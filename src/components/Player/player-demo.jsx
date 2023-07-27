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
  height: "100%",
  width: "100%",
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
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
}) => {
  const playlist = [...todosRedux];
  // console.log(playlist.length);
  const audioPlayer = useRef();
  const currTimeRef = useRef(currTime);

  const [volume, setVolume] = useState(100);
  const [mute, setMute] = useState(false);
  const [isLoadingSong, setIsLoadingSong] = useState(false);

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
      console.log(songIdTrack);
      const __URL__ = "http://localhost:1337";
      const URL = `${__URL__}/api/v1/song/${songIdTrack}/file`;
      const { data } = await axios.get(URL, {
        responseType: "blob",
      });

      const blob = new Blob([data], { type: "audio/mp3" });
      const audioUrl = window.URL.createObjectURL(blob);

      setSongUrl(audioUrl);
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

  const toggleSkipForward = async () => {
    if (!isLoadingSong) {
      await audioPlayer.current.pause();
      setIsPlaying(false);
      setIsLoadingSong(true);
      const nextIndex = currentTrackIndex + 1;
      setCurrentTrackIndex(nextIndex % playlist.length);
      setSongUrl(null);
    }
  };

  const toggleSkipBackward = async () => {
    if (!isLoadingSong) {
      await audioPlayer.current.pause();
      setIsPlaying(false);
      setIsLoadingSong(true);
      if (currentTrackIndex > 0) {
        setCurrentTrackIndex(currentTrackIndex - 1);
      }
      setSongUrl(null);
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
    setSongUrl(null);
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
            <p>{`${songArtist} - ${songName}`}</p>
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
