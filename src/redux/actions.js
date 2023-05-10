import {
  ADD_TODO,
  SET_IS_LOADED,
  SET_SONG_URL,
  SET_SONG_NAME,
  SET_ARTIST_NAME,
  SET_ALBUM_NAME,
  SET_IS_PLAYING,
  SET_CURRENT_TRACK_INDEX,
  SET_VOLUME,
  SET_SECONDS,
  SET_TIME,
  SET_CURR_TIME,
  SET_SONG_FILE,
  SET_IS_LOADED_SONG,
} from "./actionTypes";

export const addTodo = (todos) => ({
  type: ADD_TODO,
  payload: todos,
});
export const setIsLoaded = (isLoaded) => ({
  type: SET_IS_LOADED,
  payload: isLoaded,
});

export const setSongUrl = (url) => ({
  type: SET_SONG_URL,
  payload: url,
});

export const setSongName = (name) => ({
  type: SET_SONG_NAME,
  payload: name,
});

export const setArtistName = (name) => ({
  type: SET_ARTIST_NAME,
  payload: name,
});

export const setAlbumName = (name) => ({
  type: SET_ALBUM_NAME,
  payload: name,
});

export const setIsPlaying = (val) => ({
  type: SET_IS_PLAYING,
  payload: val,
});

export const setCurrentTrackIndex = (index) => ({
  type: SET_CURRENT_TRACK_INDEX,
  payload: index,
});

export const setVolume = (volume) => ({
  type: SET_VOLUME,
  payload: volume,
});

export const setSeconds = (seconds) => ({
  type: SET_SECONDS,
  payload: seconds,
});

export const setTime = (time) => ({
  type: SET_TIME,
  payload: time,
});

export const setCurrTime = (currTime) => ({
  type: SET_CURR_TIME,
  payload: currTime,
});
export const setSongFile = (songFile) => ({
  type: SET_SONG_FILE,
  payload: songFile,
});
export const setIsLoadedSong = (isLoadedSong) => ({
  type: SET_IS_LOADED_SONG,
  payload: isLoadedSong,
});
