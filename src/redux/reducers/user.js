import { SET_USER_NAME, SET_USER_EMAIL, SET_USER_SESSION_ID } from "../actionTypes";

const initialState = {
  userName: '',
  email: '',
  sessionId: ''
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_NAME: {
      return {
        ...state,
        userName: action.payload,
      };
    }
    case SET_USER_EMAIL: {
      return {
        ...state,
        email: action.payload,
      };
    }
    case SET_USER_SESSION_ID: {
      return {
        ...state,
        sessionId: action.payload,
      };
    }
    default:
      return state;
  }
};

export default userReducer;
