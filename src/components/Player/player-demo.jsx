import React, { useState, useEffect, useRef } from "react";
import { styled, Typography, Slider, Paper, Stack, Box } from "@mui/material";
import { connect } from "react-redux";
import axios from "axios";
import {
  setIsLoadedSong,
  setSongUrl,
  setCurrentTrackIndex,
  setTime,
  setCurrTime,
  setSeconds,
  setIsPlaying,
} from "../../redux/actions";
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
import { TimelapseRounded } from "@mui/icons-material";
// #endregion ------------ ICONS ---------

// #endregion ---------------------------------------------------------------

// #region -------- Styled Components -----------------------------------------
const Div = styled("div")(({ theme }) => ({
  backgroundColor: "grey",
  height: "100vh",
  width: "100vw",
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
}) => {
  const playlist = [...todosRedux];
  // console.log(playlist.length);
  const audioPlayer = useRef();
  const currTimeRef = useRef(currTime);

  const [volume, setVolume] = useState(100);
  const [mute, setMute] = useState(false);

  useEffect(() => {
    fetchSong();
    console.log(playlist);
  }, [currentTrackIndex, todosRedux]);

  const fetchSong = async () => {
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
    // const file = new File([blob], `${songIdTrack}.mp3`, {
    //   type: "audio/mp3",
    // });
    const audioUrl = window.URL.createObjectURL(blob);
    setSongUrl(audioUrl);
    setIsLoadedSong(true);
  };

  useEffect(() => {
    if (songUrl) {
      audioPlayer.current.src = songUrl;
      audioPlayer.current.load();
      audioPlayer.current.play();
      setIsPlaying(true);
    }
  }, [songUrl]);

  // console.log(songUrl);

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
    // audioPlayer.current.addEventListener(
    //   "loadedmetadata",
    //   handleLoadedMetadata
    // );

    // return () => {
    //   audioPlayer.current.removeEventListener(
    //     "loadedmetadata",
    //     handleLoadedMetadata
    //   );
    // };
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
          // Обновляем состояния только при изменении времени
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

  // useEffect(() => {
  //   if (audioPlayer.current) {
  //     audioPlayer.current.volume = volume / 100;
  //   }

  //   const handleLoadedMetadata = () => {
  //     const _duration = Math.floor(audioPlayer?.current?.duration);
  //     const _elapsed = Math.floor(audioPlayer?.current?.currentTime);
  //     // console.log(audioPlayer?.current?.currentTime);
  //     setDuration(_duration);
  //     setElapsed(_elapsed); // Обновляем состояние elapsed при загрузке метаданных
  //   };

  //   audioPlayer.current.addEventListener(
  //     "loadedmetadata",
  //     handleLoadedMetadata
  //   );

  //   const handleDurationChange = () => {
  //     const _duration = Math.floor(audioPlayer?.current?.duration);
  //     setDuration(_duration);
  //   };

  //   audioPlayer.current.addEventListener(
  //     "durationchange",
  //     handleDurationChange
  //   );

  //   const handleTimeUpdate = () => {
  //     const _elapsed = Math.floor(audioPlayer?.current?.currentTime);
  //     setElapsed(_elapsed); // Обновляем состояние elapsed при изменении времени проигрывания
  //     elapsedRef.current = _elapsed;
  //   };

  //   audioPlayer.current.addEventListener("timeupdate", handleTimeUpdate);

  //   return () => {
  //     audioPlayer.current.removeEventListener(
  //       "loadedmetadata",
  //       handleLoadedMetadata
  //     );
  //     audioPlayer.current.removeEventListener(
  //       "durationchange",
  //       handleDurationChange
  //     );
  //     audioPlayer.current.removeEventListener("timeupdate", handleTimeUpdate);
  //   };
  // }, [songUrl, audioPlayer, volume]);

  // console.log(elapsedRef);

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
      } else {
        audioPlayer.current.pause();
        setIsPlaying(false);
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

  const toggleSkipForward = () => {
    if (audioPlayer.current) {
      audioPlayer.current.pause();
      const nextIndex = currentTrackIndex + 1;
      setCurrentTrackIndex(nextIndex % playlist.length);
      audioPlayer.current.play();
      setIsPlaying(true);
    }
  };

  const toggleSkipBackward = () => {
    if (audioPlayer.current) {
      audioPlayer.current.pause();
      if (currentTrackIndex > 0) {
        setCurrentTrackIndex(currentTrackIndex - 1);
        audioPlayer.current.play();
      }
    }
    setIsPlaying(true);
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
        onEnded={() => setCurrentTrackIndex(currentTrackIndex + 1)}
      />
      <CustomPaper>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
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
          <input
            type="range"
            value={(seconds = undefined ? 0 : seconds)}
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
});

export default connect(mapStatetoProps, {
  setIsLoadedSong,
  setSongUrl,
  setCurrentTrackIndex,
  setTime,
  setCurrTime,
  setSeconds,
  setIsPlaying,
})(Player);
