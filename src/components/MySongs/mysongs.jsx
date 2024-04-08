import { useState } from "react";
import { useEffect } from "react";
import { decodeToken } from "react-jwt";
import { connect } from "react-redux";
import Songcard from "../SongCard/songcard";
import { getSongs } from "../../util/getSongs";
import "./styles.css";
import { getPlaylists } from "../../util/getPlaylists";
import { setSongsUploadedByUser, setPlaylistLoaded } from "../../redux/actions";

const MySongs = ({
  setSongsUploadedByUser,
  songsUploadedByUser,
  audioPlayer,
  playlistCurrentId,
  playlistIsOpened,
}) => {
  const token = localStorage.getItem("access_token");
  const decoded = decodeToken(token);
  // const [songsUploadedByUser, setSongsUploadedByUser] = useState([]);

  useEffect(() => {
    fetchSongs();
  }, [playlistIsOpened]);

  const fetchSongs = async () => {
    const songs = await getSongs();

    const foundSongs = songs.filter(
      (userSong) => userSong.uploadedBy === decoded.id
    );
    console.log(foundSongs);

    setSongsUploadedByUser(foundSongs);
  };

  const fetchPlaylists = async () => {
    const playlists = await getPlaylists();

    const currentPlaylist = playlists.find(
      (playlist) => playlist._id === playlistCurrentId
    );
    const songsInCurrentPlaylist = currentPlaylist
      ? currentPlaylist.songs || []
      : [];

    setPlaylistLoaded(true);
  };

  const handleSongDeleteMain = () => {
    fetchSongs();
  };

  const handleSongDeletePlaylist = () => {
    fetchPlaylists();
  };

  return (
    <div className="mysongs-container">
      <h1 className="mysongs-title">My songs</h1>
      <div className="mysongs-box">
        {songsUploadedByUser.length !== 0 ? (
          songsUploadedByUser.map((song, index) => {
            return (
              <Songcard
                key={index}
                songIdCur={song._id}
                trackIndex={song.index}
                title={song.title}
                album={song.album}
                artistName={song.artist}
                songSrc={song.file}
                uploadedBy={song.uploadedBy}
                file={song.file}
                cover={song.coverfile}
                audioPlayer={audioPlayer}
                songsUploadedByUser={songsUploadedByUser}
                onSongDelete={handleSongDeleteMain}
                onSongDeletePlaylist={handleSongDeletePlaylist}
                fromMySongs={true}
              />
            );
          })
        ) : (
          <h2>No songs, that were uploaded by the user.</h2>
        )}
      </div>
    </div>
  );
};

const mapStatetoProps = (state) => ({
  todosRedux: state.todos.todos,
  playlistCurrentId: state.playlistReducer.playlistCurrentId,
  playlistIsOpened: state.playlistReducer.playlistIsOpened,
  songsUploadedByUser: state.todos.songsUploadedByUser,
});

export default connect(mapStatetoProps, {
  setSongsUploadedByUser,
  setPlaylistLoaded,
})(MySongs);
