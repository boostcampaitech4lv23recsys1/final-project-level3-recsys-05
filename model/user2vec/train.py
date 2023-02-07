import pandas as pd
import annoy
import pickle

from scipy import sparse
from implicit.als import AlternatingLeastSquares

data = pd.read_csv('ohou-v4.inter', lineterminator='\n')
data = data[['item_id:token', 'user_id:token', 'timestamp:float']]
data.columns = ['item_id', 'user_id', 'time']

# item, user 매핑
item2vec = {v:i for i, v in enumerate(sorted(data['item_id'].unique()))}
user2vec = {v:i+1 for i, v in enumerate(sorted(data['user_id'].unique()))}
vec2item = {i:v for i, v in enumerate(sorted(data['item_id'].unique()))}
vec2user = {i+1:v for i, v in enumerate(sorted(data['user_id'].unique()))}
data['item_id'] = data['item_id'].apply(lambda x : item2vec[x])
data['user_id'] = data['user_id'].apply(lambda x : user2vec[x])

# vector 저장
with open('vec2user.pickle', 'wb') as f :
    pickle.dump(vec2user, f, pickle.HIGHEST_PROTOCOL)
with open('vec2item.pickle', 'wb') as f :
    pickle.dump(vec2item, f, pickle.HIGHEST_PROTOCOL)
with open('user2vec.pickle', 'wb') as f :
    pickle.dump(user2vec, f, pickle.HIGHEST_PROTOCOL)
with open('item2vec.pickle', 'wb') as f :
    pickle.dump(item2vec, f, pickle.HIGHEST_PROTOCOL)

# csr_matrix 생성
data['purchased'] = 1
matrix = sparse.csr_matrix((data['purchased'], (data['user_id'], data['item_id'])))

# ALS 모델 학습, 저장
model = AlternatingLeastSquares()
model.fit(matrix)

model.save('model.npz')

# ALS와 annoy의 시간 차이가 크지 않아 ALS 사용
users = model.user_factors

ann = annoy.AnnoyIndex(users.shape[1], 'angular')
for i in range(users.shape[0]) :
    ann.add_item(i, users[i])
ann.build(20)

ann.save("annoy.ann")

print("success")