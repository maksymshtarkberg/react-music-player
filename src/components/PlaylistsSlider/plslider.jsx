import { Pagination, Scrollbar, A11y, EffectCoverflow } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";
import "../PlaylistsSlider/plslider.css";
import "swiper/css";
import "swiper/css/pagination";
import PlaylistCard from "../PlaylistCard/playlistcard";
import { getPlaylists } from "../../util/getPlaylists";

import { setPlaylist, setPlaylistLoaded } from "../../redux/actions";
import { connect } from "react-redux";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PlaylistsSlider = ({
  audioPlayer,
  setPlaylist,
  playlists,
  playlistCurrentId,
}) => {
  useEffect(() => {
    fetchPlaylists();
  }, []);
  const location = useLocation();
  // fetching playlists
  const fetchPlaylists = async () => {
    const data = await getPlaylists();
    setPlaylist(data);
  };

  const currentPlaylistIndex = playlists.findIndex(
    (playlist) => playlist._id === playlistCurrentId
  );

  return (
    <div className="slider-container">
      {location.pathname === "/about" ? (
        <h1>Popular Playlists</h1>
      ) : (
        <h1>My Playlists</h1>
      )}
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
        spaceBetween={0.1}
        coverflowEffect={{
          rotate: 10,
          stretch: 100,
          depth: 200,
          modifier: 1,
          slideShadows: false,
        }}
        initialSlide={currentPlaylistIndex !== -1 ? currentPlaylistIndex : null}
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
  playlistCurrentId: state.playlistReducer.playlistCurrentId,
});

export default connect(mapStatetoProps, { setPlaylist, setPlaylistLoaded })(
  PlaylistsSlider
);
