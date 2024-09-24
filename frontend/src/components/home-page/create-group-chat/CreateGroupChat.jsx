import { useState, useEffect, useRef } from "react";
import DefaultUserSVG from "/assets/svg/default-user-image.svg";
import DropdownSvg from "/assets/svg/dropdown-02.svg";
import CameraSvg from "/assets/svg/camera.svg";
import CancelSvg from "/assets/svg/cancel.svg";
import style from "./CreateGroupChat.module.css";

export default function CreateGroupChat({
  setError,
  setActionResult,
  setActionResultError,
  showCategory,
  setShowCategory,
  showGroupChatButton,
  setShowGroupChatButton,
  statusChanged,
  setStatusChanged,
  groupChatUser,
  setGroupChatUser,
}) {
  const [previewGroupImage, setPreviewGroupImage] = useState(null);
  const [showDropdownMenu, setShowDropdownMenu] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest(`.${style.createGroupBtnDropdown}`)) {
        setShowDropdownMenu(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const createGroupChat = async (event) => {
    event.preventDefault();

    if (groupChatUser.length < 1) {
      setActionResultError(
        "You must select at least one person to create a group chat!"
      );
      setTimeout(() => setActionResultError(null), 2000);
      return;
    }
    setIsSubmitting(true);

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
        setShowCategory(true);
        setIsSubmitting(false);
        fileInputRef.current.value = null;
        setGroupChatUser([]);
        setActionResult(data.message);
        setShowGroupChatButton(false);
        setStatusChanged(!statusChanged);
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

  const handleButtonClick = () => {
    setShowGroupChatButton(true);
    setShowDropdownMenu(false);
    setShowCategory(false);
  };

  const handleFormCancel = () => {
    fileInputRef.current.value = null;
    setGroupChatUser(null);
    setPreviewGroupImage(null);
    setShowGroupChatButton(false);
    setShowCategory(true);
  };

  return (
    <div className={style.createGroupContainer}>
      {showCategory && (
        <button
          className={style.createGroupBtnDropdown}
          onClick={() => setShowDropdownMenu(!showDropdownMenu)}
          aria-label="shows the various options regarding chat management"
        >
          <img src={DropdownSvg} />
        </button>
      )}

      {showDropdownMenu && (
        <div className={style.createGroupBtnContainer}>
          <button onClick={() => handleButtonClick()}>Create group</button>
        </div>
      )}

      {showGroupChatButton && (
        <form className={style.createGroupForm} onSubmit={createGroupChat}>
          <div className={style.inputFileContainer}>
            <img
              src={previewGroupImage ? previewGroupImage : DefaultUserSVG}
              className={style.groupChatImg}
            />

            <label
              htmlFor="group-image"
              className={style.groupInputFileLabel}
              aria-label="change group image"
            >
              <img src={CameraSvg} />
            </label>

            <input
              type="file"
              name="group-image"
              id="group-image"
              ref={fileInputRef}
              className={style.groupInputFile}
              onChange={handleFileChange}
            />
          </div>

          <div className={style.inputGroupNameContainer}>
            <label
              htmlFor="group-chat-name"
              aria-label="Choose a name for the group"
            ></label>
            <input
              type="text"
              id="group-chat-name"
              name="group-chat-name"
              placeholder="Group name"
              minLength={1}
              maxLength={30}
              required
            />
            <button
              type="submit"
              className={style.doneBtn}
              disabled={isSubmitting}
            >
              Done
            </button>
          </div>

          <button
            type="button"
            aria-label="cancel"
            className={style.cancelBtn}
            onClick={() => handleFormCancel()}
          >
            <img src={CancelSvg} />
          </button>
        </form>
      )}
    </div>
  );
}
