import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import ChatSvg from "/assets/svg/app-icon.svg";
import ProfileSvg from "/assets/svg/profile-icon.svg";
import LogoutSvg from "/assets/svg/logout.svg";
import style from "./Sidebar.module.css";

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
    <div className={style.sidebarContainer}>
      <Link to="/" className={style.qcContainer} aria-label="show all chats">
        <span className={style.qcQ}>Q</span>
        <span className={style.qcC}>C</span>
      </Link>
      <div className={style.linkContainer}>
        <Link to="/" aria-label="show all chats">
          <img src={ChatSvg} />
        </Link>
        <Link
          to="/user-profile"
          aria-label="Show your profile so you can edit it"
        >
          <img src={ProfileSvg} />
        </Link>
        <button onClick={handleLogout} aria-label="Log out of the site">
          <img src={LogoutSvg} />
        </button>
      </div>
    </div>
  );
}
