import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Login from "./pages/Login/login";
import Content from "./containers/Content/content";
import { Suspense, useEffect } from "react";
import Menu from "./components/Navigation/menu";
import TrackList from "./containers/Tracklist/tracklist";
import Registration from "./pages/Registration/registration";
import UploadSong from "./pages/UploadSong/UploadSong";

import PlayList from "./pages/Playlists/playlists";
import Settings from "./pages/Settings/settings";
import PrivateRoute from "./privateRoute";
import Mysongs from "./pages/MySongs/mysongs";
import { useRef } from "react";
import AlbumsAndArtists from "./pages/Albums&Artists/albumsAndArtists";
import Account from "./pages/Account/account";
import Player from "./components/Player/player";
import { checkTokenExpiration } from "./util/checkTokenExpiration";

function RouterWrapper({ canvasRef }) {
  const audioPlayer = useRef();
  const token = localStorage.getItem("access_token");
  const navigate = useNavigate();

  useEffect(() => {
    const shouldRedirect = checkTokenExpiration();
    if (shouldRedirect) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <main>
      <Menu />

      <section className="content">
        <div className="main-content">
          <Routes>
            {!token && <Route path="/" element={<Navigate to="/signin" />} />}
            {token && <Route path="/" element={<Navigate to="/about" />} />}
            <Route path="/signin" element={<Login />} />
            <Route path="/signup" element={<Registration />} />
            <Route
              path="/about"
              element={<Content audioPlayer={audioPlayer} />}
            />

            <Route element={<PrivateRoute />}>
              <Route path="/upload" element={<UploadSong />} />
              <Route
                path="/albums"
                element={<AlbumsAndArtists audioPlayer={audioPlayer} />}
              />
              <Route
                path="/playlists"
                element={<PlayList audioPlayer={audioPlayer} />}
              />
              <Route
                path="/mysongs"
                element={<Mysongs audioPlayer={audioPlayer} />}
              />
              <Route path="/account" element={<Account />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </div>
        <TrackList audioPlayer={audioPlayer} canvasRef={canvasRef} />
        <Player audioPlayer={audioPlayer} canvasRef={canvasRef} />
      </section>
    </main>
  );
}

export default RouterWrapper;
