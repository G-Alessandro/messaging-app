import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Sidebar({
  setShowUserProfile,
  setShowGeneralChat,
  setShowGroupChat,
}) {
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

  const handleClick = (componentToShow) => {
    const setShowStates = [
      setShowUserProfile,
      setShowGeneralChat,
      setShowGroupChat,
    ];

    setShowStates.forEach((setState) => {
      setState(setState === componentToShow);
    });
  };

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
        <button onClick={() => handleClick(setShowUserProfile)}>
          <img src="" alt="" />
          User
        </button>
        <button onClick={() => handleClick(setShowGeneralChat)}>
          <img src="" alt="" />
          General Chat
        </button>
        <button onClick={() => handleClick(setShowGroupChat)}>
          <img src="" alt="" />
          Group Chat
        </button>
      </div>
      <button onClick={handleLogout}>
        <img src="" alt="" />
        Logout
      </button>
    </div>
  );
}
