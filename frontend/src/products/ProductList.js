import { useState, useEffect } from "react";
import ScrollToTopOnMount from "../template/ScrollToTopOnMount";
import React from "react";
import axios from "axios";
import FilterMenuLeft from "./FilterMenuLeft";
import FilterBudgetLeft from "./FilterBudgetLeft";
import ItemSwiper from "./ItemSwiper";
import ReactDOM from 'react-dom';

function ProductList() {
  const [ products, setProducts ] = useState([]);
  const [ totals, setTotals ] = useState([]);
  const [ simusers, setSimusers ] = useState([]);
  const [ wishProducts, setWishProducts ] = useState([]);
  const [ myusername, setMyusername ] = useState("");
  const [ myohouse, setMyOhouse ] =useState();

  const defaultFilter = {
    "price_s": 0,
    "price_e": 10000000000,
    "category": [
      "가구",
      "주방용품",
      "수납·정리",
      "생활용품",
      "패브릭",
      "공구·DIY",
      "데코·식물",
      "조명"]
    }

  useEffect(() => {
    const controller = new AbortController();
    const logintoken = localStorage.getItem("token");
    const filter = defaultFilter;
    
    axios.get("http://34.64.87.78:8000/wishes/" + logintoken)
    .then(response => response.data)
    .then(data => {
      setWishProducts(data);
      axios.get("http://34.64.87.78:8000/username/" + logintoken)
      .then(resp => {
        setMyusername(resp.data[0]);
        axios.post("http://115.85.181.95:30003/recommend/personal?top_k=10&user_id=" + (resp.data[1]!=0 ? resp.data[1] : -1).toString() , {'input_list':data, 'filters':filter})      
          .then( response => response.data)
          .then( datum => {
            setProducts(datum);
          })
          .catch( error => console.log(error) );

        axios.post(`http://115.85.181.95:30003/recommend/similar/user?user_id=${(resp.data[1]!=0 ? resp.data[1] : -1).toString()}&top_k=10`, {'input_list':data, 'filters':filter})      
          .then( response => response.data)
          .then( data => {
            setSimusers(data);
          })
          .catch( error => console.log(error) );
      })
      .catch( error => console.log(error) );
    })
    .catch((error) => console.log(error));

    axios.get("http://34.64.87.78:8000/username/" + logintoken)
    .then(resp => {
      setMyusername(resp.data[0]);
      setMyOhouse(resp.data[1]);
    })
    .catch((error) => console.log(error));

    axios.post(`http://115.85.181.95:30003/recommend/normal?k=10`, filter)      
    .then( response => response.data)
    .then( data => {
      setTotals(data);
    })
    .catch( error => console.log(error) );

    

    // wish list gcp 서버에서 받아오기
    return () => {
     controller.abort();
    }
  }, []);

  useEffect(() => {ReactDOM.render(<ItemSwiper field="1" products={ products } wishProducts={ wishProducts }></ItemSwiper>, document.getElementById('swiper01'));
  }, [products, wishProducts])
  useEffect(() => {ReactDOM.render(<ItemSwiper field="2" products={ totals } wishProducts={ wishProducts }></ItemSwiper>, document.getElementById('swiper02'));
  }, [totals, wishProducts])
  useEffect(() => {ReactDOM.render(<ItemSwiper field="3" products={ simusers } wishProducts={ wishProducts }></ItemSwiper>, document.getElementById('swiper03'));
  }, [simusers, wishProducts])

  function getFilter(minprice, maxprice, category) {
    if(minprice>=0 & maxprice>=0) {
      if(minprice < maxprice) {
        const d = {"price_s":minprice, "price_e":maxprice, "category":category};
        if(category.length === 0) {
          d.category = defaultFilter.category;
        }
        
        const logintoken = localStorage.getItem("token");
        axios.get("http://34.64.87.78:8000/wishes/" + logintoken)
        .then(response => response.data)
        .then(data => {
          setWishProducts(data);
          axios.post(`http://115.85.181.95:30003/recommend/personal?top_k=10&user_id=${logintoken}`, {'input_list':data, 'filters':d})
          .then( response => response.data )
          .then( data => {
            setProducts(data);
          })
          .catch( error => console.log(error) );
        })
        .catch( error => console.log(error) );

        axios.post(`http://115.85.181.95:30003/recommend/normal?k=10`, d)
        .then( response => response.data )
        .then( data => {
          setTotals(data);
        })
        .catch( error => console.log(error) );

        axios.post(`http://115.85.181.95:30003/recommend/similar/user?user_id=${logintoken}&top_k=10`, d)
        .then( response => response.data )
        .then( data => {
          setSimusers(data);
        })
        .catch( error => console.log(error) );
      } else {
        alert("최소, 최대 금액이 맞지 않습니다.");
      }
    } else {
      alert("가격이 입력되지 않았습니다.");
    }
  }


  return (
    <div className="container mt-5 py-4 px-xl-5">
      <ScrollToTopOnMount />
      <br/>

      <div className="row mb-3 d-block d-lg-none">
        <div className="col-12">
          <div id="accordionFilter" className="accordion shadow-sm">
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingOne">
                <button
                  className="accordion-button fw-bold collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseFilter"
                  aria-expanded="false"
                  aria-controls="collapseFilter"
                >
                  Filter Products
                </button>
              </h2>
            </div>
            <div
              id="collapseFilter"
              className="accordion-collapse collapse"
              data-bs-parent="#accordionFilter"
            >
              <div className="accordion-body p-0">
                <FilterMenuLeft getFilter = { getFilter }/>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4 mt-lg-3">
        <div className="d-none d-lg-block col-lg-3 filterbar">
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingOne">
              <button
                className="accordion-button fw-bold"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseFilterPrice"
                aria-expanded="false"
                aria-controls="collapseFilterPrice"
              >
              가격 필터
              </button>
            </h2>
          </div>
          <div className="border rounded shadow-sm accordion-collapse collapse-show" 
              id="collapseFilterPrice">
            <FilterMenuLeft getFilter = { getFilter }/>
          </div>
          
          {/* <div className="accordion-item">
            <h2 className="accordion-header" id="headingOne">
              <button
                className="accordion-button fw-bold collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseFilterBudget"
                aria-expanded="false"
                aria-controls="collapseFilterBudget"
              >
              예산 필터
              </button>
            </h2>
          </div>
          <div className="border rounded shadow-sm accordion-collapse collapse" 
              id="collapseFilterBudget">
            <FilterBudgetLeft getFilter = { getFilterBudget }/>
          </div> */}
        </div>
        <div className="col-lg-9">
          <div className="d-flex flex-column h-100">
            <div className="row mb-3">
              <div className="col-lg-9 col-xl-5 offset-xl-4 d-flex flex-row">
              </div>
            </div>
            <h2>{myusername}님을 위한 추천</h2>
            <br/>
            <div id='swiper01'></div>
            <br/>
            <h2>인기있는 상품</h2>
            <br/>
            <div id='swiper02'></div>
            <br/>
            <h2>유사한 유저가 구매한 물품</h2>
            <br/>
            <div id='swiper03'></div>
            <br/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductList;