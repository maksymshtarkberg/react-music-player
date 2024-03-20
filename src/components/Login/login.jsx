import { useForm } from "react-hook-form";
import "../Registration/styles.css";
import { useState } from "react";
import { decodeToken } from "react-jwt";

import { connect } from "react-redux";
import { setUserSession } from "../../redux/actions";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ setUserSession }) => {
  const [submitted, setSubmitted] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const apiUrl = "http://localhost:1337/api/v1/auth/login";
      const response = await axios.post(apiUrl, {
        email: data.email,
        password: data.password,
      });

      if (response.status === 200 && response.data.status === "success") {
        setValue("username", "");
        setValue("password", "");
        setSubmitted(true);

        localStorage.setItem("access_token", response.data.token);
        const token = localStorage.getItem("access_token");

        token && navigate("/feed");
      } else {
        console.error("Error during login:", response.statusText);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  });

  return (
    <section className="reg-container">
      <h1 className="reg-title">Login</h1>
      <form onSubmit={onSubmit} className="reg-form">
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
              required: true,
            })}
          />
          {errors.email && errors.email.type === "required" && (
            <small>{errors.email.message}</small>
          )}
        </div>

        <div className="input-control">
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
          {errors.password && errors.password.type === "required" && (
            <small>{errors.password.message}</small>
          )}
        </div>

        <button className="reg-button" type="submit">
          Submit
        </button>
      </form>

      {submitted && (
        <div className="message">
          <p>Login successfully!🎉</p>
        </div>
      )}
    </section>
  );
};

const mapStatetoProps = (state) => ({
  sessionId: state.userReducer.sessionId,
});

export default connect(mapStatetoProps, { setUserSession })(Login);
