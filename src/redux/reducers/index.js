import { combineReducers } from "redux";

import todos from "./todos";
import songReducer from "./song";
import playerReducer from "./player";

export default combineReducers({ todos, songReducer, playerReducer });
