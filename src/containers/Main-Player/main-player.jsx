import { useRef } from "react";
import Player from "../../components/Player/player-demo";
import Songs from "../Songs/Songs";
import "./main-player.css";

const MainPlayer = () => {
  const canvasRef = useRef();
  const audioPlayer = useRef();

  return (
    <div className="main-player">
      {/* <div className="vizualizer-container">
        <canvas ref={canvasRef} className="vizualizer" />
      </div> */}
      <Songs audioPlayer={audioPlayer} />
      <Player canvasRef={canvasRef} audioPlayer={audioPlayer} />
    </div>
  );
};

export default MainPlayer;
