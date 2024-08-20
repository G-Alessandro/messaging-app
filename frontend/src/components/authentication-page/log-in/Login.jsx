import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileIcon from "/assets/svg/profile-icon.svg";
import Checkmark from "/assets/svg/checkmark.svg";
import style from "./Login.module.css";

export default function Login({ setCreateAccount }) {
  const [logInError, setLogInError] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event, type) => {
    event.preventDefault();
    const route = type === "sign-in" ? "sign-in" : "demo-account";
    const method = type === "sign-in" ? "POST" : "GET";
    const body =
      type === "sign-in"
        ? JSON.stringify({
            email: event.target.email.value,
            password: event.target.password.value,
          })
        : undefined;

    try {
      const response = await fetch(`http://localhost:3000/${route}`, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "include",
        body: body,
      });

      const data = await response.json();
      if (response.ok) {
        setAuthenticated(true);
        setTimeout(() => navigate("/"), 2000);
      } else {
        if (data.error) {
          setLogInError(data.error);
        }
      }
    } catch (error) {
      console.log("Error during login:", error);
    }
  };

  return (
    <>
      {authenticated && (
        <div className={style.authenticationSuccessfulContainer}>
          <h1>Authentication successful</h1>
          <img src={Checkmark} />
        </div>
      )}
      {!authenticated && (
        <div className={style.loginContainer}>
          <h2>Welcome back</h2>
          <div className={style.createAccountButtonContainer}>
            <h3>New to QuickChat?</h3>
            <button
              onClick={() => setCreateAccount((prev) => !prev)}
              aria-label="Click to view the fields to fill in to create an account"
            >
              Create an account
            </button>
          </div>
          <form onSubmit={(event) => handleSubmit(event, "sign-in")}>
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Enter your email"
              required
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              required
            />

            {logInError && <p className={style.logInError}>{logInError}</p>}

            <button type="submit" className={style.submitButton}>
              Log in
            </button>
            <button
              onClick={(event) => handleSubmit(event, "demo-account")}
              className={style.demoAccountButton}
            >
              <div>
                <img src={ProfileIcon} />
              </div>
              Try a demo account
            </button>
          </form>
        </div>
      )}
    </>
  );
}
