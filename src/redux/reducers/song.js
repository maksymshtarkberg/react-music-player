import {
  SET_SONG_URL,
  SET_SONG_NAME,
  SET_ARTIST_NAME,
  SET_ALBUM_NAME,
  SET_IS_PLAYING,
  SET_SONG_FILE,
  SET_IS_LOADED_SONG,
  SET_SONG_ID,
} from "../actionTypes";

const initialState = {
  songUrl: "",
  songName: "",
  songArtist: "",
  songAlbum: "",
  isPlaying: false,
  songFile: null,
  isLoadedSong: false,
  songId: "",
};

const songReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SONG_URL:
      return { ...state, songUrl: action.payload };
    case SET_SONG_NAME:
      return { ...state, songName: action.payload };
    case SET_ARTIST_NAME:
      return { ...state, songArtist: action.payload };
    case SET_ALBUM_NAME:
      return { ...state, songAlbum: action.payload };
    case SET_IS_PLAYING:
      return { ...state, isPlaying: action.payload };
    case SET_SONG_FILE:
      return { ...state, songFile: action.payload };
    case SET_IS_LOADED_SONG:
      return { ...state, loadedSong: action.payload };
    case SET_SONG_ID:
      return { ...state, songId: action.payload };
    default:
      return state;
  }
};

export default songReducer;
