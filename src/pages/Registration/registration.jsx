import { useState } from "react";
import "./styles.css";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Registration = () => {
  const [submitted, setSubmitted] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    watch,
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

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (data.password !== data.confirmPassword) {
        console.error("Passwords do not match");
        return;
      }

      const apiUrl = "http://localhost:1337/api/v1/auth/register";
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
        const token = localStorage.getItem("access_token");
        token && setSubmitted(true);

        setTimeout(() => {
          token && navigate("/feed");
        }, 2000);
      } else {
        console.error("Error during registration:", response.statusText);
      }
    } catch (error) {
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
          <input
            type="text"
            placeholder="username"
            id="username"
            className="reg-input"
            {...register("username", {
              required: true,
            })}
          />
          {errors.username && errors.username.type === "required" && (
            <small>{errors.username.message}</small>
          )}
        </div>

        <div className="input-control">
          <label htmlFor="email" className="reg-label">
            Email
          </label>
          <input
            type="email"
            placeholder="info@email.com"
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
              minLength: 6,
            })}
          />
          {errors.password && errors.password.type === "required" && (
            <small>{errors.password.message}</small>
          )}
        </div>

        <div className="input-control">
          <label htmlFor="confirmPassword" className="reg-label">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="confirm password"
            id="confirmPassword"
            className="reg-input"
            {...register("confirmPassword", {
              required: true,
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
          />
          {errors.confirmPassword && (
            <small>{errors.confirmPassword.message}</small>
          )}
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

export default Registration;
