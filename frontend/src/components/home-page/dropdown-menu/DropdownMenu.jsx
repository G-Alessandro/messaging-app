import { useState, useEffect } from "react";
import DropdownSvg from "/assets/svg/dropdown-01.svg";
import style from "./DropdownMenu.module.css";

export default function DropdownMenu({
  component,
  index,
  showDropdownMenu,
  setShowDropdownMenu,
  chosenCategoryName,
  userId,
  founder,
  setChosenCategoryName,
  setError,
  setActionResult,
  statusChanged,
  setStatusChanged,
}) {
  const [buttonActionName, setButtonActionName] = useState(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest(".dropdownMenu")) {
        setShowDropdownMenu((prev) => {
          const newState = prev.map(() => false);
          return newState;
        });
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const addFriend = async (userId) => {
    try {
      const response = await fetch("https://backend-messaging-app.fly.dev/add-friend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "cors",
        body: JSON.stringify({ friendId: userId }),
      });
      const data = await response.json();
      if (!response.ok) {
        setActionResult(data.error);
      } else {
        setActionResult(data.message);
        setStatusChanged(!statusChanged);
        setShowDropdownMenu(false);
        setTimeout(() => setActionResult(null), 2000);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const removeFriend = async (userId) => {
    try {
      const response = await fetch("https://backend-messaging-app.fly.dev/remove-friend", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "cors",
        body: JSON.stringify({ removedFriendId: userId }),
      });
      const data = await response.json();
      if (!response.ok) {
        setActionResult(data.error);
      } else {
        setActionResult(data.message);
        setChosenCategoryName("friends");
        setStatusChanged(!statusChanged);
        setTimeout(() => setActionResult(null), 2000);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteGroup = async (userId, founder) => {
    try {
      const response = await fetch("https://backend-messaging-app.fly.dev/delete-group", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "cors",
        body: JSON.stringify({ deletedGroupId: userId, founder }),
      });
      const data = await response.json();
      if (!response.ok) {
        setActionResult(data.error);
      } else {
        setActionResult(data.message);
        setChosenCategoryName(chosenCategoryName);
        setStatusChanged(!statusChanged);
        setTimeout(() => setActionResult(null), 2000);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDropdownClick = (component) => {
    switch (component) {
      case "FriendsList":
        setButtonActionName("Remove from friends");
        break;
      case "GroupList":
        setButtonActionName("Leave the group");
        break;
      case "GroupListFounder":
        setButtonActionName("Delete group");
        break;
      case "AllUsersList":
        setButtonActionName("Add to friends");
        break;
    }

    if (showDropdownMenu[index]) {
      setShowDropdownMenu((prev) => {
        const newState = prev.map(() => false);
        return newState;
      });
    } else {
      setShowDropdownMenu((prev) => {
        const newState = prev.map(() => false);
        newState[index] = true;
        return newState;
      });
    }
  };

  const handleButtonClick = (component, userId, founder) => {
    switch (component) {
      case "FriendsList":
        removeFriend(userId);
        break;
      case "GroupList":
      case "GroupListFounder":
        deleteGroup(userId, founder);
        break;
      case "AllUsersList":
        addFriend(userId);
        break;
    }
    setShowDropdownMenu((prev) => {
      const newState = prev.map(() => false);
      return newState;
    });
  };

  return (
    <div className={style.dropdownContainer}>
      <button
        className="dropdownMenu"
        aria-label="show possible actions for this user"
        onClick={() => handleDropdownClick(component)}
      >
        <img src={DropdownSvg} className={style.dropdownSvg} />
      </button>
      {showDropdownMenu && showDropdownMenu[index] && (
        <div className={style.dropdownOptionContainer}>
          <button onClick={() => handleButtonClick(component, userId, founder)}>
            {buttonActionName}
          </button>
        </div>
      )}
    </div>
  );
}
