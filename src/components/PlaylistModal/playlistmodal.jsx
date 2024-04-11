import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import AddIcon from "@mui/icons-material/Add";
import PlayList from "../../containers/Playlists/playlists";
import "./styles.css";
import { connect } from "react-redux";
import axios from "axios";
import { getPlaylists } from "../../util/getPlaylists";
import { setPlaylist } from "../../redux/actions";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { decodeToken } from "react-jwt";
import { getSongs } from "../../util/getSongs";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "20px",
  boxShadow: 24,
  p: 4,
};

const PlaylistModal = ({
  playlists,
  songIdCur,
  title,
  artistName,
  album,
  setPlaylist,
  playlistOpen,
  handleClosePlaylist,
  uploadedBy,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePlaylistItemClick = async (event, playlistId) => {
    event.stopPropagation();

    if (isLoading) {
      return;
    }

    setIsLoading(true);
    try {
      const selectedPlaylist = playlists.find(
        (playlist) => playlist._id === playlistId
      );
      const songsInPlaylist = selectedPlaylist.songs || [];

      const isSongAlreadyInPlaylist = songsInPlaylist.some(
        (song) => song._id === songIdCur
      );

      if (isSongAlreadyInPlaylist) {
        alert("This song is already in the playlist.");
        return;
      }
      const allSongs = await getSongs();

      const cover = allSongs.find((song) => song._id === songIdCur);
      const coverfile = cover ? cover.coverfile : null;

      const songData = [
        {
          _id: songIdCur,
          title,
          artist: artistName,
          album,
          uploadedBy: uploadedBy,
          coverfile: coverfile,
        },
      ];
      const headers = {
        "X-Auth-Token": localStorage.getItem("access_token"),
      };
      const __URL__ = "http://localhost:1337";
      const { data, status } = await axios.post(
        `${__URL__}/api/v1/playlist/add/${playlistId}`,
        songData,
        { headers }
      );
      if (status === 200) {
        alert("Song added to playlist");
      }
      const playlistsData = await getPlaylists();
      setPlaylist(playlistsData);

      console.log(`Song added to playlist with ID: ${playlistId}`);
    } catch (error) {
      console.error("Error adding song to playlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {playlistOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="close" onClick={handleClosePlaylist}>
              &times;
            </div>
            <ul className="songCard__addtoplaylist-item">
              {playlists ? (
                playlists.map((playlist) => (
                  <li className="songCard__chooseplaylist" key={playlist._id}>
                    {playlist.playlistName}
                    <button
                      title="Add"
                      className="addsong-btn"
                      onClick={(event) =>
                        handlePlaylistItemClick(event, playlist._id)
                      }
                    >
                      <svg
                        height="25"
                        width="25"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M0 0h24v24H0z" fill="none"></path>
                        <path
                          d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"
                          fill="currentColor"
                        ></path>
                      </svg>
                      <span>
                        Add song to playlist - {playlist.playlistName}
                      </span>
                    </button>
                  </li>
                ))
              ) : (
                <li>Loading playlists...</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

const mapStatetoProps = (state) => ({
  playlists: state.playlistReducer.playlists,
  playlistCurrentId: state.playlistReducer.playlistCurrentId,
  playlistIsOpened: state.playlistReducer.playlistIsOpened,
});

export default connect(mapStatetoProps, { setPlaylist })(PlaylistModal);
