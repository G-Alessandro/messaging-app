import { useState, useEffect } from "react";
import io from "socket.io-client";
import Sidebar from "../sidebar/Sidebar";
import CategoryTopBar from "./category-top-bar/CategoryTopBar";
import UsersList from "./users-list/UsersList";
import ChatRoom from "./chat-room/ChatRoom";
import AppSvg from "/assets/svg/app-icon.svg";
import style from "./HomePage.module.css";

export default function GeneralChat() {
  const [userId, setUserId] = useState(null);
  const [userFriends, setUserFriends] = useState([]);
  const [groupChat, setGroupChat] = useState([]);
  const [allUsers, setAllUsers] = useState(null);
  const [chosenCategoryName, setChosenCategoryName] = useState("all");
  const [chosenCategory, setChosenCategory] = useState(null);
  const [error, setError] = useState(null);
  const [actionResult, setActionResult] = useState(null);
  const [actionResultError, setActionResultError] = useState(null);
  const [statusChanged, setStatusChanged] = useState(false);
  const [showGroupChatButton, setShowGroupChatButton] = useState(false);
  const [groupChatUser, setGroupChatUser] = useState([]);
  const [chatUserId, setChatUserId] = useState(null);
  const [socket, setSocket] = useState(null);

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
      const newSocket = io("http://localhost:4000");
      setSocket(newSocket);

      newSocket.emit("user_connected", { userId });

      const handleDisconnect = () => {
        newSocket.emit("user_disconnected", { userId });
      };

      window.addEventListener("beforeunload", handleDisconnect);

      return () => {
        handleDisconnect();
        window.removeEventListener("beforeunload", handleDisconnect);
        newSocket.disconnect();
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
      <Sidebar selectedPage={"chat"} setSocket={setSocket} />
      <div className={style.container}>
        {error && <p>{error}</p>}
        {actionResult && <p className={style.actionResult}>{actionResult}</p>}
        {actionResultError && (
          <p className={style.actionResultError}>{actionResultError}</p>
        )}
        {!allUsers && !error && <p>Loading...</p>}
        {allUsers && !error && (
          <div className={style.categoryUserListContainer}>
            <CategoryTopBar
              userFriends={userFriends}
              groupChat={groupChat}
              allUsers={allUsers}
              setChosenCategoryName={setChosenCategoryName}
              setChosenCategory={setChosenCategory}
              setError={setError}
              setActionResult={setActionResult}
              setActionResultError={setActionResultError}
              showGroupChatButton={showGroupChatButton}
              setShowGroupChatButton={setShowGroupChatButton}
              statusChanged={statusChanged}
              setStatusChanged={setStatusChanged}
              groupChatUser={groupChatUser}
              setGroupChatUser={setGroupChatUser}
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
      {!chatUserId && (
        <div className={style.appWelcomeContainer}>
          <img src={AppSvg} className={style.appIconSvg} />
          <h1>Welcome!</h1>
          <div className={style.welcomeContainer}>
            <p>
              Here you can talk in real time with all the people on{" "}
              <span className={style.appNameQuick}>Quick</span>
              <span className={style.appNameChat}>Chat</span>, make friends and
              create groups!
            </p>
            <p className={style.pEnd}>Have fun!</p>
          </div>
        </div>
      )}
      {chatUserId && <ChatRoom socket={socket} chatUserId={chatUserId} />}
    </div>
  );
}
