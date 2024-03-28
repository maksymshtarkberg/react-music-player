import {
  ADD_TODO,
  SET_IS_LOADED,
  SET_SONGS_UPLOADED_BY_USER,
} from "../actionTypes";

const initialState = {
  todos: [],
  isLoaded: false,
  songsUploadedByUser: [],
};

const todoReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TODO: {
      return {
        ...state,
        todos: action.payload,
        isLoaded: true,
      };
    }
    case SET_IS_LOADED: {
      return {
        ...state,
        isLoaded: action.payload,
      };
    }
    case SET_SONGS_UPLOADED_BY_USER: {
      return {
        ...state,
        songsUploadedByUser: action.payload,
      };
    }

    default:
      return state;
  }
};

export default todoReducer;
