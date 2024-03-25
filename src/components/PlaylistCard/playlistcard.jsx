import {
  addTodo,
  setPlaylist,
  setPlaylistLoaded,
  setPlaylistCurrentId,
  setPlaylistIsOpened,
  setCurrentTrackIndex,
  setSongUrl,
  setIsLoadingSong,
} from "../../redux/actions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import DeleteIcon from "@mui/icons-material/Delete";

import "./styles.css";
import { connect } from "react-redux";
import { getPlaylists } from "../../util/getPlaylists";
import axios from "axios";

const PlaylistCard = ({
  playlistId,
  name,
  cover,
  quantityOfSongs,
  playlists,
  addTodo,
  setPlaylist,
  setPlaylistLoaded,
}) => {
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
      `http://localhost:1337/api/v1/playlist/delete/${id}`,
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

    addTodo(songsInCurrentPlaylist);
    setPlaylistLoaded(true);
  };

  return (
    <div className="playlist-card">
      <div className="playlist-card_circle"></div>
      <div className="playlist-card_circle"></div>
      <div className="playlist-card_card-inner">
        <div className="playlist-delete">
          <DeleteIcon onClick={() => handleDelete(playlistId)} />
        </div>
        <div className="playlist-card_box">
          <img
            className="playlist-card_cover"
            src={`http://localhost:1337/api/v1/playlistcover/${cover}`}
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
    </div>
  );
};

const mapStatetoProps = (state) => ({
  playlists: state.playlistReducer.playlists,
  playlistsisLoaded: state.playlistReducer.playlistsisLoaded,
  playlistCurrentId: state.playlistReducer.playlistCurrentId,
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
})(PlaylistCard);
