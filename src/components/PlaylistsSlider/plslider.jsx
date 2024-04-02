import { Pagination, Scrollbar, A11y, EffectCoverflow } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";
import "../PlaylistsSlider/plslider.css";
import "swiper/css";
import "swiper/css/pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import PlaylistCard from "../PlaylistCard/playlistcard";
import { getPlaylists } from "../../util/getPlaylists";

import { setPlaylist, setPlaylistLoaded } from "../../redux/actions";
import { connect } from "react-redux";
import { useEffect } from "react";

const PlaylistsSlider = ({ audioPlayer, setPlaylist, playlists }) => {
  useEffect(() => {
    fetchPlaylists();
  }, []);

  // fetching playlists
  const fetchPlaylists = async () => {
    const data = await getPlaylists();
    setPlaylist(data);
  };

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
        loop={false}
        speed={600}
        slidesPerView={"auto"}
        coverflowEffect={{
          rotate: 10,
          stretch: 120,
          depth: 200,
          modifier: 1,
          slideShadows: false,
        }}
        initialSlide={
          playlists.length > 0 ? Math.floor(playlists.length / 2) : null
        }
      >
        <div className="swiper-wrapper">
          {playlists !== undefined &&
            playlists.map((item, index) => {
              const songsQuantity = item.songs.length;
              return (
                <SwiperSlide className="swiper-slide" key={index}>
                  <PlaylistCard
                    audioPlayer={audioPlayer}
                    playlistId={item._id}
                    name={item.playlistName}
                    cover={item.playlistCoverId}
                    quantityOfSongs={songsQuantity}
                    songs={item.songs}
                  />
                </SwiperSlide>
              );
            })}
        </div>
        <div className="swiper-pagination"></div>
      </Swiper>
    </div>
  );
};

const mapStatetoProps = (state) => ({
  playlists: state.playlistReducer.playlists,
  playlistsisLoaded: state.playlistReducer.playlistsisLoaded,
});

export default connect(mapStatetoProps, { setPlaylist, setPlaylistLoaded })(
  PlaylistsSlider
);
