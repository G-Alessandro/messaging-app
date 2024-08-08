export default function FriendsList({
  userFriends,
  setError,
  actionResult,
  setActionResult,
  friendStatusChanged,
  setFriendStatusChanged,
  showGroupChatButton,
  addUserGroupChat,
  setChatUserId,
}) {
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
      <p>Friends</p>
      {actionResult && <p>{actionResult}</p>}
      {!userFriends && <p>No Friends? Make One!</p>}
      {userFriends &&
        userFriends.map((friend) => {
          return (
            <div key={friend._id} onClick={() => setChatUserId([user._id])}>
              <p>
                {friend.firstName} {friend.lastName}
              </p>
              <p className={friend.online ? "userOnline" : "userOffline"}>
                {friend.online ? "Online" : "Offline"}
              </p>
              <button
                onClick={() => addUserGroupChat(friend._id)}
                style={{
                  visibility: showGroupChatButton ? "visible" : "hidden",
                }}
              >
                Add to group chat
              </button>
              <button onClick={() => removeFriend(friend._id)}>
                Remove from friends list
              </button>
            </div>
          );
        })}
    </div>
  );
}
