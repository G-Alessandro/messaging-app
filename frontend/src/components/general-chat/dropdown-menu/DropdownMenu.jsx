import { useState } from "react";
import DropdownSvg from "/assets/svg/dropdown.svg";
import style from "./DropdownMenu.module.css";

export default function DropdownMenu({
  component,
  userId,
  groupId,
  founder,
  setError,
  setActionResult,
  friendStatusChanged,
  setFriendStatusChanged,
}) {
  const [showDropdownMenu, setShowDropdownMenu] = useState(false);
  const [buttonActionName, setButtonActionName] = useState(null);

  const addFriend = async (userId) => {
    try {
      const response = await fetch("http://localhost:3000/add-friend", {
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
        setFriendStatusChanged(!friendStatusChanged);
        setShowDropdownMenu(false);
        setTimeout(() => setActionResult(null), 2000);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const removeFriend = async (userId) => {
    try {
      const response = await fetch("http://localhost:3000/remove-friend", {
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
        setFriendStatusChanged(!friendStatusChanged);
        setTimeout(() => setActionResult(null), 2000);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteGroup = async (groupId, founder) => {
    try {
      const response = await fetch("http://localhost:3000/delete-group", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "cors",
        body: JSON.stringify({ deletedGroupId: groupId, founder }),
      });
      const data = await response.json();
      if (!response.ok) {
        setActionResult(data.error);
      } else {
        setActionResult(data.message);
        setFriendStatusChanged(!friendStatusChanged);
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
    setShowDropdownMenu(!showDropdownMenu);
  };

  const handleButtonClick = (component, userId, groupId, founder) => {
    switch (component) {
      case "FriendsList":
        removeFriend(userId);
        break;
      case "GroupList":
      case "GroupListFounder":
        deleteGroup(groupId, founder);
        break;
      case "AllUsersList":
        addFriend(userId);
        break;
    }
    setShowDropdownMenu(false);
  };

  return (
    <div>
      <button
        aria-label="show possible actions for this user"
        onClick={() => handleDropdownClick(component)}
      >
        <img src={DropdownSvg} className={style.dropdownSvg} />
      </button>
      {showDropdownMenu && (
        <div>
          <button
            onClick={() =>
              handleButtonClick(component, userId, groupId, founder)
            }
          >
            {buttonActionName}
          </button>
        </div>
      )}
    </div>
  );
}
