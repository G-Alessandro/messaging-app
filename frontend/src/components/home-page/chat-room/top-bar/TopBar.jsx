import style from "./TopBar.module.css";

export default function TopBar({ chatRoomUserData, chatRoomGroupData }) {
  return (
    <>
      {!chatRoomUserData && (
        <h3 className={style.chatRoomLoading}>Loading...</h3>
      )}
      {chatRoomUserData && (
        <div className={style.chatRoomTopBar}>
          <img
            src={
              chatRoomGroupData === undefined
                ? chatRoomUserData[0].profileImage.url
                : chatRoomGroupData.groupChatImage.url
            }
            className={style.chatUserImg}
          />
          <h3>
            {chatRoomGroupData === undefined
              ? `${
                  chatRoomUserData[0].firstName.charAt(0).toUpperCase() +
                  chatRoomUserData[0].firstName.slice(1)
                } ${
                  chatRoomUserData[0].lastName.charAt(0).toUpperCase() +
                  chatRoomUserData[0].lastName.slice(1)
                }`
              : chatRoomGroupData.groupChatName.charAt(0).toUpperCase() +
                chatRoomGroupData.groupChatName.slice(1)}
          </h3>
        </div>
      )}{" "}
    </>
  );
}
