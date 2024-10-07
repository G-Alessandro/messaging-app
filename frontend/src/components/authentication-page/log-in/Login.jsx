import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileSvg from "/assets/svg/profile-icon.svg";
import Checkmark from "/assets/svg/checkmark.svg";
import style from "./Login.module.css";

export default function Login({ setCreateAccount }) {
  const [logInError, setLogInError] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event, type) => {
    event.preventDefault();
    setShowLoader(true);
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
      const response = await fetch(
        `https://backend-messaging-app.fly.dev/${route}`,
        {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
          credentials: "include",
          body: body,
        }
      );

      const data = await response.json();
      if (response.ok) {
        setAuthenticated(true);
        setShowLoader(false);
        navigate("/");
      } else {
        if (data.error) {
          setLogInError(data.error);
          setShowLoader(false);
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

            {showLoader && <div className={style.loader}></div>}

            {showLoader === false && (
              <>
                <button type="submit" className={style.submitButton}>
                  Log in
                </button>
                <button
                  onClick={(event) => handleSubmit(event, "demo-account")}
                  className={style.demoAccountButton}
                >
                  <div>
                    <img src={ProfileSvg} />
                  </div>
                  Try a demo account
                </button>
              </>
            )}
          </form>
        </div>
      )}
    </>
  );
}
