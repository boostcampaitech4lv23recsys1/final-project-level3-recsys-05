import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import "swiper/components/navigation/navigation.min.css";
import SwiperCore, { Navigation } from "swiper";
import Product from "./Product";

function ItemSwiper(props) {
    const category = props.category;

    return (
      <Swiper
        className="col-12"
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
      >
        {Array.from({ length:10 }, (_, i) => 
        <SwiperSlide key={category + i}>
          <Product name='samsung' id={"product" + category + i}/>
        </SwiperSlide>
        )}
      </Swiper>
    );
}

export default ItemSwiper;