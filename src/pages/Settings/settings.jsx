import { useState } from "react";
import "../../components/Registration/styles.css";
import { useForm } from "react-hook-form";
import axios from "axios";
import { connect } from "react-redux";
import { getUser } from "../../util/getUser";
import { useEffect } from "react";
import { uploadAvatar } from "../../util/uploadAvatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import "./styles.css";

const Settings = ({ sessionId }) => {
  const [submitted, setSubmitted] = useState(false);
  const [userAvatar, setUserAvatar] = useState();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const [editOnName, setEditOnName] = useState(false);
  const [editOnEmail, setEditOnEmail] = useState(false);

  const { handleSubmit, register, formState, setValue } = useForm({
    mode: "onChange",
    defaultValues: {
      username: userName,
      email: userEmail,
    },
  });
  // const { username, email } = formState;

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
          "X-Auth-Token": localStorage.getItem("access_token"),
        };
        const user = await getUser(headers);
        console.log(headers, user);
        if (user) {
          setValue("username", user.name);
          setValue("email", user.email);
          setUserName(user.name);
          setUserEmail(user.email);
        }
      } catch (error) {
        console.error("No user logged in", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleUserAvatarChange = (e) => {
    setUserAvatar(e.target.files[0]);
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const headers = {
        "X-Auth-token": localStorage.getItem("access_token"),
      };

      const [nameResponse, emailResponse, avatarResponse] = await Promise.all([
        axios.put(
          `http://localhost:1337/api/v1/user/changename`,
          { fullName: data.username },
          { headers }
        ),
        axios.put(
          `http://localhost:1337/api/v1/user/changemail`,
          { email: data.email },
          { headers }
        ),
        uploadAvatar(userAvatar, headers),
      ]);

      if (
        nameResponse.status === 200 ||
        emailResponse.status === 200 ||
        avatarResponse.status === 200
      ) {
        setSubmitted(true);
      } else {
        console.error("Error changing name or email");
      }
    } catch (error) {
      console.error("Error changing name, email or avatar:", error);
    }
  });

  const handleClickEditName = () => {
    setEditOnName((prevValue) => !prevValue);
  };
  const handleClickEditEmail = () => {
    setEditOnEmail((prevValue) => !prevValue);
  };

  return (
    <section className="reg-container">
      <h1 className="reg-title">Account settings</h1>
      <form onSubmit={onSubmit} className="reg-form">
        <div className="input-control">
          <label className="reg-label" htmlFor="username">
            Username
          </label>
          {editOnName ? (
            <div className="input-box">
              <input
                type="text"
                placeholder="Username"
                id="username"
                className="reg-input"
                {...register("username", {
                  required: false,
                })}
                onChange={(e) => setUserName(e.target.value)}
              />
              <FontAwesomeIcon
                icon={faCheck}
                className="edit-icon"
                onClick={handleClickEditName}
              />
            </div>
          ) : (
            <div className="input-box">
              <p className="user-info">{userName}</p>
              <FontAwesomeIcon
                icon={faPenToSquare}
                className="edit-icon"
                onClick={handleClickEditName}
              />
            </div>
          )}
        </div>
        <div className="input-control">
          <label className="reg-label" htmlFor="email">
            Email
          </label>
          {editOnEmail ? (
            <div className="input-box">
              <input
                type="text"
                placeholder="Email"
                id="email"
                className="reg-input"
                {...register("email", {
                  required: false,
                })}
                onChange={(e) => setUserEmail(e.target.value)}
              />
              <FontAwesomeIcon
                icon={faCheck}
                className="edit-icon"
                onClick={handleClickEditEmail}
              />
            </div>
          ) : (
            <div className="input-box">
              <p className="user-info">{userEmail}</p>
              <FontAwesomeIcon
                icon={faPenToSquare}
                className="edit-icon"
                onClick={handleClickEditEmail}
              />
            </div>
          )}
        </div>
        <div className="input-control">
          <label className="reg-label" htmlFor="avatar">
            Photo
          </label>
          <input
            onChange={handleUserAvatarChange}
            className="reg-input"
            type="file"
            name="avatar"
            accept="image/*"
          />
        </div>

        <button
          className="reg-button"
          type="submit"
          disabled={editOnEmail || (editOnName && true)}
        >
          Save
        </button>
      </form>

      {submitted && (
        <div className="message">
          <p>Changes successfully apply!🎉</p>
        </div>
      )}
    </section>
  );
};

const mapStatetoProps = (state) => ({
  sessionId: state.userReducer.sessionId,
});

export default connect(mapStatetoProps, {})(Settings);
