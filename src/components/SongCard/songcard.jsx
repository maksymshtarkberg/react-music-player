import { decodeToken } from "react-jwt";
import musicbg from "../../assets/musicbg.jpg";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import React, { useState } from "react";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
import { faPause, faPlay, faStop } from "@fortawesome/free-solid-svg-icons";

const SongCard = ({
  songIdCur,
  title,
  artistName,
  album,
  file,
  cover,
  setSongUrl,
  setSongName,
  setArtistName,
  setAlbumName,
  currentTrackIndex,
  setCurrentTrackIndex,
  trackIndex,
  songId,
  setSongId,
  playlists,
  playlistCurrentId,
  playlistIsOpened,
  setPlaylist,
  onSongDelete,
  onSongDeletePlaylist,
  setIsLoadingSong,
  isPlaying,
  isLoadingSong,
  setIsPlaying,
  audioPlayer,
}) => {
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [songDeleteRenderind, setSongDeleteRenderind] = useState(false);
  const [showPlayingImage, setShowPlayingImage] = useState(false);

  useEffect(() => {
    document.addEventListener("click", handleClosePlaylist);
    return () => {
      document.removeEventListener("click", handleClosePlaylist);
    };
  }, []);

  useEffect(() => {
    if (songDeleteRenderind) {
      fetchPlaylists();
    }
  }, []);

  /**
   * Turning on gif amimation when song is playing
   */
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

  /**
   * Playing the song by click on song in the tracklist
   */
  const handlePlay = async () => {
    if (songIdCur === songId) {
      if (isPlaying) {
        audioPlayer.current.pause();
        setIsPlaying(false);
      } else {
        audioPlayer.current.play();
        setIsPlaying(true);
      }
    } else {
      setCurrentTrackIndex(trackIndex);
      setIsLoadingSong(true);
      setSongUrl("");
      setSongName(title);
      setArtistName(artistName);
      setAlbumName(album);
      setSongId(songIdCur);
      setIsPlaying(true);
    }
  };

  /**
   * Adding song to playlist only by one time
   */
  const handleAddToPlaylist = (event) => {
    event.stopPropagation();

    setPlaylistOpen(true);
  };

  const handleClosePlaylist = () => {
    setPlaylistOpen(false);
  };

  const fetchPlaylists = async () => {
    const __URL__ = "http://localhost:1337";
    const { data } = await axios.get(`${__URL__}/api/v1/playlist`);
    setPlaylist(data["playlists"]);
  };

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
      if (status === 200) {
        setSongDeleteRenderind(true);
        alert("Song removed from the player");
        onSongDelete();
      }
    }
    setSongDeleteRenderind(false);
  };

  return (
    <div className="song">
      <div className="song-img" onClick={handlePlay}>
        <img
          src={
            cover !== null && cover !== undefined
              ? showPlayingImage
                ? playing
                : `http://localhost:1337/api/v1/song/${cover}/cover`
              : showPlayingImage
              ? playing
              : musicbg
          }
          alt="SongCover"
        />
        <div className="overlay">
          {isPlaying && songIdCur === songId ? (
            <FontAwesomeIcon icon={faPause} />
          ) : (
            <FontAwesomeIcon icon={faPlay} />
          )}
        </div>
      </div>
      <div className="song-title">
        <h2>{title}</h2>
        <p>{artistName}</p>
      </div>
      <div className="song-actions">
        <div className="songCard__addtoplaylist">
          <button
            style={{
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
            <ul className="songCard__addtoplaylist-item">
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
        </div>
        <div className="song-delete">
          <IconButton
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
        </div>
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
