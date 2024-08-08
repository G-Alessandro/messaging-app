import { useState, useEffect } from "react";
import io from "socket.io-client";
import Sidebar from "../sidebar/Sidebar";
import CreateGroupChat from "./create-group-chat/CreateGroupChat";
import FriendsList from "./friends-list/FriendsList";
import GroupList from "./group-list/GroupList";
import AllUsersList from "./all-users-list/AllUsersList";
import ChatRoom from "./chat-room/ChatRoom";

const socket = io("http://localhost:4000");

export default function GeneralChat() {
  const [userId, setUserId] = useState(null);
  const [userFriends, setUserFriends] = useState([]);
  const [allUsers, setAllUsers] = useState(null);
  const [error, setError] = useState(null);
  const [actionResult, setActionResult] = useState(null);
  const [friendStatusChanged, setFriendStatusChanged] = useState(false);
  const [showGroupChatButton, setShowGroupChatButton] = useState(false);
  const [groupChatUser, setGroupChatUser] = useState([]);
  const [chatUserId, setChatUserId] = useState([]);

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
          setAllUsers(data.allUsers);
          setUserFriends(data.userFriends);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, [friendStatusChanged]);

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
  // Creare barra per selezionare le varie categorie di chat
  return (
    <>
      <Sidebar />
      <div>
        {error && <p>{error}</p>}
        {!allUsers && !error && <p>Loading...</p>}
        {allUsers && !error && (
          <>
            <CreateGroupChat
              setError={setError}
              setActionResult={setActionResult}
              showGroupChatButton={showGroupChatButton}
              setShowGroupChatButton={setShowGroupChatButton}
              groupChatUser={groupChatUser}
            />

            <FriendsList
              userFriends={userFriends}
              setError={setError}
              actionResult={actionResult}
              setActionResult={setActionResult}
              friendStatusChanged={friendStatusChanged}
              setFriendStatusChanged={setFriendStatusChanged}
              showGroupChatButton={showGroupChatButton}
              addUserGroupChat={addUserGroupChat}
              setChatUserId={setChatUserId}
            />

            <GroupList />

            <AllUsersList
              allUsers={allUsers}
              setError={setError}
              setActionResult={setActionResult}
              friendStatusChanged={friendStatusChanged}
              setFriendStatusChanged={setFriendStatusChanged}
              showGroupChatButton={showGroupChatButton}
              addUserGroupChat={addUserGroupChat}
              setChatUserId={setChatUserId}
            />
          </>
        )}
      </div>
      {chatUserId.length > 0 && (
        <ChatRoom socket={socket} chatUserId={chatUserId} />
      )}
    </>
  );
}
