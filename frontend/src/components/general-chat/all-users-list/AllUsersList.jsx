import { useState, useEffect } from "react";
import DropdownMenu from "../dropdown-menu/DropdownMenu";
import style from "./AllUsersList.module.css";

export default function AllUsersList({
  userFriends,
  groupChat,
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
  const [userClicked, setUserClicked] = useState([]);
  const [showDropdownMenu, setShowDropdownMenu] = useState([]);

  useEffect(() => {
    const fillFalse = new Array(allUsers.length).fill(false);
    if (allUsers) {
      setUserAddedToGroup(fillFalse);
      setUserClicked(fillFalse);
      setShowDropdownMenu(fillFalse);
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

  const handleUserClick = ([id], index) => {
    setChatUserId([id]);
    setUserClicked((prev) => {
      const newState = prev.map(() => false);
      newState[index] = true;
      return newState;
    });
  };

  const categoryFind = (id) => {
    let category = "AllUsersList";
    if (userFriends) {
      const friend = userFriends.find((friend) => friend._id === id);
      if (friend) {
        category = "FriendsList";
      }
    }
    if (groupChat) {
      const group = groupChat.groupChat.find((group) => group._id === id);
      if (group) {
        category = group.founder ? "GroupListFounder" : "GroupList";
      }
    }
    return category;
  };

  return (
    <div>
      <h2>Users</h2>
      <div className={style.usersContainer}>
        {allUsers &&
          allUsers.map((user, index) => {
            return (
              <div
                key={user._id}
                className={style.userContainer}
                style={
                  userClicked[index]
                    ? { backgroundColor: "rgb(240, 240, 240)" }
                    : null
                }
              >
                <button
                  className={style.userButton}
                  onClick={() => handleUserClick([user._id], index)}
                  aria-label={
                    user.groupChatName
                      ? `chat with ${user.firstName} ${user.lastName}`
                      : `chat in the group ${user.groupChatName}`
                  }
                >
                  <img
                    src={
                      user.groupChatImage
                        ? user.groupChatImage.url
                        : user.profileImage.url
                    }
                    className={style.userChatImg}
                    style={
                      user.online
                        ? {
                            border: "2px solid #33cc99",
                            boxShadow: "0 0 3px 1px #33cc99",
                          }
                        : { border: "2px solid rgb(197, 197, 197)" }
                    }
                  />
                  <h2>
                    {user.groupChatName
                      ? user.groupChatName.charAt(0).toUpperCase() +
                        user.groupChatName.slice(1)
                      : user.firstName.charAt(0).toUpperCase() +
                        user.firstName.slice(1) +
                        " " +
                        user.lastName.charAt(0).toUpperCase() +
                        user.lastName.slice(1)}
                  </h2>
                </button>

                <div className={style.dropdownMenuAndUserStatusContainer}>
                  <DropdownMenu
                    component={categoryFind(user._id)}
                    index={index}
                    showDropdownMenu={showDropdownMenu}
                    setShowDropdownMenu={setShowDropdownMenu}
                    userId={user._id}
                    setError={setError}
                    setActionResult={setActionResult}
                    friendStatusChanged={friendStatusChanged}
                    setFriendStatusChanged={setFriendStatusChanged}
                  />
                  {!user.groupChatImage && (
                    <h3
                      className={style.userStatus}
                      style={
                        user.online
                          ? {
                              color: "#33cc99",
                            }
                          : { color: "rgb(197, 197, 197)" }
                      }
                    >
                      {user.online ? "online" : "offline"}
                    </h3>
                  )}
                </div>

                {showGroupChatButton && (
                  <button onClick={() => handleAddUserToGroup(user._id, index)}>
                    {userAddedToGroup[index] ? "Remove" : "Add"}
                  </button>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
