import React, { useState, useEffect } from "react";
import axios from "axios";
// import BasicModal from "../Modal/modal";
// import PlaylistModal from "../PlaylistModal/playlistmodal";
// import { IconButton } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlay,
  faCompactDisc,
  faGear,
  faHeart,
  faMap,
  faRightFromBracket,
  faUpload,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

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
  setIsLoadingSong,
} from "../../redux/actions";

import "./menu.css";

const Menu = ({
  setPlaylist,
  setPlaylistLoaded,
  playlists,
  playlistsisLoaded,
  addTodo,
  todosRedux,
  setIsLoaded,
  setPlaylistCurrentId,
  setPlaylistIsOpened,
  setCurrentTrackIndex,
  setSongUrl,
  setIsLoadingSong,
  playlistCurrentId,
}) => {
  const [modalShow, setModalShow] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState(0);

  const handleNavItemClick = (index) => {
    setActiveNavItem(index);
  };
  const HandleClickOpen = () => {
    setModalShow(true);
  };

  const fetchSongs = async () => {
    setIsLoadingSong(true);
    setSongUrl("");
    setPlaylistIsOpened(false);
    setCurrentTrackIndex(0);
    const __URL__ = "http://localhost:1337";
    const { data } = await axios.get(`${__URL__}/api/v1/songs`);
    addTodo(data["songs"]);
    setPlaylistCurrentId("");
    setIsLoaded(true);
  };

  const fetchPlaylists = async () => {
    const __URL__ = "http://localhost:1337";
    const { data } = await axios.get(`${__URL__}/api/v1/playlist`);

    setPlaylist(data["playlists"]);
    setPlaylistLoaded(true);
  };

  useEffect(() => {
    if (playlists && playlists.length === 0) {
      fetchPlaylists();
      setPlaylistLoaded(false);
    }
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
    setCurrentTrackIndex(0);
    if (playlist._id !== playlistCurrentId) {
      setIsLoadingSong(true);
      setPlaylistIsOpened(true);
      setSongUrl("");
      if (playlist.songs.length !== 0) {
        addTodo(playlist.songs);
        setPlaylistCurrentId(playlist._id);
      } else {
        addTodo(playlist.songs);
        setPlaylistCurrentId(playlist._id);
        setSongUrl("");
      }
    }
  };

  const sortBySongName = () => {
    const songs = [...todosRedux].sort((song1, song2) =>
      song1.title.localeCompare(song2.title)
    );
    addTodo(songs);
  };

  const sortByArtist = () => {
    const artists = [...todosRedux].sort((song1, song2) =>
      song1.artist.localeCompare(song2.artist)
    );
    addTodo(artists);
  };

  return (
    <nav className="main-menu">
      <div>
        <UserInfo />

        <ul>
          <NavItem
            index={0}
            icon={faMap}
            text="Discover"
            activeIndex={activeNavItem}
            onClick={handleNavItemClick}
          />
          <NavItem
            index={1}
            icon={faUpload}
            text="Upload song"
            activeIndex={activeNavItem}
            onClick={handleNavItemClick}
          />
          <NavItem
            index={2}
            icon={faCompactDisc}
            text="Albums"
            activeIndex={activeNavItem}
            onClick={handleNavItemClick}
          />
          <NavItem
            index={3}
            icon={faCirclePlay}
            text="Playlist"
            activeIndex={activeNavItem}
            onClick={handleNavItemClick}
          />
          <NavItem
            index={4}
            icon={faHeart}
            text="Favorites"
            activeIndex={activeNavItem}
            onClick={handleNavItemClick}
          />
        </ul>
      </div>
      <ul>
        <NavItem
          index={5}
          icon={faUser}
          text="Account"
          activeIndex={activeNavItem}
          onClick={handleNavItemClick}
        />
        <NavItem
          index={6}
          icon={faGear}
          text="Settings"
          activeIndex={activeNavItem}
          onClick={handleNavItemClick}
        />
        <NavItem
          index={7}
          icon={faRightFromBracket}
          text="Logout"
          activeIndex={activeNavItem}
          onClick={handleNavItemClick}
        />
      </ul>

      {/* <ul className="menu__player">
          <p>Player</p>
          <li onClick={fetchSongs}>Listen</li>
          <BasicModal
            modalShow={modalShow}
            setModalShow={setModalShow}
            onUploadSong={fetchSongs}
          />
          <li onClick={HandleClickOpen}>Upload song</li>
        </ul>
        <ul className="menu__media">
          <p>Media</p>
          <li onClick={sortBySongName}>Songs</li>
           <li>Last added</li> Need to connect Upload file date with
        comparing of tracklist songs or added date of file on params in
        uploading route on backend 
          <li onClick={sortByArtist}>Artists</li>
        </ul> */}
      {/* <PlaylistModal />
        <ul className="menu__playlist">
          <p className="menu__playlist-title">Playlists</p>
          <div className="menu__playlist-box">
            {playlists ? (
              playlists.map((playlist) => (
                <li
                  key={playlist._id}
                  onClick={() => handleSetPlaylistOn(playlist)}
                >
                  {playlist.playlistName}

                  <IconButton
                    sx={{ marginLeft: "auto" }}
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
          </div>
        </ul> */}
    </nav>
  );
};

const UserInfo = () => {
  return (
    <div className="user-info">
      <img
        src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/37e5ccfa-f9ee-458b-afa2-dcd85b495e4e"
        alt="user"
      />
      <p>Jane Wilson</p>
    </div>
  );
};

const NavItem = ({ icon, text, index, activeIndex, onClick }) => {
  const handleClick = () => {
    onClick(index);
  };
  return (
    <li
      className={`nav-item ${activeIndex === index ? "active" : ""}`}
      onClick={handleClick}
    >
      <a href="#">
        <FontAwesomeIcon icon={icon} className="nav-icon" />
        <span className="nav-text">{text}</span>
      </a>
    </li>
  );
};

const mapStatetoProps = (state) => ({
  todosRedux: state.todos.todos,
  playlists: state.playlistReducer.playlists,
  playlistsisLoaded: state.playlistReducer.playlistsisLoaded,
  playlistCurrentId: state.playlistReducer.playlistCurrentId,
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
  setIsLoadingSong,
})(Menu);
