import {
  SET_CURRENT_TRACK_INDEX,
  SET_VOLUME,
  SET_SECONDS,
  SET_TIME,
  SET_CURR_TIME,
  SET_IS_LOADING_SONG,
  SET_ALBUM_IS_ON,
  SET_ARTIST_IS_ON,
  SET_ALBUMS_AND_ARTISTS_SONGS,
} from "../actionTypes";

const initialState = {
  currentTrackIndex: 0,
  volume: 100,
  seconds: "",
  time: {
    min: "",
    sec: "",
  },
  currTime: {
    min: "",
    sec: "",
  },
  isLoadingSong: false,
  albumIsOn: false,
  artistIsOn: false,
  albumsAndArtistsSongs: [],
};

const playerReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_TRACK_INDEX:
      return {
        ...state,
        currentTrackIndex: action.payload,
      };
    case SET_VOLUME:
      return {
        ...state,
        volume: action.payload,
      };
    case SET_SECONDS:
      return {
        ...state,
        seconds: action.payload,
      };
    case SET_TIME:
      return {
        ...state,
        time: action.payload,
      };
    case SET_CURR_TIME:
      return {
        ...state,
        currTime: action.payload,
      };
    case SET_IS_LOADING_SONG:
      return {
        ...state,
        isLoadingSong: action.payload,
      };
    case SET_ALBUM_IS_ON:
      return {
        ...state,
        albumIsOn: action.payload,
      };
    case SET_ARTIST_IS_ON:
      return {
        ...state,
        artistIsOn: action.payload,
      };
    case SET_ALBUMS_AND_ARTISTS_SONGS:
      return {
        ...state,
        albumsAndArtistsSongs: action.payload,
      };
    default:
      return state;
  }
};

export default playerReducer;
