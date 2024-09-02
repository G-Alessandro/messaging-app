import { useState } from "react";
import style from "./InputBar.module.css";

export default function InputBar({ setError, userData, socket, chatRoomData }) {
  const [messageInput, setMessageInput] = useState("");
  const [previewUserImage, setPreviewUserImage] = useState(null);

  const handleImageSubmit = async (event) => {
    event.preventDefault();

    try {
      let image;

      if (event.target["message-image"].files[0]) {
        const formData = new FormData();
        formData.append(
          "message-image",
          event.target["message-image"].files[0]
        );

        const response = await fetch(`http://localhost:3000/chat-room-image`, {
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

      if (messageInput.trim() !== "") {
        const message = {
          userId: userData._id,
          userName: `${userData.firstName} ${userData.lastName}`,
          timestamp: new Date(),
          text: messageInput,
          image,
        };
        socket.emit("send_message", { roomId: chatRoomData._id, message });
        setMessageInput("");
        setPreviewUserImage(null);
      }
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

  return (
    <div>
      {previewUserImage && (
        <div>
          <button onClick={() => setPreviewUserImage(null)}>X</button>
          <div>
            <img className={style.chatRoomImg} src={previewUserImage} />
          </div>
        </div>
      )}
      <form onSubmit={handleImageSubmit}>
        <input
          type="file"
          name="message-image"
          id="message-image"
          onChange={handleFileChange}
        />
        <input
          type="text"
          onChange={(e) => setMessageInput(e.target.value)}
          value={messageInput}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
