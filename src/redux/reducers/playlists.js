import {
  SET_PLAYLIST,
  SET_PLAYLIST_LOADED,
  SET_PLAYLIST_CURRENT_ID,
  SET_PLAYLIST_IS_OPENED,
} from "../actionTypes";

const initialState = {
  playlists: [],
  playlistsisLoaded: false,
  playlistIsOpened: false,
  playlistCurrentId: "",
};

const playlistReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PLAYLIST: {
      return {
        ...state,
        playlists: action.payload,
        playlistsisLoaded: true,
      };
    }
    case SET_PLAYLIST_LOADED: {
      return {
        ...state,
        playlistsisLoaded: action.payload,
      };
    }
    case SET_PLAYLIST_CURRENT_ID: {
      return {
        ...state,
        playlistCurrentId: action.payload,
      };
    }
    case SET_PLAYLIST_IS_OPENED: {
      return {
        ...state,
        playlistIsOpened: action.payload,
      };
    }
    default:
      return state;
  }
};

export default playlistReducer;
