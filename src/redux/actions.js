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
  SET_SONG_ID,
  SET_PLAYLIST,
  SET_PLAYLIST_LOADED,
  SET_PLAYLIST_CURRENT_ID,
  SET_PLAYLIST_IS_OPENED,
  SET_IS_LOADING_SONG,
  SET_USER_NAME,
  SET_USER_EMAIL,
  SET_USER_SESSION_ID,
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
export const setSongId = (songId) => ({
  type: SET_SONG_ID,
  payload: songId,
});

export const setPlaylist = (playlists) => ({
  type: SET_PLAYLIST,
  payload: playlists,
});
export const setPlaylistLoaded = (playlistsisLoaded) => ({
  type: SET_PLAYLIST_LOADED,
  payload: playlistsisLoaded,
});
export const setPlaylistCurrentId = (playlistCurrentId) => ({
  type: SET_PLAYLIST_CURRENT_ID,
  payload: playlistCurrentId,
});
export const setPlaylistIsOpened = (playlistIsOpened) => ({
  type: SET_PLAYLIST_IS_OPENED,
  payload: playlistIsOpened,
});
export const setIsLoadingSong = (isLoadingSong) => ({
  type: SET_IS_LOADING_SONG,
  payload: isLoadingSong,
});
export const setUserName = (userName) => ({
  type: SET_USER_NAME,
  payload: userName,
});
export const setUserEmail = (email) => ({
  type: SET_USER_EMAIL,
  payload: email,
});
export const setUserSession = (sessionId) => ({
  type: SET_USER_SESSION_ID,
  payload: sessionId,
});
