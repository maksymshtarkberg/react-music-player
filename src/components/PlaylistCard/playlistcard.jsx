import {
  addTodo,
  setPlaylist,
  setPlaylistLoaded,
  setPlaylistCurrentId,
  setPlaylistIsOpened,
  setCurrentTrackIndex,
  setSongUrl,
  setIsLoadingSong,
  setSongId,
  setIsPlaying,
  setPlaylistSongHasBeenDeleted,
} from "../../redux/actions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import DeleteIcon from "@mui/icons-material/Delete";

import "./styles.css";
import { connect } from "react-redux";
import { getPlaylists } from "../../util/getPlaylists";
import axios from "axios";
import PlaylistOnPlay from "./PlaylistOnPlay/playlistonplay";
import { useEffect } from "react";

const PlaylistCard = ({
  songUrl,
  audioPlayer,
  playlistId,
  name,
  cover,
  songs,
  quantityOfSongs,
  playlists,
  addTodo,
  setPlaylist,
  setPlaylistLoaded,
  playlistIsOpened,
  setPlaylistIsOpened,
  setSongId,
  setIsLoadingSong,
  setIsPlaying,
  setPlaylistCurrentId,
  playlistCurrentId,
  playlistSongHasBeenDeleted,
  setPlaylistSongHasBeenDeleted,
}) => {
  useEffect(() => {
    fetchPlaylists();
    setPlaylistSongHasBeenDeleted(false);
  }, [playlistSongHasBeenDeleted]);

  const fetchPlaylists = async () => {
    const data = await getPlaylists();
    setPlaylist(data);
    setPlaylistLoaded(true);
  };

  // delete playlist
  const deletePlaylist = async (id) => {
    const headers = {
      "X-Auth-Token": localStorage.getItem("access_token"),
    };

    const { data, status } = await axios.delete(
      `${process.env.REACT_APP_URL}/api/v1/playlist/delete/${id}`,
      { headers }
    );
    if (status === 200) {
      alert("Playlist deleted successfully");
      fetchPlaylists();
    }
  };

  // confirm delete and handle delete
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this playlist?")) {
      deletePlaylist(id);
    }
  };

  const setCurrentPlaylistOn = () => {
    const currentPlaylist = playlists.find(
      (playlist) => playlist._id === playlistId
    );
    const songsInCurrentPlaylist = currentPlaylist
      ? currentPlaylist.songs || []
      : [];
    if (songsInCurrentPlaylist.length > 0) {
      audioPlayer.current.pause();
      setSongUrl("");
      setIsPlaying(false);
      setSongId("");
      setPlaylistCurrentId(playlistId);
      setIsLoadingSong(true);

      addTodo(songsInCurrentPlaylist);
      setSongId(songsInCurrentPlaylist[0]._id);
      setCurrentTrackIndex(0);
      setPlaylistLoaded(true);
      setPlaylistIsOpened(true);
      songUrl && setIsPlaying(true);
    } else {
      setPlaylistIsOpened(false);
    }
  };

  return (
    <div className="playlist-card">
      <div
        className={`playlist-card_inner ${
          playlistIsOpened && playlistCurrentId === playlistId
            ? "playlist-rotate"
            : ""
        }`}
      >
        <div className="playlist-card_circle"></div>
        <div className="playlist-card_circle"></div>
        <div className="playlist-card_front">
          <div className="playlist-delete">
            <DeleteIcon onClick={() => handleDelete(playlistId)} />
          </div>
          <div className="playlist-card_box">
            <img
              className="playlist-card_cover"
              src={`${process.env.REACT_APP_URL}/api/v1/playlistcover/${cover}`}
              alt="playlist-cover"
            />
          </div>

          <h1 className="playlist-card_title">{name}</h1>
          <h4 className="playlist-card_songs">
            Songs in playlist: {quantityOfSongs}
          </h4>
          <button className="playlist-card_btn" onClick={setCurrentPlaylistOn}>
            Listen Now <FontAwesomeIcon icon={faCirclePlay} />
          </button>
        </div>
        <div className="playlist-card_back">
          <PlaylistOnPlay
            songs={songs}
            audioPlayer={audioPlayer}
            playlistId={playlistId}
          />
        </div>
      </div>
    </div>
  );
};

const mapStatetoProps = (state) => ({
  songUrl: state.songReducer.songUrl,
  playlists: state.playlistReducer.playlists,
  playlistsisLoaded: state.playlistReducer.playlistsisLoaded,
  playlistIsOpened: state.playlistReducer.playlistIsOpened,
  playlistCurrentId: state.playlistReducer.playlistCurrentId,
  playlistSongHasBeenDeleted: state.playlistReducer.playlistSongHasBeenDeleted,
});

export default connect(mapStatetoProps, {
  addTodo,
  setPlaylist,
  setPlaylistLoaded,
  setPlaylistCurrentId,
  setPlaylistIsOpened,
  setCurrentTrackIndex,
  setSongUrl,
  setIsLoadingSong,
  setSongId,
  setIsPlaying,
  setPlaylistSongHasBeenDeleted,
})(PlaylistCard);
