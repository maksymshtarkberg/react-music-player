import { useEffect } from "react";
import default_img from "../../assets/vinyl_icon.png";
import { useRef } from "react";
import { useState } from "react";
import { connect } from "react-redux";

const RotateImg = ({ songImg, isPlaying, currTime }) => {
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
  }, [isPlaying, currTime.sec]);

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
  const __URL__ = "http://localhost:1337";

  const coverURL = `${__URL__}/api/v1/${songImg}/cover`;

  return (
    <div className="album-cover">
      <img
        ref={rotatingImageRef}
        src={!songImg && songImg === undefined ? default_img : coverURL}
        alt="album-cover"
      />
      <span className="point"></span>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isPlaying: state.songReducer.isPlaying,
  seconds: state.playerReducer.seconds,
  currTime: state.playerReducer.currTime,
});

export default connect(mapStateToProps)(RotateImg);