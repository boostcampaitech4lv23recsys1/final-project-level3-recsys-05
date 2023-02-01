import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import "swiper/components/navigation/navigation.min.css";
import SwiperCore, { Navigation } from "swiper";
import Product from "./Product";

function ItemSwiper(props) {
  const products = props.products;
  const field = props.field;

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
        products.map((product, index) => {
          return (
            <SwiperSlide key={field + index}>
              <Product product={ product } field={field + index}/>	
            </SwiperSlide>
          )
        })
      }
      </Swiper>
    </>
  );
}

export default ItemSwiper;