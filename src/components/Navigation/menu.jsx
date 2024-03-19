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
  faRightToBracket,
  faUpload,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import defaultAvatar from "../../assets/default-avatar.svg";

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
import { getUser } from "../../util/getUser";
import UserInfo from "../User/userInfo";

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
  const [userInfo, setUserInfo] = useState({ name: "", email: "" });

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
          "X-Auth-Token": localStorage.getItem("access_token"),
        };
        const user = await getUser(headers);
        setUserInfo({ name: user.name, email: user.email });
      } catch (error) {
        console.error("No user logged in", error);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (token && playlists && playlists.length === 0) {
      fetchPlaylists();
      setPlaylistLoaded(false);
    }
  }, [playlists, playlistsisLoaded]);

  const handleNavItemClick = (index) => {
    setActiveNavItem(index);
  };

  // const fetchSongs = async () => {
  //   setIsLoadingSong(true);
  //   setSongUrl("");
  //   setPlaylistIsOpened(false);
  //   setCurrentTrackIndex(0);
  //   const __URL__ = "http://localhost:1337";
  //   const { data } = await axios.get(`${__URL__}/api/v1/songs`);
  //   addTodo(data["songs"]);
  //   setPlaylistCurrentId("");
  //   setIsLoaded(true);
  // };

  const fetchPlaylists = async () => {
    const headers = {
      "Content-type": "multipart/form-data",
      "X-Auth-Token": localStorage.getItem("access_token"),
    };

    const __URL__ = "http://localhost:1337";
    const { data } = await axios.get(`${__URL__}/api/v1/playlist`, { headers });

    setPlaylist(data["playlists"]);
    setPlaylistLoaded(true);
  };

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
        <UserInfo userInfo={userInfo} />

        <ul>
          {!token && (
            <NavItem
              index={0}
              icon={faRightToBracket}
              text="Login"
              activeIndex={activeNavItem}
              onClick={handleNavItemClick}
            />
          )}
          <NavItem
            index={1}
            icon={faMap}
            text="Discover"
            activeIndex={activeNavItem}
            onClick={handleNavItemClick}
          />

          {token && (
            <>
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
            </>
          )}
        </ul>
      </div>
      <ul>
        {token && (
          <>
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
          </>
        )}
      </ul>

      {/* <ul className="menu__player">
        <p>Player</p>
      </ul>
      <ul className="menu__media">
        <p>Media</p>
        <li onClick={sortBySongName}>Songs</li>
        <li onClick={sortByArtist}>Artists</li>
      </ul>
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
