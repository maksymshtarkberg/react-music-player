import { useEffect, useState } from "react";
import { getUser } from "../../util/getUser";
import moment from "moment";
import { getSongs } from "../../util/getSongs";
import { decodeToken } from "react-jwt";
import { getPlaylists } from "../../util/getPlaylists";
import "./styles.css";

const Account = () => {
  const [user, setUser] = useState();
  const [userSongs, setUserSongs] = useState(0);
  const [userPlaylists, setUserPlaylists] = useState(0);

  const token = localStorage.getItem("access_token");
  const decoded = decodeToken(token);

  useEffect(() => {
    fetchUserInfo();
    fetchSongs();
    fetchPlaylists();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
        "X-Auth-Token": localStorage.getItem("access_token"),
      };
      const user = await getUser(headers);

      setUser(user);
    } catch (error) {
      console.error("No user logged in", error);
    }
  };

  const fetchSongs = async () => {
    const songs = await getSongs();

    const foundSongs = songs.filter(
      (userSong) => userSong.uploadedBy === decoded.id
    );
    console.log(foundSongs);

    setUserSongs(foundSongs.length);
  };

  const fetchPlaylists = async () => {
    const playlists = await getPlaylists();

    const currentPlaylist = playlists.filter(
      (playlist) => playlist.createdBy === decoded.id
    );

    setUserPlaylists(currentPlaylist.length);
  };

  const date = user && new Date(user.registrationDate);
  const formattedDate = moment(date).format("DD/MM/YYYY");
  return (
    <div>
      {user && (
        <div className="reg-container">
          <h1 className="reg-title">Account Info</h1>
          <div className="reg-form reg-form_account">
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Registration Date: {formattedDate}</p>
            <p>
              Songs uploaded by {user.name}: {userSongs}
            </p>
            <p>
              Playlists created by {user.name}: {userPlaylists}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
