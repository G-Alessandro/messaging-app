import { useState, useEffect } from "react";
import { CreateGroupChat } from "./create-group-chat/CreateGroupChat";
import { FriendsList } from "./friends-list/FriendsList";
import { AllUsersList } from "./all-users-list/AllUsersList";

export default function GeneralChat() {
  const [userFriends, setUserFriends] = useState([]);
  const [allUsers, setAllUsers] = useState(null);
  const [error, setError] = useState(null);
  const [actionResult, setActionResult] = useState(null);
  const [friendStatusChanged, setFriendStatusChanged] = useState(false);
  const [showGroupChatButton, setShowGroupChatButton] = useState(false);
  const [groupChatUser, setGroupChatUser] = useState([]);

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
          setAllUsers(data.allUsers);
          setUserFriends(data.userFriends);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, [friendStatusChanged]);

  const addUserGroupChat = (userId) => {
    setGroupChatUser((prev) => {
      const result = [...prev, userId];
      return result;
    });
  };

  return (
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
          />

          <AllUsersList
            allUsers={allUsers}
            setError={setError}
            setActionResult={setActionResult}
            friendStatusChanged={friendStatusChanged}
            setFriendStatusChanged={setFriendStatusChanged}
            showGroupChatButton={showGroupChatButton}
            addUserGroupChat={addUserGroupChat}
          />
        </>
      )}
    </div>
  );
}
