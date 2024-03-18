import { combineReducers } from "redux";

import todos from "./todos";
import songReducer from "./song";
import playerReducer from "./player";
import playlistReducer from "./playlists";
import userReducer from "./user";

export default combineReducers({
  todos,
  songReducer,
  playerReducer,
  playlistReducer,
  userReducer
});
