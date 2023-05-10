import { ADD_TODO, SET_IS_LOADED } from "../actionTypes";

const initialState = {
  todos: [],
  isLoaded: false,
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
    default:
      return state;
  }
};

export default todoReducer;
