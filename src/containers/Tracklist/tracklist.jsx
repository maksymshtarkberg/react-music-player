import Songs from "../Songs/Songs";
import "./styles.css";

const TrackList = ({ audioPlayer }) => {
  return (
    <div className="main-player">
      {/* <div className="vizualizer-container">
        <canvas ref={canvasRef} className="vizualizer" />
      </div> */}
      <Songs audioPlayer={audioPlayer} />
    </div>
  );
};

export default TrackList;
