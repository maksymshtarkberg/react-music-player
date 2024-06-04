import { useEffect, useState } from "react";
import "./styles.css";
import { useForm, setError } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";
import { setUserName, setUserEmail } from "../../redux/actions";
const Registration = ({ setUserName, setUserEmail }) => {
  const [submitted, setSubmitted] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    watch,
    setError,
    clearErrors,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
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
    let clearErrorsTimeout;

    if (
      errors.confirmPassword ||
      errors.email ||
      errors.password ||
      errors.username
    ) {
      clearErrorsTimeout = setTimeout(() => {
        clearErrors("confirmPassword");
        clearErrors("email");
        clearErrors("password");
        clearErrors("username");
      }, 5000);
    }

    return () => {
      clearTimeout(clearErrorsTimeout);
    };
  }, [errors, clearErrors, errors.email]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (data.password !== data.confirmPassword) {
        setError("confirmPassword", {
          type: "manual",
          message: "Passwords do not match",
        });
        return;
      }

      const apiUrl = `${process.env.REACT_APP_URL}/api/v1/auth/register`;
      const response = await axios.post(apiUrl, {
        fullName: data.username,
        email: data.email,
        password: data.password,
      });

      if (response.status === 200) {
        setValue("username", "");
        setValue("email", "");
        setValue("password", "");
        setValue("confirmPassword", "");
        localStorage.setItem("access_token", response.data.token);
        localStorage.setItem("Exp", new Date(response.data.token_expiration));

        const token = localStorage.getItem("access_token");
        console.log(response, token);

        if (token) {
          setSubmitted(true);

          setTimeout(() => {
            token && navigate("/about");
          }, 2000);
        }
      } else {
        console.error("Error during registration:", response.statusText);
      }
    } catch (error) {
      if (error.response.data.message === "User already exists") {
        setError("email", {
          type: "manual",
          message: "User already exists",
        });
      }
      console.error("Error during registration:", error);
    }
  });

  const password = watch("password");

  return (
    <section className="reg-container">
      <h1 className="reg-title">Registration</h1>

      <form onSubmit={onSubmit} className="reg-form">
        <div className="input-control">
          <label className="reg-label" htmlFor="username">
            Username
          </label>
          <div className="input-controll">
            <input
              type="text"
              placeholder="username"
              id="username"
              className={`reg-input ${errors.username && "input-error"}`}
              {...register("username", {
                required: { value: true, message: "Username is required" },
              })}
            />
            {errors.username && (
              <span className="error log-in_error">
                {errors.username.message}
              </span>
            )}
          </div>
        </div>

        <div className="input-control">
          <label htmlFor="email" className="reg-label">
            Email
          </label>
          <div className="input-controll">
            <input
              type="email"
              placeholder="info@email.com"
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
              className={`reg-input ${errors.password && "input-error"}`}
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

        <div className="input-control">
          <label htmlFor="confirmPassword" className="reg-label">
            Confirm Password
          </label>
          <div className="input-controll">
            <input
              type="password"
              placeholder="confirm password"
              id="confirmPassword"
              className={`reg-input ${errors.confirmPassword && "input-error"}`}
              {...register("confirmPassword", {
                required: {
                  value: true,
                  message: "Password confirmation is required",
                },
                minLength: {
                  value: 6,
                  message:
                    "Password confirmation must be at least 6 characters long",
                },
              })}
            />
            {errors.confirmPassword && (
              <span className="error log-in_error">
                {errors.confirmPassword.message}
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
          <p>Account created successfully!🎉</p>
        </div>
      )}
    </section>
  );
};

const mapStatetoProps = (state) => ({
  userName: state.userReducer.userName,
  email: state.userReducer.email,
});

export default connect(mapStatetoProps, { setUserName, setUserEmail })(
  Registration
);
