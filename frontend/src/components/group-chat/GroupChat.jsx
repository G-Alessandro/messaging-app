import { useState, useEffect } from "react";
import Sidebar from "../sidebar/Sidebar";

export default function GeneralChat() {
  const [groupChat, setGroupChat] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/group-chat", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          mode: "cors",
        });
        const data = await response.json();
        if (!response.ok) {
          setError(data.error);
        } else {
          setGroupChat(data.groupChat);
        }
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Sidebar />
      <div>
        {error && <p>{error}</p>}
        {!groupChat && !error && <p>Loading group chat..</p>}
        {groupChat && !error && (
          <div>
            <p>Group Chat</p>
            {groupChat.groupChat.map((chat) => {
              return (
                <button key={chat.groupChatName}>
                  <p>{chat.groupChatName}</p>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
