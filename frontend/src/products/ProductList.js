import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ScrollToTopOnMount from "../template/ScrollToTopOnMount";
import React from "react";
import axios from "axios";
import ItemSwiper from "./ItemSwiper";

function FilterMenuLeft() {
  return (
    <ul className="list-group list-group-flush rounded">
      <li className="list-group-item">
        <h5 className="mt-1 mb-2">Price Range</h5>
        <div className="d-grid d-block mb-3">
          <div className="form-floating mb-2">
            <input
              type="number"
              className="form-control min-price"
              placeholder="Min"
              defaultValue="0"
            />
            <label htmlFor="floatingInput">Min Price</label>
          </div>
          <div className="form-floating mb-2">
            <input
              type="number"
              className="form-control max-price"
              placeholder="Max"
              defaultValue="0"
            />
            <label htmlFor="floatingInput">Max Price</label>
          </div>
          <button className="btn btn-dark apply" onClick={ FilterApply }>Apply</button>
        </div>
      </li>
    </ul>
  );
}

function FilterApply() {
  const min = document.getElementsByClassName("min-price")[1].valueAsNumber;
  const max = document.getElementsByClassName("max-price")[1].valueAsNumber;
  axios.get("http://localhost:8000/filter?minp=" + min + "&maxp=" + max)
  .then( response => response.data )
  .then( data => { 
    var index = 0;
    var ids = [];
    var titles = [];
    var prices = [];
    var starss = [];
    var urls = [];
    data.map((d) => {
      const product = document.getElementById("product1"+index);
      const image = product.getElementsByClassName("cover")[0];
      const link = product.getElementsByClassName("link")[0];
      const star = d.star;
      const price = d.price;
      const title = d.title;
      const url = d.image;
      const id = d.id;
      var stars = "";
      for(var i = 1; i < star; i++) {
        stars += "★";
      }
      for(var j = 0; j < 5 - stars.length; j++) {
        stars += "☆";
      }
      product.getElementsByClassName("title")[0].textContent = title;
      product.getElementsByClassName("price")[0].textContent = price;
      product.getElementsByClassName("star")[0].textContent = stars;
      starss.push(stars);
      // image.setAttribute("src", url);
      link.setAttribute("href", "https://ohou.se/productions/" + id + "/selling?affect_type=StoreHome&affect_id=");
      index++;
      return 0;
    });
    console.log(starss);
  })
  .catch( error => console.log(error) );
}

function ProductList() {
  const [viewType, setViewType] = useState({ grid: true });

  const date = new Date();
  axios.get("http://localhost:8000"
  )
  .then( response => response.data )
  .then( data => {  
    var index = 0;
    data.map((d) => {
      const product = document.getElementById("product1"+index);
      const image = product.getElementsByClassName("cover")[0];
      const link = product.getElementsByClassName("link")[0];
      const star = d.star;
      const price = d.price;
      const title = d.title;
      const url = d.image;
      const id = d.id;
      var stars = "";
      for(var i = 1; i < star; i++) {
        stars += "★";
      }
      for(var j = 0; j < 5 - stars.length; j++) {
        stars += "☆";
      }
      product.getElementsByClassName("title")[0].textContent = title;
      product.getElementsByClassName("price")[0].textContent = price;
      product.getElementsByClassName("star")[0].textContent = stars;
      image.setAttribute("src", url);
      link.setAttribute("href", "https://ohou.se/productions/" + id + "/selling?affect_type=StoreHome&affect_id=");
      index++;
      return 0;
    });
  })
  .catch( error => console.log(error) );

  function changeViewType() {
    setViewType({
      grid: !viewType.grid,
    });
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
                <FilterMenuLeft />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4 mt-lg-3">
        <div className="d-none d-lg-block col-lg-3">
          <div className="border rounded shadow-sm">
            <FilterMenuLeft />
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
            <ItemSwiper category="1"></ItemSwiper>
            <br/>
            <h2>내가 찾는 핸드폰</h2>
            <br/>
            <ItemSwiper category="2"></ItemSwiper>
            <br/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductList;