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
  const [ myusername, setMyusername ] = useState("");

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

    axios.get("http://34.64.87.78:8000/username/" + logintoken)
    .then(resp => {
      setMyusername(resp.data);
    })

    // wish list gcp 서버에서 받아오기
    
    axios.post("http://115.85.181.95:30003/recommend/personal?top_k=10", {'input_list':wishProducts, 'filters':defaultFilter}, {signal:controller.signal})      
    .then( response => response.data)
    .then( data => {
      setProducts(data);
    })
    .catch( error => console.log(error) );
    axios.post(`http://115.85.181.95:30003/recommend/normal?k=10`, {signal:controller.signal})      
    .then( response => response.data)
    .then( data => {
      console.log(data)
      setTotals(data);
    })
    .catch( error => console.log(error) );
    axios.post(`http://115.85.181.95:30003/recommend/similar/user?user_id=${11}&top_k=10`, {signal:controller.signal})      
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
    const d = (category.length===0 ? {"price_s":minprice, "price_e":maxprice, "category":defaultFilter.category} : {"price_s":minprice, "price_e":maxprice, "category":category})
    axios.post(`http://115.85.181.95:30003/recommend/personal?top_k=10`, {'input_list':wishProducts, 'filters':d})
    .then( response => response.data )
    .then( data => {
      setProducts(data);
    })
    .catch( error => console.log(error) );
    axios.post(`http://115.85.181.95:30003/recommend/normal?k=10`, d)
    .then( response => response.data )
    .then( data => {
      setTotals(data);
    })
    .catch( error => console.log(error) );
    axios.post(`http://115.85.181.95:30003/recommend/similar/user?user_id=${11}&top_k=10`, d, {'header':'Access-Control-Allow-Origin'})
    .then( response => response.data )
    .then( data => {
      setSimusers(data);
    })
    .catch( error => console.log(error) );
    
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
        <div className="d-none d-lg-block col-lg-3">
          <div className="border rounded shadow-sm">
            <FilterMenuLeft getFilter = { getFilter }/>
          </div>
        </div>
        <div className="col-lg-9">
          <div className="d-flex flex-column h-100">
            <div className="row mb-3">
              <div className="col-lg-9 col-xl-5 offset-xl-4 d-flex flex-row">
              </div>
            </div>
            <h2>{myusername}님을 위한 추천</h2>
            <br/>
            <ItemSwiper field="1" products={ products }></ItemSwiper>
            <br/>
            <h2>인기있는 상품</h2>
            <br/>
            <ItemSwiper field="2" products={ totals }></ItemSwiper>
            <br/>
            <h2>유사한 유저가 구매한 물품</h2>
            <br/>
            <ItemSwiper field="3" products={ simusers }></ItemSwiper>
            <br/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductList;