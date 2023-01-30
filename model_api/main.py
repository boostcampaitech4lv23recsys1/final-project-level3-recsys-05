import io
import re
import base64
import uvicorn
import torch
import random
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt


from fastapi import FastAPI
from fastapi import FastAPI, Query
from fastapi.param_functions import Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, Any, Dict, List

from wordcloud import WordCloud
from matplotlib import rc
from collections import Counter
from konlpy.tag import Okt
from PIL import Image


app = FastAPI()

data = pd.read_csv("data/for_word_cloud.csv", lineterminator='\n')
data2 = pd.read_csv("data/final_v2.inter", lineterminator='\n')

icon = Image.open('data/house.png')
mask = Image.new("RGB", icon.size, (255,255,255))
mask.paste(icon,icon)
mask = np.array(mask)

class Options(BaseModel):
    living : Optional[int] = None
    family : Optional[int] = None
    area : Optional[int] = None
    style : Optional[int] = None

def from_image_to_bytes(img):
    """
    pillow image 객체를 bytes로 변환
    """
    # Pillow 이미지 객체를 Bytes로 변환
    imgByteArr = io.BytesIO()
    img.save(imgByteArr, format='PNG')
    imgByteArr = imgByteArr.getvalue()
    # Base64로 Bytes를 인코딩
    encoded = base64.b64encode(imgByteArr)
    # Base64로 ascii로 디코딩
    decoded = encoded.decode('ascii')
    return decoded

def get_item_info(df):
    item_ids = df['item_id'].tolist()
    img_urls = df['img_main'].tolist()
    original_prices = df['original_price'].tolist()
    selling_prices = df['selling_price'].tolist()
    titles = df['title']
    
    pattern1 = r'\([^)]*\)'
    pattern2 = r'\[[^)]*\]'
    titles = titles.apply(lambda x: re.sub(pattern1, '', x))
    titles = titles.apply(lambda x: re.sub(pattern2, '', x))
    titles = titles.tolist()
    return [item_ids, img_urls, original_prices, selling_prices, titles]

@app.get('/')
def test():
    return {'hello' : 'this is the main page'}

@app.get('/wordcloud/', description='get wordcloud')
def get_wordcloud(item_id: int = Query(None), split: int = Query(None)):
    text = '\n'.join(data.loc[(data['item_id'] == item_id) & (data['split'] == split), 'review'].tolist())
    if text:
        okt = Okt()
        nouns = okt.nouns(text)
        c = Counter(nouns)
        wc = WordCloud(font_path='/usr/share/fonts/nanum/NanumPen.ttf',
               background_color='white',
               width=800, height=600,
               max_words=200,  
               mask=mask)
        gen = wc.generate_from_frequencies(c)
        img = from_image_to_bytes(gen.to_image())
        return JSONResponse(img)
    
    return '리뷰가 존재하지 않습니다.'

@app.get('/recommend/normal', description='get normal recommendation')
def get_normal_recommendation(filters : Options):
    product_si = pd.read_csv("data/side_info.csv")

    star_avg_df = data2.groupby(by=['item_id:token'], as_index=False)['star_avg:float'].mean()
    star_avg_items = star_avg_df.loc[star_avg_df['star_avg:float'] > 4.63, 'item_id:token'].tolist()

    cnt_df = data2.groupby(by=['item_id:token'], as_index=False)['user_id:token'].count()
    basic_items = cnt_df.loc[cnt_df['user_id:token'] > 100]['item_id:token'].tolist()

    random_items = list(set(star_avg_items).intersection(set(basic_items)))
    if not (filters.living and filters.area and filters.family and filters.style):
        selected_items = random.sample(random_items, 10)
        recommend = product_si.loc[product_si['item_id'].isin(selected_items)]
        item_info = get_item_info(recommend)
    
    return {
            'item_ids' : item_info[0],
            'img_urls' : item_info[1],
            'original_prices' : item_info[2],
            'selling_prices' : item_info[3],
            'titles' : item_info[4],
            }

@app.get('/recommend/similar/item', description='get simlilar item')
def get_similar_item(item_id: int = Query(None), top_k: int = Query(None)):
    from gensim.models import Word2Vec

    product_si = pd.read_csv("data/side_info.csv")
    model = Word2Vec.load('model/item2vec.model')
    item_vectors = model.wv
    index = [i for i, _ in item_vectors.most_similar(item_id, topn=top_k)]

    result = product_si[product_si['item_id'].isin(index)]
    item_info = get_item_info(result)

    return {
            'item_ids' : item_info[0],
            'img_urls' : item_info[1],
            'original_prices' : item_info[2],
            'selling_prices' : item_info[3],
            'titles' : item_info[4],
            }
if __name__ == '__main__':
    uvicorn.run("main:app", host="0.0.0.0", port=30002, reload=True)