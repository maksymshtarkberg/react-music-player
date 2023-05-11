import { useEffect, useState, useRef } from "react";
import { Howl, Howler } from "howler";
import axios from "axios";
import qala from "../../assets/The Weeknd-Save Your Tears.mp3";
import useSound from "use-sound"; //для работы со звуком
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai"; // иконки для воспроизведения и паузы
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi"; // иконки для следующего и предыдущего трека
import { IconContext } from "react-icons"; // для кастомизации иконок
import "./style.css";
import AudioPlayer, { RHAP_UI } from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

import {
  setIsPlaying,
  setCurrentTrackIndex,
  setVolume,
  setSeconds,
  setTime,
  setCurrTime,
  setIsLoaded,
} from "../../redux/actions";
import { connect } from "react-redux";

const Player = ({ songUrl, songArtist, songName, todosRedux }) => {
  // const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const audioRef = useRef(null);
  const soundRef = useRef(null);

  const playlist = [todosRedux];

  // const playNextSong = () => {
  //   const nextSongIndex = (currentSongIndex + 1) % songs.length;
  //   setCurrentSongIndex(nextSongIndex);
  // };

  //  useSound(tracks[currentTrackIndex].url);

  const volumeBar = useRef();
  const currTimeRef = useRef();

  // useEffect(() => {
  //   if (duration) {
  //     console.log(duration);
  //     const sec = duration / 1000;
  //     const min = Math.floor(sec / 60);
  //     const secRemain = Math.floor(sec % 60);

  //     setTime({
  //       min: min,
  //       sec: secRemain,
  //     });
  //   }
  // }, [isPlaying, duration]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (sound) {
  //       try {
  //         const seekTime = sound.seek([]);
  //         const min = Math.floor(seekTime / 60);
  //         const sec = Math.floor(seekTime % 60);
  //         const currTime = {
  //           min,
  //           sec,
  //         };

  //         // Обновляем состояния только при изменении времени
  //         if (
  //           currTime.min !== currTimeRef.current.min ||
  //           currTime.sec !== currTimeRef.current.sec
  //         ) {
  //           setCurrTime(currTime);
  //           setSeconds(seekTime);
  //           currTimeRef.current = currTime;
  //         }
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     }
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, [isPlaying, sound, seconds, currTime]);

  // const HandleTimeChange = (e) => {
  //   const value = parseFloat(e.target.value);
  //   setSeconds(parseFloat(value));
  //   sound.seek(parseFloat(value));
  // };

  // const handleVolumeChange = (e) => {
  //   const value = e.target.value;
  //   const newVolume = value / 100;
  //   setVolume(newVolume);
  //   sound.volume(newVolume);
  // };

  // useEffect(() => {
  //   if (volumeBar.current) {
  //     volumeBar.current.value = volume;
  //   }
  // }, [volume]);

  // const playingButton = () => {
  //   if (isPlaying) {
  //     setIsPlaying(false);
  //     pause();
  //   } else {
  //     setIsPlaying(true);
  //     play();
  //   }
  // };

  //   const handleSkipNext = () => {
  //     const nextTrackIndex =
  //       currentTrackIndex === tracks.length - 1 ? 0 : currentTrackIndex + 1;
  //     setCurrentTrackIndex(nextTrackIndex);
  //     stop();
  //     play({ id: tracks[nextTrackIndex].url });
  //   };

  //   const handleSkipPrevious = () => {
  //     const previousTrackIndex =
  //       currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;
  //     setCurrentTrackIndex(previousTrackIndex);
  //     stop();
  //     play({ id: tracks[previousTrackIndex].url });
  //   };

  return (
    <div className="component">
      <h2>Playing Now</h2>
      <img className="musicCover" src="https://picsum.photos/200/200" />
      <div>
        <h3 className="title">{!songName ? "Song Name" : songName}</h3>
        <p className="subTitle">{!songArtist ? "Artist Name" : songArtist}</p>
      </div>
      <AudioPlayer
        autoPlay
        src={songUrl}
        showFilledVolume={true}
        onPlay={(e) => setIsPlaying(true)}

        // other props here
      />
      <div>
        <button className="playButton">
          <IconContext.Provider value={{ size: "3em", color: "#27AE60" }}>
            <BiSkipPrevious />
          </IconContext.Provider>
        </button>
        {!isPlaying ? (
          <button className="playButton" onClick={playingButton}>
            <IconContext.Provider value={{ size: "3em", color: "#27AE60" }}>
              <AiFillPlayCircle />
            </IconContext.Provider>
          </button>
        ) : (
          <button className="playButton" onClick={playingButton}>
            <IconContext.Provider value={{ size: "3em", color: "#27AE60" }}>
              <AiFillPauseCircle />
            </IconContext.Provider>
          </button>
        )}
        <button className="playButton">
          <IconContext.Provider value={{ size: "3em", color: "#27AE60" }}>
            <BiSkipNext />
          </IconContext.Provider>
        </button>
        <div>
          <div className="time">
            <p>
              {currTime.min}:
              {currTime.sec.toLocaleString(undefined, {
                minimumIntegerDigits: 2,
              })}
            </p>
            <p>
              {time.min}:
              {time.sec.toLocaleString(undefined, {
                minimumIntegerDigits: 2,
              })}
            </p>
          </div>
          <input
            type="range"
            min="0"
            max={duration}
            default="0"
            value={seconds}
            className="timeline"
            onChange={HandleTimeChange}
          />
        </div>
        <input
          type="range"
          min="1"
          max="100"
          step="1"
          value={volume * 100}
          ref={volumeBar}
          onChange={handleVolumeChange}
        />
        <span>{Math.round(volume * 100)}</span>
      </div>
    </div>
  );
};

const mapStatetoProps = (state) => ({
  todosRedux: state.todos.todos,
  songUrl: state.songReducer.songUrl,
  songName: state.songReducer.songName,
  songArtist: state.songReducer.songArtist,
});

export default connect(mapStatetoProps, { setSongId })(Player);
