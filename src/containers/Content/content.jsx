import Albums from "../../components/Albums/albums";
import Artists from "../../components/Artists/artists";
import Login from "../../components/Login/login";
import PlaylistsSlider from "../../components/PlaylistsSlider/plslider";
import Registration from "../../components/Registration/registration";
import Settings from "../../pages/Settings/settings";
import UploadSong from "../../pages/UploadSong/UploadSong";
import "./content.css";

const Content = () => {
  return (
    <div class="main-content">
      <Settings />
      {/* <UploadSong /> */}
      <Login />
      {/* <Registration /> */}
      {/* <PlaylistsSlider /> */}
      {/* <Artists />
      <Albums /> */}
    </div>
  );
};

export default Content;
