import { useState, useEffect } from "react";
import InputBar from "./input-bar/InputBar";
import style from "./ChatRoom.module.css";

export default function ChatRoom({ chatUserId, socket }) {
  const [error, setError] = useState(null);
  const [chatRoomData, setChatRoomData] = useState(null);
  // const [messageInput, setMessageInput] = useState("");
  const [userData, setUserData] = useState(null);
  const [chatRoomUserData, setChatRoomUserData] = useState(null);
  // const [previewUserImage, setPreviewUserImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const requestData = { chatUserId: chatUserId };

      try {
        const response = await fetch("http://localhost:3000/chat-room", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          mode: "cors",
          body: JSON.stringify(requestData),
        });
        const data = await response.json();
        if (!response.ok) {
          setError(data.error);
        } else {
          setChatRoomData(data.chatData);
          setUserData(data.userData);
          setChatRoomUserData(data.chatRoomUserData);

          socket.emit("join_room", {
            userId: data.userData._id,
            roomId: data.chatData._id,
          });
        }
      } catch (err) {
        setError(err.error);
      }
    };

    fetchData();

    socket.on("receive_message", (newMessage) => {
      setChatRoomData((prevChatRoomData) => {
        return {
          ...prevChatRoomData,
          messages: [...prevChatRoomData.messages, newMessage],
        };
      });
    });

    return () => {
      socket.off("receive_message");
    };
  }, [chatUserId]);

  // const handleImageSubmit = async (event) => {
  //   event.preventDefault();

  //   try {
  //     let image;

  //     if (event.target["message-image"].files[0]) {
  //       const formData = new FormData();
  //       formData.append(
  //         "message-image",
  //         event.target["message-image"].files[0]
  //       );

  //       const response = await fetch(`http://localhost:3000/chat-room-image`, {
  //         method: "POST",
  //         credentials: "include",
  //         mode: "cors",
  //         body: formData,
  //       });
  //       const data = await response.json();

  //       if (!response.ok) {
  //         setError(data.error);
  //       } else {
  //         image = data.image;
  //       }
  //     }

  //     if (messageInput.trim() !== "") {
  //       const message = {
  //         userId: userData._id,
  //         userName: `${userData.firstName} ${userData.lastName}`,
  //         timestamp: new Date(),
  //         text: messageInput,
  //         image,
  //       };
  //       socket.emit("send_message", { roomId: chatRoomData._id, message });
  //       setMessageInput("");
  //     }
  //   } catch (err) {
  //     setError(err);
  //   }
  // };

  // const handleFileChange = (event) => {
  //   const image = event.target.files[0];
  //   if (image) {
  //     const imageUrl = URL.createObjectURL(image);
  //     setPreviewUserImage(imageUrl);
  //   }
  // };

  return (
    <div>
      {!chatRoomUserData && <p>Loading messages</p>}
      <div>
        {chatRoomUserData && chatRoomUserData.length === 1 && (
          <div>
            <div>
              <img
                src={chatRoomUserData[0].profileImage.url}
                className={style.chatUserImg}
              />
            </div>
            <p>{`${chatRoomUserData[0].firstName} ${chatRoomUserData[0].lastName}`}</p>
          </div>
        )}
      </div>

      <div>
        {error && <p>{error}</p>}
        {chatRoomData &&
          chatRoomData.messages.map((message) => (
            <div key={message._id || message.timestamp}>
              <p>{message.userName}</p>
              {message.text && <p>{message.text}</p>}
              {message.image && (
                <div>
                  <img src={message.image.url} className={style.chatRoomImg} />
                </div>
              )}
              <p>{new Date(message.timestamp).toLocaleString()}</p>
            </div>
          ))}
      </div>
      <InputBar
        socket={socket}
        setError={setError}
        chatRoomData={chatRoomData}
        userData={userData}
      />

      {/* <div>
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
      </div> */}
    </div>
  );
}
