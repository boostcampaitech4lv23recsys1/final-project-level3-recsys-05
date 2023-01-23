/* eslint-disable react/button-has-type */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import axios from 'axios';

// 상세 제품 페이지
function Detail() {
    const [ products, setProducts ] = useState([]);	
    const [ count, setCount ] = useState(0);

    useEffect(() => {
        axios.get('http://localhost:5785/jims').then((resp) => {
            setProducts([...resp.data.posts])
          }).catch((e) => {
            console.log(e);
          });
      }, [])
    
    const product = products[1]

    return (
        <>
            {product && (
                <Container>
                    <ItemBox>
                        <ImgBox>
                            <img src={product.image} alt="상품이미지" />
                        </ImgBox>
                        <ItemInfoBox>
                            <InfoBox>
                                <p>{product.title}</p>
                                <PriceBox>
                                    <span>
                                        100000
                                        <small>100</small>
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
                                        합계 <strong>10394 원</strong>
                                    </span>
                                </TotalPrice>
                                <ButtonBox>
                                    <CartBtn>장바구니 담기</CartBtn>
                                    <BuyBtn>바로 구매하기</BuyBtn>
                                </ButtonBox>
                            </InfoBox>
                        </ItemInfoBox>
                    </ItemBox>
                </Container>
            )}
        </>
    );
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