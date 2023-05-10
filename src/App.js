// import Player from "./components/Player/player";
import Player from "./components/Player/player-demo";
import Songs from "./pages/Songs";
import UploadSong from "./pages/UploadSong";
import "./App.css";

function App() {
  return (
    <div className="container">
      {/* <UploadSong /> */}

      <Player />
      <Songs />
    </div>
  );
}

export default App;
