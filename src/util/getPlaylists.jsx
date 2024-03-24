import axios from "axios";

export const getPlaylists = async () => {
  const headers = {
    "X-Auth-Token": localStorage.getItem("access_token"),
  };
  const __URL__ = "http://localhost:1337";
  const { data } = await axios.get(`${__URL__}/api/v1/playlist`, { headers });

  return data["playlists"];
};
