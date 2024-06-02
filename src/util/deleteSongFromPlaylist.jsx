import axios from "axios";

export const deleteSongFromPlaylist = async (playlistId, title) => {
  const headers = {
    "X-Auth-Token": localStorage.getItem("access_token"),
  };
  const __URL__ = process.env.REACT_APP_URL;
  const { data, status } = await axios.delete(
    `${__URL__}/api/v1/playlist/remove/${playlistId}?song=${title}`,
    { headers }
  );
  if (status === 200) {
    return console.log("Song:" + title + "has been successfully  deleted");
  }
};
