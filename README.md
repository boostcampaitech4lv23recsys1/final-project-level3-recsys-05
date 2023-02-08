# **UNZYP, 집꾸미기 개인화 추천 서비스**



![unzip Logo](https://user-images.githubusercontent.com/86918832/217407236-30fd240a-509c-46db-90f8-c5fd4a059cec.png)

UNZYP은 오늘의 집에 있는 압축된 상품을 추천을 통해 unzip하겠다는 의미로, 오늘의 집 상품 기반의 집 꾸미기 상품 추천 서비스입니다. 

🖥 **[웹 사이트 보러 가기]()**


<br/>

<br/>

------



## **Background**

### **프로젝트 동기**

[오늘의 집](https://www.ohou.se/)은 국내 최대 온라인 집 꾸미기 상품 판매 사이트이며, 기업 가치는 2조원대로 오프라인 업체의 규모를 넘어섰습니다.<sup id="a1">[1](#f1)</sup> 2020년 3월 이후 오늘의 집 검색량이 급증하였으며<sup id="a1">[2](#f2)</sup>, 코로나로 인해 외출을 꺼리게 되었고, 급격한 집값 상승으로 인해 리모델링이나 인테리어로 관심이 이동되는 것이 이유로 추정됩니다. 이러한 내용을 토대로 오늘의 집에 대한 시장성이 충분히 있다고 판단하여 해당 프로젝트를 진행하였습니다.

<br/>

### **기대 효과**

UNZYP 웹 서비스를 통해 다양한 접근으로 유저가 선호할 만한 상품을 추천하여 효율적으로 상품을 탐색할 수 있도록 하고자 합니다. 또한 각 상품에 대한 리뷰 요약 정보를 제공하여 상품 구매 여부를 결정하는데 도움을 주는 효과를 기대합니다.

<br/>

<br/>

------

## **Features**

### **메인 페이지**

> ![개인화 추천](https://user-images.githubusercontent.com/86918832/217445701-9ada3de2-a1c9-4d7e-9cd2-41586a5fb3eb.png)

- 회원가입 시 유저가 남긴 선호 상품 리스트와 오늘의 집 리뷰 데이터 기반으로 추천합니다. 

<br/>

> ![인기도 기반 추천](https://user-images.githubusercontent.com/86918832/217445898-d2d89cc9-29f3-4b79-b96e-2544bd99fddf.png)

- 개인화 추천 이외에 유저가 선택한 가격대와 상품 카테고리를 기반으로 인기있는 상품을 추천합니다.

<br/>

> ![유사 유저 기반 추천](https://user-images.githubusercontent.com/86918832/217445920-e72a0bfd-4272-42c6-842d-8abdcd279e8a.png)

- 유저 interaction을 기반으로 유사한 유저의 상품을 추천합니다.

<br/>

<br/>

### **상품 상세 페이지**

> ![상품 상세 정보](https://user-images.githubusercontent.com/86918832/217480918-bf42793f-61d5-443e-b01d-1b4b9210dd80.png)

- 선택한 상품의 상세 정보를 제공합니다. 기본적인 정보와 더불어 유사한 유저 n명이 만족한 비율을 노출합니다.

<br/>

> ![wordcloud](https://user-images.githubusercontent.com/86918832/217455564-7422591f-baea-48db-b0a8-03d275b79883.png)

- wordcloud 형식으로 별점대 별 해당 상품의 리뷰 요약 정보를 제공합니다.

<br/>

> ![유사 아이템 추천](https://user-images.githubusercontent.com/86918832/217446346-a9f24f95-e01d-41d2-bded-efe1a93b1d5d.png)

- 해당 상품과 유사한 상품을 추천합니다.


<br/>

<br/>

------



## **Data Resource**

<br/>

- [오늘의 집] > [커뮤티니] > [집들이] 페이지 정보와 상품 id 수집
- item side information: 수집된 상품 id 에 대한 상세 정보 수집 
- 유저-아이템 interaction: 상품 리뷰 데이터 수집

<br/>

<br/>

------



## **Data Analysis & Preprocessing**

<br/>

📊 **[EDA 보러 가기]()**

**※ 데이터 분석 결과에 관한 자세한 내용은 EDA 파일을 참고해주세요.**

<br/>

------



## **Recommender System**


<br/>

### **모델 기반 개인화 추천**

| 방법론                           | 참조                                                         |
| -------------------------------- | ------------------------------------------------------------ |
| RecVAE                         | [Shenbin, Ilya, et al. "Recvae: A new variational autoencoder for top-n recommendations with implicit feedback." Proceedings of the 13th international conference on web search and data mining. 2020.](https://arxiv.org/abs/1912.11160) |
| Multi-VAE                       | [Liang, Dawen, et al. "Variational autoencoders for collaborative filtering." Proceedings of the 2018 world wide web conference. 2018.](https://dl.acm.org/doi/10.1145/3178876.3186150) |
| CDAE                                  | [Wu, Yao, et al. "Collaborative denoising auto-encoders for top-n recommender systems." Proceedings of the ninth ACM international conference on web search and data mining. 2016.](https://dl.acm.org/doi/10.1145/2835776.2835837) |
| SASRec                               | [Kang, Wang-Cheng, and Julian McAuley. "Self-attentive sequential recommendation." 2018 IEEE international conference on data mining (ICDM). IEEE, 2018.](https://ieeexplore.ieee.org/abstract/document/8594844) |


유저의 오늘의 집 리뷰 이력과 언집에서 남긴 선호 상품 이력을 기반으로 Autoencoder 계열 모델과 sequence 계열 모델을 학습하고, 검증 결과에 따라 평가 지표(Hit@10) 값과 학습 상태를 고려하여 모델을 선정합니다. 오늘의 집 리뷰 이력이 없는 cold-start 유저가 대부분일 것이라 판단하여 유저 id 에 종속적이지 않은 Autoencode 계열 모델과 sequence 계열 모델을 사용하였습니다. 검증 결과, 안정적으로 학습이 되면서 좋은 성능을 보인 RecVAE 모델을 최종 모델로 결정하였습니다.


<br/>

<br/>

### **인기도 기반 추천**
<br/>

인기도 기반 추천에서는 모델을 사용하지 않고 자체 로직을 통해 추천합니다. 상품 평점과 리뷰 수를 기준으로 인기 상품을 선정한 후 유저가 선택한 상품 카테고리로 필터링하여 추천 결과를 반환합니다.

<br/>

<br/>

### **유사 유저 기반 추천**

| 방법론                                 | 참조                                                         |
| -------------------------------------- | ------------------------------------------------------------ |
| ALS(Alternating Least Squares) MF    | [Yifan Hu, Yehuda Koren, and Chris Volinsky. 2008. Collaborative Filtering for Implicit Feedback Datasets](https://ieeexplore.ieee.org/abstract/document/4781121) |


ALS를 통해 유저 Latent Vector 를 생성하고, NNS(Nearest Neighbor Similarity)를 통해 유사 유저들을 식별합니다. 이후 유사한 유저들과 interaction이 있었던 상품들을 추천합니다.


<br/>

<br/>

### **유사 아이템 추천**

| 방법론                                 | 참조                                                         |
| -------------------------------------- | ------------------------------------------------------------ |
| Item2Vec      | [Barkan, Oren, and Noam Koenigstein. "Item2vec: neural item embedding for collaborative filtering." 2016 IEEE 26th International Workshop on Machine Learning for Signal Processing (MLSP). IEEE, 2016.](https://ieeexplore.ieee.org/abstract/document/7738886) |

Item2Vec을 통해 상품 Latent Vector를 학습하고, NNS 를 통해 해당 상품과 유사한 상품 추천합니다.

<br/>

<br/>

------



## **Service Architecture**

<br/>

![Architecture](https://user-images.githubusercontent.com/86918832/217450824-75840b2d-8628-42eb-b20d-ad86f3ff22cb.png)


<br/>

<br/>


------



## **Team Members**

<table>
   <tr height="160px">
      <td align="center">
         <a href="https://github.com/minsu0216">
            <img src="https://user-images.githubusercontent.com/86918832/217452209-4ad3725c-902d-44eb-8dce-f9d1316bc907.png" width="200"/>
         </a>
      </td>
      <td align="center">
         <a href="https://github.com/tobe-honest">
            <img src="https://user-images.githubusercontent.com/86918832/217452222-c069d1e6-49e1-4ebf-8c39-0b6a7d0a47e3.png" width="180"/>
         </a>
      </td>
      <td align="center">
         <a href="https://github.com/GT0122">
            <img src="https://user-images.githubusercontent.com/86918832/217452231-d21446e0-bc3d-464d-9ac4-d7c6da9ebbae.png" width="200"/>
         </a>
      </td>
       <td align="center">
         <a href="https://github.com/oceanofglitta">
            <img src="https://user-images.githubusercontent.com/86918832/217452253-561cd620-b48a-4d33-946f-a8a24bf5d741.png" width="190"/>
         </a>
      </td>
   </tr>
   <tr>
       <td align="center"><a href="https://github.com/minsu0216"><b>강민수</b></a></td>
       <td align="center"><a href="https://github.com/tobe-honest"><b>김진명</b></a></td>
       <td align="center"><a href="https://github.com/GT0122"><b>박경태</b></a></td>
      <td align="center"><a href="https://github.com/oceanofglitta"><b>박용욱</b></a></td>
   </tr>
   <tr>
      <td align="center">데이터 수집 & 전처리<br/>개인화 추천 모델링</td>
      <td align="center">데이터 수집 & 전처리<br/>개인화 추천 모델링<br/>백엔트 API</td>
      <td align="center">데이터 수집<br/>프론트엔드<br/>개인화 추천 모델링</td>
      <td align="center">데이터 수집<br/>프론트엔드<br/>백엔드<br/>개인화 추천 모델링</td>
   </tr>
</table>
<br/>

<br/>

------



## **Further Information**

<br/>

📹 **[발표 영상 보러 가기]()**   

🔖 **[발표 자료 보러 가기]()**


<br/>

<br/>

------



## **Annotation**


<b id="f1">1.</b> [2022.05.09 한경 기사](https://www.hankyung.com/it/article/2022050929951) [↩](#a1)

<b id="f2">2.</b> [Naver Datalab - 검색어 트렌드](https://datalab.naver.com/keyword/trendResult.naver?hashKey=N_97be31b0888ee7e5baf0ebd679dbe328) 월별 오늘의 집 검색어 트렌드를 보면 2020.03 검색량이 급증한 것을 확인할 수 있음 [↩](#a2)


