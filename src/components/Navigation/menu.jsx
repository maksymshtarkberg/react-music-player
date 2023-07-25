import React, { useState, useEffect } from "react";
import axios from "axios";
import BasicModal from "../Modal/modal";
import PlaylistModal from "../PlaylistModal/playlistmodal";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { connect } from "react-redux";
import {
  addTodo,
  setIsLoaded,
  setPlaylist,
  setPlaylistLoaded,
  setPlaylistCurrentId,
  setPlaylistIsOpened,
  setCurrentTrackIndex,
  setSongUrl,
} from "../../redux/actions";

import "./menu.css";

const Menu = ({
  setPlaylist,
  setPlaylistLoaded,
  playlists,
  playlistsisLoaded,
  addTodo,
  setIsLoaded,
  setPlaylistCurrentId,
  setPlaylistIsOpened,
  setCurrentTrackIndex,
  setSongUrl,
}) => {
  const [modalShow, setModalShow] = useState(false);

  const HandleClickOpen = () => {
    setModalShow(true);
  };

  const fetchSongs = async () => {
    setPlaylistIsOpened(false);
    setCurrentTrackIndex(0);
    const __URL__ = "http://localhost:1337";
    const { data } = await axios.get(`${__URL__}/api/v1/songs`);
    addTodo(data["songs"]);
    // console.log(data.songs);

    setIsLoaded(true);
  };

  const fetchPlaylists = async () => {
    const __URL__ = "http://localhost:1337";
    const { data } = await axios.get(`${__URL__}/api/v1/playlist`);
    // setPlaylists(data["playlists"]);
    setPlaylist(data["playlists"]);
    setPlaylistLoaded(true);
  };

  useEffect(() => {
    if (playlists && playlists.length == 0) {
      fetchPlaylists();
      setPlaylistLoaded(false);
    }

    console.log(playlists);
  }, [playlists, playlistsisLoaded]);

  // delete playlist
  const deletePlaylist = async (id) => {
    const { data, status } = await axios.delete(
      `http://localhost:1337/api/v1/playlist/delete/${id}`
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

  const handleSetPlaylistOn = (playlist) => {
    setPlaylistIsOpened(true);
    setSongUrl(null);
    if (playlist.songs.length != 0) {
      addTodo(playlist.songs);
      setPlaylistCurrentId(playlist._id);
    } else {
      addTodo(playlist.songs);
      setPlaylistCurrentId(playlist._id);
      setSongUrl(null);
    }
  };

  return (
    <div className="menu">
      <ul className="menu__player">
        <p>Player</p>
        <li onClick={fetchSongs}>Listen</li>
        <BasicModal modalShow={modalShow} setModalShow={setModalShow} />
        <li onClick={HandleClickOpen}>Upload song</li>
      </ul>
      <ul className="menu__media">
        <p>Media</p>
        <li>Songs</li>
        <li>Last added</li>
        <li>Artists</li>
      </ul>
      <ul className="menu__playlist">
        <div className="menu__playlist-box">
          <PlaylistModal />
          <p>Playlists</p>
        </div>
        {playlists ? (
          playlists.map((playlist) => (
            <li
              key={playlist._id}
              onClick={() => handleSetPlaylistOn(playlist)}
            >
              {playlist.playlistName}

              <IconButton
                onClick={() => handleDelete(playlist._id)}
                aria-label="delete"
              >
                <DeleteIcon />
              </IconButton>
            </li>
          ))
        ) : (
          <li>Loading playlists...</li>
        )}
      </ul>
    </div>
  );
};

const mapStatetoProps = (state) => ({
  playlists: state.playlistReducer.playlists,
  playlistsisLoaded: state.playlistReducer.playlistsisLoaded,
});

export default connect(mapStatetoProps, {
  addTodo,
  setIsLoaded,
  setPlaylist,
  setPlaylistLoaded,
  setPlaylistCurrentId,
  setPlaylistIsOpened,
  setCurrentTrackIndex,
  setSongUrl,
})(Menu);
