import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/Login/login";
import Content from "./containers/Content/content";
import { Suspense } from "react";
import Menu from "./components/Navigation/menu";
import MainPlayer from "./containers/Main-Player/main-player";
import Registration from "./components/Registration/registration";
import UploadSong from "./pages/UploadSong/UploadSong";
import Artists from "./components/Artists/artists";
import Albums from "./components/Albums/albums";
import PlayList from "./containers/Playlists/playlists";
import PlaylistsSlider from "./components/PlaylistsSlider/plslider";
import Settings from "./pages/Settings/settings";
import PrivateRoute from "./privateRoute";

function RouterWrapper() {
  const token = localStorage.getItem("access_token");

  return (
    <main>
      <Menu />
      <section className="content">
        <div className="main-content">
          <Routes>
            {!token && <Route path="/" element={<Navigate to="/signin" />} />}
            {token && <Route path="/" element={<Navigate to="/feed" />} />}
            <Route path="/signin" element={<Login />} />
            <Route path="/signup" element={<Registration />} />
            <Route path="/feed" element={<Content />} />

            <Route element={<PrivateRoute />}>
              <Route path="/upload" element={<UploadSong />} />
              <Route path="/albums" element={<Artists />} />
              <Route path="/playlists" element={<PlayList />} />
              <Route path="/mysongs" element={<h1>My songs</h1>} />
              <Route path="/account" element={<PlayList />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </div>
        <MainPlayer />
      </section>
    </main>
  );
}

export default RouterWrapper;
