import { useState, useEffect } from "react";

export default function GeneralChat() {
  const [userFriends, setUserFriends] = useState([]);
  const [allUsers, setAllUsers] = useState(null);
  const [error, setError] = useState(null);
  const [friendResult, setFriendResult] = useState(null);
  const [friendStatusChanged, setFriendStatusChanged] = useState(false);

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

  const addFriend = async (friendId) => {
    try {
      const response = await fetch("http://localhost:3000/add-friend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "cors",
        body: JSON.stringify({ friendId }),
      });
      const data = await response.json();
      if (!response.ok) {
        setFriendResult(data.error);
      } else {
        setFriendResult(data.message);
        setFriendStatusChanged(!friendStatusChanged);
        setTimeout(() => setFriendResult(null), 2000);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const removeFriend = async (friendId) => {
    try {
      const response = await fetch("http://localhost:3000/remove-friend", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "cors",
        body: JSON.stringify({ friendId }),
      });
      const data = await response.json();
      if (!response.ok) {
        setFriendResult(data.error);
      } else {
        setFriendResult(data.message);
        setFriendStatusChanged(!friendStatusChanged);
        setTimeout(() => setFriendResult(null), 2000);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      {error && <p>{error}</p>}
      {!allUsers && !error && <p>Loading Users...</p>}
      <div>
        <p>Friends</p>
        {friendResult && <p>{friendResult}</p>}
        {!userFriends && <p>No Friends? Make One!</p>}
        {userFriends &&
          userFriends.map((friend) => {
            return (
              <div key={friend._id}>
                <p>
                  {friend.firstName} {friend.lastName}
                </p>
                <p className={friend.online ? "userOnline" : "userOffline"}>
                  {friend.online ? "Online" : "Offline"}
                </p>
                <button onClick={() => removeFriend(friend._id)}>
                  Remove from friends list
                </button>
              </div>
            );
          })}
      </div>
      <div>
        <p>All Users</p>
        {allUsers &&
          allUsers.map((user) => {
            return (
              <div key={user._id}>
                <p>
                  {user.firstName} {user.lastName}
                </p>
                <p className={user.online ? "userOnline" : "userOffline"}>
                  {user.online ? "Online" : "Offline"}
                </p>
                <button onClick={() => addFriend(user._id)}>
                  Add to friends list
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
}
