import Songs from "../Songs/Songs";
import "./styles.css";

const TrackList = ({ audioPlayer, canvasRef }) => {
  return (
    <div className="main-player">
      <Songs audioPlayer={audioPlayer} />
    </div>
  );
};

export default TrackList;
