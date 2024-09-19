import { useState } from "react";
import CreateGroupChat from "../create-group-chat/CreateGroupChat";
import style from "./CategoryTopBar.module.css";

export default function CategoryTopBar({
  userFriends,
  groupChat,
  allUsers,
  setChosenCategoryName,
  setChosenCategory,
  setError,
  setActionResult,
  setActionResultError,
  showGroupChatButton,
  setShowGroupChatButton,
  statusChanged,
  setStatusChanged,
  groupChatUser,
  setGroupChatUser,
}) {
  const [selectedElement, setSelectedElement] = useState("all");
  const [showCategory, setShowCategory] = useState(true);

  const handleElementClicked = (element, category) => {
    const style = {
      color: "#078646",
      background: "#33cc9942",
    };
    if (element === category) {
      return style;
    }
  };

  const handleCategorySet = (state, category) => {
    setChosenCategory(state);
    setSelectedElement(category);
    setChosenCategoryName(category);
  };

  return (
    <div className={style.categoryTopBarContainer}>
      {showCategory && (
        <div
          className={style.categoryBtnContainer}
          aria-label="bar to choose which category of users to display "
        >
          <button
            onClick={() => handleCategorySet(allUsers, "all")}
            style={handleElementClicked(selectedElement, "all")}
          >
            All
          </button>
          <button
            onClick={() => handleCategorySet(userFriends, "friends")}
            style={handleElementClicked(selectedElement, "friends")}
          >
            Friends
          </button>
          <button
            onClick={() => handleCategorySet(groupChat, "group")}
            style={handleElementClicked(selectedElement, "group")}
          >
            Group
          </button>
        </div>
      )}
      <CreateGroupChat
        setError={setError}
        setActionResult={setActionResult}
        setActionResultError={setActionResultError}
        showCategory={showCategory}
        setShowCategory={setShowCategory}
        showGroupChatButton={showGroupChatButton}
        setShowGroupChatButton={setShowGroupChatButton}
        statusChanged={statusChanged}
        setStatusChanged={setStatusChanged}
        groupChatUser={groupChatUser}
        setGroupChatUser={setGroupChatUser}
      />
    </div>
  );
}
