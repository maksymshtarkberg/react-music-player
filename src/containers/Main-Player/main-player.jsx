import { useRef } from "react";
import Player from "../../components/Player/player-demo";
import Songs from "../../pages/Songs";
import "./main-player.css";

const MainPlayer = () => {
  const canvasRef = useRef();

  return (
    <div className="main-player">
      <div style={{ width: "100%", height: "100%" }}>
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "100%", borderRadius: 12 }}
        />
      </div>

      <Songs />
      <Player canvasRef={canvasRef} />
    </div>
  );
};

export default MainPlayer;
