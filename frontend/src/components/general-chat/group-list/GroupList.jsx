import DropdownMenu from "../dropdown-menu/DropdownMenu";
import style from "./GroupList.module.css";

export default function GroupList({
  setError,
  setActionResult,
  friendStatusChanged,
  setFriendStatusChanged,
  groupChat,
  setChatUserId,
}) {
  return (
    <div>
      <h2>Group Chat</h2>
      {groupChat && (
        <div>
          {groupChat.groupChat.map((group) => {
            return (
              <div key={group._id}>
                <button
                  onClick={() => setChatUserId([group.groupChatUsers])}
                  aria-label={`chat in the group ${group.groupChatName}`}
                >
                  <div>
                    <img
                      src={group.groupChatImage.url}
                      className={style.friendChatImg}
                    />
                  </div>
                  <h2>{group.groupChatName}</h2>
                </button>

                <DropdownMenu
                  component={group.founder ? "GroupListFounder" : "GroupList"}
                  groupId={group._id}
                  founder={group.founder}
                  setError={setError}
                  setActionResult={setActionResult}
                  friendStatusChanged={friendStatusChanged}
                  setFriendStatusChanged={setFriendStatusChanged}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
