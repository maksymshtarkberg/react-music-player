import { decodeToken } from "react-jwt";
import musicbg from "../../assets/musicbg.jpg";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import React, { useState } from "react";
import axios from "axios";

import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import playing from "../../assets/playingsong.gif";
import { useEffect } from "react";

import AudioDownloader from "../AudioDownloader/audioDownloader";

import {
  setSongUrl,
  setSongName,
  setArtistName,
  setAlbumName,
  setIsPlaying,
  setSongFile,
  setIsLoadedSong,
  setCurrentTrackIndex,
  setSongId,
  setIsLoaded,
  setPlaylist,
  setIsLoadingSong,
} from "../../redux/actions";
import { connect } from "react-redux";
import "./styles.css";

const SongCard = ({
  songIdCur,
  songId,
  title,
  artistName,
  album,
  songSrc,
  file,
  setSongUrl,
  setSongName,
  setArtistName,
  setAlbumName,
  setIsLoadedSong,
  isLoadedSong,
  currentTrackIndex,
  setCurrentTrackIndex,
  trackIndex,
  setSongId,
  todosRedux,
  setIsLoaded,
  playlists,
  playlistCurrentId,
  playlistIsOpened,
  setPlaylist,
  onSongDelete,
  onSongDeletePlaylist,
  setIsLoadingSong,
  isPlaying,
  isLoadingSong,
}) => {
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [songDeleteRenderind, setSongDeleteRenderind] = useState(false);
  const [showPlayingImage, setShowPlayingImage] = useState(false);

  const handlePlay = async () => {
    setCurrentTrackIndex(trackIndex);
    setIsLoadingSong(true);
    setSongUrl("");
    setSongName(title);
    setArtistName(artistName);
    setAlbumName(album);
    setSongId(songIdCur);
  };

  const handleAddToPlaylist = (event) => {
    event.stopPropagation();

    setPlaylistOpen(true);
  };

  const handleClosePlaylist = () => {
    setPlaylistOpen(false);
  };

  useEffect(() => {
    document.addEventListener("click", handleClosePlaylist);
    return () => {
      document.removeEventListener("click", handleClosePlaylist);
    };
  }, []);

  const fetchPlaylists = async () => {
    const __URL__ = "http://localhost:1337";
    const { data } = await axios.get(`${__URL__}/api/v1/playlist`);
    setPlaylist(data["playlists"]);
  };

  useEffect(() => {
    if (songDeleteRenderind) {
      fetchPlaylists();
    }
  }, []);

  const handlePlaylistItemClick = async (event, playlistId) => {
    event.stopPropagation();

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

    const songData = [
      {
        _id: songIdCur,
        title,
        artist: artistName,
        album,
      },
    ];

    const __URL__ = "http://localhost:1337";
    const { data, status } = await axios.post(
      `${__URL__}/api/v1/playlist/add/${playlistId}`,
      songData
    );
    if (status === 200) {
      alert("Song added to playlist");
    }
    fetchPlaylists();
    console.log(`Song added to playlist with ID: ${playlistId}`);

    setPlaylistOpen(false);
  };

  const handleDeletePlaylistSong = async (
    event,
    file,
    songIdCur,
    playlistId,
    title
  ) => {
    event.stopPropagation();

    if (playlistIsOpened) {
      const { data, status } = await axios.delete(
        `http://localhost:1337/api/v1/playlist/remove/${playlistId}?song=${title}`
      );
      console.log(playlistId, title);
      if (status == 200) {
        setSongDeleteRenderind(true);
        alert("Song removed from the playlist");
        onSongDeletePlaylist();
      }
    } else {
      const __URL__ = "http://localhost:1337";
      const { data, status } = await axios.delete(
        `${__URL__}/api/v1/song/delete/${songIdCur}?file=${file}`
      );
      if (status == 200) {
        setSongDeleteRenderind(true);
        alert("Song removed from the player");
        onSongDelete();
      }
    }
    setSongDeleteRenderind(false);
  };

  useEffect(() => {
    if (!isLoadingSong && isPlaying && currentTrackIndex === trackIndex) {
      setShowPlayingImage(true);
    } else {
      const timer = setTimeout(() => {
        setShowPlayingImage(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentTrackIndex, isPlaying, !isLoadingSong]);

  return (
    <div
      onClick={handlePlay}
      className={
        "songCard" + (currentTrackIndex === trackIndex ? "_selected" : "")
      }
    >
      <img
        style={{ height: "60px", width: "80px" }}
        src={showPlayingImage ? playing : musicbg}
        alt="SongCover"
      />

      <div className="songCard__title">{title}</div>
      <div className="songCard__artist">{artistName}</div>

      <div className="songCard__addtoplaylist">
        <button
          style={{
            marginLeft: "auto",
            marginRight: 70,
            alignSelf: "center",
            cursor: "pointer",
            zIndex: 1,
            border: "none",
            background: "transparent",
          }}
          onClick={handleAddToPlaylist}
        >
          <PlaylistAddIcon />
        </button>
        {playlistOpen && (
          <ul>
            {playlists ? (
              playlists.map((playlist) => (
                <li
                  className="songCard__chooseplaylist"
                  key={playlist._id}
                  onClick={(event) =>
                    handlePlaylistItemClick(event, playlist._id)
                  }
                >
                  {playlist.playlistName}
                </li>
              ))
            ) : (
              <li>Loading playlists...</li>
            )}
          </ul>
        )}
        <IconButton
          sx={{ marginRight: 2 }}
          onClick={(event) =>
            handleDeletePlaylistSong(
              event,
              file,
              songIdCur,
              playlistCurrentId,
              title
            )
          }
          aria-label="delete"
        >
          <DeleteIcon />
        </IconButton>
        <AudioDownloader
          songIdTrack={songIdCur}
          fileName={`${artistName} - ${title}`}
        />
      </div>
    </div>
  );
};

const mapStatetoProps = (state) => ({
  todosRedux: state.todos.todos,
  songUrl: state.songReducer.songUrl,
  isLoadedSong: state.songReducer.isLoadedSong,
  currentTrackIndex: state.playerReducer.currentTrackIndex,
  songId: state.songReducer.songId,
  songUrl: state.songReducer.songUrl,
  playlists: state.playlistReducer.playlists,
  playlistCurrentId: state.playlistReducer.playlistCurrentId,
  playlistIsOpened: state.playlistReducer.playlistIsOpened,
  isPlaying: state.songReducer.isPlaying,
  isLoadingSong: state.playerReducer.isLoadingSong,
});

export default connect(mapStatetoProps, {
  setSongUrl,
  setSongName,
  setArtistName,
  setAlbumName,
  setIsPlaying,
  setSongFile,
  setIsLoadedSong,
  setCurrentTrackIndex,
  setSongId,
  setIsLoaded,
  setPlaylist,
  setIsLoadingSong,
})(SongCard);
