import { useState } from "react";
import style from "./CategoryTopBar.module.css";

export default function CategoryTopBar({
  userFriends,
  groupChat,
  allUsers,
  setChosenCategory,
}) {
  const [selectedElement, setSelectedElement] = useState("all");

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
  };

  return (
    <div className={style.categoryTopBarContainer}>
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
  );
}
