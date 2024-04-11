import { useEffect, useState } from "react";
import useDragScroll from "../../util/useDragScroll";
import artistsdef from "../../assets/artist-default.png";
import { connect } from "react-redux";
import {
  addTodo,
  setIsPlaying,
  setSongId,
  setSongUrl,
  setCurrentTrackIndex,
  setArtistIsOn,
  setPlaylistIsOpened,
  setAlbumsAndArtistsSongs,
} from "../../redux/actions";

const Artists = ({
  audioPlayer,
  artists,
  addTodo,
  setIsPlaying,
  setSongId,
  setSongUrl,
  songUrl,
  setCurrentTrackIndex,
  setArtistIsOn,
  artistIsOn,
  setPlaylistIsOpened,
  setAlbumsAndArtistsSongs,
}) => {
  const { handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave } =
    useDragScroll();

  const HandlePlayArtistSongs = (songs) => {
    audioPlayer.current.pause();
    setSongUrl("");
    setSongId("");
    setIsPlaying(false);
    setSongId(songs[0]._id);
    addTodo(songs);
    setAlbumsAndArtistsSongs(songs);
    setCurrentTrackIndex(0);
    setArtistIsOn(true);
    setPlaylistIsOpened(false);
  };

  return (
    <div class="artists">
      <h1>Featured Artists</h1>
      <div
        className="artist-container containers"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {artists &&
          artists.map((artist, index) => {
            return (
              <div class="artist" key={index}>
                <img
                  onClick={() => HandlePlayArtistSongs(artist.songs)}
                  src={
                    artist.artistName === "Future"
                      ? "https://images.genius.com/a3496b5fc4c6f7796e08548ab28aef18.1000x1000x1.jpg"
                      : artist.artistName === "$uicideBoy$"
                      ? "https://images.genius.com/3858815bfd12a53748553d09964fed4c.529x529x1.jpg"
                      : artist.artistName === "Led Zeppelin"
                      ? "https://images.genius.com/e4763bba12e6411077a3e573cd290da0.433x433x1.jpg"
                      : artist.artistName === "Lil Peep"
                      ? "https://images.genius.com/919c7ba130d3861740cbe7fbd7f83c59.1000x1000x1.jpg"
                      : artist.artistName === "Pink Floyd"
                      ? "https://images.genius.com/6b5c50912d99c3cf0eabfec5f427c452.1000x1000x1.jpg"
                      : artist.artistName === "The Weeknd"
                      ? "https://images.genius.com/1bab7f9dbd1216febc16d73ae4da9bd0.1000x1000x1.jpg"
                      : artistsdef
                  }
                  alt="artist-cover"
                />
                <p>{artist.artistName}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
};

const mapStatetoProps = (state) => ({
  songUrl: state.songReducer.songUrl,
  artistIsOn: state.playerReducer.artistIsOn,
});

export default connect(mapStatetoProps, {
  addTodo,
  setIsPlaying,
  setSongId,
  setSongUrl,
  setCurrentTrackIndex,
  setArtistIsOn,
  setPlaylistIsOpened,
  setAlbumsAndArtistsSongs,
})(Artists);
