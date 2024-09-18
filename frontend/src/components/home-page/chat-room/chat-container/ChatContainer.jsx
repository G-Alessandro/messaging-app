import React, { useState, useEffect, useRef } from "react";
import style from "./ChatContainer.module.css";

export default function ChatContainer({
  error,
  userData,
  chatRoomUserData,
  chatRoomData,
  chatRoomGroupData,
}) {
  const [messageUserName, setMessageUserName] = useState([]);
  const [messagesDate, setMessagesDate] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatRoomData]);

  const chatUserProfileImage = (messageUserName) => {
    const user = chatRoomUserData.find((user) => {
      const userName = user.firstName + " " + user.lastName;
      return userName === messageUserName;
    });

    if (user && user.profileImage) {
      return user.profileImage.url;
    }

    return null;
  };

  const handleMessageTimestamp = (timestamp, category) => {
    const getDayNameIfRecent = (timestamp) => {
      const daysOfWeek = [
        "SUNDAY",
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
      ];
      const givenDate = new Date(timestamp);
      const currentDate = new Date();

      const isSameDay =
        givenDate.getFullYear() === currentDate.getFullYear() &&
        givenDate.getMonth() === currentDate.getMonth() &&
        givenDate.getDate() === currentDate.getDate();

      if (isSameDay) {
        return "TODAY";
      }

      const diffInTime = currentDate.getTime() - givenDate.getTime();
      const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24));

      if (diffInDays >= 0 && diffInDays <= 6) {
        return daysOfWeek[givenDate.getDay()];
      }
      return null;
    };

    let result;

    switch (category) {
      case "date":
        if (getDayNameIfRecent(timestamp)) {
          result = getDayNameIfRecent(timestamp);
        } else {
          result = new Date(timestamp).toLocaleDateString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });
        }
        break;
      case "hours":
        result = new Date(timestamp).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        });
        break;
    }
    return result;
  };

  useEffect(() => {
    if (chatRoomData && chatRoomData.messages) {
      const dates = chatRoomData.messages.map((message) => {
        return handleMessageTimestamp(message.timestamp, "date");
      });
      const messageAuthor = chatRoomData.messages.map((message) => {
        return message.userName;
      });
      setMessagesDate([...dates]);
      setMessageUserName([...messageAuthor]);
    }
  }, [chatRoomData]);

  return (
    <div className={style.chatRoomMessagesContainer}>
      {error && <p className={style.chatRoomError}>{error}</p>}

      {!chatRoomData && (
        <h3 className={style.chatRoomLoading}>Loading messages...</h3>
      )}

      {chatRoomData &&
        chatRoomData.messages.map((message, index) => (
          <React.Fragment key={message._id || message.timestamp}>
            {index !== 1 && messagesDate[index - 1] !== messagesDate[index] && (
              <div className={style.messagesDate}>{messagesDate[index]}</div>
            )}

            <div
              className={style.container}
              style={{
                borderRadius: "4px",
                ...(message.userName ===
                `${userData.firstName} ${userData.lastName}`
                  ? { alignSelf: "flex-end", backgroundColor: "#d9fdd3" }
                  : { alignSelf: "flex-start", backgroundColor: "#ffffff" }),
              }}
            >
              <div className={style.messageContainer}>
                {message.userName !==
                  `${userData.firstName} ${userData.lastName}` &&
                  index !== 1 &&
                  message.userName !== messageUserName[index - 1] && (
                    <img
                      className={style.messageAuthorImg}
                      src={chatUserProfileImage(message.userName)}
                    />
                  )}

                {message.userName !== messageUserName[index - 1] &&
                  message.userName !==
                    `${userData.firstName} ${userData.lastName}` && (
                    <div
                      className={style.messageTriangleBubble}
                      style={
                        message.userName ===
                        `${userData.firstName} ${userData.lastName}`
                          ? { borderBottomColor: "#d9fdd3" }
                          : {}
                      }
                    ></div>
                  )}

                {chatRoomGroupData && (
                  <h3 className={style.messageAuthor}>
                    {message.userName !==
                      `${userData.firstName} ${userData.lastName}` &&
                    index !== 1 &&
                    message.userName !== messageUserName[index - 1]
                      ? message.userName
                          .split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")
                      : ""}
                  </h3>
                )}

                {message.text && (
                  <div
                    className={style.messageTextContainer}
                    style={
                      message.userName ===
                      `${userData.firstName} ${userData.lastName}`
                        ? { flexDirection: "row-reverse" }
                        : {}
                    }
                  >
                    <p
                      style={
                        message.userName ===
                        `${userData.firstName} ${userData.lastName}`
                          ? { alignSelf: "flex-end" }
                          : { alignSelf: "flex-start" }
                      }
                    >
                      {message.text}
                    </p>
                    {message.userName !== messageUserName[index - 1] &&
                      message.userName ===
                        `${userData.firstName} ${userData.lastName}` && (
                        <div className={style.messageUserTriangleBubble}></div>
                      )}
                  </div>
                )}

                {message.image && (
                  <img src={message.image.url} className={style.chatRoomImg} />
                )}

                <p className={style.messageHours}>
                  {handleMessageTimestamp(message.timestamp, "hours")}
                </p>
              </div>
            </div>
          </React.Fragment>
        ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
