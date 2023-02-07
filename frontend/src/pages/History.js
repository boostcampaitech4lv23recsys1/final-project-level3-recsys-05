import { useState, Fragment } from 'react';	
import axios from 'axios';	
import styled from 'styled-components';
import checkimg from './check.jpeg';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


function History() {	
  const [ products, setProducts ] = useState([]);	
  const [ counter, setCounter ]= useState(0);	
  const [ chosenItemIds, setChosenItemIds ] = useState([]);
  const controller = new AbortController()
  const theuserid = useParams()['userid'];

  const userChoose = (itemId) => {
    if (chosenItemIds.includes(itemId)) {
      setChosenItemIds(chosenItemIds.filter((id) => id !== itemId));
    } 
    else {
      setChosenItemIds([...chosenItemIds, itemId]);
    }  
    console.log(chosenItemIds)
  };

  useEffect(() => {
    axios.post(`http://115.85.181.95:30003/recommend/normal?k=8`, {signal:controller.signal})      
    .then( response => response.data)
    .then( data => {
      setProducts(data)
    })
  }, [])

  return (	
    <div>	
      {/* jumbotron */}	
      <div class="bg-light p-5 rounded-lg">	
        <h1 class="display-4">안녕하세요 UNZYP입니다.</h1>	
        <p class="lead">선호하는 상품을 5개 이상 골라주세요!</p>	
        <hr class="my-4" />	
      </div>	
      {/* card contents */}	
      <div className='container'>	
        <div className='historys'>	
          {	
            products.map((obj, index) => {	
              return <Product product = {obj} useruser = {theuserid}/>
              }
            )	
          }	
        </div>
      </div>
      {/* more button */}
      <div style={{alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
      <a class="btn btn-secondary btn m-1" role="button" onClick={() => {
        axios.post('http://115.85.181.95:30003/recommend/normal?k=4', {signal:controller.signal})
        .then((resp) => {
          console.log(resp.data)
          setProducts(
            [...products, ...resp.data]
          );
        }).catch((e) => {
          console.log(e);
        });
      }}>더보기</a>
      <a class="btn btn-secondary btn m-1" role="button" onClick={() => {
        window.location.replace('/#/login/');
      }}>제출하기</a>
      </div>
    </div>	
  );	
}	


function Product(props) {
  var [clicked, setClicked] = useState(false);

  const handleClick = () => {
    const heart = document.getElementById("like"+id).getElementsByTagName("path")[0];
    if(clicked) {
      axios.get("http://34.64.87.78:8000/unwishing/"+ props.useruser + "/" + id);
      heart.setAttribute("d", "M458.4 64.3C400.6 15.7 311.3 23 256 79.3 200.7 23 111.4 15.6 53.6 64.3-21.6 127.6-10.6 230.8 43 285.5l175.4 178.7c10 10.2 23.4 15.9 37.6 15.9 14.3 0 27.6-5.6 37.6-15.8L469 285.6c53.5-54.7 64.7-157.9-10.6-221.3zm-23.6 187.5L259.4 430.5c-2.4 2.4-4.4 2.4-6.8 0L77.2 251.8c-36.5-37.2-43.9-107.6 7.3-150.7 38.9-32.7 98.9-27.8 136.5 10.5l35 35.7 35-35.7c37.8-38.5 97.8-43.2 136.5-10.6 51.1 43.1 43.5 113.9 7.3 150.8z");
      setClicked(false);
    } else {
      axios.get("http://34.64.87.78:8000/wishing/"+ props.useruser + "/" + id);
      heart.setAttribute("d", "M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z");
      setClicked(true);
    }
  };

  const product = props.product;
  const id = product.item_ids;
  const name = product.titles;
  const price = product.selling_prices;
  const star = product.star_avgs;
  const Image = product.img_urls;
  const brand = product.brands;
  const field = props.field;
  
  return (
      <div className={"card shadow-sm card" + field}>
        <a href={ "#/detail/" + id } className="link" target="_blank">
          <img
            className="card-img-top bg-dark cover"
            height="200"
            alt=""
            src={ Image }
            loading="lazy"
          />
        </a>
        <div className="card-body">
          <h5 className="card-title text-center text-dark text-truncate title">
            { name }
          </h5>
          <p className="card-text text-center text-muted mb-0 brand">{ brand }</p>
          <p className="card-text text-center text-muted mb-0 price">{ '￦' + [price].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }</p>
          <div className="d-grid d-block text-center">
              <FontAwesomeIcon icon={["far", "heart"]} id={ `like${id}`} onClick={ handleClick } className={"like"}/>
          </div>
        </div>
      </div>
  );
}

export default History;