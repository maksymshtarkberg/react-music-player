import useDragScroll from "../../util/useDragScroll";
import albumsdef from "../../assets/albums-default.png";
import { connect } from "react-redux";
import {
  addTodo,
  setIsPlaying,
  setSongId,
  setSongUrl,
  setCurrentTrackIndex,
  setAlbumIsOn,
  setPlaylistIsOpened,
  setAlbumsAndArtistsSongs,
} from "../../redux/actions";

const Albums = ({
  audioPlayer,
  albums,
  addTodo,
  setIsPlaying,
  setSongId,
  setSongUrl,
  setCurrentTrackIndex,
  setAlbumIsOn,
  setPlaylistIsOpened,
  setAlbumsAndArtistsSongs,
}) => {
  const { handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave } =
    useDragScroll();

  const HandlePlayAlbumSongs = (songs) => {
    audioPlayer.current.pause();
    setSongUrl("");
    setSongId("");
    setIsPlaying(false);
    setSongId(songs[0]._id);
    addTodo(songs);
    setAlbumsAndArtistsSongs(songs);
    setCurrentTrackIndex(0);
    setAlbumIsOn(true);
    setPlaylistIsOpened(false);
  };

  return (
    <div className="albums">
      <h1>Recommended Albums</h1>
      <div
        className="album-container containers"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {albums &&
          albums.map((album, index) => {
            return (
              <div className="album" key={index}>
                <div className="album-frame">
                  <img
                    onClick={() => HandlePlayAlbumSongs(album.songs)}
                    src={
                      album.albumName === "Now the Moon’s Rising"
                        ? "https://t2.genius.com/unsafe/842x0/https%3A%2F%2Fimages.genius.com%2F3d76a6c01fde3e445b40246d45682eb1.877x877x1.png"
                        : album.albumName === "DS2"
                        ? "https://t2.genius.com/unsafe/842x0/https%3A%2F%2Fimages.genius.com%2Fc498a9a939e455ae13be88fb8319ac3b.1000x1000x1.jpg"
                        : album.albumName === "After Hours"
                        ? "https://t2.genius.com/unsafe/842x0/https%3A%2F%2Fimages.genius.com%2F9d35a5dff10090e6c1d5e077932cea99.1000x1000x1.jpg"
                        : album.albumName ===
                          "Come Over When You’re Sober, Pt. 1"
                        ? "https://t2.genius.com/unsafe/842x0/https%3A%2F%2Fimages.genius.com%2F08a41fd48e3aad97b825b70dfdea89af.1000x1000x1.png"
                        : album.albumName === "The Dark Side Of The Moon"
                        ? "https://t2.genius.com/unsafe/842x0/https%3A%2F%2Fimages.genius.com%2Fd3ecd57d490f664e08aba94019796f1a.1000x1000x1.png"
                        : album.albumName === "Led Zeppelin IV"
                        ? "https://t2.genius.com/unsafe/842x0/https%3A%2F%2Fimages.genius.com%2F2f7f8a7cf53e8162d15ef6143d38e8ed.1000x1000x1.jpg"
                        : albumsdef
                    }
                    alt="album-cover"
                  />
                </div>
                <div>
                  <h2>{album.albumName}</h2>
                  <p>{album.songs[0].artist}</p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

const mapStatetoProps = (state) => ({
  albumIsOn: state.playerReducer.artistIsOn,
});

export default connect(mapStatetoProps, {
  addTodo,
  setIsPlaying,
  setSongId,
  setSongUrl,
  setCurrentTrackIndex,
  setAlbumIsOn,
  setPlaylistIsOpened,
  setAlbumsAndArtistsSongs,
})(Albums);
