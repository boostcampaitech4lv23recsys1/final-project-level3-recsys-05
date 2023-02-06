/* eslint-disable react/button-has-type */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ItemSwiper from '../products/ItemSwiper';
import axios from 'axios';
import StarRate from '../products/StarRate';
import { useParams } from 'react-router-dom';
import ReactDOM from 'react-dom';
import loading from '../landing/loading.gif';
import Heart from '../products/Heart';

// 상세 제품 페이지
function Detail() {
    const [ product, setProduct ] = useState([]);
    const [ similar, setSimilar ] = useState([]);
    const [ wishProducts, setWishProducts ] = useState([]);
    const [ clicked, setClicked ] = useState(false);
    const [ avg, setAvg ] = useState(0);
    const item_id = Number(useParams()['itemid']);

    useEffect(() => {
        const controller = new AbortController();
        ReactDOM.render(<><br/><img src={loading} alt='loading'></img></>, document.getElementById('cloudCon'));
        axios.get("http://34.64.87.78:8000/wishes/" + localStorage.getItem("token"))
        .then(response => response.data)
        .then(data => {
          setWishProducts(data);
          setClicked(data.includes(item_id));
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
            url:`http://115.85.181.95:30002/wordcloud/?item_id=${item_id}&split=${1}`,
            // responseType:'blob'
            })
        .then(response => response.data)
        .then(data => {
            const Example = ({ data }) => <img src={`data:image/jpeg;base64,${data}`} alt='wordcloud'/>
            ReactDOM.render(<Example data={data} />, document.getElementById('cloudCon'))
        })
        .catch( error => console.log(error) );


        return () => {
        controller.abort();
        }
    }, [item_id]);

    const onClickButton = (value) => {
        const buttons = document.getElementsByClassName("starButton");
        Array.from(buttons).map((button) => {
            if(button.value === value) {
                button.setAttribute('class', 'activate starButton');
            } else {
                button.setAttribute('class', 'deactivate starButton');
            }
            return 0;
        })
        ReactDOM.render(<><br/><img src={loading} alt="loading"></img></>, document.getElementById('cloudCon'));
        axios({            
            method:'GET',
            url:`http://115.85.181.95:30002/wordcloud/?item_id=${item_id}&split=${value}`,
            })
        .then(response => response.data)
        .then(data => {
            const Example = ({ data }) => <img src={`data:image/jpeg;base64,${data}`} alt='wordcloud'/>
            ReactDOM.render(<Example data={data} />, document.getElementById('cloudCon'))
        })
        .catch( error => console.log(error) );
        axios.post('http://localhost:8000/review/'+item_id, wishProducts)
        .then(response => response.data)
        .then(data => setAvg(data))
        .catch(error => console.log(error))
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
                                <p>{`유저와 비슷한 유저가 평가한 점수입니다.\n ${parseInt(avg*100)}%`}</p>
                                <ButtonBox>
                                    <CartBtn>
                                        <Heart liked={ clicked } id={ item_id }/>
                                    </CartBtn>
                                    <BuyBtn onClick={() => {window.open('https://ohou.se/productions/' + item_id)}}>오늘의집에서 보기</BuyBtn>
                                </ButtonBox>
                            </InfoBox>
                        </ItemInfoBox>
                    </ItemBox>
                    <br/>
                    <div className = 'filterStar d-flex flex-row'>
                        {Array.from([1,2,3,4,5]).map( (i) =>{
                            if(i === 1) {
                                return (
                                    <button value={ i } key={'button'+i} className="activate starButton" onClick={(event) => {
                                        onClickButton(event.target.value);
                                    }}>{ `${i}점` }</button>
                                )
                            }
                            return (
                                <button value={ i } key={'button'+i} className="deactivate starButton" onClick={(event) => {
                                    onClickButton(event.target.value);
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