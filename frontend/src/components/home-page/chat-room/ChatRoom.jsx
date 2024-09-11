import { useState, useEffect } from "react";
import InputBar from "./input-bar/InputBar";
import style from "./ChatRoom.module.css";

export default function ChatRoom({ chatUserId, socket }) {
  const [error, setError] = useState(null);
  const [chatRoomData, setChatRoomData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [chatRoomUserData, setChatRoomUserData] = useState(null);
  const [chatRoomGroupData, setChatRoomGroupData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const requestData = {
        chatUserId: chatUserId,
      };

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
          setChatRoomGroupData(data.chatRoomGroupData);

          console.log("chatRoomUserData", data.chatRoomUserData);
          console.log("chatRoomGroupData", data.chatRoomGroupData);

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

  return (
    <div>
      {!chatRoomUserData && <p>Loading messages</p>}
      <div>
        {chatRoomUserData && (
          <div>
            <div>
              <img
                src={
                  chatRoomGroupData === undefined
                    ? chatRoomUserData[0].profileImage.url
                    : chatRoomGroupData.groupChatImage.url
                }
                className={style.chatUserImg}
              />
            </div>
            <h3>
              {chatRoomGroupData === undefined
                ? `${chatRoomUserData[0].firstName} ${chatRoomUserData[0].lastName}`
                : chatRoomGroupData.groupChatName}
            </h3>
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
    </div>
  );
}
