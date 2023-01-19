import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import "swiper/components/navigation/navigation.min.css";
import SwiperCore, { Navigation } from "swiper";
import Product from "./Product";
import axios from "axios";

function ItemSwiper(props) {
  const [ products, setProducts ] = useState([]);
  const category = props.category;

  useEffect(() => {
    const controller = new AbortController()
    axios.get("http://localhost:8000", {signal:controller.signal})      
    .then( response => response.data)
    .then( data => { 
      console.log(data);
      setProducts([...products, ...data]);
    })
    .catch( error => console.log(error) );
    
    return () => {
     controller.abort();
    }
  }, []);

  return (
    <Swiper
      className={ "col-12 swiper swiper" + category }
      spaceBetween={0}
      slidesPerView={2}
      scrollbar={{ draggable: true }}
      navigation
      pagination={{ clickable: true }}
      breakpoints={{
        768: {
          slidesPerView: 5,
        },
      }}
      id={category}
    >
    {	
      products.map((pro, index) => {
        return (
          <SwiperSlide key={category + index}>
            <Product id={pro.id} name={pro.title} price={pro.price} star={pro.star} image={pro.image} category={category + index}/>	
          </SwiperSlide>
        )
      })	
    }	
    </Swiper>
  );
}

export default ItemSwiper;