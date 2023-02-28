import pandas as pd
import annoy
import pickle

from scipy import sparse
from implicit.als import AlternatingLeastSquares

# vector 로드
with open('item2vec.pickle', 'rb') as f :
    item2vec = pickle.load(f)
with open('user2vec.pickle', 'rb') as f :
    user2vec = pickle.load(f)
with open('vec2item.pickle', 'rb') as f :
    vec2item = pickle.load(f)
with open('vec2user.pickle', 'rb') as f :
    vec2user = pickle.load(f)

# ALS 모델 로드
model = AlternatingLeastSquares()
model = model.load('model.npz')

# 테스트 데이터
items = [
  456986, 304967, 409929, 630604, 388715, 107013, 336837, 67412, 314260, 361961, 314120, 130195, 229192, 302232, 423677, 1207397,
  314121, 344496, 146362, 314902, 308398, 48222, 345755, 88315, 61686, 314893, 314895, 313686, 337634, 313549, 313538, 32691,
  314892, 314889, 386064, 300614, 119709, 387732, 414289, 88416, 615593, 313688, 48896, 391014, 419918, 337570, 306267, 244188,
  75702, 329364, 189411, 310706, 111255, 290657, 306812, 310756, 628174, 227006, 95942, 201509, 419911, 352669, 309019, 65166,
  209749, 316468, 343456, 495763, 499748, 97960, 75389, 435899, 335550, 414954, 87730, 1024870, 159676, 312114, 498401, 153841,
  299209, 201149, 238712, 312973, 337738, 354736, 337750, 191794, 116770, 422986, 349035, 345758, 138320
  ]

# csr_matrix 생성
d = []
for item in items :
    d.append([0, item2vec[item], 1])
tmp = pd.DataFrame(d)
t = sparse.csr_matrix((tmp[2], (tmp[0], tmp[1])))

# 모델 재 학습
intent = model.recalculate_user(0, t)
model.partial_fit_users([0], t)

# ALS와 annoy의 시간 차이가 크지 않아 ALS 사용
ann = annoy.AnnoyIndex(100, 'angular')
ann.load('annoy.ann')

print("ALS: ", model.similar_users(0, 10))
print("annoy: ", ann.get_nns_by_vector(intent, 10))