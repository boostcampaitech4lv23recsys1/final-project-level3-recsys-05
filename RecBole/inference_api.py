from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import List

import torch
import numpy as np

from recbole.quick_start import load_data_and_model

app = FastAPI()

 # model, dataset 불러오기
config, model, dataset, train_data, _, _ = load_data_and_model("saved/CDAE-Jan-26-2023_03-25-07.pth")

# device 설정
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

# user, item id -> token 변환 array
user_id2token = dataset.field2id_token[config['USER_ID_FIELD']]
item_id2token = dataset.field2id_token[config['ITEM_ID_FIELD']]

# token -> user, item id 변환 dict
token2user_id = {id: i for i, id in enumerate(user_id2token)}
token2item_id = {id: i for i, id in enumerate(item_id2token)}

# filtering 된 데이터 반환
class Products(BaseModel):
    item: List[int] = Field(default_factory=list)


# 모델 추천 결과 반환


@app.get('/test')
def test():
    return {'test' : 123}

@app.post("/results/recommend", description="추천 결과를 반환합니다")
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

    return Products(item=output_list)


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run("inference_api:app", host="0.0.0.0", port=30002, reload=True)
