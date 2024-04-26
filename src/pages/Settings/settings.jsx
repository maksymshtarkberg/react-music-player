import { useRef, useState } from "react";
import "../Registration/styles.css";
import { useForm, setError } from "react-hook-form";
import axios from "axios";
import { connect } from "react-redux";
import { getUser } from "../../util/getUser";
import { useEffect } from "react";
import { uploadAvatar } from "../../util/uploadAvatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import avatarPrewDefault from "../../assets/avatar-default-icon.png";
import "./styles.css";
import { getAvatar } from "../../util/getAvatar";
import { decodeToken } from "react-jwt";

import {
  setUserName,
  setUserEmail,
  setAvatarUpdated,
} from "../../redux/actions";

const Settings = ({
  setUserName,
  setUserEmail,
  userName,
  email,
  setAvatarUpdated,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [userAvatar, setUserAvatar] = useState(null);
  const [userNameLocal, setUserNameLocal] = useState(userName);
  const [userEmailLocal, setUserEmailLocal] = useState(email);

  const [editOnName, setEditOnName] = useState(false);
  const [editOnEmail, setEditOnEmail] = useState(false);

  const avatarPreview = useRef();

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    setError,
    clearErrors,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      username: userNameLocal,
      userEmail: userEmailLocal,
    },
  });

  useEffect(() => {
    if (errors) {
      setTimeout(() => {
        clearErrors("userEmail");
      }, 5000);
    }
    if (submitted) {
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    }
  }, [submitted, errors]);

  useEffect(() => {
    const fetchAvatar = async () => {
      const token = localStorage.getItem("access_token");
      const decoded = decodeToken(token);
      try {
        const avatar = await getAvatar();
        if (avatar) {
          avatarPreview.current.src = `http://localhost:1337/api/v1/avatar/${decoded.id}`;
        } else {
          avatarPreview.current.src = avatarPrewDefault;
        }
      } catch (error) {
        console.error("Error fetching avatar:", error);
      }
    };

    fetchAvatar();
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
          "X-Auth-Token": localStorage.getItem("access_token"),
        };
        const user = await getUser(headers);
        if (user) {
          setValue("username", user.name);
          setValue("email", user.email);
          setUserNameLocal(user.name);
          setUserEmailLocal(user.email);
        }
      } catch (error) {
        console.error("No user logged in", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleUserAvatarChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
          const width = img.width;
          const height = img.height;

          if (width > 600 || height > 600) {
            alert("File size exceeds the limit. Please choose a smaller file.");
            e.target.value = "";
            setUserAvatar(null);
            avatarPreview.current.src = avatarPrewDefault;
          } else {
            setUserAvatar(file);
            avatarPreview.current.src = event.target.result;
          }
        };
        img.src = event.target.result;
      };

      reader.readAsDataURL(file);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const headers = {
        "X-Auth-token": localStorage.getItem("access_token"),
      };
      const promises = [];
      if (data.username !== userName) {
        promises.push(
          axios.put(
            `http://localhost:1337/api/v1/user/changename`,
            { fullName: data.username },
            { headers }
          )
        );
      }
      if (data.email !== email) {
        promises.push(
          axios.put(
            `http://localhost:1337/api/v1/user/changemail`,
            { email: data.email },
            { headers }
          )
        );
      }
      if (userAvatar) {
        promises.push(uploadAvatar(userAvatar, headers));
      }
      const responses = await Promise.all(promises);
      const allChangesSuccessful = responses.every(
        (response) => response.status === 200
      );
      if (allChangesSuccessful) {
        setSubmitted(true);
        setUserName(data.username);
        setUserEmail(data.email);
        setAvatarUpdated(true);
      } else {
        console.error("Error changing name, email or avatar");
      }
    } catch (error) {
      if (error.response.status === 400) {
        setError("userEmail", {
          type: "manual",
          message: "Email already exists",
        });
        setSubmitted(false);
      } else {
        console.error("Error changing name, email or avatar:", error);
        setSubmitted(false);
      }
    }
  });

  const handleClickEditName = (e) => {
    e.stopPropagation();
    setEditOnName((prevValue) => !prevValue);
  };
  const handleClickEditEmail = (e) => {
    e.stopPropagation();
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
                onChange={(e) => setUserNameLocal(e.target.value)}
              />
              <FontAwesomeIcon
                icon={faCheck}
                className="approve-icon"
                onClick={(e) => handleClickEditName(e)}
              />
            </div>
          ) : (
            <div className="input-box" onClick={handleClickEditName}>
              <p className="user-info">{userNameLocal}</p>
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
                onChange={(e) => setUserEmailLocal(e.target.value)}
              />
              <FontAwesomeIcon
                icon={faCheck}
                className="approve-icon"
                onClick={handleClickEditEmail}
              />
            </div>
          ) : (
            <div className="input-box" onClick={handleClickEditEmail}>
              <p className={`user-info ${errors.userEmail && "input-error"}`}>
                {userEmailLocal}
              </p>
              <FontAwesomeIcon
                icon={faPenToSquare}
                className="edit-icon"
                onClick={(e) => handleClickEditEmail(e)}
              />
            </div>
          )}
        </div>
        <div className="input-control">
          <label className="reg-label" htmlFor="avatar">
            Photo
          </label>
          <div className="settings-photo">
            <input
              onChange={handleUserAvatarChange}
              className="reg-input"
              type="file"
              name="avatar"
              accept="image/*"
              capture="environment"
              style={{ maxWidth: "600px", maxHeight: "600px" }}
            />
            <img
              className="settings-avatar_prew"
              ref={avatarPreview || avatarPrewDefault}
              id="previewImg"
              alt="Avatar preview"
            />
          </div>
        </div>

        <button
          className="reg-button"
          type="submit"
          disabled={editOnEmail || (editOnName && true)}
        >
          Save
        </button>
      </form>

      {errors.userEmail && (
        <span className="error">{errors.userEmail.message}</span>
      )}
      {submitted && (
        <div className="message">
          <p>Changes successfully saved!🎉</p>
        </div>
      )}
    </section>
  );
};

const mapStatetoProps = (state) => ({
  sessionId: state.userReducer.sessionId,
  userName: state.userReducer.userName,
  email: state.userReducer.email,
});

export default connect(mapStatetoProps, {
  setUserName,
  setUserEmail,
  setAvatarUpdated,
})(Settings);
