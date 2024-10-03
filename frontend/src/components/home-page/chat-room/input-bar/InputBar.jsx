import { useState } from "react";
import CancelSvg from "/assets/svg/cancel.svg";
import PictureSvg from "/assets/svg/picture.svg";
import PaperPlaneSvg from "/assets/svg/paper-plane.svg";
import style from "./InputBar.module.css";

export default function InputBar({ setError, userData, socket, chatRoomData }) {
  const [messageInput, setMessageInput] = useState("");
  const [previewUserImage, setPreviewUserImage] = useState(null);
  const [showLoader, setShowLoader] = useState(false);

  const handleImageSubmit = async (event) => {
    event.preventDefault();
    setShowLoader(true);
    try {
      let image;

      if (event.target["message-image"].files[0]) {
        const formData = new FormData();
        formData.append(
          "message-image",
          event.target["message-image"].files[0]
        );

        const response = await fetch(`https://backend-messaging-app.fly.dev/chat-room-image`, {
          method: "POST",
          credentials: "include",
          mode: "cors",
          body: formData,
        });
        const data = await response.json();

        if (!response.ok) {
          setError(data.error);
        } else {
          image = data.image;
        }
      }

      if (
        messageInput.trim() !== "" ||
        event.target["message-image"].files[0]
      ) {
        const message = {
          userId: userData._id,
          userName: `${userData.firstName} ${userData.lastName}`,
          timestamp: new Date(),
          text: messageInput,
          image,
        };
        socket.emit("send_message", { roomId: chatRoomData._id, message });
        const fileInput = document.getElementById("message-image");
        fileInput.value = "";
        setMessageInput("");
        setPreviewUserImage(null);
      }

      setShowLoader(false);
    } catch (err) {
      setError(err);
    }
  };

  const handleFileChange = (event) => {
    const image = event.target.files[0];
    if (image) {
      const imageUrl = URL.createObjectURL(image);
      setPreviewUserImage(imageUrl);
    }
  };

  const handleCancelPreview = () => {
    setPreviewUserImage(null);
    const fileInput = document.getElementById("message-image");
    fileInput.value = "";
  };

  return (
    <div className={style.inputBarContainer}>
      {previewUserImage && (
        <div className={style.inputBarImagePreviewContainer}>
          <img className={style.chatRoomImg} src={previewUserImage} />
          <button onClick={() => handleCancelPreview()}>
            <img src={CancelSvg} />
          </button>
        </div>
      )}
      <form onSubmit={handleImageSubmit}>
        <label
          htmlFor="message-image"
          className={style.messageImageLabel}
          aria-label="attach or send an image along with the message"
        >
          <img src={PictureSvg} />
        </label>
        <input
          type="file"
          name="message-image"
          id="message-image"
          className={style.messageImageInputFile}
          onChange={handleFileChange}
        />
        <input
          type="text"
          onChange={(e) => setMessageInput(e.target.value)}
          className={style.messageImageInputText}
          value={messageInput}
          placeholder="Type your message..."
        />
        {showLoader && <div className={style.loader}></div>}
        {showLoader === false && (
          <button type="submit" aria-label="send message">
            <img src={PaperPlaneSvg} />
          </button>
        )}
      </form>
    </div>
  );
}
