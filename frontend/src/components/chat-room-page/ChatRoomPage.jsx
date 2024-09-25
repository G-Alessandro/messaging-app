import { useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { SocketContext } from "../../main.jsx";
import TopBar from "../home-page/category-top-bar/CategoryTopBar";
import ChatContainer from "../home-page/chat-room/chat-container/ChatContainer";
import InputBar from "../home-page/chat-room/input-bar/InputBar";
import style from "./ChatRoomPage.module.css";

export default function ChatRoom() {
  const location = useLocation();
  const { chatUserId } = location.state;
  const { socket } = useContext(SocketContext);
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
