import { useState, useEffect } from "react";

export default function GroupList({ setChatUserId }) {
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
      <div>
        {groupChat && !error && (
          <div>
            <p>Group Chat</p>
            {groupChat.groupChat.map((group) => {
              return (
                <div key={group._id}>
                  <button
                    onClick={() => setChatUserId([group.groupChatUsers])}
                  >
                    <img src={group.groupChatImage.url} />
                    <p>{group.groupChatName}</p>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
