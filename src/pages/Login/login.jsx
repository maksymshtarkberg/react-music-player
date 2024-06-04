import { useForm, setError } from "react-hook-form";
import "../Registration/styles.css";
import { useEffect, useState } from "react";
import { decodeToken } from "react-jwt";

import { connect } from "react-redux";
import { setUserSession, setUserName, setUserEmail } from "../../redux/actions";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const Login = ({ setUserSession, setUserName, setUserEmail }) => {
  const [submitted, setSubmitted] = useState(false);
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
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      navigate("/about");
    }
  }, []);

  useEffect(() => {
    if (errors.email || errors.password) {
      setTimeout(() => {
        clearErrors("email");
        clearErrors("password");
      }, 7000);
    }
  }, [errors, clearErrors]);

  const onSubmit = handleSubmit(async (data) => {
    if (!data.email || !data.password) {
      return;
    }
    try {
      const apiUrl = `${process.env.REACT_APP_URL}/api/v1/auth/login`;
      const response = await axios.post(apiUrl, {
        email: data.email,
        password: data.password,
      });

      if (response.status === 200 && response.data.status === "success") {
        setValue("email", "");
        setValue("password", "");

        localStorage.setItem("access_token", response.data.token);
        localStorage.setItem("Exp", new Date(response.data.token_expiration));
        const token = localStorage.getItem("access_token");

        if (token) {
          setSubmitted(true);
          setUserName(response.data.username);
          setUserEmail(response.data.email);
          setTimeout(() => {
            token && navigate("/about");
          }, 2000);
        }
      } else {
        console.error("Error during login:", response.statusText);
      }
    } catch (error) {
      console.log(error, error.response.status);
      if (error.response.status === 400) {
        setValue("email", "");
        setValue("password", "");
        setError("password", {
          type: "manual",
          message: "Invalid login or password",
        });
        setError("email", true);

        setSubmitted(false);
      }

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
          <div className="input-controll">
            <input
              type="text"
              placeholder="email"
              id="email"
              className={`reg-input ${errors.email && "input-error"}`}
              {...register("email", {
                required: { value: true, message: "Email is required" },
              })}
            />
            {errors.email && (
              <span className="error log-in_error">{errors.email.message}</span>
            )}
          </div>
        </div>

        <div className="input-control">
          <label htmlFor="password" className="reg-label">
            Password
          </label>
          <div className="input-controll">
            <input
              type="password"
              placeholder="password"
              id="password"
              className={`reg-input ${errors.password && "input-error "}`}
              {...register("password", {
                required: { value: true, message: "Password is required" },
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              })}
            />
            {errors.password && (
              <span className="error log-in_error">
                {errors.password.message}
              </span>
            )}
          </div>
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

export default connect(mapStatetoProps, {
  setUserSession,
  setUserName,
  setUserEmail,
})(Login);
