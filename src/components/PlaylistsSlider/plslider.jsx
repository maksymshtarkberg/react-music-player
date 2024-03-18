import { Pagination, Scrollbar, A11y, EffectCoverflow } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";
import "../PlaylistsSlider/plslider.css";
import "swiper/css";
import "swiper/css/pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";

const PlaylistsSlider = () => {
  return (
    <div className="slider-container">
      <h1>Popular Playlist</h1>
      <Swiper
        modules={[Pagination, Scrollbar, A11y, EffectCoverflow]}
        className="swiper"
        effect="coverflow"
        pagination={{ el: ".swiper-pagination" }}
        grabCursor={true}
        centeredSlides
        loop={true}
        speed={600}
        slidesPerView={"auto"}
        coverflowEffect={{
          rotate: 10,
          stretch: 120,
          depth: 200,
          modifier: 1,
          slideShadows: false,
        }}
      >
        <div className="swiper-wrapper">
          <SwiperSlide className="swiper-slide">
            <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/95b52c32-f5da-4fe6-956d-a5ed118bbdd2" />
            <div className="slide-overlay">
              <h2>Midnight Moods</h2>
              <button>
                Listen Now <FontAwesomeIcon icon={faCirclePlay} />
              </button>
            </div>
          </SwiperSlide>

          <SwiperSlide className="swiper-slide">
            <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/6ddf81f5-2689-4f34-bf80-a1e07f14621c" />
            <div className="slide-overlay">
              <h2>Party Starters</h2>
              <button>
                Listen Now <FontAwesomeIcon icon={faCirclePlay} />
              </button>
            </div>
          </SwiperSlide>

          <SwiperSlide className="swiper-slide">
            <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/ab52d9d0-308e-43e0-a577-dce35fedd2a3" />
            <div className="slide-overlay">
              <h2>Relaxing Tones</h2>
              <button>
                Listen Now <FontAwesomeIcon icon={faCirclePlay} />
              </button>
            </div>
          </SwiperSlide>

          <SwiperSlide className="swiper-slide">
            <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/20c8fdd5-9f4a-4917-ae90-0239a52e8334" />
            <div className="slide-overlay">
              <h2>Smooth Jazz Journey</h2>
              <button>
                Listen Now <FontAwesomeIcon icon={faCirclePlay} />
              </button>
            </div>
          </SwiperSlide>
          <SwiperSlide className="swiper-slide">
            <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/df461a99-2fb3-4d55-ac16-2e0c6dd783e1" />
            <div className="slide-overlay">
              <h2>Uplifting Rhythms</h2>
              <button>
                Listen Now <FontAwesomeIcon icon={faCirclePlay} />
              </button>
            </div>
          </SwiperSlide>
        </div>
        <div className="swiper-pagination"></div>
      </Swiper>
    </div>
  );
};

export default PlaylistsSlider;
