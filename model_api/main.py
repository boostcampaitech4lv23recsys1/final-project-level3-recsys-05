import io
import re
import sys
import base64
import uvicorn
import torch
import random
import pickle
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from fastapi import FastAPI
from fastapi import FastAPI, Query, Body
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

from pyfiglet import Figlet
from termcolor import colored

f = Figlet(font="slant")
print(colored(f.renderText('For Better Life'), 'green'))


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
reivew_classification = pd.read_csv("data/review_classification.csv")

DEFAULT_CATEGORY = product_si['category0'].unique().tolist()

icon = Image.open('data/house.png')
mask = Image.new("RGB", icon.size, (255,255,255))
mask.paste(icon,icon)
mask = np.array(mask)

wc = WordCloud(font_path='/usr/share/fonts/nanum/NanumGothicBold.ttf',
               background_color='white',
               width=800, height=600,
               max_words=200,
               mask=mask)

 # model, dataset 불러오기
config, model, dataset, train_data, _, _ = load_data_and_model("model/RecVAE-Jan-27-2023_06-50-00.pth")

# device 설정
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

# user, item id -> token 변환 array
user_id2token = dataset.field2id_token[config['USER_ID_FIELD']]
item_id2token = dataset.field2id_token[config['ITEM_ID_FIELD']]

# token -> user, item id 변환 dict
token2user_id = {id: i for i, id in enumerate(user_id2token)}
token2item_id = {id: i for i, id in enumerate(item_id2token)}

user2vec = {v:i for i, v in enumerate(sorted(data2['user_id:token'].unique()))}
vec2user = {i:v for i, v in enumerate(sorted(data2['user_id:token'].unique()))}

class Filters(BaseModel):
    price_s : Optional[int] = 0
    price_e : Optional[int] = LIMIT
    category : List[str] = DEFAULT_CATEGORY#product_si['category0'].unique().tolist()

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

def get_item_info(df, filters=None, k=10):
    # print(df)
    print(filters)
    print(k)
    if filters:
        df_ = df.loc[(df['selling_price'] >= filters.price_s) & (df['selling_price'] <= filters.price_e) &
                    (df['category0'].isin(filters.category))]
    else: df_ = df
    selected_items = random.sample(df_['item_id'].tolist(), k)
    df_ = df_.loc[df_['item_id'].isin(selected_items)]

    item_ids = df_['item_id'].tolist()
    img_urls = df_['img_main'].tolist()
    original_prices = df_['original_price'].tolist()
    selling_prices = df_['selling_price'].tolist()
    star_avgs = df_['review_avg'].tolist()
    brands = df_['brand'].tolist()
    titles = df_['title']
    
    pattern1 = r'\([^)]*\)'
    pattern2 = r'\[[^)]*\]'
    titles = titles.apply(lambda x: re.sub(pattern1, '', x))
    titles = titles.apply(lambda x: re.sub(pattern2, '', x))
    titles = titles.tolist()

    result = []
    for idx, val in enumerate(zip(item_ids, img_urls, original_prices, selling_prices, titles, star_avgs, brands)):
        a, b, c, d, e, f, g = val
        tmp = defaultdict(int)
        tmp['item_ids'] = a
        tmp['img_urls'] = b
        tmp['original_prices'] = c
        tmp['selling_prices'] = d
        tmp['titles'] = e
        tmp['star_avgs'] = f
        tmp['brands'] = g
        result.append(tmp)

    return result

@app.get('/')
def test():
    return 'hello this is the main page'

@app.get('/wordcloud/', description='get wordcloud')
def get_wordcloud(item_id: int = Query(...), split: int = Query(...)):
    try:
        with open(f'data/wc_data/{item_id}_{split}.pickle', 'rb') as f:
            data = pickle.load(f)
        
        for word in data:
            if len(word) < 2: del(data['word'])
    except:
        return '리뷰가 존재하지 않습니다.'
    gen = wc.generate_from_frequencies(data)
    img = from_image_to_bytes(gen.to_image())
    return JSONResponse(img)

    # text = '\n'.join(data.loc[(data['item_id'] == item_id) & (data['split'] == split), 'review'].tolist())
    # if text:
        # okt = Okt()
        # nouns = okt.nouns(text)
        # c = Counter(nouns)
        # gen = wc.generate_from_frequencies(c)
        # img = from_image_to_bytes(gen.to_image())
        # return JSONResponse(img)
    
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
    recommend = product_si.loc[product_si['item_id'].isin(random_items)]

    return get_item_info(recommend, filters, k)

