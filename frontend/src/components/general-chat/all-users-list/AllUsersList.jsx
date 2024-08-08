import { useState } from "react";
import DropdownSvg from "/assets/svg/dropdown.svg";
import style from "./AllUsersList.module.css";

export default function AllUsersList({
  allUsers,
  setError,
  setActionResult,
  friendStatusChanged,
  setFriendStatusChanged,
  showGroupChatButton,
  addUserGroupChat,
  setChatUserId,
}) {
  const [showDropdownMenu, setShowDropdownMenu] = useState(false);

  const addFriend = async (friendId) => {
    try {
      const response = await fetch("http://localhost:3000/add-friend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "cors",
        body: JSON.stringify({ friendId }),
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

  const handleButtonClick = (user) => {
    addUserGroupChat(user._id);
    setShowDropdownMenu(false);
  };

  return (
    <div>
      <p>All Users</p>
      {allUsers &&
        allUsers.map((user) => {
          return (
            <div key={user._id}>
              <button
                onClick={() => setChatUserId([user._id])}
                aria-label={`chat with ${user.firstName} ${user.lastName}`}
              >
                <div>
                  <img
                    src={user.profileImage.url}
                    className={style.userChatImg}
                  />
                </div>
                <p>
                  {user.firstName} {user.lastName}
                </p>
                <p className={user.online ? "userOnline" : "userOffline"}>
                  {user.online ? "Online" : "Offline"}
                </p>
              </button>

              <button
                aria-label="show possible actions for this user"
                onClick={() => setShowDropdownMenu(!showDropdownMenu)}
              >
                <img src={DropdownSvg} className={style.dropdownSvg}/>
              </button>

              {showDropdownMenu && (
                <div>
                  <button
                    onClick={() => handleButtonClick(user)}
                    style={{
                      visibility: showGroupChatButton ? "visible" : "hidden",
                    }}
                    aria-label="add user to group"
                  >
                    Add to group chat
                  </button>
                  <button
                    onClick={() => addFriend(user._id)}
                    aria-label="add user to friends"
                  >Add to friends</button>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}
