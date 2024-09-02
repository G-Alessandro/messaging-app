import { useState, useEffect } from "react";
import DropdownMenu from "../dropdown-menu/DropdownMenu";
import AddToGroupSvg from "/assets/svg/addToGroup.svg";
import RemoveToGroupSvg from "/assets/svg/removeToGroup.svg";
import style from "./UsersList.module.css";

export default function AllUsersList({
  userFriends,
  groupChat,
  chosenCategoryName,
  setChosenCategoryName,
  chosenCategory,
  setError,
  setActionResult,
  statusChanged,
  setStatusChanged,
  showGroupChatButton,
  addUserGroupChat,
  removeUserGroupChat,
  setChatUserId,
}) {
  const [userAddedToGroup, setUserAddedToGroup] = useState([]);
  const [userClicked, setUserClicked] = useState([]);
  const [showDropdownMenu, setShowDropdownMenu] = useState([]);

  useEffect(() => {
    const fillFalse = new Array(chosenCategory.length).fill(false);
    if (chosenCategory) {
      setUserAddedToGroup(fillFalse);
      setUserClicked(fillFalse);
      setShowDropdownMenu(fillFalse);
    }
  }, [chosenCategory]);

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
      const group = groupChat.find((group) => group._id === id);
      if (group) {
        category = group.founder ? "GroupListFounder" : "GroupList";
      }
    }
    return category;
  };

  return (
    <div className={style.usersContainer}>
      {chosenCategory.length === 0 && (
        <h3 className={style.noUsersContainer}>
          {chosenCategoryName === "friends"
            ? " No friends? Make one now, it's free!"
            : "No group? Make one!"}
        </h3>
      )}
      {chosenCategory &&
        chosenCategory.length > 0 &&
        chosenCategory.map((user, index) => {
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
                <div className={style.userNameStatusContainer}>
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
              </button>

              <div className={style.dropdownMenuAndUserStatusContainer}>
                <DropdownMenu
                  component={categoryFind(user._id)}
                  index={index}
                  chosenCategoryName={chosenCategoryName}
                  showDropdownMenu={showDropdownMenu}
                  setShowDropdownMenu={setShowDropdownMenu}
                  userFriends={userFriends}
                  groupChat={groupChat}
                  userId={user._id}
                  founder={user.founder}
                  setChosenCategoryName={setChosenCategoryName}
                  setError={setError}
                  setActionResult={setActionResult}
                  statusChanged={statusChanged}
                  setStatusChanged={setStatusChanged}
                />
                {showGroupChatButton && (
                  <button
                    onClick={() => handleAddUserToGroup(user._id, index)}
                    className={style.addRemoveToGroupBtn}
                    aria-label={
                      userAddedToGroup[index]
                        ? `add ${user.firstName} ${user.lastName} to group`
                        : `remove ${user.firstName} ${user.lastName} from group`
                    }
                  >
                    <img
                      src={
                        userAddedToGroup[index]
                          ? RemoveToGroupSvg
                          : AddToGroupSvg
                      }
                    />
                  </button>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
}
