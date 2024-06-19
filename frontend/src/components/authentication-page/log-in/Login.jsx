import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ setCreateAccount }) {
  const [logInError, setLogInError] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      email: event.target.email.value,
      password: event.target.password.value,
    };
    try {
      const response = await fetch("http://localhost:3000/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          mode: "cors",
        },
        body: JSON.stringify(formData),
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
      {authenticated && <p>Authentication successful</p>}
      {!authenticated && (
        <div>
          <h1>Welcome back</h1>
          <div>
            <p>New to Messaging App?</p>
            <button onClick={() => setCreateAccount((prev) => !prev)}>Create an account.</button>
          </div>
          <form onSubmit={handleSubmit}>
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

            {logInError && <p>{logInError}</p>}

            <button type="submit">Log in</button>
          </form>
          <button>
            <img src="" alt="" />
            Try a demo account
          </button>
        </div>
      )}
    </>
  );
}
