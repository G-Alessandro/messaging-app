import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserIdContext } from "../../main.jsx";
import { SocketContext } from "../../main.jsx";
import ChatSvg from "/assets/svg/app-icon.svg";
import ProfileSvg from "/assets/svg/profile-icon.svg";
import LogoutSvg from "/assets/svg/logout.svg";
import style from "./Sidebar.module.css";

export default function Sidebar({ selectedPage }) {
  const { setUserId } = useContext(UserIdContext);
  const { setSocket } = useContext(SocketContext);
  const [selectedElement, setSelectedElement] = useState("chat");
  const [showLoader, setShowLoader] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setSelectedElement(selectedPage);
    const authenticationCheck = async () => {
      try {
        const response = await fetch(
          "https://backend-messaging-app.fly.dev/authentication-check",
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
    setSelectedElement("logout");
    setShowLoader(true);
    try {
      const response = await fetch(
        "https://backend-messaging-app.fly.dev/logout",
        {
          method: "GET",
          credentials: "include",
          mode: "cors",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSocket(null);
        setShowLoader(false);
        setUserId(null);
        navigate("/authentication-page");
      } else {
        console.error("Logout error:", data);
      }
    } catch (error) {
      console.log("Error requesting registration:", error);
    }
  };

  const elementClickedStyle = (element, link) => {
    const style = {
      borderLeft: "5px solid #33cc99",
      background: "linear-gradient(to right, #33cc9942, rgba(0, 128, 255, 0))",
    };
    if (element === link) {
      return style;
    }
  };

  return (
    <nav aria-label="Main navigation" className={style.sidebarContainer}>
      <Link to="/" className={style.qcContainer} aria-label="show all chats">
        <span className={style.qcQ}>Q</span>
        <span className={style.qcC}>C</span>
      </Link>
      <div className={style.linkContainer}>
        <Link
          to="/"
          aria-label="show all chats"
          style={elementClickedStyle(selectedElement, "chat")}
        >
          <img src={ChatSvg} />
        </Link>
        <Link
          to="/user-profile"
          aria-label="Show your profile so you can edit it"
          style={elementClickedStyle(selectedElement, "profile")}
        >
          <img src={ProfileSvg} />
        </Link>
        {showLoader && <div className={style.loader}></div>}
        {showLoader === false && (
          <button
            onClick={handleLogout}
            aria-label="Log out of the site"
            style={elementClickedStyle(selectedElement, "logout")}
          >
            <img src={LogoutSvg} />
          </button>
        )}
      </div>
    </nav>
  );
}
