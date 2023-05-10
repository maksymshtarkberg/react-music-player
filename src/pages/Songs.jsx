import React, { useEffect, useState, useContext } from "react";
import axios from "axios";

import SongCard from "../components/SongCard/songcard";
import "./styles.css";

import { addTodo, setIsLoaded } from "../redux/actions";
import { connect } from "react-redux";

const Songs = ({ addTodo, todosRedux, setIsLoaded, isLoaded }) => {
  const __URL__ = "http://localhost:1337";

  useEffect(() => {
    fetchSongs();
  }, [isLoaded]);

  const fetchSongs = async () => {
    const { data } = await axios.get(`${__URL__}/api/v1/songs`);
    setIsLoaded(true);
    addTodo(data["songs"]);
    // console.log(data.songs);
  };

  return (
    <div className="componentPlaylist">
      {setIsLoaded && todosRedux === null ? (
        <div>loading...</div>
      ) : todosRedux && todosRedux.length > 0 ? (
        todosRedux.map((song, index) => {
          return (
            <SongCard
              trackIndex={index}
              title={song.title}
              album={song.album}
              artistName={song.artist}
              songSrc={song.song}
              userId={song.uploadedBy}
              songId={song._id}
              file={song.file}
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
});

export default connect(mapStatetoProps, { addTodo, setIsLoaded })(Songs);
