import { useState } from "react";
import DefaultUserSVG from "/assets/svg/default-user-image.svg";
import style from "./CreateGroupChat.module.css";
export default function CreateGroupChat({
  setError,
  setActionResult,
  showGroupChatButton,
  setShowGroupChatButton,
  friendStatusChanged,
  setFriendStatusChanged,
  groupChatUser,
}) {
  const [previewGroupImage, setPreviewGroupImage] = useState(null);

  const createGroupChat = async (event) => {
    event.preventDefault();

    if (groupChatUser.length < 1) {
      setActionResult(
        "You must select at least one person to create a group chat!"
      );
      setTimeout(() => setActionResult(null), 2000);
      return;
    }

    const imageData = event.target["group-image"].files[0];

    const formData = new FormData();
    formData.append("groupChatName", event.target["group-chat-name"].value);
    formData.append("groupChatUsers", JSON.stringify(groupChatUser));

    if (imageData) {
      formData.append("group-image", event.target["group-image"].files[0]);
    }

    try {
      const response = await fetch("http://localhost:3000/create-group-chat", {
        method: "POST",
        credentials: "include",
        mode: "cors",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        setActionResult(data.error);
      } else {
        setActionResult(data.message);
        setShowGroupChatButton(false);
        setFriendStatusChanged(!friendStatusChanged);
        setTimeout(() => setActionResult(null), 2000);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFileChange = (event) => {
    const image = event.target.files[0];
    if (image) {
      const imageUrl = URL.createObjectURL(image);
      setPreviewGroupImage(imageUrl);
    }
  };

  return (
    <>
      <button
        style={{
          visibility: showGroupChatButton ? "hidden" : "visible",
        }}
        onClick={() => setShowGroupChatButton(true)}
      >
        Create group
      </button>

      {showGroupChatButton && (
        <form onSubmit={createGroupChat}>
          <img
            src={previewGroupImage ? previewGroupImage : DefaultUserSVG}
            className={style.groupChatImg}
          />
          <label htmlFor="group-chat-name">Group Chat Name</label>
          <input
            type="text"
            id="group-chat-name"
            name="group-chat-name"
            minLength={1}
            maxLength={30}
            required
          />

          <input
            type="file"
            name="group-image"
            id="group-image"
            onChange={handleFileChange}
          />

          <button type="submit">Done</button>
          <button type="button" onClick={() => setShowGroupChatButton(false)}>
            Cancel
          </button>
        </form>
      )}
    </>
  );
}
