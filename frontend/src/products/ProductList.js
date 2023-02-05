import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ScrollToTopOnMount from "../template/ScrollToTopOnMount";
import React from "react";
import axios from "axios";
import FilterMenuLeft from "./FilterMenuLeft";
import ItemSwiper from "./ItemSwiper";

function ProductList() {
  const [ products, setProducts ] = useState([]);
  const [ totals, setTotals ] = useState([]);
  const [ simusers, setSimusers ] = useState([]);
  const [ wishProducts, setWishProducts ] = useState([]);

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

    axios.get("http://34.64.87.78:8000/wishes/" + logintoken)
    .then(response => {
      setWishProducts(response.data);
    })

    // wish list gcp 서버에서 받아오기
    
    axios.post("http://115.85.181.95:30002/recommend/personal?top_k=10", {'input_list':wishProducts, 'filters':defaultFilter}, {signal:controller.signal})      
    .then( response => response.data)
    .then( data => {
      setProducts(data);
    })
    .catch( error => console.log(error) );
    axios.post(`http://115.85.181.95:30002/recommend/normal?k=10`, {signal:controller.signal})      
    .then( response => response.data)
    .then( data => {
      setTotals(data);
    })
    .catch( error => console.log(error) );
    axios.post(`http://115.85.181.95:30002/recommend/similar/user?user_id=${11}&top_k=10`, {signal:controller.signal})      
    .then( response => response.data)
    .then( data => {
      setSimusers(data);
    })
    .catch( error => console.log(error) );
    
    return () => {
     controller.abort();
    }
  }, []);

  function getFilter(minprice, maxprice, category) {
    if(minprice>=0 & maxprice>=0) {
      if(minprice < maxprice) {
        const d = {"price_s":minprice, "price_e":maxprice, "category":category};
        if(category.length === 0) {
          d.category = defaultFilter.category;
        }
        axios.post(`http://115.85.181.95:30002/recommend/personal?top_k=10`, {'input_list':wishProducts, 'filters':d})
        .then( response => response.data )
        .then( data => {
          setProducts(data);
        })
        .catch( error => console.log(error) );
        axios.post(`http://115.85.181.95:30002/recommend/normal?k=10`, d)
        .then( response => response.data )
        .then( data => {
          setTotals(data);
        })
        .catch( error => console.log(error) );
        axios.post(`http://115.85.181.95:30002/recommend/similar/user?user_id=${11}&top_k=10`, d)
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
      <nav aria-label="breadcrumb" className="bg-custom-light rounded">
        <ol className="breadcrumb p-3 mb-0">
          <li className="breadcrumb-item">
            <Link
              className="text-decoration-none link-secondary"
              to="/products"
              replace
            >
              All Prodcuts
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Cases &amp; Covers
          </li>
        </ol>
      </nav>

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
        <div className="d-none d-lg-block col-lg-3">
          <div className="border rounded shadow-sm filterbar">
            <FilterMenuLeft getFilter = { getFilter }/>
          </div>
        </div>
        <div className="col-lg-9">
          <div className="d-flex flex-column h-100">
            <div className="row mb-3">
              <div className="col-lg-9 col-xl-5 offset-xl-4 d-flex flex-row">
                <div className="input-group">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Search products..."
                    aria-label="search input"
                  />
                  <button className="btn btn-outline-dark">
                    <FontAwesomeIcon icon={["fas", "search"]} />
                  </button>
                </div>
              </div>
            </div>
            <h2>username님을 위한 추천</h2>
            <br/>
            <ItemSwiper field="1" products={ products } wishProducts={ wishProducts }></ItemSwiper>
            <br/>
            <h2>인기있는 상품</h2>
            <br/>
            <ItemSwiper field="2" products={ totals } wishProducts={ wishProducts }></ItemSwiper>
            <br/>
            <h2>유사한 유저가 구매한 물품</h2>
            <br/>
            <ItemSwiper field="3" products={ simusers } wishProducts={ wishProducts }></ItemSwiper>
            <br/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductList;