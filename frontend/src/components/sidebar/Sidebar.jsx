import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import ChatSvg from "/assets/svg/app-icon.svg";
import ProfileSvg from "/assets/svg/profile-icon.svg";
import LogoutSvg from "/assets/svg/logout.svg";
import style from "./Sidebar.module.css";

export default function Sidebar() {
  const [selectedElement, setSelectedElement] = useState("chat");
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
    setSelectedElement("logout");
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
    <div className={style.sidebarContainer}>
      <Link
        to="/"
        className={style.qcContainer}
        aria-label="show all chats"
        onClick={() => setSelectedElement("chat")}
      >
        <span className={style.qcQ}>Q</span>
        <span className={style.qcC}>C</span>
      </Link>
      <div className={style.linkContainer}>
        <Link
          to="/"
          aria-label="show all chats"
          onClick={() => setSelectedElement("chat")}
          style={elementClickedStyle(selectedElement,"chat")
          }
        >
          <img src={ChatSvg} />
        </Link>
        <Link
          to="/user-profile"
          aria-label="Show your profile so you can edit it"
          onClick={() => setSelectedElement("profile")}
          style={elementClickedStyle(selectedElement,"profile")
          }
        >
          <img src={ProfileSvg} />
        </Link>
        <button
          onClick={handleLogout}
          aria-label="Log out of the site"
          style={elementClickedStyle(selectedElement,"logout")
          }
        >
          <img src={LogoutSvg} />
        </button>
      </div>
    </div>
  );
}
