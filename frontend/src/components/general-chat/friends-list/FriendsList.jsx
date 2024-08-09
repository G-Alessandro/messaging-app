import DropdownMenu from "../dropdown-menu/DropdownMenu";
import style from "./FriendsList.module.css";

export default function FriendsList({
  userFriends,
  setError,
  actionResult,
  setActionResult,
  friendStatusChanged,
  setFriendStatusChanged,
  // showGroupChatButton,
  // addUserGroupChat,
  setChatUserId,
}) {

  return (
    <div>
      <h2>Friends</h2>
      {actionResult && <p>{actionResult}</p>}
      {!userFriends && <p>No Friends? Make One!</p>}
      {userFriends &&
        userFriends.map((friend) => {
          return (
            <div key={friend._id}>
              <button
                onClick={() => setChatUserId([friend._id])}
                aria-label={`chat with ${friend.firstName} ${friend.lastName}`}
              >
                <div>
                  <img
                    src={friend.profileImage.url}
                    className={style.friendChatImg}
                  />
                </div>

                <h3>
                  {friend.firstName} {friend.lastName}
                </h3>
                <p className={friend.online ? "userOnline" : "userOffline"}>
                  {friend.online ? "Online" : "Offline"}
                </p>
              </button>

              <DropdownMenu component={"FriendsList"}
                userId={friend._id}
                setError={setError}
                setActionResult={setActionResult}
                friendStatusChanged={friendStatusChanged}
                setFriendStatusChanged={setFriendStatusChanged}/>
            </div>
          );
        })}
    </div>
  );
}
