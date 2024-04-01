import Albums from "../../components/Albums/albums";
import Artists from "../../components/Artists/artists";
import Login from "../../components/Login/login";
import PlaylistsSlider from "../../components/PlaylistsSlider/plslider";
import Registration from "../../components/Registration/registration";
import Settings from "../../pages/Settings/settings";
import UploadSong from "../../pages/UploadSong/UploadSong";
import "./content.css";
import { connect } from "react-redux";

const Content = ({ audioPlayer, playlists }) => {
  return (
    <div class="main-content">
      {playlists.length > 0 && (
        <PlaylistsSlider audioPlayer={audioPlayer} playlists={playlists} />
      )}
      <Artists />
      <Albums />
    </div>
  );
};

const mapStatetoProps = (state) => ({
  playlists: state.playlistReducer.playlists,
});

export default connect(mapStatetoProps, {})(Content);
