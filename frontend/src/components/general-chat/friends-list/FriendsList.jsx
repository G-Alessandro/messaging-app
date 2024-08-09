import { useState } from "react";
import DropdownSvg from "/assets/svg/dropdown.svg";
import style from "./FriendsList.module.css";

export default function FriendsList({
  userFriends,
  setError,
  actionResult,
  setActionResult,
  friendStatusChanged,
  setFriendStatusChanged,
  showGroupChatButton,
  addUserGroupChat,
  setChatUserId,
}) {
  const [showDropdownMenu, setShowDropdownMenu] = useState(false);

  const removeFriend = async (friendId) => {
    try {
      const response = await fetch("http://localhost:3000/remove-friend", {
        method: "DELETE",
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
      <h2>Friends</h2>
      {actionResult && <p>{actionResult}</p>}
      {!userFriends && <p>No Friends? Make One!</p>}
      {userFriends &&
        userFriends.map((friend) => {
          return (
            <div key={friend._id}>
              <button
                onClick={() => setChatUserId([friend._id])}
                aria-label={`chat with ${friend.firstName} ${friend.lastName}`}
              >
                <div>
                  <img
                    src={friend.profileImage.url}
                    className={style.friendChatImg}
                  />
                </div>

                <h3>
                  {friend.firstName} {friend.lastName}
                </h3>
                <p className={friend.online ? "userOnline" : "userOffline"}>
                  {friend.online ? "Online" : "Offline"}
                </p>
              </button>

              <button
                aria-label="show possible actions for this user"
                onClick={() => setShowDropdownMenu(!showDropdownMenu)}
              >
                <img src={DropdownSvg} className={style.dropdownSvg} />
              </button>

              {showDropdownMenu && (
                <div>
                  <button
                    onClick={() => handleButtonClick(friend)}
                    style={{
                      visibility: showGroupChatButton ? "visible" : "hidden",
                    }}
                    aria-label="add user to group"
                  >
                    Add to group chat
                  </button>
                  <button onClick={() => removeFriend(friend._id)}>
                    Remove from friends list
                  </button>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}
