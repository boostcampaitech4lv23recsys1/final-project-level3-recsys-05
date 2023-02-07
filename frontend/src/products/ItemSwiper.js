import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import "swiper/components/navigation/navigation.min.css";
import SwiperCore, { Navigation } from "swiper";
import Product from "./Product";
import { useState, useEffect } from "react";

import "swiper/swiper.scss";
import "swiper/components/navigation/navigation.scss";
import "swiper/components/pagination/pagination.scss";

function ItemSwiper(props) {
  const [ clicked, setClicked ] = useState([])
  const wishProducts = props.wishProducts;
  const products = props.products;
  const field = props.field;

  SwiperCore.use([Navigation]);

  useEffect(() => {
    const temp = []
    Array.from(products).map((product) => {
      temp.push(wishProducts.includes(product.item_ids))
    })
    setClicked(temp)
  }, [wishProducts])

  return (
    <>
      <Swiper
        className={ "col-12 swiper swiper" + field }
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
        id={"swiper"+field}
      >
      {	
        products.map((product, index) => {
          return (
            <SwiperSlide key={field + index}>
              <Product product={ product } field={field + index} wish={ clicked[index] }/>	
            </SwiperSlide>
          )
        })
      }
      </Swiper>
    </>
  );
}

export default ItemSwiper;