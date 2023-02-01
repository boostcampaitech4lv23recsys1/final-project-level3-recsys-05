/* eslint-disable react/button-has-type */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ItemSwiper from '../products/ItemSwiper';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// 상세 제품 페이지
function Detail() {
    const [ product, setProduct ] = useState([]);
    const [ count, setCount ] = useState(0);
    const [ cloud, setCloud ] = useState('#');
    const [ similar, setSimilar ] = useState([]);
    var [clicked, setClicked] = useState(false);
  
    const handleClick = () => {
      const heart = document.getElementById("like"+item_id).getElementsByTagName("path")[0];
      if(clicked) {
        heart.setAttribute("d", "M458.4 64.3C400.6 15.7 311.3 23 256 79.3 200.7 23 111.4 15.6 53.6 64.3-21.6 127.6-10.6 230.8 43 285.5l175.4 178.7c10 10.2 23.4 15.9 37.6 15.9 14.3 0 27.6-5.6 37.6-15.8L469 285.6c53.5-54.7 64.7-157.9-10.6-221.3zm-23.6 187.5L259.4 430.5c-2.4 2.4-4.4 2.4-6.8 0L77.2 251.8c-36.5-37.2-43.9-107.6 7.3-150.7 38.9-32.7 98.9-27.8 136.5 10.5l35 35.7 35-35.7c37.8-38.5 97.8-43.2 136.5-10.6 51.1 43.1 43.5 113.9 7.3 150.8z");
        axios.post("http://34.64.87.78:8000/wish", {item_id});
        setClicked(false);
      } else {
        heart.setAttribute("d", "M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z");
        setClicked(true);
      }
    };

    const item_id = useParams()['itemid'];
    
    useEffect(() => {
        const controller = new AbortController()
        axios.get('http://localhost:8000/item/' + item_id)
        .then(response => response.data)
        .then(data => {
            console.log(data);
            setProduct(data);
        })
        .catch( error => console.log(error) );
        axios.get('http://localhost:8000/item/' + item_id)
        .then(response => response.data)
        .then(data => {
            setCloud(data.img_main);
        })
        .catch( error => console.log(error) );
        axios.get(`http://115.85.181.95:30002/recommend/similar/item?item_id=${item_id}&top_k=10`)
        .then(response => response.data)
        .then(data => {
            console.log(data);
            setSimilar(data);
        })
        .catch( error => console.log(error) );
        return () => {
        controller.abort();
        }
    }, []);
    
    return (
        <>
            {product && (
                <Container>
                    <ItemBox>
                        <ImgBox>
                            <img src={product.img_main}/>
                        </ImgBox>
                        <ItemInfoBox>
                            <InfoBox>
                                <h3>{product.title}</h3>
                                <p>{product.brand}</p>
                                <small className="category">{ product.category0 }</small>
                                <br/>
                                <small className="category">{ product.category1 }</small>
                                {
                                    [product.review_avg].map((star) => {                                      
                                        var stars = ""
                                        for(var i=0; i<star-1; i++) {
                                            stars += "★";
                                        }
                                        const rest = 5 - stars.length
                                        for(var j=0; j<rest; j++) {
                                            stars += "☆";
                                        }
                                        return (
                                            <div>{ stars }</div>
                                        )
                                    })
                                }
                                <PriceBox>
                                    <span>
                                        {product.selling_price}
                                        <small>원</small>
                                    </span>
                                    <CountBox>
                                        <button
                                            onClick={() => {
                                                if (count < 2) {
                                                    return;
                                                }
                                                setCount(count - 1);
                                            }}
                                        >
                                            -
                                        </button>
                                        <div>{count}</div>
                                        <button
                                            onClick={() => {
                                                setCount(count + 1);
                                            }}
                                        >
                                            +
                                        </button>
                                    </CountBox>
                                </PriceBox>
                                    <div>{ `운송비 : ${product.delivery_fee}원` }</div>
                                    <div>{ `${product.delivery_fee_free_threshold}원 이상 구매 시 운송 무료` }</div>
                                    {
                                        [product.is_sold_out].map((soldout) => {
                                            if(soldout) {
                                                return (
                                                    <div>품절</div>
                                                )
                                            } else {
                                                return (
                                                    <div>판매중</div>
                                                )
                                            }
                                        })
                                    }
                                <TotalPrice>
                                    <span>
                                        합계 <strong>{product.selling_price * count} 원</strong>
                                    </span>
                                </TotalPrice>
                                <ButtonBox>
                                    <CartBtn>
                                        <FontAwesomeIcon icon={["far", "heart"]} id={ `like${item_id}`} onClick={ handleClick } className={"like"}/>
                                    </CartBtn>
                                    <BuyBtn><a href={`https://ohou.se/productions/${item_id}/selling?affect_type=StoreHome&affect_id=`} target='_blank'>오늘의집</a></BuyBtn>
                                </ButtonBox>
                            </InfoBox>
                        </ItemInfoBox>
                    </ItemBox>
                    <br/>
                    <h3>유사한 물품</h3>
                    <br/>
                    <ItemSwiper products={ similar } category='3'/>
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
    min-width: 609px;
    cursor: default;
    & img {
        width: 609px;
        height: 407px;
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
    margin-top: 40px;
    display: flex;
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
const CountBox = styled.div`
    display: flex;
    width: 100%;
    justify-content: flex-end;
    align-items: center;

    & button {
        width: 28px;
        height: 28px;
        padding: 0;
        margin: 0 10px;
        border: 1px solid rgb(236, 236, 236);
        cursor: pointer;
        overflow: visible;
        background: rgb(255, 255, 255);
        outline: none;
    }
`;
const TotalPrice = styled.div`
    padding: 16px 0;
    margin-top: 150px;
    text-align: right;
    & span {
        font-size: 14px;
        & strong {
            font-size: 22px;
            color: rgb(255, 111, 97);
            margin-left: 7px;
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