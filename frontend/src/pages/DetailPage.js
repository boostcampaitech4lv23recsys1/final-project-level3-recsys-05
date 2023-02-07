/* eslint-disable react/button-has-type */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ItemSwiper from '../products/ItemSwiper';
import axios from 'axios';
import StarRate from '../products/StarRate';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import base64 from 'base-64';
import ReactDOM from 'react-dom';
import loading from '../landing/loading.gif';

// 상세 제품 페이지
function Detail() {
    const [ product, setProduct ] = useState([]);
    const [ similar, setSimilar ] = useState([]);
    const [ wishProducts, setWishProducts ] = useState([]);
    const [clicked, setClicked] = useState(false);
    const [activated, setActivated] = useState(5);
    const theitemid = useParams()['itemid'];
  
    const handleClick = () => {
      const heart = document.getElementById("like"+item_id).getElementsByTagName("path")[0];
      if(clicked) {
        axios.get("http://34.64.87.78:8000/unwishing/"+ localStorage.getItem("token") + "/" + theitemid);
        heart.setAttribute("d", "M458.4 64.3C400.6 15.7 311.3 23 256 79.3 200.7 23 111.4 15.6 53.6 64.3-21.6 127.6-10.6 230.8 43 285.5l175.4 178.7c10 10.2 23.4 15.9 37.6 15.9 14.3 0 27.6-5.6 37.6-15.8L469 285.6c53.5-54.7 64.7-157.9-10.6-221.3zm-23.6 187.5L259.4 430.5c-2.4 2.4-4.4 2.4-6.8 0L77.2 251.8c-36.5-37.2-43.9-107.6 7.3-150.7 38.9-32.7 98.9-27.8 136.5 10.5l35 35.7 35-35.7c37.8-38.5 97.8-43.2 136.5-10.6 51.1 43.1 43.5 113.9 7.3 150.8z");
        setClicked(false);
        } else {
        axios.get("http://34.64.87.78:8000/wishing/"+ localStorage.getItem("token") + "/" + theitemid);
        heart.setAttribute("d", "M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z");
        setClicked(true);
        }
    };

    const item_id = useParams()['itemid'];

    useEffect(() => {
        const controller = new AbortController();
        ReactDOM.render(<><br/><img src={loading}></img></>, document.getElementById('cloudCon'));
        axios.get("http://34.64.87.78:8000/wishes/" + localStorage.getItem("token"))
        .then(response => {
          setWishProducts(response.data);
          setClicked(wishProducts.includes(Number(item_id)));
        })
        .catch( error => console.log(error) );

        axios.get('http://34.64.87.78:8000/item/' + item_id)
        .then(response => response.data)
        .then(data => {
            setProduct(data);
        })
        .catch( error => console.log(error) );
        axios.post(`http://115.85.181.95:30002/recommend/similar/item?item_id=${item_id}&top_k=10`)
        .then(response => response.data)
        .then(data => {
            setSimilar(data);
        })
        .catch( error => console.log(error) );
        axios({            
            method:'GET',
            url:`http://115.85.181.95:30002/wordcloud/?item_id=${item_id}&split=${5}`,
            // responseType:'blob'
            })
        .then(response => response.data)
        .then(data => {
            const Example = ({ data }) => <img src={`data:image/jpeg;base64,${data}`} />
            ReactDOM.render(<Example data={data} />, document.getElementById('cloudCon'))
        })
        .catch( error => console.log(error) );
        return () => {
        controller.abort();
        }
    }, []);

    const onClickButton = (value) => {
        setActivated(value)
        ReactDOM.render(<><br/><img src={loading}></img></>, document.getElementById('cloudCon'));
        axios({            
            method:'GET',
            url:`http://115.85.181.95:30002/wordcloud/?item_id=${item_id}&split=${value}`,
            })
        .then(response => response.data)
        .then(data => {
            const Example = ({ data }) => <img src={`data:image/jpeg;base64,${data}`} />
            ReactDOM.render(<Example data={data} />, document.getElementById('cloudCon'))
        })
        .catch( error => console.log(error) );
    }
    
    return (
        <>
            {product && (
                <Container>
                    <ItemBox>
                        <ImgBox>
                            <img src={product.image_url} alt="상품 이미지"/>
                        </ImgBox>
                        <ItemInfoBox>
                            <InfoBox>
                                <small>{product.brand}</small>
                                <h1>{product.title}</h1>
                                <StarRate star = {product.review_avg} />
                                <div style={{"marginTop": "13px"}}>{product.wish_count} 명이 찜 했어요!</div>
                                <hr></hr>
                                <small className="category">{ product.category0 }</small>
                                <br/>
                                <small className="category">{ product.category1 }</small>


                                
                                <PriceBox>
                                    <span>
                                        {[product.selling_price].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        <small>원</small>
                                    </span>
                                </PriceBox>
                                <DeliveryBox>
                                    <span>
                                        <small> + 배송비 </small>
                                        {[product.delivery_fee].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        <small>원</small>
                                    </span>
                                </DeliveryBox>
                                <TotalPrice>
                                    <span>
                                    <span>배송비 포함 <strong>{(product.selling_price + product.delivery_fee).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</strong>원</span>
                                    </span>
                                </TotalPrice>
                                <ButtonBox>
                                    <CartBtn>
                                        <FontAwesomeIcon icon={clicked?["fas", "heart"]:["far", "heart"]} id={ `like${item_id}`} onClick={ handleClick } className={"like"}/>
                                    </CartBtn>
                                    <BuyBtn onClick={() => {window.open('https://ohou.se/productions/' + item_id)}}>오늘의집에서 보기</BuyBtn>
                                </ButtonBox>
                            </InfoBox>
                        </ItemInfoBox>
                    </ItemBox>
                    <br/>
                    <div className = 'filterStar d-flex flex-row'>
                        {[5, 4, 3, 2, 1].map( (i) =>{
                            return (
                                <button value={ i } key={i} className={`btn ${activated === i ? 'btn-secondary' : 'btn-outline-secondary'}`} onClick={() => {               
                                    onClickButton(i);
                                }}>{ `${i}점` }</button>
                            )  
                        })}
                    </div>
                    <div id='cloudCon'></div>
                    <br/>
                    <h3>유사한 물품</h3>
                    <br/>
                    <ItemSwiper products={ similar } field='4' wishProducts={ wishProducts }/>
                </Container>
            )}
        </>
    )
}

const Container = styled.div`
    margin: 0 auto;
    margin-bottom: 200px;
    width: 1140px;
    background: rgb(255, 255, 255);
`;
const ItemBox = styled.div`
    box-sizing: border-box;
    display: flex;
    padding-top: 60px;
    flex-direction: row;
`;

const ImgBox = styled.div`
    min-width: 500px;
    cursor: default;
    & img {
        width: 500px;
        height: 500px;
        min-height: 230px;
        border: none;
        vertical-align: middle;
        max-width: 100%;
    }
`;
const ItemInfoBox = styled.div`
    width: 100%;
`;

const InfoBox = styled.div`
    background-color: rgb(255, 255, 255);
    padding: 30px 24px;
    flex: 1 1 0%;
    color: rgb(59, 59, 59);
    cursor: default;
    & p {
        font-size: 18px;
        line-height: 24px;
        font-weight: bold;
        margin: 0;
        padding: 0;
        margin-bottom: 6px;
    }
`;
const PriceBox = styled.div`
marginTop: 60px;
display: flex;
text-align: right;
& span {
    font-size: 24px;
    line-height: 24px;
    font-weight: bold;
    width: 100%;
    & small {
        font-size: 14px;
        margin-left: 2px;
        font-weight: bold;
    }
}
`;

const TotalPrice = styled.div`
    padding: 16px 0;
    text-align: right;
    & span {
        font-size: 14px;
        & strong {
            font-size: 22px;
            color: rgb(255, 111, 97);
            margin-left: 7px;
        }
    }
    & small {
        font-size: 16px;
        margin-left: 2px;
        font-weight: bold;
    }
`;
const DeliveryBox = styled.div`
display: flex;
text-align: right;
& span {
    font-size: 20px;
    line-height: 24px;
    font-weight: bold;
    width: 100%;
    & small {
        font-size: 14px;
        margin-left: 2px;
    }
}
`;
const ButtonBox = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
`;

const CartBtn = styled.button`
    height: 52px;
    font-size: 16px;
    border-radius: 4px;
    font-weight: bold;
    width: 49%;
    background-color: rgb(255, 240, 239);
    color: rgb(255, 111, 97);
    margin: 0;
    padding: 0;
    cursor: pointer;
    border: 0;
    overflow: visible;
`;

const BuyBtn = styled.button`
    height: 52px;
    font-size: 16px;
    border-radius: 4px;
    font-weight: bold;
    width: 49%;
    background-color: rgb(255, 111, 97);
    color: rgb(255, 255, 255);
    margin: 0;
    padding: 0;
    cursor: pointer;
    border: 0;
    overflow: visible;
`;

export default Detail;