import Artists from "../../components/Artists/artists";
import Albums from "../../components/Albums/albums";
import { connect } from "react-redux";
import {
  setArtistIsOn,
  setAlbumIsOn,
  setSongId,
  setSongUrl,
  setIsPlaying,
  setCurrentTrackIndex,
  setAlbumsAndArtistsSongs,
} from "../../redux/actions";
import { useEffect } from "react";
import { useState } from "react";
import "./styles.css";
import { getSongs } from "../../util/getSongs";

const AlbumsAndArtists = ({
  todosRedux,
  audioPlayer,
  albumIsOn,
  artistIsOn,
  setArtistIsOn,
  setAlbumIsOn,
  setSongId,
  setSongUrl,
  setIsPlaying,
  setCurrentTrackIndex,
  setAlbumsAndArtistsSongs,
  albumsAndArtistsSongs,
}) => {
  const [sortedAlbums, setSortedAlbums] = useState();
  const [sortedArtists, setSortedArtists] = useState();

  useEffect(() => {
    if (albumIsOn || artistIsOn) {
      return;
    } else {
      fetchSongs();
    }
  }, []);

  useEffect(() => {
    if (albumsAndArtistsSongs.length > 0) {
      sortByAlbumName();
      sortByArtist();
    }
  }, [albumsAndArtistsSongs]);

  const fetchSongs = async () => {
    const songs = await getSongs();
    setAlbumsAndArtistsSongs(songs);
  };

  const sortByAlbumName = () => {
    const sortedSongs = [...albumsAndArtistsSongs].sort((song1, song2) =>
      song1.album.localeCompare(song2.album)
    );

    const albumsMap = sortedSongs.reduce((acc, song) => {
      if (!acc[song.album]) {
        acc[song.album] = [song];
      } else {
        acc[song.album].push(song);
      }
      return acc;
    }, {});

    const albumsArray = Object.keys(albumsMap).map((album) => ({
      albumName: album,
      songs: albumsMap[album],
    }));

    setSortedAlbums(albumsArray);
  };

  const sortByArtist = () => {
    const sortedSongs = [...albumsAndArtistsSongs].sort((song1, song2) =>
      song1.artist.localeCompare(song2.artist)
    );

    const albumsMap = sortedSongs.reduce((acc, song) => {
      if (!acc[song.artist]) {
        acc[song.artist] = [song];
      } else {
        acc[song.artist].push(song);
      }
      return acc;
    }, {});

    const artistsArray = Object.keys(albumsMap).map((artist) => ({
      artistName: artist,
      songs: albumsMap[artist],
    }));
    setSortedArtists(artistsArray);
  };

  const handleGoBack = async () => {
    setSortedAlbums([]);
    setSortedArtists([]);
    fetchSongs();
    setArtistIsOn(false);
    setAlbumIsOn(false);
    setSongId("");
    setSongUrl("");
    audioPlayer.current.pause();
    setIsPlaying(false);
    setCurrentTrackIndex(0);
  };

  return (
    <>
      {artistIsOn || albumIsOn ? (
        <button class="btn-go_back" title="Go Back" onClick={handleGoBack}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="50px"
            height="50px"
            viewBox="0 0 24 24"
            class="stroke-blue-300"
          >
            <path
              stroke-linejoin="round"
              stroke-linecap="round"
              stroke-width="1.5"
              d="M11 6L5 12M5 12L11 18M5 12H19"
            ></path>
          </svg>
        </button>
      ) : null}
      <Albums albums={sortedAlbums} audioPlayer={audioPlayer} />
      <Artists artists={sortedArtists} audioPlayer={audioPlayer} />
    </>
  );
};

const mapStatetoProps = (state) => ({
  todosRedux: state.todos.todos,
  albumIsOn: state.playerReducer.albumIsOn,
  artistIsOn: state.playerReducer.artistIsOn,
  albumsAndArtistsSongs: state.playerReducer.albumsAndArtistsSongs,
});

export default connect(mapStatetoProps, {
  setArtistIsOn,
  setAlbumIsOn,
  setSongId,
  setSongUrl,
  setIsPlaying,
  setCurrentTrackIndex,
  setAlbumsAndArtistsSongs,
})(AlbumsAndArtists);
