import React, { useEffect, useState } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { setPlaylist, setPlaylistLoaded } from "../../redux/actions";

import "./styles.css";

const PlayList = ({
  setPlaylist,
  setPlaylistLoaded,
  playlists,
  playlistsisLoaded,
}) => {
  const [cretePlaylist, setCreatePlaylist] = useState(false);
  const [loading, setLoading] = useState(false);

  // Create a playlist
  const createPlaylist = async () => {
    const __URL__ = "http://localhost:1337";
    const playlistName = document.getElementById("playlistName").value;
    if (playlistName === "") return alert("Please enter a playlist name");
    const { data, status } = await axios.post(
      `${__URL__}/api/v1/playlist/create`,
      { playlistName }
    );
    if (status === 200) {
      alert("Playlist created successfully");
      setCreatePlaylist(true);
    }
  };

  // fetching playlists
  const fetchPlaylists = async () => {
    const __URL__ = "http://localhost:1337";
    const { data } = await axios.get(`${__URL__}/api/v1/playlist`);
    setPlaylist(data["playlists"]);
    setPlaylistLoaded(true);
  };

  useEffect(() => {
    if (cretePlaylist) {
      setLoading(true);
      fetchPlaylists();
      setLoading(false);
      setCreatePlaylist(false);
      setPlaylistLoaded(false);
    }
    console.log(...playlists);
  }, [cretePlaylist, playlists, playlistsisLoaded]);

  return (
    <div className="playlist-create">
      <input type="text" id="playlistName" placeholder="Playlist Name" />
      <button className="playlist-button" onClick={createPlaylist}>
        Create Playlist
      </button>
    </div>
  );
};

const mapStatetoProps = (state) => ({
  playlists: state.playlistReducer.playlists,
  playlistsisLoaded: state.playlistReducer.playlistsisLoaded,
});

export default connect(mapStatetoProps, { setPlaylist, setPlaylistLoaded })(
  PlayList
);