@app.post('/recommend/similar/user/', description='get similar user')
def get_similar_user(filters : Filters, user_id: int, top_k: int):
    print(f"user : {filters}")
    import annoy
    ann = annoy.AnnoyIndex(100, 'angular')
    ann.load('model/annoy.ann')
    recommend = ann.get_nns_by_item(user2vec[user_id], n=top_k**2)
    recommend = [vec2user[rec] for rec in recommend]

    result = data2.loc[data2['user_id:token'].isin(recommend), 'item_id:token'].tolist()
    recommend = product_si.loc[product_si['item_id'].isin(result)]
    # if filters and (not filters.price_s and filters.price_e == LIMIT and filters.category == DEFAULT_CATEGORY):
    return get_item_info(recommend, filters, top_k)
    # return get_item_info(recommend, top_k)

@app.post('/recommend/similar/item', description='get simlilar item')
def get_similar_item(item_id: int, top_k: int):
    from gensim.models import Word2Vec

    model = Word2Vec.load('model/item2vec.model')
    item_vectors = model.wv
    index = [i for i, _ in item_vectors.most_similar(item_id, topn=top_k)]
    result = product_si[product_si['item_id'].isin(index)]

    return get_item_info(df=result, k=top_k)


@app.post("/recommend/personal", description="추천 결과를 반환합니다")
def rec_topk(filters : Filters, input_list: List[int], top_k: int):
    print(f"personal : {filters}")

    input_list = [token2item_id[str(i)] for i in input_list]

    model.eval()

    # model input 생성
    items = torch.zeros(len(item_id2token))
    items[input_list] = 1

    # inference
    score, _, _, _ = model.forward(items.unsqueeze(0).to(device), model.dropout_prob)
    rating_pred = score.cpu().data.numpy().copy()

    # 입력한 아이템은 추천되지 않도록
    rating_pred[:, input_list] = -np.Inf

    # sort & topk
    pred_list = np.argsort(rating_pred)[np.arange(len(rating_pred)), ::-1]
    # ind = np.argpartition(rating_pred, -split)[:, -split:]
    # arr_ind = rating_pred[np.arange(len(rating_pred))[:, None], ind]
    # arr_ind_argsort = np.argsort(arr_ind)[np.arange(len(rating_pred)), ::-1]

    # pred_list = ind[
    #     np.arange(len(rating_pred))[:, None], arr_ind_argsort
    # ]

    output_list = []
    for item in pred_list[0]:
        try:
            output_list.append(int(item_id2token[item]))
        except:
            pass
    # if filters and (not filters.price_s and filters.price_e == LIMIT and filters.category == DEFAULT_CATEGORY):
    
    df_ = product_si.loc[(product_si['selling_price'] >= filters.price_s) & (product_si['selling_price'] <= filters.price_e) &
                (product_si['category0'].isin(filters.category))]
    cnt = 0
    item_ids, img_urls, original_prices, selling_prices, star_avgs, brands, titles = [], [], [], [], [], [], []
    pattern1 = r'\([^)]*\)'
    pattern2 = r'\[[^)]*\]'
    # titles = titles.apply(lambda x: re.sub(pattern1, '', x))
    # titles = titles.apply(lambda x: re.sub(pattern2, '', x))
    for id in output_list:
        if id in df_['item_id'].tolist():
            id_info = df_[df_['item_id']==id]
            item_ids.append(id_info['item_id'].values[0])
            img_urls.append(id_info['img_main'].values[0])
            original_prices.append(id_info['original_price'].values[0])
            selling_prices.append(id_info['selling_price'].values[0])
            star_avgs.append(id_info['review_avg'].values[0])
            brands.append(id_info['brand'].values[0])
            titles.append(re.sub(pattern2, '', re.sub(pattern1, '', id_info['title'].values[0])))
            cnt += 1
        if cnt == top_k:
            break

    result__ = []
    for idx, val in enumerate(zip(item_ids, img_urls, original_prices, selling_prices, titles, star_avgs, brands)):
        a, b, c, d, e, f, g = val
        tmp = defaultdict(int)
        tmp['item_ids'] = a
        tmp['img_urls'] = b
        tmp['original_prices'] = c
        tmp['selling_prices'] = d
        tmp['titles'] = e
        tmp['star_avgs'] = f
        tmp['brands'] = g
        result__.append(tmp)
        
    return result__
    # return get_item_info(result, filters, top_k)
    # return get_item_info(result, top_k)

@app.get('/review_cls', description='get pos and neg ratio')
def get_review_cls():
    item_label_cnt = reivew_classification.groupby(by=['item_id', 'label'], as_index=False).count()
    per_item = item_label_cnt.loc[item_label_cnt['item_id'] == 449, 'review']
    total = per_item.sum()
    pos = per_item[0]
    neg = per_item[1]

if __name__ == '__main__':
    uvicorn.run("main:app", host="0.0.0.0", port=30002)#, reload=True)

