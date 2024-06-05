import React, { useEffect } from "react";

import SongCard from "../../components/SongCard/songcard";
import { getSongs } from "../../util/getSongs";
import "./styles.css";

import {
  addTodo,
  setSongUrl,
  setIsLoaded,
  setSongId,
  setPlaylist,
  setPlaylistLoaded,
  setPlaylistIsOpened,
  setIsPlaying,
  setArtistIsOn,
  setAlbumIsOn,
  setAlbumsAndArtistsSongs,
} from "../../redux/actions";
import { connect } from "react-redux";
import { getPlaylists } from "../../util/getPlaylists";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SkeletonLoader from "../../components/SkeletonLoader/skeletonLoader";

const Songs = ({
  addTodo,
  setSongUrl,
  todosRedux,
  setIsLoaded,
  setPlaylistLoaded,
  playlistCurrentId,
  setSongId,
  audioPlayer,
  songId,
  setPlaylistIsOpened,
  playlistIsOpened,
  setIsPlaying,
  setArtistIsOn,
  setAlbumIsOn,
  setAlbumsAndArtistsSongs,
}) => {
  useEffect(() => {
    fetchSongs();
  }, [!songId]);

  const fetchSongs = async () => {
    const songs = await getSongs();
    addTodo(songs);
    if (songId === "") {
      setSongId(songs[0]._id);
    }

    setIsLoaded(true);
  };

  const handleSongDeleteMain = () => {
    fetchSongs();
  };

  const fetchPlaylists = async () => {
    const playlists = await getPlaylists();

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

  const reloadTracklist = () => {
    setSongId("");
    setSongUrl("");
    playlistIsOpened && setPlaylistIsOpened(false);
    audioPlayer.current.pause();
    setIsPlaying(false);
    fetchSongs();
  };

  return (
    <>
      <div className="tracklist-title">
        <h1>Tracklist</h1>
        <FontAwesomeIcon
          icon={faRotate}
          className="tracklist-reload"
          onClick={reloadTracklist}
        />
      </div>
      <div className="song-container">
        {setIsLoaded && todosRedux.length === 0 ? (
          <SkeletonLoader count={7} height="80px" />
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
                uploadedBy={song.uploadedBy}
                file={song.file}
                cover={song.coverfile}
                onSongDelete={handleSongDeleteMain}
                onSongDeletePlaylist={handleSongDeletePlaylist}
                audioPlayer={audioPlayer}
              />
            );
          })
        ) : (
          <SkeletonLoader count={7} height="80px" />
        )}
      </div>
    </>
  );
};

const mapStatetoProps = (state) => ({
  todosRedux: state.todos.todos,
  isLoaded: state.todos.isLoaded,
  songUrl: state.songReducer.songUrl,
  currentTrackIndex: state.playerReducer.currentTrackIndex,
  songId: state.songReducer.songId,
  playlistCurrentId: state.playlistReducer.playlistCurrentId,
  playlistIsOpened: state.playlistReducer.playlistIsOpened,
});

export default connect(mapStatetoProps, {
  addTodo,
  setSongUrl,
  setIsLoaded,
  setIsPlaying,
  setSongId,
  setPlaylist,
  setPlaylistLoaded,
  setPlaylistIsOpened,
  setArtistIsOn,
  setAlbumIsOn,
  setAlbumsAndArtistsSongs,
})(Songs);
