import { useState, useEffect } from "react";
import DropdownMenu from "../dropdown-menu/DropdownMenu";
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
  removeUserGroupChat,
  setChatUserId,
}) {
  const [userAddedToGroup, setUserAddedToGroup] = useState([]);

  useEffect(() => {
    if (userFriends) {
      setUserAddedToGroup(new Array(userFriends.length).fill(false));
    }
  }, [userFriends]);

  const handleAddUserToGroup = (id, index) => {
    if (!userAddedToGroup[index]) {
      addUserGroupChat(id);
      setUserAddedToGroup((prev) => {
        const newState = [...prev];
        newState[index] = true;
        return newState;
      });
    } else {
      removeUserGroupChat(id);
      setUserAddedToGroup((prev) => {
        const newState = [...prev];
        newState[index] = false;
        return newState;
      });
    }
  };

  return (
    <div>
      <h2>Friends</h2>
      {actionResult && <p>{actionResult}</p>}
      {!userFriends && <p>No Friends? Make One!</p>}
      {userFriends &&
        userFriends.map((friend, index) => {
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

              <DropdownMenu
                component={"FriendsList"}
                userId={friend._id}
                setError={setError}
                setActionResult={setActionResult}
                friendStatusChanged={friendStatusChanged}
                setFriendStatusChanged={setFriendStatusChanged}
              />

              {showGroupChatButton && (
                <button onClick={() => handleAddUserToGroup(friend._id, index)}>
                  {userAddedToGroup[index] ? "Remove" : "Add"}
                </button>
              )}
            </div>
          );
        })}
    </div>
  );
}
