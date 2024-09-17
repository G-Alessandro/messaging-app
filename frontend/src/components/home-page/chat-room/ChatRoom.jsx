import { useState, useEffect } from "react";
import TopBar from "./top-bar/TopBar";
import ChatContainer from "./chat-container/ChatContainer";
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
    <div className={style.chatRoomContainer}>
      <TopBar
        chatRoomUserData={chatRoomUserData}
        chatRoomGroupData={chatRoomGroupData}
      />
      <ChatContainer
        error={error}
        userData={userData}
        chatRoomUserData={chatRoomUserData}
        chatRoomData={chatRoomData}
        chatRoomGroupData={chatRoomGroupData}
      />
      <InputBar
        socket={socket}
        setError={setError}
        chatRoomData={chatRoomData}
        userData={userData}
      />
    </div>
  );
}
