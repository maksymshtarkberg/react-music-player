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
  faUserPlus,
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
import Logout from "../../util/logout";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { getPlaylists } from "../../util/getPlaylists";

const Menu = ({
  setPlaylist,
  setPlaylistLoaded,
  playlists,
  playlistsisLoaded,
}) => {
  const [activeNavItem, setActiveNavItem] = useState(0);
  const [userInfo, setUserInfo] = useState({ name: "", email: "" });

  const token = localStorage.getItem("access_token");

  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const routes = {
    0: !token ? "/signin" : "/feed",
    1: !token ? "/signup" : "/upload",
    2: !token ? "/feed" : "/albums",
    3: "/playlists",
    4: "/mysongs",
    5: "/account",
    6: "/settings",
    7: () => Logout(),
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
          "X-Auth-token": localStorage.getItem("access_token"),
        };
        const user = await getUser(headers);
        user && setUserInfo({ name: user.name, email: user.email });
      } catch (error) {
        console.error("No user logged in", error);
      }
    };

    token && fetchUserInfo();
  }, [token]);

  useEffect(() => {
    if (token && playlists && playlists.length === 0) {
      fetchPlaylists();
      setPlaylistLoaded(false);
    }
  }, [playlists, playlistsisLoaded]);

  useEffect(() => {
    const activeIndex = Object.values(routes).indexOf(currentPath);
    setActiveNavItem(activeIndex);
  }, [currentPath]);

  const handleNavItemClick = (index) => {
    setActiveNavItem(index);

    const route = routes[index];

    if (typeof route === "string") {
      navigate(route);
    } else if (typeof route === "function") {
      route();
      navigate("/signin");
    }
  };

  const fetchPlaylists = async () => {
    const data = await getPlaylists();
    setPlaylist(data);
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

  return (
    <nav className="main-menu">
      <div>
        <UserInfo userInfo={userInfo} />

        <ul>
          {!token && (
            <>
              <NavItem
                index={0}
                icon={faRightToBracket}
                text="Sign in"
                activeIndex={activeNavItem}
                onClick={handleNavItemClick}
              />
              <NavItem
                index={1}
                icon={faUserPlus}
                text="Sign up"
                activeIndex={activeNavItem}
                onClick={handleNavItemClick}
              />
              <NavItem
                index={2}
                icon={faMap}
                text="Discover"
                activeIndex={activeNavItem}
                onClick={handleNavItemClick}
              />
            </>
          )}

          {token && (
            <>
              <NavItem
                index={0}
                icon={faMap}
                text="Feed"
                activeIndex={activeNavItem}
                onClick={handleNavItemClick}
              />
              <NavItem
                index={1}
                icon={faUpload}
                text="Upload"
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
                text="My Songs"
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
      <div className="nav-element">
        <FontAwesomeIcon icon={icon} className="nav-icon" />
        <span className="nav-text">{text}</span>
      </div>
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
