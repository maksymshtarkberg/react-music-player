import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./styles.css";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import { TbArrowBackUpDouble } from "react-icons/tb";
import { connect } from "react-redux";
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
  setPlaylistIsOpened,
  addTodo,
  setPlaylistSongHasBeenDeleted,
  setAlbumsAndArtistsSongs,
} from "../../../redux/actions";
import SpotifySvg from "./PlaylistUiComponents/spotifysvg";
import PlayingInPlaylist from "./PlaylistUiComponents/playinginplaylist";
import { getSongs } from "../../../util/getSongs";
import SongDefault from "../../../assets/song-default.jpg";
import { deleteSongFromPlaylist } from "../../../util/deleteSongFromPlaylist";
import { getPlaylists } from "../../../util/getPlaylists";

const PlaylistOnPlay = ({
  songs,
  setPlaylistIsOpened,
  audioPlayer,
  playlistId,
  songId,
  isPlaying,
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
  isLoadingSong,
  addTodo,
  setPlaylistSongHasBeenDeleted,
  setAlbumsAndArtistsSongs,
}) => {
  const goBackToPlaylistMain = async () => {
    setIsPlaying(false);
    setSongUrl("");
    setCurrentTrackIndex(0);
    setSongName("");
    setArtistName("");
    setAlbumName("");
    setSongId("");
    setPlaylistIsOpened(false);
  };

  const handlePlay = async (songIdCur, title, artistName, album, songIndex) => {
    setSongId(songIdCur);
    setCurrentTrackIndex(songIndex);
    setAlbumsAndArtistsSongs([]);
    if (songIdCur === songId) {
      if (isPlaying) {
        audioPlayer.current.pause();
        setIsPlaying(false);
      } else {
        audioPlayer.current.play();
        setIsPlaying(true);
      }
    } else {
      setCurrentTrackIndex(songIndex);
      setIsLoadingSong(true);
      setSongUrl("");
      setSongName(title);
      setArtistName(artistName);
      setAlbumName(album);
      setSongId(songIdCur);
      setIsPlaying(true);
    }
  };

  const handleDeleteSongFromPlaylist = async (event, id, title) => {
    event.stopPropagation();
    await deleteSongFromPlaylist(id, title);
    setPlaylistSongHasBeenDeleted(true);
    const newPlaylist = await getPlaylists();
    const currentPlaylist = newPlaylist.find(
      (playlist) => playlist._id === playlistId
    );
    const songsInCurrentPlaylist = currentPlaylist
      ? currentPlaylist.songs || []
      : [];
    addTodo(songsInCurrentPlaylist);
    if (songsInCurrentPlaylist.length === 0) {
      setPlaylistIsOpened(false);
      const songs = await getSongs();
      addTodo(songs);
    }
  };
  return (
    <>
      <div className="playlist-card_arrowback" onClick={goBackToPlaylistMain}>
        <TbArrowBackUpDouble />
      </div>
      <div className="currentplaying">
        <SpotifySvg />
        <div className="playlist-heading">Currently Playing</div>
      </div>
      <div className="playlist-song_container">
        {songs &&
          songs.map((song, index) => {
            return (
              <div
                className="playlist-loader"
                key={index}
                onClick={() =>
                  handlePlay(
                    song._id,
                    song.title,
                    song.artist,
                    song.album,
                    index
                  )
                }
              >
                <div
                  className="playlist-delete_song"
                  onClick={(event) =>
                    handleDeleteSongFromPlaylist(event, playlistId, song.title)
                  }
                >
                  &times;
                </div>
                <div className="playlist-song">
                  <p>{song.title}</p>
                  <p className="playlist-artist">{song.artist}</p>
                </div>
                <img
                  className="playlist-albumcover"
                  src={
                    song.coverfile
                      ? `${process.env.REACT_APP_URL}/api/v1/${song.coverfile}/cover`
                      : SongDefault
                  }
                  alt="cover"
                />
                {!isLoadingSong && isPlaying && song._id === songId ? (
                  <PlayingInPlaylist />
                ) : (
                  <button className="playlist-onplay_btn">
                    <FontAwesomeIcon icon={faCirclePlay} />
                  </button>
                )}
              </div>
            );
          })}
      </div>
    </>
  );
};

const mapStatetoProps = (state) => ({
  songId: state.songReducer.songId,
  isPlaying: state.songReducer.isPlaying,
  isLoadingSong: state.playerReducer.isLoadingSong,
});

export default connect(mapStatetoProps, {
  addTodo,
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
  setPlaylistIsOpened,
  setPlaylistSongHasBeenDeleted,
  setAlbumsAndArtistsSongs,
})(PlaylistOnPlay);
