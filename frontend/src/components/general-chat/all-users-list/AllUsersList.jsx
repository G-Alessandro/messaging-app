import { useState, useEffect } from "react";
import DropdownMenu from "../dropdown-menu/DropdownMenu";
import style from "./AllUsersList.module.css";

export default function AllUsersList({
  allUsers,
  setError,
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
    if (allUsers) {
      setUserAddedToGroup(new Array(allUsers.length).fill(false));
    }
  }, [allUsers]);

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
      <h2>All Users</h2>
      {allUsers &&
        allUsers.map((user, index) => {
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
                <h3>
                  {user.firstName} {user.lastName}
                </h3>
                <p className={user.online ? "userOnline" : "userOffline"}>
                  {user.online ? "Online" : "Offline"}
                </p>
              </button>

              <DropdownMenu
                component={"AllUsersList"}
                userId={user._id}
                setError={setError}
                setActionResult={setActionResult}
                friendStatusChanged={friendStatusChanged}
                setFriendStatusChanged={setFriendStatusChanged}
              />

              {showGroupChatButton && (
                <button onClick={() => handleAddUserToGroup(user._id, index)}>
                  {userAddedToGroup[index] ? "Remove" : "Add"}
                </button>
              )}
            </div>
          );
        })}
    </div>
  );
}
