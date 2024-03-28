import React, { useState, useEffect, useRef } from "react";
import { styled, Typography, Slider, Paper, Stack, Box } from "@mui/material";
import { connect } from "react-redux";
import axios from "axios";
import * as THREE from "three";
import "./style.css";

import {
  setIsLoadedSong,
  setSongUrl,
  setCurrentTrackIndex,
  setTime,
  setCurrTime,
  setSeconds,
  setIsPlaying,
  setSongName,
  setArtistName,
  setIsLoadingSong,
  setSongId,
  setVolume,
} from "../../redux/actions";
import Loader from "../Loader/loader";
import RotateImg from "../RotatingImg/rotatingImg";

// #region ------------ ICONS ---------
import VolumeDownIcon from "@mui/icons-material/VolumeDown";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeMuteIcon from "@mui/icons-material/VolumeMute";

import PauseIcon from "@mui/icons-material/Pause";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import FastForwardIcon from "@mui/icons-material/FastForward";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";

const Player = ({
  songUrl,
  songArtist,
  songName,
  todosRedux,
  isPlaying,
  setIsPlaying,
  setIsLoadedSong,
  setSongUrl,
  setCurrentTrackIndex,
  currentTrackIndex,
  setTime,
  time,
  volume,
  setVolume,
  setCurrTime,
  currTime,
  setSeconds,
  seconds,
  isLoaded,
  setSongName,
  setArtistName,
  setIsLoadingSong,
  isLoadingSong,
  songId,
  setSongId,
  canvasRef,
  audioPlayer,
}) => {
  const currTimeRef = useRef(currTime);

  const [mute, setMute] = useState(false);
  const [songImg, setSongImg] = useState("");

  /**
   * Fetching current song by current track id
   */
  useEffect(() => {
    if (isLoaded && songId && todosRedux) {
      fetchSong();
    }
  }, [todosRedux, isLoaded, songId]);

  const fetchSong = async () => {
    try {
      if (currentTrackIndex >= todosRedux.length) {
        setCurrentTrackIndex(0);
      }

      const headers = {
        "Content-Type": "application/json",
        "X-Auth-token": localStorage.getItem("access_token"),
      };

      const __URL__ = "http://localhost:1337";
      const URL = `${__URL__}/api/v1/${songId}/file`;
      const { data } = await axios.get(URL, {
        headers: headers,
        responseType: "blob",
      });

      const blob = new Blob([data], { type: "audio/mp3" });
      const audioUrl = window.URL.createObjectURL(blob);
      if (audioUrl) {
        setSongUrl(audioUrl);
        const currentSong = todosRedux.find((song) => song._id === songId);
        setSongName(currentSong.title);
        setArtistName(currentSong.artist);

        setSongImg(currentSong.coverfile);

        setIsLoadedSong(true);
        setIsLoadingSong(false);
      } else {
        setSongImg(""); // Clearing somgImg to default Player Image if its no file
      }
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Set current song volume equal to volume in Redux Player
   */
  useEffect(() => {
    if (songUrl && !isLoadingSong) {
      audioPlayer.current.volume = volume / 100;
    }
  }, [songUrl, songId, volume, currentTrackIndex]);

  /**
   * Set song file to audioRef of component
   */
  useEffect(() => {
    if (songUrl && !isLoadingSong) {
      audioPlayer.current.src = songUrl;
      audioPlayer.current.load();

      /**
       * Auto-start playing when select song
       */
      if (isPlaying) {
        audioPlayer.current.play();
        setIsPlaying(true);
      } else {
        audioPlayer.current.pause();
      }
    }
  }, [songId, isLoadingSong]);

  /**
   * Calculating the time of current song(duration and updating it when song is playing)
   */
  useEffect(() => {
    const handleLoadedMetadata = () => {
      const sec = audioPlayer.current.duration;
      const min = Math.floor(sec / 60);
      const secRemain = Math.floor(sec % 60);

      setTime({
        min: min,
        sec: secRemain,
      });
    };
    handleLoadedMetadata();
  }, [audioPlayer?.current?.readyState, songUrl]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (audioPlayer.current) {
        try {
          const seekTime = audioPlayer.current.currentTime;
          const min = Math.floor(seekTime / 60);
          const sec = Math.floor(seekTime % 60);
          const currTime = {
            min,
            sec,
          };

          if (
            currTime.min !== currTimeRef.current.min ||
            currTime.sec !== currTimeRef.current.sec
          ) {
            setCurrTime(currTime);
            setSeconds(seekTime);
            currTimeRef.current = currTime;
          }
        } catch (error) {
          console.error(error);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [songUrl, currTime, audioPlayer]);

  /**
   * Visualizer THREE.js
   */

  // useEffect(() => {
  //   let audioContext;
  //   let analyser;
  //   let source;

  //   const canvasWidth = 1307;
  //   const canvasHeight = 300;

  //   const listener = new THREE.AudioListener();
  //   const sound = new THREE.Audio(listener);
  //   const canvas = canvasRef.current;
  //   const scene = new THREE.Scene();
  //   const camera = new THREE.PerspectiveCamera(
  //     75,
  //     canvasWidth / canvasHeight,
  //     0.1,
  //     1000
  //   );
  //   const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  //   const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);
  //   const sphereMaterial = new THREE.MeshBasicMaterial({
  //     color: 0xffffff, // white color
  //     envMap: scene.background, // using the scene's background as an environment map (for reflections)
  //   });
  //   const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  //   sphere.castShadow = true; // apply swadows
  //   sphere.receiveShadow = true;
  //   renderer.setSize(canvasWidth, canvasHeight);

  //   scene.background = new THREE.Color(0x000000);
  //   scene.add(camera);
  //   scene.add(sphere);

  //   // sphere.position.set(0, 0, 0);

  //   camera.position.z = 4;

  //   const wireframe = new THREE.WireframeGeometry(sphereGeometry);
  //   const lineMaterial = new THREE.LineBasicMaterial({
  //     color: 0x000000, // color of lines (segments)
  //     linewidth: 50,
  //   });

  //   const lineSegments = new THREE.LineSegments(wireframe, lineMaterial);
  //   sphere.add(lineSegments);

  //   const connectAudio = async () => {
  //     source = audioContext.createMediaElementSource(audioPlayer.current);
  //     source.connect(analyser);
  //     analyser.connect(audioContext.destination);

  //     console.log(source);
  //   };

  //   // Loading and playback of audio
  //   if (songUrl) {
  //     const audioLoader = new THREE.AudioLoader();
  //     audioLoader.load(songUrl, function (buffer) {
  //       sound.setBuffer(buffer);

  //       audioContext = new window.AudioContext();
  //       analyser = audioContext.createAnalyser();
  //       connectAudio();

  //       // Animation of analyser
  //       const animateSphere = () => {
  //         requestAnimationFrame(animateSphere);

  //         if (analyser) {
  //           const frequencyData = new Uint8Array(analyser.frequencyBinCount);
  //           analyser.getByteFrequencyData(frequencyData);

  //           const averageFrequency =
  //             frequencyData.reduce((a, b) => a + b, 0) / frequencyData.length;
  //           const scaleFactor = 1 + averageFrequency / 256; // Масштабируем шар в зависимости от средней частоты

  //           sphere.scale.set(scaleFactor, scaleFactor, scaleFactor);
  //           sphere.rotation.y += 0.003 + averageFrequency / 500;
  //         }

  //         // Zone to add animation with sphere

  //         renderer.render(scene, camera);
  //       };

  //       animateSphere();
  //     });
  //   }

  //   // Clearing the audio context upon component unmounting
  //   return () => {
  //     if (audioContext && audioContext.state === "running") {
  //       audioContext.close();
  //     }
  //   };
  // }, [songUrl]);

  /**
   * Creating a time format
   */
  function formatTime(time) {
    if (time && !isNaN(time)) {
      const minutes =
        Math.floor(time / 60) < 10
          ? `0${Math.floor(time / 60)}`
          : Math.floor(time / 60);
      const seconds =
        Math.floor(time % 60) < 10
          ? `0${Math.floor(time % 60)}`
          : Math.floor(time % 60);

      return `${minutes}:${seconds}`;
    }
    return "00:00";
  }

  /**
   * Audio controls of playing
   */
  const togglePlay = () => {
    if (audioPlayer.current) {
      if (!isPlaying) {
        audioPlayer.current.readyState === 4 && audioPlayer.current.play();
        setIsPlaying(true);
      } else {
        audioPlayer.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleForward = () => {
    if (audioPlayer.current) {
      // audioPlayer.current.pause();
      audioPlayer.current.currentTime += 10;
      // audioPlayer.current.play();
    }
  };

  const toggleBackward = () => {
    if (audioPlayer.current) {
      // audioPlayer.current.pause();
      audioPlayer.current.currentTime -= 10;
      // audioPlayer.current.play();
    }
  };

  const toggleSkipForward = async () => {
    if (!isLoadingSong) {
      const nextIndex = (currentTrackIndex + 1) % todosRedux.length;
      await switchSong(nextIndex);
    }
  };

  const toggleSkipBackward = async () => {
    if (!isLoadingSong) {
      const prevIndex = (currentTrackIndex - 1) % todosRedux.length;
      await switchSong(prevIndex);
    }
  };

  const switchSong = async (index) => {
    await audioPlayer.current.pause();
    setIsPlaying(true);
    setIsLoadingSong(true);
    setCurrentTrackIndex(index);
    setSongId(todosRedux[index]._id);
  };

  const handleVolumeChange = (newValue) => {
    setVolume(+newValue);
  };

  const HandleTimeChange = (e) => {
    const newValue = parseFloat(e.target.value);
    if (audioPlayer.current) {
      setSeconds(newValue);
      setCurrTime({
        min: Math.floor(newValue / 60),
        sec: Math.floor(newValue % 60),
      });

      audioPlayer.current.currentTime = parseFloat(newValue);
    }
  };

  const SongOnEnded = async () => {
    setSongUrl("");
    const nextIndex = (currentTrackIndex + 1) % todosRedux.length;
    await switchSong(nextIndex);
  };

  function VolumeBtns() {
    const handleMuteToggle = () => {
      if (mute) {
        setVolume(50);
      } else {
        setVolume(0);
      }
      setMute(!mute);
    };

    return mute || volume === 0 ? (
      <button onClick={handleMuteToggle}>
        <VolumeOffIcon />
      </button>
    ) : volume <= 20 ? (
      <button onClick={handleMuteToggle}>
        <VolumeMuteIcon />
      </button>
    ) : volume <= 75 ? (
      <button onClick={handleMuteToggle}>
        <VolumeDownIcon />
      </button>
    ) : (
      <button onClick={handleMuteToggle}>
        <VolumeUpIcon />
      </button>
    );
  }

  return (
    <div className="music-player">
      <audio
        src={songUrl}
        key={songUrl}
        ref={audioPlayer}
        muted={mute}
        onEnded={SongOnEnded}
      />

      <RotateImg songImg={songImg} />
      {songUrl && !isLoadingSong ? (
        <div>
          <h2>{songName}</h2>
          <p>{songArtist}</p>
        </div>
      ) : (
        <p>Loading song...</p>
      )}
      <div className="controls">
        <button onClick={toggleSkipBackward}>
          <SkipPreviousIcon disabled={true} />
        </button>
        <button onClick={toggleBackward}>
          <FastRewindIcon />
        </button>
        {isLoadingSong || songUrl === "" ? (
          <button>
            <Loader />
          </button>
        ) : !isPlaying ? (
          <button onClick={togglePlay}>
            <PlayArrowIcon />
          </button>
        ) : (
          <button onClick={togglePlay}>
            <PauseIcon />
          </button>
        )}
        <button onClick={toggleForward}>
          <FastForwardIcon />
        </button>
        <button onClick={toggleSkipForward}>
          <SkipNextIcon />
        </button>
      </div>

      <input
        id="progress"
        type="range"
        value={seconds || 0}
        max={audioPlayer.current ? audioPlayer.current.duration || 0 : 0}
        onChange={HandleTimeChange}
      />
      <div className="song-time">
        <div>{formatTime(seconds)}</div>
        <div>{formatTime(time.min * 60 + time.sec - seconds)}</div>
      </div>
      <div className="song-volume">
        <VolumeBtns />
        <input
          id="volume"
          type="range"
          value={volume}
          onChange={(e) => handleVolumeChange(e.target.value)}
        />
      </div>
    </div>
  );
};

const mapStatetoProps = (state) => ({
  todosRedux: state.todos.todos,
  isLoaded: state.todos.isLoaded,
  songUrl: state.songReducer.songUrl,
  songName: state.songReducer.songName,
  songArtist: state.songReducer.songArtist,
  isPlaying: state.songReducer.isPlaying,
  currentTrackIndex: state.playerReducer.currentTrackIndex,
  time: state.playerReducer.time,
  currTime: state.playerReducer.currTime,
  seconds: state.playerReducer.seconds,
  volume: state.playerReducer.volume,
  songId: state.songReducer.songId,
  isLoadedSong: state.songReducer.isLoadedSong,
  isLoadingSong: state.playerReducer.isLoadingSong,
});

export default connect(mapStatetoProps, {
  setIsLoadedSong,
  setSongUrl,
  setCurrentTrackIndex,
  setTime,
  setCurrTime,
  setSeconds,
  setIsPlaying,
  setSongName,
  setArtistName,
  setIsLoadingSong,
  setSongId,
  setVolume,
})(Player);
