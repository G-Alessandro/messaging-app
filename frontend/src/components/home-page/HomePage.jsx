import { useState, useEffect } from "react";
import io from "socket.io-client";
import Sidebar from "../sidebar/Sidebar";
import CategoryTopBar from "./category-top-bar/CategoryTopBar";
import UsersList from "./users-list/UsersList";
import ChatRoom from "./chat-room/ChatRoom";
import style from "./HomePage.module.css";

const socket = io("http://localhost:4000");

export default function GeneralChat() {
  const [userId, setUserId] = useState(null);
  const [userFriends, setUserFriends] = useState([]);
  const [groupChat, setGroupChat] = useState([]);
  const [allUsers, setAllUsers] = useState(null);
  const [chosenCategoryName, setChosenCategoryName] = useState("all");
  const [chosenCategory, setChosenCategory] = useState(null);
  const [error, setError] = useState(null);
  const [actionResult, setActionResult] = useState(null);
  const [statusChanged, setStatusChanged] = useState(false);
  const [showGroupChatButton, setShowGroupChatButton] = useState(false);
  const [groupChatUser, setGroupChatUser] = useState([]);
  const [chatUserId, setChatUserId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/general-chat", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          mode: "cors",
        });

        const data = await response.json();
        if (!response.ok) {
          setError(data.error);
        } else {
          setUserId(data.userId);
          setUserFriends(data.userFriends);
          setGroupChat(data.groupChat);
          setAllUsers(data.allUsers);
          switch (chosenCategoryName) {
            case "all":
              setChosenCategory(data.allUsers);
              break;
            case "friends":
              setChosenCategory(data.userFriends);
              break;
            case "group":
              setChosenCategory(data.groupChat);
              break;
          }
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, [statusChanged]);

  useEffect(() => {
    if (userId) {
      socket.emit("user_connected", { userId });

      const handleDisconnect = () => {
        socket.emit("user_disconnected", { userId });
      };

      window.addEventListener("beforeunload", handleDisconnect);

      return () => {
        handleDisconnect();
        window.removeEventListener("beforeunload", handleDisconnect);
        socket.disconnect();
      };
    }
  }, [userId]);

  const addUserGroupChat = (id) => {
    setGroupChatUser((prev) => {
      const result = [...prev, id];
      return result;
    });
  };

  const removeUserGroupChat = (id) => {
    setGroupChatUser((prev) => {
      const result = prev.filter((arrayId) => arrayId !== id);
      return result;
    });
  };

  return (
    <div className={style.homePageContainer}>
      <Sidebar />
      <div>
        {error && <p>{error}</p>}
        {!allUsers && !error && <p>Loading...</p>}
        {allUsers && !error && (
          <div className={style.container}>

            <CategoryTopBar
              userFriends={userFriends}
              groupChat={groupChat}
              allUsers={allUsers}
              setChosenCategoryName={setChosenCategoryName}
              setChosenCategory={setChosenCategory}
              setError={setError}
              setActionResult={setActionResult}
              showGroupChatButton={showGroupChatButton}
              setShowGroupChatButton={setShowGroupChatButton}
              statusChanged={statusChanged}
              setStatusChanged={setStatusChanged}
              groupChatUser={groupChatUser}
            />

            <UsersList
              userFriends={userFriends}
              groupChat={groupChat}
              chosenCategoryName={chosenCategoryName}
              setChosenCategoryName={setChosenCategoryName}
              chosenCategory={chosenCategory}
              setError={setError}
              setActionResult={setActionResult}
              statusChanged={statusChanged}
              setStatusChanged={setStatusChanged}
              showGroupChatButton={showGroupChatButton}
              addUserGroupChat={addUserGroupChat}
              removeUserGroupChat={removeUserGroupChat}
              setChatUserId={setChatUserId}
            />
          </div>
        )}
      </div>
      {chatUserId && <ChatRoom socket={socket} chatUserId={chatUserId} />}
    </div>
  );
}
