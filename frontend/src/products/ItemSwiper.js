import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import "swiper/components/navigation/navigation.min.css";
import SwiperCore, { Navigation } from "swiper";
import Product from "./Product";

function ItemSwiper(props) {
  const products = [];
  const field = props.field;
  for(var k in props.products) {
    products.push(props.products[k])
  }

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
        id={field}
      >
      {	
        products.map((product) => {
          return (
            <SwiperSlide key={field + k}>
              <Product product={ product } field={field + k}/>	
            </SwiperSlide>
          )
        })
      }
      </Swiper>
    </>
  );
}

export default ItemSwiper;