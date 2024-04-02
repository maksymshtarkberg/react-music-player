import Artists from "../../components/Artists/artists";
import Albums from "../../components/Albums/albums";
import { connect } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";

const AlbumsAndArtists = ({ todosRedux }) => {
  const [sortedAlbums, setSortedAlbums] = useState();
  const [sortedArtists, setSortedArtists] = useState();

  useEffect(() => {
    sortByAlbumName();
    sortByArtist();
  }, [todosRedux]);

  const sortByAlbumName = () => {
    const sortedSongs = [...todosRedux].sort((song1, song2) =>
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
    const sortedSongs = [...todosRedux].sort((song1, song2) =>
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

  return (
    <>
      <Albums albums={sortedAlbums} />
      <Artists artists={sortedArtists} />
    </>
  );
};

const mapStatetoProps = (state) => ({
  todosRedux: state.todos.todos,
});

export default connect(mapStatetoProps, {})(AlbumsAndArtists);
