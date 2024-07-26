export function AllUsersList({
  allUsers,
  setError,
  setActionResult,
  friendStatusChanged,
  setFriendStatusChanged,
  showGroupChatButton,
  addUserGroupChat,
}) {
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
        setActionResult(data.error);
      } else {
        setActionResult(data.message);
        setFriendStatusChanged(!friendStatusChanged);
        setTimeout(() => setActionResult(null), 2000);
      }
    } catch (err) {
      setError(err.message);
    }
  };
  return (
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
              <button
                onClick={() => addUserGroupChat(user._id)}
                style={{
                  visibility: showGroupChatButton ? "visible" : "hidden",
                }}
              >
                Add to group chat
              </button>
              <button onClick={() => addFriend(user._id)}>
                Add to friends list
              </button>
            </div>
          );
        })}
    </div>
  );
}
