import { useEffect } from "react";
import default_img from "../../assets/vinyl_icon.png";
import { useRef } from "react";
import { useState } from "react";
import { connect } from "react-redux";

const RotateImg = ({
  songImg,
  isPlaying,
  currTime,
  isLoadingSong,
  audioPlayer,
}) => {
  const rotatingImageRef = useRef(null);
  const [animationFrameId, setAnimationFrameId] = useState(null);
  const currentRotation = useRef(0);

  useEffect(() => {
    if (isPlaying) {
      startRotation();
    } else {
      pauseRotation();
    }

    return () => {
      pauseRotation();
    };
  }, [isPlaying, currTime.sec, isLoadingSong, audioPlayer.current]);

  const rotateImage = () => {
    setAnimationFrameId(
      requestAnimationFrame(() => {
        currentRotation.current = currentRotation.current + 0.5;
        rotatingImageRef.current.style.transform = `rotate(${currentRotation.current}deg)`;
        isPlaying && rotateImage();
      })
    );
  };

  const startRotation = () => {
    if (!animationFrameId && isPlaying) {
      rotateImage();
    }
  };

  const pauseRotation = () => {
    cancelAnimationFrame(animationFrameId);
    setAnimationFrameId(null);
  };
  const __URL__ = process.env.REACT_APP_URL;

  const coverURL = songImg ? `${__URL__}/api/v1/${songImg}/cover` : default_img;

  return (
    <div className="album-cover">
      <div className="album-cover_box">
        <img ref={rotatingImageRef} src={coverURL} alt="album-cover" />
        <span className="point"></span>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isPlaying: state.songReducer.isPlaying,
  seconds: state.playerReducer.seconds,
  currTime: state.playerReducer.currTime,
  isLoadingSong: state.playerReducer.isLoadingSong,
});

export default connect(mapStateToProps)(RotateImg);
