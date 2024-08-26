import { useState, useEffect } from "react";
import io from "socket.io-client";
import Sidebar from "../sidebar/Sidebar";
import CreateGroupChat from "./create-group-chat/CreateGroupChat";
import CategoryTopBar from "./category-top-bar/CategoryTopBar";
import FriendsList from "./friends-list/FriendsList";
import GroupList from "./group-list/GroupList";
import AllUsersList from "./all-users-list/AllUsersList";
import ChatRoom from "./chat-room/ChatRoom";
import style from "./GeneralChat.module.css";

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
    <div className={style.generalChatContainer}>
      <Sidebar />
      <div>
        {error && <p>{error}</p>}
        {!allUsers && !error && <p>Loading...</p>}
        {allUsers && !error && (
          <div>
            <CreateGroupChat
              setError={setError}
              setActionResult={setActionResult}
              showGroupChatButton={showGroupChatButton}
              setShowGroupChatButton={setShowGroupChatButton}
              statusChanged={statusChanged}
              setStatusChanged={setStatusChanged}
              groupChatUser={groupChatUser}
            />

            <CategoryTopBar
              userFriends={userFriends}
              groupChat={groupChat}
              allUsers={allUsers}
              setChosenCategory={setChosenCategory}
            />

            <AllUsersList
              userFriends={userFriends}
              groupChat={groupChat}
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

            {/* <FriendsList
              userFriends={userFriends}
              setError={setError}
              actionResult={actionResult}
              setActionResult={setActionResult}
              friendStatusChanged={friendStatusChanged}
              setFriendStatusChanged={setFriendStatusChanged}
              showGroupChatButton={showGroupChatButton}
              addUserGroupChat={addUserGroupChat}
              removeUserGroupChat={removeUserGroupChat}
              setChatUserId={setChatUserId}
            />

            <GroupList
              setError={setError}
              setActionResult={setActionResult}
              groupChat={groupChat}
              friendStatusChanged={friendStatusChanged}
              setFriendStatusChanged={setFriendStatusChanged}
              setChatUserId={setChatUserId}
            /> */}
          </div>
        )}
      </div>
      {chatUserId && <ChatRoom socket={socket} chatUserId={chatUserId} />}
    </div>
  );
}
