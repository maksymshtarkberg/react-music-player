import React, { useEffect, useState } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { setPlaylist, setPlaylistLoaded } from "../../redux/actions";

import "./styles.css";
import PlaylistCard from "../../components/PlaylistCard/playlistcard";
import { getPlaylists } from "../../util/getPlaylists";

const PlayList = ({
  setPlaylist,
  setPlaylistLoaded,
  playlists,
  playlistsisLoaded,
}) => {
  const [cretePlaylist, setCreatePlaylist] = useState(false);
  const [PlaylistCover, setPlaylistCover] = useState();

  const [loading, setLoading] = useState(false);

  // Create a playlist
  const createPlaylist = async () => {
    const __URL__ = "http://localhost:1337";
    const playlistName = document.getElementById("playlistName").value;
    if (playlistName === "") return alert("Please enter a playlist name");

    const formData = new FormData();
    formData.append("playlistName", playlistName);
    formData.append("playlistCover", PlaylistCover);

    try {
      const headers = {
        "Content-Type": "multipart/form-data",
        "X-Auth-Token": localStorage.getItem("access_token"),
      };

      const response = await axios.post(
        `${__URL__}/api/v1/playlist/create`,
        formData,
        {
          headers,
        }
      );
      if (response.status === 201) {
        alert("Playlist created successfully");
        setCreatePlaylist(true);
      }
    } catch (error) {
      console.error("Error creating playlist:", error);
      alert("Failed to create playlist");
    }
  };

  // fetching playlists
  const fetchPlaylists = async () => {
    const data = await getPlaylists();
    setPlaylist(data);
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
  }, [cretePlaylist, playlists, playlistsisLoaded]);

  const handlePlaylistCover = (e) => {
    setPlaylistCover(e.target.files[0]);
  };

  return (
    <>
      <div className="playlist-name">
        <input
          type="text"
          id="playlistName"
          placeholder="Playlist Name"
          className="playlist-input"
        />
      </div>
      <div className="playlist-photo">
        <label className="reg-label" htmlFor="playlistCover">
          Playlist Cover
        </label>
        <input
          onChange={handlePlaylistCover}
          className="playlist-input"
          type="file"
          name="playlistCover"
          accept="image/*"
        />
      </div>
      <button className="playlist-button" onClick={createPlaylist}>
        Create Playlist
      </button>
      <div className="playlists-card_container">
        {playlists ? (
          playlists.map((item, index) => {
            const songsQuantity = item.songs.length;
            return (
              <PlaylistCard
                playlistId={item._id}
                name={item.playlistName}
                key={index}
                cover={item.playlistCoverId}
                quantityOfSongs={songsQuantity}
              />
            );
          })
        ) : (
          <>No playlists</>
        )}
      </div>
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
