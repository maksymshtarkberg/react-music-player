import Player from "../../components/Player/player-demo";
import Songs from "../../pages/Songs";
import "./main-player.css";

const MainPlayer = () => {
  return (
    <div className="main-player">
      <Songs />
      <Player />
    </div>
  );
};

export default MainPlayer;
