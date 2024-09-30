import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { UserIdContext } from "../../main.jsx";
import { SocketContext } from "../../main.jsx";
import Sidebar from "../sidebar/Sidebar";
import CategoryTopBar from "./category-top-bar/CategoryTopBar";
import UsersList from "./users-list/UsersList";
import ChatRoom from "./chat-room/ChatRoom";
import AppSvg from "/assets/svg/app-icon.svg";
import style from "./HomePage.module.css";

export default function GeneralChat() {
  const { setUserId } = useContext(UserIdContext);
  const { socket } = useContext(SocketContext);
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
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 500px)");

    const handleMediaQueryChange = (e) => {
      setIsMobile(e.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    handleMediaQueryChange(mediaQuery);

    return () =>
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
  }, []);

  useEffect(() => {
    if (isMobile && chatUserId) {
      navigate("/chat-room-page", {
        state: { chatUserId },
      });
    }
  }, [isMobile, chatUserId]);

  return (
    <div className={style.homePageContainer}>
      <Sidebar selectedPage={"chat"} />
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
      {chatUserId && isMobile === false && (
        <ChatRoom socket={socket} chatUserId={chatUserId} />
      )}
    </div>
  );
}
