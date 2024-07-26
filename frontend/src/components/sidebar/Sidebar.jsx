import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  useEffect(() => {
    const authenticationCheck = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/authentication-check",
          {
            method: "GET",
            credentials: "include",
            mode: "cors",
          }
        );

        const data = await response.json();
        if (!data.authenticated) {
          navigate("/authentication-page");
        }
      } catch (error) {
        console.log("Error checking authentication:", error);
        navigate("/authentication-page");
      }
    };
    authenticationCheck();
  }, []);

  const handleLogout = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/logout", {
        method: "GET",
        credentials: "include",
        mode: "cors",
      });

      const data = await response.json();

      if (response.ok) {
        setTimeout(() => navigate("/authentication-page"), 2000);
      } else {
        console.error("Logout error:", data);
      }
    } catch (error) {
      console.log("Error requesting registration:", error);
    }
  };

  return (
    <div>
      <div>
        <Link to="/">
          <img src="" alt="" />
          General Chat
        </Link>
        <Link to="/group-chat">
          <img src="" alt="" />
          Group Chat
        </Link>
        <Link to="/user-profile">
          <img src="" alt="" />
          User profile
        </Link>
      </div>
      <button onClick={handleLogout}>
        <img src="" alt="" />
        Logout
      </button>
    </div>
  );
}
