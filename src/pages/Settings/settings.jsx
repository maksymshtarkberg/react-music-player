import { useState } from "react";
import "../../components/Registration/styles.css";
import { useForm } from "react-hook-form";
import axios from "axios";
import { connect } from "react-redux";
import { decodeToken } from "react-jwt";

const Settings = ({ sessionId }) => {
  const [submitted, setSubmitted] = useState(false);
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
      password: "",
    },
  });

  const headers = {
    "Content-Type": "application/json",
    "X-Auth-Token": localStorage.getItem("access_token"),
  };

  const token = localStorage.getItem("access_token");

  const userSession = token && decodeToken(token);

  const onSubmit = handleSubmit(async (data) => {
    const response = await axios.patch(
      `http://localhost:1337/api/v1/user/changename`,
      { fullName: data.username },
      { headers }
    );
    if (response.status === 200) {
      // setLoading(false);
      alert("Name changed successfully");
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
            className="reg-input"
            type="file"
            name="avatar"
            accept="image/*"
            // required
          />
        </div>
        {/* <div className="input-control">
          <label htmlFor="password" className="reg-label">
            Password
          </label>
          <input
            type="password"
            placeholder="password"
            id="password"
            className="reg-input"
            {...register("password", {
              required: true,
              minLength: 4,
            })}
          />
        </div> */}

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
