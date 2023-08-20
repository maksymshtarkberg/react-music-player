import React, { useEffect, useState, useContext } from "react";
import axios from "axios";

import SongCard from "../components/SongCard/songcard";
import "./styles.css";

import {
  addTodo,
  setIsLoaded,
  setSongId,
  setPlaylist,
  setPlaylistLoaded,
} from "../redux/actions";
import { connect } from "react-redux";

const Songs = ({
  addTodo,
  todosRedux,
  setIsLoaded,
  setPlaylist,
  setPlaylistLoaded,
  isLoaded,
  currentTrackIndex,
  songId,
  setSongId,
  playlistCurrentId,
}) => {
  const __URL__ = "http://localhost:1337";

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    const { data } = await axios.get(`${__URL__}/api/v1/songs`);
    addTodo(data["songs"]);

    setIsLoaded(true);
  };

  const handleSongDeleteMain = () => {
    fetchSongs();
  };

  const fetchPlaylists = async () => {
    const __URL__ = "http://localhost:1337";
    const { data } = await axios.get(`${__URL__}/api/v1/playlist`);

    const playlists = data["playlists"];
    const currentPlaylist = playlists.find(
      (playlist) => playlist._id === playlistCurrentId
    );
    const songsInCurrentPlaylist = currentPlaylist
      ? currentPlaylist.songs || []
      : [];

    addTodo(songsInCurrentPlaylist);
    setPlaylistLoaded(true);
  };

  const handleSongDeletePlaylist = () => {
    fetchPlaylists();
  };

  return (
    <div className="componentPlaylist">
      {setIsLoaded && todosRedux === null ? (
        <div>loading...</div>
      ) : todosRedux && todosRedux.length > 0 ? (
        todosRedux.map((song, index) => {
          return (
            <SongCard
              key={index}
              songIdCur={song._id}
              trackIndex={index}
              title={song.title}
              album={song.album}
              artistName={song.artist}
              songSrc={song.song}
              userId={song.uploadedBy}
              file={song.file}
              onSongDelete={handleSongDeleteMain}
              onSongDeletePlaylist={handleSongDeletePlaylist}
            />
          );
        })
      ) : (
        <div>No songs found</div>
      )}
    </div>
  );
};

const mapStatetoProps = (state) => ({
  todosRedux: state.todos.todos,
  isLoaded: state.todos.isLoaded,
  songUrl: state.songReducer.songUrl,
  currentTrackIndex: state.playerReducer.currentTrackIndex,
  songId: state.songReducer.songId,
  playlistCurrentId: state.playlistReducer.playlistCurrentId,
});

export default connect(mapStatetoProps, {
  addTodo,
  setIsLoaded,
  setSongId,
  setPlaylist,
  setPlaylistLoaded,
})(Songs);
