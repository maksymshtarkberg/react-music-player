import PlaylistsSlider from "../../components/PlaylistsSlider/plslider";
import AlbumsAndArtists from "../../pages/Albums&Artists/albumsAndArtists";
import "./content.css";
import { connect } from "react-redux";

const Content = ({ audioPlayer, playlists }) => {
  return (
    <div class="main-content">
      {playlists.length > 0 && (
        <PlaylistsSlider audioPlayer={audioPlayer} playlists={playlists} />
      )}
      {/* <AlbumsAndArtists /> */}
    </div>
  );
};

const mapStatetoProps = (state) => ({
  playlists: state.playlistReducer.playlists,
});

export default connect(mapStatetoProps, {})(Content);
