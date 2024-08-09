import DropdownMenu from "../dropdown-menu/DropdownMenu";
import style from "./AllUsersList.module.css";

export default function AllUsersList({
  allUsers,
  setError,
  setActionResult,
  friendStatusChanged,
  setFriendStatusChanged,
  // showGroupChatButton,
  // addUserGroupChat,
  setChatUserId,
}) {

  return (
    <div>
      <h2>All Users</h2>
      {allUsers &&
        allUsers.map((user) => {
          return (
            <div key={user._id}>
              <button
                onClick={() => setChatUserId([user._id])}
                aria-label={`chat with ${user.firstName} ${user.lastName}`}
              >
                <div>
                  <img
                    src={user.profileImage.url}
                    className={style.userChatImg}
                  />
                </div>
                <h3>
                  {user.firstName} {user.lastName}
                </h3>
                <p className={user.online ? "userOnline" : "userOffline"}>
                  {user.online ? "Online" : "Offline"}
                </p>
              </button>

              <DropdownMenu
                component={"AllUsersList"}
                userId={user._id}
                setError={setError}
                setActionResult={setActionResult}
                friendStatusChanged={friendStatusChanged}
                setFriendStatusChanged={setFriendStatusChanged}
              />
            </div>
          );
        })}
    </div>
  );
}
