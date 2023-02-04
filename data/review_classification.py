# import library
import pandas as pd
import re
from tqdm import tqdm
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification, TextClassificationPipeline

# load model\
tokenizer = AutoTokenizer.from_pretrained("jaehyeong/koelectra-base-v3-generalized-sentiment-analysis")
model = AutoModelForSequenceClassification.from_pretrained("jaehyeong/koelectra-base-v3-generalized-sentiment-analysis")
sentiment_classifier = TextClassificationPipeline(tokenizer=tokenizer, model=model)

# load data
inter = pd.read_csv("../RecBole/dataset/ohou-v4/ohou-v4.inter", lineterminator='\n', usecols=["item_id:token", "review:token_seq"])

# preprocess data
inter.dropna(subset="review:token_seq", inplace=True)
inter['review:token_seq'] = inter['review:token_seq'].apply(lambda x: re.sub('[^ ㄱ-ㅣ가-힣]+', '', x)[:1024])
inter.reset_index(drop=True, inplace=True)

# pred

inter['pos_label'] = 0
inter['pos_score'] = 0

for idx, review in tqdm(enumerate(inter['review:token_seq'].values)):
    try:
        val = sentiment_classifier(review)
        inter.loc[idx, 'pos_label'] = val[0]["label"]
        inter.loc[idx, 'pos_score'] = val[0]["score"]
    except:
        pass

inter.drop("review:token_seq", axis=1).to_csv("review_pos.csv", index=False)

