import React, { useState, useEffect, useRef } from "react";
import { styled, Typography, Slider, Paper, Stack, Box } from "@mui/material";
import { connect } from "react-redux";
import axios from "axios";
import * as THREE from "three";

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
} from "../../redux/actions";
import Loader from "../Loader/loader";

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
// #endregion ------------ ICONS ---------

// #region -------- Styled Components -----------------------------------------
const Div = styled("div")(({ theme }) => ({
  backgroundColor: "grey",
  height: "100%",
  width: "100%",
  paddingTop: theme.spacing(6),
}));

const CustomPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: "#F4F4F4",
  marginLeft: theme.spacing(6),
  marginRight: theme.spacing(6),
  padding: theme.spacing(2),
}));

const PSlider = styled(Slider)(({ theme, ...props }) => ({
  color: "lime",
  height: 2,
  "&:hover": {
    cursor: "auto",
  },
  "& .MuiSlider-thumb": {
    width: "13px",
    height: "13px",
    display: props.thumbless ? "none" : "block",
  },
}));
// #endregion ---------------------------------------------------------------

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
  setCurrTime,
  currTime,
  setSeconds,
  seconds,
  songId,
  isLoadedSong,
  isLoaded,
  setSongName,
  setArtistName,
  setIsLoadingSong,
  isLoadingSong,
  canvasRef,
}) => {
  const playlist = [...todosRedux];
  // console.log(playlist.length);
  const audioPlayer = useRef();
  const currTimeRef = useRef(currTime);

  const [volume, setVolume] = useState(100);
  const [mute, setMute] = useState(false);
  const [analyserConnected, setAnalylerConnected] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      fetchSong();
    }
  }, [todosRedux, isLoaded, currentTrackIndex]);

  const fetchSong = async () => {
    try {
      if (currentTrackIndex >= playlist.length) {
        setCurrentTrackIndex(0);
      }

      const songIdTrack = playlist[currentTrackIndex]._id;

      const __URL__ = "http://localhost:1337";
      const URL = `${__URL__}/api/v1/song/${songIdTrack}/file`;
      const { data } = await axios.get(URL, {
        responseType: "blob",
      });

      const blob = new Blob([data], { type: "audio/mp3" });
      const audioUrl = window.URL.createObjectURL(blob);

      setSongUrl(audioUrl);
      setSongName(playlist[currentTrackIndex].title);
      setArtistName(playlist[currentTrackIndex].artist);
      setIsLoadedSong(true);
      setIsLoadingSong(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (songUrl && !isLoadingSong) {
      audioPlayer.current.src = songUrl;
      audioPlayer.current.load();

      /**
       * Auto-start playing
       */
      audioPlayer.current.play();
      setIsPlaying(true);
    }
  }, [songUrl, currentTrackIndex, isLoadingSong]);

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

  useEffect(() => {
    let audioContext = new window.AudioContext();
    let analyser = audioContext.createAnalyser();
    let source;

    const canvasWidth = 1300;
    const canvasHeight = 300;

    const listener = new THREE.AudioListener();
    const sound = new THREE.Audio(listener);
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      canvasWidth / canvasHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff, // Белый цвет
      roughness: 0.0, // Устанавливаем минимальную шероховатость
      metalness: 1.0, // Устанавливаем максимальную металличность
      envMap: scene.background, // Используем фон сцены как окружающую карту (для отражений)
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.castShadow = true; // Разрешаем отбрасывание тени
    sphere.receiveShadow = true;
    renderer.setSize(canvasWidth, canvasHeight);

    scene.background = new THREE.Color(0x111111);
    scene.add(camera);
    scene.add(sphere);

    sphere.position.set(0, 0, 0);

    camera.position.z = 5;

    const wireframe = new THREE.WireframeGeometry(sphereGeometry);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x000000, // Цвет линий (сегментов)
      linewidth: 2,
    });

    const lineSegments = new THREE.LineSegments(wireframe, lineMaterial);
    sphere.add(lineSegments);

    const ambientLight = new THREE.AmbientLight(0x808080, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x00ff00, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    camera.add(pointLight);
    pointLight.position.set(0, 0, 5);

    const light = new THREE.PointLight(0xffffff, 1);
    light.position.copy(camera.position); // Позиция света совпадает с позицией камеры
    scene.add(light);

    const connectAudio = () => {
      source = audioContext.createMediaElementSource(audioPlayer.current);
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      console.log(source);
    };

    async function loadAudio() {
      await audioContext.resume();
    }

    connectAudio();

    // Загрузка аудио и воспроизведение
    if (songUrl) {
      const audioLoader = new THREE.AudioLoader();
      audioLoader.load(songUrl, function (buffer) {
        sound.setBuffer(buffer);

        // const canvasContext = canvas.getContext("2d");

        // Анимация анализа
        const animateSphere = () => {
          requestAnimationFrame(animateSphere);

          if (analyser) {
            const frequencyData = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(frequencyData);

            const averageFrequency =
              frequencyData.reduce((a, b) => a + b, 0) / frequencyData.length;
            const scaleFactor = 1 + averageFrequency / 128; // Масштабируем шар в зависимости от средней частоты

            sphere.scale.set(scaleFactor, scaleFactor, scaleFactor);
            sphere.rotation.y += 0.005 + averageFrequency / 2000;
          }

          // Дополнительные анимационные действия с шаром

          renderer.render(scene, camera);
        };

        animateSphere();
      });
    }

    isPlaying && loadAudio();

    // Очистка аудиоконтекста при размонтировании компонента
    return () => {
      if (audioContext.state === "running") {
        audioContext.close();
      }
    };
  }, [songUrl]);

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

  const togglePlay = () => {
    if (audioPlayer.current) {
      if (!isPlaying) {
        audioPlayer.current.play();
        setIsPlaying(true);
        setAnalylerConnected(true);
      } else {
        audioPlayer.current.pause();
        setIsPlaying(false);
        setAnalylerConnected(false);
      }
    }
  };

  const toggleForward = () => {
    if (audioPlayer.current) {
      audioPlayer.current.pause();
      audioPlayer.current.currentTime += 10;
      audioPlayer.current.play();
    }
  };

  const toggleBackward = () => {
    if (audioPlayer.current) {
      audioPlayer.current.pause();
      audioPlayer.current.currentTime -= 10;
      audioPlayer.current.play();
    }
  };

  const toggleSkipForward = async () => {
    if (!isLoadingSong) {
      await audioPlayer.current.pause();
      setSongUrl("");
      setIsLoadingSong(true);
      const nextIndex = currentTrackIndex + 1;
      setCurrentTrackIndex(nextIndex % playlist.length);
      setIsPlaying(true);
    }
  };

  const toggleSkipBackward = async () => {
    if (!isLoadingSong) {
      await audioPlayer.current.pause();
      setIsPlaying(true);
      setIsLoadingSong(true);
      if (currentTrackIndex > 0) {
        setCurrentTrackIndex(currentTrackIndex - 1);
      }
      setSongUrl("");
    }
  };

  const handleVolumeChange = (newValue) => {
    setVolume(newValue);
    audioPlayer.current.volume = newValue / 100;
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

  const SongOnEnded = () => {
    setSongUrl("");
    setCurrentTrackIndex(currentTrackIndex + 1);
  };

  function VolumeBtns() {
    return mute ? (
      <VolumeOffIcon
        sx={{ color: "lime", "&:hover": { color: "white" } }}
        onClick={() => setMute(!mute)}
      />
    ) : volume <= 20 ? (
      <VolumeMuteIcon
        sx={{ color: "lime", "&:hover": { color: "white" } }}
        onClick={() => setMute(!mute)}
      />
    ) : volume <= 75 ? (
      <VolumeDownIcon
        sx={{ color: "lime", "&:hover": { color: "white" } }}
        onClick={() => setMute(!mute)}
      />
    ) : (
      <VolumeUpIcon
        sx={{ color: "lime", "&:hover": { color: "white" } }}
        onClick={() => setMute(!mute)}
      />
    );
  }

  return (
    <Div>
      <audio
        src={songUrl}
        key={songUrl}
        ref={audioPlayer}
        muted={mute}
        onEnded={SongOnEnded}
      />
      <CustomPaper>
        <Box
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {isLoadingSong || songUrl === "" ? <Loader /> : null}
          <Stack
            direction="row"
            spacing={1}
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              width: "25%",
              alignItems: "center",
            }}
          >
            <VolumeBtns />
            <PSlider
              min={0}
              max={100}
              value={volume}
              onChange={(e, v) => handleVolumeChange(v)}
            />
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            sx={{
              display: "flex",
              width: "40%",
              alignItems: "center",
            }}
          >
            <SkipPreviousIcon
              sx={{
                color: "lime",
                "&:hover": { color: "white" },
              }}
              onClick={toggleSkipBackward}
              disabled={true}
            />
            <FastRewindIcon
              sx={{ color: "lime", "&:hover": { color: "white" } }}
              onClick={toggleBackward}
            />

            {!isPlaying ? (
              <PlayArrowIcon
                fontSize={"large"}
                sx={{ color: "lime", "&:hover": { color: "white" } }}
                onClick={togglePlay}
              />
            ) : (
              <PauseIcon
                fontSize={"large"}
                sx={{ color: "lime", "&:hover": { color: "white" } }}
                onClick={togglePlay}
              />
            )}
            <FastForwardIcon
              sx={{ color: "lime", "&:hover": { color: "white" } }}
              onClick={toggleForward}
            />
            <SkipNextIcon
              sx={{ color: "lime", "&:hover": { color: "white" } }}
              onClick={toggleSkipForward}
            />

            {songUrl ? (
              <div style={{ position: "relative" }}>
                <p
                  style={{
                    position: "absolute",
                    whiteSpace: "nowrap",
                    top: "-23px",
                  }}
                >{`${songArtist} - ${songName}`}</p>
              </div>
            ) : (
              <div style={{ position: "relative" }}>
                <p
                  style={{
                    position: "absolute",
                    whiteSpace: "nowrap",
                    top: "-23px",
                  }}
                >
                  Loading song...
                </p>
              </div>
            )}
          </Stack>

          <Stack
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          />
        </Box>
        <Stack
          spacing={1}
          direction="row"
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography sx={{ color: "lime" }}>{formatTime(seconds)}</Typography>
          <PSlider
            thumbless="true"
            value={seconds || 0}
            max={audioPlayer.current ? audioPlayer.current.duration : 0}
            onChange={HandleTimeChange}
          />
          <Typography sx={{ color: "lime" }}>
            {formatTime(time.min * 60 + time.sec - seconds)}
          </Typography>
        </Stack>
      </CustomPaper>
    </Div>
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
})(Player);
