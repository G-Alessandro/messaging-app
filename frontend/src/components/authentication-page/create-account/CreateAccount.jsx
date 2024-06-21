import { useState } from "react";

export default function CreateAccount({ setCreateAccount }) {
  const [registrationCompleted, setRegistrationCompleted] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setEmailError(false);
    setConfirmPasswordError(false);
    const formData = {
      firstName: event.target["first-name"].value,
      lastName: event.target["last-name"].value,
      email: event.target.email.value,
      password: event.target.password.value,
      confirmPassword: event.target["confirm-password"].value,
    };

    try {
      const response = await fetch("http://localhost:3000/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          mode: "cors",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok && !data.error) {
        setRegistrationCompleted(true);
        setTimeout(() => setCreateAccount((prev) => !prev), 2000);
      } else {
        if (data.error) {
          data.error.forEach((error) => {
            if (error === "email is already in use") {
              setEmailError(true);
            } else if (error === "passwords do not match") {
              setConfirmPasswordError(true);
            }
          });
        }
      }
    } catch (error) {
      console.log("Error requesting registration:", error);
    }
  };
  return (
    <>
      {registrationCompleted && (
        <div>
          <p>Registration was successful</p>
        </div>
      )}
      {!registrationCompleted && (
        <div>
          <h1>Sign Up</h1>
          <div>
            <p>Already have an account?</p>
            <button onClick={() => setCreateAccount((prev) => !prev)}>
              Login.
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <label htmlFor="first-name">First Name</label>
            <input
              type="text"
              id="first-name"
              name="first-name"
              minLength={1}
              maxLength={30}
              placeholder="Enter your email"
              required
            />

            <label htmlFor="last-name">Last Name</label>
            <input
              type="text"
              id="last-name"
              name="last-name"
              minLength={1}
              maxLength={30}
              placeholder="Enter your email"
              required
            />

            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              minLength={1}
              placeholder="Enter your email"
              required
            />
            {emailError && <p>the email is already in use</p>}

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              minLength={8}
              placeholder="Enter your password"
              required
            />

            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              minLength={8}
              placeholder="Enter your password"
              required
            />
            {confirmPasswordError && <p>passwords must match</p>}

            <button type="submit">Sign up</button>
          </form>
        </div>
      )}
    </>
  );
}
