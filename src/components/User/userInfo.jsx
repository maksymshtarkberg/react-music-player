import { decodeToken } from "react-jwt";
import { getAvatar } from "../../util/getAvatar";
import { useEffect } from "react";
import { useState } from "react";
import "./styles.css";
import { connect } from "react-redux";
import { setAvatarUpdated } from "../../redux/actions";

const UserInfo = ({
  userName,
  email,
  avatarURL,
  avatarUpdated,
  setAvatarUpdated,
}) => {
  const token = localStorage.getItem("access_token");
  const decoded = decodeToken(token);
  const [userAvatar, setUserAvatar] = useState(null);

  const fetchAvatar = async () => {
    try {
      const avatar = await getAvatar();
      setUserAvatar(avatar);
      setAvatarUpdated(false);
    } catch (error) {
      console.error("Error fetching avatar:", error);
    }
  };

  useEffect(() => {
    fetchAvatar();
  }, [avatarUpdated]);

  return (
    <div className="user-profile-name">
      {token ? (
        <>
          {userAvatar ? (
            <img
              src={`${avatarURL}?${new Date().getTime()}`}
              alt="user"
              className="user-info_img"
            />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              id="mdi-account-music"
              viewBox="0 0 24 24"
              fill="#1c016c"
              className="user-info_img"
            >
              <path d="M11,14C12,14 13.05,14.16 14.2,14.44C13.39,15.31 13,16.33 13,17.5C13,18.39 13.25,19.23 13.78,20H3V18C3,16.81 3.91,15.85 5.74,15.12C7.57,14.38 9.33,14 11,14M11,12C9.92,12 9,11.61 8.18,10.83C7.38,10.05 7,9.11 7,8C7,6.92 7.38,6 8.18,5.18C9,4.38 9.92,4 11,4C12.11,4 13.05,4.38 13.83,5.18C14.61,6 15,6.92 15,8C15,9.11 14.61,10.05 13.83,10.83C13.05,11.61 12.11,12 11,12M18.5,10H20L22,10V12H20V17.5A2.5,2.5 0 0,1 17.5,20A2.5,2.5 0 0,1 15,17.5A2.5,2.5 0 0,1 17.5,15C17.86,15 18.19,15.07 18.5,15.21V10Z" />
            </svg>
          )}
          <h2>{userName}</h2>
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            id="mdi-account-music"
            viewBox="0 0 24 24"
            fill="#1c016c"
            className="user-info_img"
          >
            <path d="M11,14C12,14 13.05,14.16 14.2,14.44C13.39,15.31 13,16.33 13,17.5C13,18.39 13.25,19.23 13.78,20H3V18C3,16.81 3.91,15.85 5.74,15.12C7.57,14.38 9.33,14 11,14M11,12C9.92,12 9,11.61 8.18,10.83C7.38,10.05 7,9.11 7,8C7,6.92 7.38,6 8.18,5.18C9,4.38 9.92,4 11,4C12.11,4 13.05,4.38 13.83,5.18C14.61,6 15,6.92 15,8C15,9.11 14.61,10.05 13.83,10.83C13.05,11.61 12.11,12 11,12M18.5,10H20L22,10V12H20V17.5A2.5,2.5 0 0,1 17.5,20A2.5,2.5 0 0,1 15,17.5A2.5,2.5 0 0,1 17.5,15C17.86,15 18.19,15.07 18.5,15.21V10Z" />
          </svg>
          <h2>Login to your account</h2>
        </>
      )}
    </div>
  );
};

const mapStatetoProps = (state) => ({
  sessionId: state.userReducer.sessionId,
  userName: state.userReducer.userName,
  email: state.userReducer.email,
  avatarURL: state.userReducer.avatarURL,
  avatarUpdated: state.userReducer.avatarUpdated,
});

export default connect(mapStatetoProps, { setAvatarUpdated })(UserInfo);
