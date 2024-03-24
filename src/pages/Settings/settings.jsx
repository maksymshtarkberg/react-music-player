import { useState } from "react";
import "../../components/Registration/styles.css";
import { useForm } from "react-hook-form";
import axios from "axios";
import { connect } from "react-redux";
import { decodeToken } from "react-jwt";
import { getUser } from "../../util/getUser";
import { useEffect } from "react";
import { uploadAvatar } from "../../util/uploadAvatar";

const Settings = ({ sessionId }) => {
  const [submitted, setSubmitted] = useState(false);
  const [userAvatar, setUserAvatar] = useState();

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
    },
  });

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
        }
      } catch (error) {
        console.error("No user logged in", error);
      }
    };

    fetchUserInfo();
  }, []);

  const uploadUserAvatar = async () => {
    try {
      const headers = {
        "content-type": "multipart/form-data",
        "X-Auth-token": localStorage.getItem("access_token"),
      };

      const result = await uploadAvatar(userAvatar, headers);
      // console.log(avatar.data);
    } catch (error) {
      console.error("Avatar can`t be upload", error);
    }
  };

  const handleUserAvatarChange = (e) => {
    setUserAvatar(e.target.files[0]);
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      // const response = await axios.put(
      //   `http://localhost:1337/api/v1/user/changename`,
      //   { fullName: data.username },
      //   { headers }
      // );
      // if (response.status === 200) {
      //   const username = response.data;
      //   console.log(username);
      //   // setLoading(false);
      //   alert("Name changed successfully");
      // }
      uploadUserAvatar();
    } catch (error) {
      console.log(error.message);
    }
  });
  return (
    <section className="reg-container">
      <h1 className="reg-title">Account settings</h1>
      <form onSubmit={onSubmit} className="reg-form">
        <div className="input-control">
          <label className="reg-label" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            placeholder="Username"
            id="username"
            className="reg-input"
            {...register("username", {
              required: true,
            })}
          />
        </div>
        <div className="input-control">
          <label className="reg-label" htmlFor="username">
            Email
          </label>
          <input
            type="text"
            placeholder="email"
            id="email"
            className="reg-input"
            {...register("email", {
              // required: true,
            })}
          />
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

        <button className="reg-button" type="submit">
          Submit
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
