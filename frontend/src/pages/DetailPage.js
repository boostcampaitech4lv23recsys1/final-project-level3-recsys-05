/* eslint-disable react/button-has-type */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ItemSwiper from '../products/ItemSwiper';
import axios from 'axios';
import { useParams } from 'react-router-dom';

// 상세 제품 페이지
function Detail() {
    const [ product, setProduct ] = useState([]);
    const [ count, setCount ] = useState(0);
    const [ cloud, setCloud ] = useState('#');
    const [ similar, setSimilar ] = useState([])

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
        axios.get('http://localhost:8000')
        .then(response => response.data)
        .then(data => {
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
                                        console.log(star);
                                        var stars = ""
                                        for(var i=0; i<star-1; i++) {
                                            stars += "★";
                                        }
                                        for(var j=0; j<5-star; j++) {
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
                                <TotalPrice>
                                    <span>
                                        합계 <strong>{product.selling_price * count} 원</strong>
                                    </span>
                                </TotalPrice>
                                <ButtonBox>
                                    <CartBtn>장바구니 담기</CartBtn>
                                    <BuyBtn><a href={`https://ohou.se/productions/${item_id}/selling?affect_type=StoreHome&affect_id=`} target='/blank'>바로 구매하기</a></BuyBtn>
                                </ButtonBox>
                            </InfoBox>
                        </ItemInfoBox>
                    </ItemBox>
                    <ImgBox>
                        <img src={ cloud }/>
                    </ImgBox>
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