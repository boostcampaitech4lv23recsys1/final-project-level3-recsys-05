import io
import re
import sys
import base64
import uvicorn
import torch
import random
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from fastapi import FastAPI
from fastapi import FastAPI, Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List
from starlette.middleware.cors import CORSMiddleware
from collections import defaultdict

from wordcloud import WordCloud
from collections import Counter
from konlpy.tag import Okt
from PIL import Image
sys.path.append('/opt/ml/input/final-project-level3-recsys-05/RecBole/')
from recbole.quick_start import load_data_and_model


LIMIT = 10000000000
app = FastAPI()

origins = [
    '*'
]
app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ['GET', 'POST']
)

data = pd.read_csv("data/for_word_cloud.csv", lineterminator='\n')
data2 = pd.read_csv("data/final_v2.inter", lineterminator='\n')
product_si = pd.read_csv("data/side_info.csv")

icon = Image.open('data/house.png')
mask = Image.new("RGB", icon.size, (255,255,255))
mask.paste(icon,icon)
mask = np.array(mask)

wc = WordCloud(font_path='/usr/share/fonts/nanum/NanumPen.ttf',
               background_color='white',
               width=800, height=600,
               max_words=200,
               mask=mask)

 # model, dataset 불러오기
config, model, dataset, train_data, _, _ = load_data_and_model("model/CDAE-Jan-27-2023_06-49-36.pth")

# device 설정
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

# user, item id -> token 변환 array
user_id2token = dataset.field2id_token[config['USER_ID_FIELD']]
item_id2token = dataset.field2id_token[config['ITEM_ID_FIELD']]

# token -> user, item id 변환 dict
token2user_id = {id: i for i, id in enumerate(user_id2token)}
token2item_id = {id: i for i, id in enumerate(item_id2token)}

class Filters(BaseModel):
    price_s : Optional[int] = 0
    price_e : Optional[int] = LIMIT
    category : List[str] = product_si['category0'].unique().tolist()

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

def get_item_info(df, filters=None, k=None):
    if filters and k:
        df_ = df.loc[(df['original_price'] >= filters.price_s) & (df['original_price'] <= filters.price_e) &
                    (df['category0'].isin(filters.category))]
        indices = df_['item_id'].tolist()
        if len(indices) >= k:
            selected_items = random.sample(indices, k)
        else: selected_items = indices
        df_ = df_.loc[df_['item_id'].isin(selected_items)]
    else: df_ = df

    item_ids = df_['item_id'].tolist()
    img_urls = df_['img_main'].tolist()
    original_prices = df_['original_price'].tolist()
    selling_prices = df_['selling_price'].tolist()
    titles = df_['title']
    
    pattern1 = r'\([^)]*\)'
    pattern2 = r'\[[^)]*\]'
    titles = titles.apply(lambda x: re.sub(pattern1, '', x))
    titles = titles.apply(lambda x: re.sub(pattern2, '', x))
    titles = titles.tolist()

    result = defaultdict(list)
    for idx, val in enumerate(zip(item_ids, img_urls, original_prices, selling_prices, titles)):
        a, b, c, d, e = val
        result[idx].append(a)
        result[idx].append(b)
        result[idx].append(c)
        result[idx].append(d)
        result[idx].append(e)

    return result

@app.get('/')
def test():
    return 'hello this is the main page'

@app.get('/wordcloud/', description='get wordcloud')
def get_wordcloud(item_id: int = Query(None), split: int = Query(None)):
    text = '\n'.join(data.loc[(data['item_id'] == item_id) & (data['split'] == split), 'review'].tolist())
    if text:
        okt = Okt()
        nouns = okt.nouns(text)
        c = Counter(nouns)
        gen = wc.generate_from_frequencies(c)
        img = from_image_to_bytes(gen.to_image())
        return JSONResponse(img)
    
    return '리뷰가 존재하지 않습니다.'

@app.post('/recommend/normal', description='get normal recommendation')
def get_normal_recommendation(filters : Filters, k : int):

    star_avg_df = data2.groupby(by=['item_id:token'], as_index=False)['star_avg:float'].mean()
    star_avg_items = star_avg_df.loc[star_avg_df['star_avg:float'] > 4.63, 'item_id:token'].tolist()

    cnt_df = data2.groupby(by=['item_id:token'], as_index=False)['user_id:token'].count()
    basic_items = cnt_df.loc[cnt_df['user_id:token'] > 100]['item_id:token'].tolist()

    random_items = list(set(star_avg_items).intersection(set(basic_items)))
    print(filters)
    print(filters.price_s, filters.price_e, filters.category)
    selected_items = random.sample(random_items, k)
    recommend = product_si.loc[product_si['item_id'].isin(selected_items)]

    return get_item_info(recommend, filters, k)

@app.get('/recommend/similar/item', description='get simlilar item')
def get_similar_item(item_id: int = Query(None), top_k: int = Query(None)):
    from gensim.models import Word2Vec

    model = Word2Vec.load('model/item2vec.model')
    item_vectors = model.wv
    index = [i for i, _ in item_vectors.most_similar(item_id, topn=top_k)]

    result = product_si[product_si['item_id'].isin(index)]
    # item_info = get_item_info(result)

    return get_item_info(result)

@app.get('/recommend/similar/user', description='get similar user')
def get_similar_user(user_id: int = Query(None), top_k: int = Query(None)):
    import annoy
    ann = annoy.AnnoyIndex(100, 'angular')
    ann.load('model/annoy.ann')
    recommend = ann.get_nns_by_item(0, n=top_k)

    data2.loc[data2['user_id'].isin(recommend)]

@app.post("/recommend/personal", description="추천 결과를 반환합니다")
def rec_topk(input_list: List[int], top_k: int):
    
    input_list = [token2item_id[str(i)] for i in input_list]

    model.eval()

    # model input 생성
    items = torch.zeros(len(item_id2token))
    items[input_list] = 1
    dummy_user = torch.tensor([0])

    # inference
    score = model(items.to(device), dummy_user.to(device))
    score = model.o_act(score)
    rating_pred = score.cpu().data.numpy().copy()

    # 입력한 아이템은 추천되지 않도록
    rating_pred[:, input_list] = 0

    # sort & topk
    ind = np.argpartition(rating_pred, -top_k)[:, -top_k:]
    arr_ind = rating_pred[np.arange(len(rating_pred))[:, None], ind]
    arr_ind_argsort = np.argsort(arr_ind)[np.arange(len(rating_pred)), ::-1]

    pred_list = ind[
        np.arange(len(rating_pred))[:, None], arr_ind_argsort
    ]

    output_list = []
    for item in pred_list[0]:
        output_list.append(int(item_id2token[item]))

    result = get_item_info(product_si.loc[product_si['item_id'].isin(output_list)])
    return result


if __name__ == '__main__':
    uvicorn.run("main:app", host="0.0.0.0", port=30002, reload=True)

