import { useState } from "react";
import { useEffect } from "react";
import { decodeToken } from "react-jwt";
import { connect } from "react-redux";
import Songcard from "../SongCard/songcard";
import { getSongs } from "../../util/getSongs";
import "./styles.css";

const MySongs = ({ todosRedux, audioPlayer }) => {
  const token = localStorage.getItem("access_token");
  const decoded = decodeToken(token);
  const [songsUploadedByUser, setSongsUploadedByUser] = useState([]);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    const songs = await getSongs();
    const foundSongs = songs.filter(
      (userSong) => userSong.uploadedBy === decoded.id
    );
    // console.log(songs);
    setSongsUploadedByUser(foundSongs);
  };

  const handleSongDeleteMain = () => {
    fetchSongs();
  };

  return (
    <div className="mysongs-container">
      <h1 className="mysongs-title">My songs</h1>
      {songsUploadedByUser.length !== 0 ? (
        songsUploadedByUser.map((song, index) => {
          return (
            <Songcard
              key={index}
              songIdCur={song._id}
              trackIndex={index}
              title={song.title}
              album={song.album}
              artistName={song.artist}
              songSrc={song.file}
              uploadedBy={song.uploadedBy}
              file={song.file}
              cover={song.coverfile}
              audioPlayer={audioPlayer}
              onSongDelete={handleSongDeleteMain}
            />
          );
        })
      ) : (
        <h2>No songs, that were uploaded by the user.</h2>
      )}
    </div>
  );
};

const mapStatetoProps = (state) => ({
  todosRedux: state.todos.todos,
});

export default connect(mapStatetoProps, {})(MySongs);
