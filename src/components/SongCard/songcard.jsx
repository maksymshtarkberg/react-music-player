import { decodeToken } from "react-jwt";
import musicbg from "../../assets/musicbg.jpg";
import axios from "axios";

import { useEffect } from "react";

import {
  setSongUrl,
  setSongName,
  setArtistName,
  setAlbumName,
  setIsPlaying,
  setSongFile,
  setIsLoadedSong,
  setCurrentTrackIndex,
} from "../../redux/actions";
import { connect } from "react-redux";
import "./styles.css";

const SongCard = ({
  songId,
  title,
  artistName,
  album,
  songSrc,
  setSongUrl,
  setSongName,
  setArtistName,
  setAlbumName,
  setIsLoadedSong,
  isLoadedSong,
  currentTrackIndex,
  setCurrentTrackIndex,
  trackIndex,
}) => {
  const token = localStorage.getItem("access_token");
  let decoded;
  if (token) {
    decoded = decodeToken(token);
  }

  // useEffect(() => {
  //   fetchSong();
  // }, [isLoadedSong]);

  // const fetchSong = async () => {
  //   const __URL__ = "http://localhost:1337";
  //   const { data } = await axios.get(`${__URL__}/api/v1/songs`);

  //   setIsLoadedSong(true);
  //   const song = data.songs[currentTrackIndex];
  //   console.log(song);

  //   // setSongUrl()
  // };

  const handlePlay = async () => {
    // const __URL__ = "http://localhost:1337";
    // const URL = `http://localhost:1337/api/v1/song/${songId}/file`;
    // const streamURL = `${__URL__}/api/v1/stream/${songSrc}`;
    // const { data } = await axios.get(URL, {
    //   responseType: "blob",
    // });

    // const blob = new Blob([data], { type: "audio/mp3" }); // создаем Blob из данных и указываем тип
    // const file = new File([blob], `${songId}.mp3`, { type: "audio/mp3" });
    // const audioUrl = window.URL.createObjectURL(file);
    // setSongUrl(streamURL);
    setCurrentTrackIndex(trackIndex);
    setSongName(title);
    setArtistName(artistName);
    setAlbumName(album);
  };

  return (
    <div
      onClick={handlePlay}
      className={
        "songCard" + (currentTrackIndex === trackIndex ? "_selected" : "")
      }
    >
      <img src={musicbg} alt="" />
      <div>
        <div>{title}</div>
        <div>{artistName}</div>
      </div>
    </div>
  );
};

const mapStatetoProps = (state) => ({
  // songSrcRedux: state.songReducer,
  songUrl: state.songReducer.songUrl,
  isLoadedSong: state.songReducer.isLoadedSong,
  currentTrackIndex: state.playerReducer.currentTrackIndex,
});

export default connect(mapStatetoProps, {
  setSongUrl,
  setSongName,
  setArtistName,
  setAlbumName,
  setIsPlaying,
  setSongFile,
  setIsLoadedSong,
  setCurrentTrackIndex,
})(SongCard);
