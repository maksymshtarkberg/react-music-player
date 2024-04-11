import React, { useEffect, useState } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { setPlaylist, setPlaylistLoaded } from "../../redux/actions";

import "./styles.css";
import { getPlaylists } from "../../util/getPlaylists";
import PlaylistsSlider from "../../components/PlaylistsSlider/plslider";
import BtnLoader from "../../components/BtnLoader/btnloader";

const PlayList = ({
  audioPlayer,
  setPlaylist,
  setPlaylistLoaded,
  playlists,
  playlistsisLoaded,
}) => {
  const [playlistName, setPlaylistName] = useState("");
  const [playlistCover, setPlaylistCover] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    const data = await getPlaylists();
    setPlaylist(data);
    setPlaylistLoaded(true);
  };

  const createPlaylist = async () => {
    if (!playlistName) {
      alert("Please enter a playlist name");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("playlistName", playlistName);
    formData.append("playlistCover", playlistCover);

    try {
      const headers = {
        "Content-Type": "multipart/form-data",
        "X-Auth-Token": localStorage.getItem("access_token"),
      };

      const response = await axios.post(
        "http://localhost:1337/api/v1/playlist/create",
        formData,
        { headers }
      );

      if (response.status === 201) {
        alert("Playlist created successfully");
        setPlaylistName("");
        setPlaylistCover(null);
        fetchPlaylists();
      }
    } catch (error) {
      console.error("Error creating playlist:", error);
      alert("Failed to create playlist");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaylistCover = (e) => {
    setPlaylistCover(e.target.files[0]);
  };

  return (
    <>
      <div className="playlist-create">
        <div className="playlist-name">
          <label className="reg-label" htmlFor="playlistName">
            Playlist Name
          </label>
          <input
            type="text"
            id="playlistName"
            placeholder="Playlist Name"
            className="playlist-input"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
          />
        </div>
        <div className="playlist-photo">
          <label className="reg-label" htmlFor="playlistCover">
            Playlist Cover File
          </label>
          <input
            onChange={handlePlaylistCover}
            className="playlist-input"
            type="file"
            name="playlistCover"
            accept="image/*"
          />
        </div>
        <div className="playlists-create_btn">
          {loading ? (
            <BtnLoader top={"10px"} left={"-100px"} />
          ) : (
            <button
              className="reg-button playlist-button"
              onClick={createPlaylist}
            >
              Create Playlist
            </button>
          )}
        </div>
      </div>

      {playlistsisLoaded && playlists.length > 0 ? (
        <PlaylistsSlider audioPlayer={audioPlayer} playlists={playlists} />
      ) : (
        <h2>No playlists </h2>
      )}
    </>
  );
};

const mapStatetoProps = (state) => ({
  playlists: state.playlistReducer.playlists,
  playlistsisLoaded: state.playlistReducer.playlistsisLoaded,
});

export default connect(mapStatetoProps, { setPlaylist, setPlaylistLoaded })(
  PlayList
);
