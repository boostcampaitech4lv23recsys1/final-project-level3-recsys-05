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

  useEffect(() => {
    const controller = new AbortController()
    axios.get("http://localhost:8000", {signal:controller.signal})      
    .then( response => response.data)
    .then( data => {
      console.log(data);
      setProducts(data);
    })
    .catch( error => console.log(error) );
    axios.get(`http://localhost:8000`, {signal:controller.signal})      
    .then( response => response.data)
    .then( data => {
      setTotals(data);
    })
    .catch( error => console.log(error) );
    axios.get("http://localhost:8000", {signal:controller.signal})      
    .then( response => response.data)
    .then( data => {
      setSimusers(data);
    })
    .catch( error => console.log(error) );
    
    return () => {
     controller.abort();
    }
  }, []);

  const applyButton = document.createElement('button');
  applyButton.setAttribute('className', "btn btn-dark apply");
  applyButton.textContent = 'Apply';

  function getFilter(minprice, maxprice, category, style) {
    axios.post(`http://localhost:8000/filter?minp=${minprice}&maxp=${maxprice}&category=${category}`, [style])
    .then( response => response.data )
    .then( data => {
      setProducts(data);
    })
    .catch( error => console.log(error) );
    axios.post(`http://localhost:8000/filter?minp=${minprice}&maxp=${maxprice}&category=${category}`, [style])
    .then( response => response.data )
    .then( data => {
      setTotals(data);
    })
    .catch( error => console.log(error) );
    axios.post(`http://localhost:8000/filter?minp=${minprice}&maxp=${maxprice}&category=${category}`, [style])
    .then( response => response.data )
    .then( data => {
      setSimusers(data);
    })
    .catch( error => console.log(error) );
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
          <div className="border rounded shadow-sm">
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
            <h2>용욱님을 위한 추천</h2>
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