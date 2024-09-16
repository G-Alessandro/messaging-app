import { useState, useEffect } from "react";
import InputBar from "./input-bar/InputBar";
import style from "./ChatRoom.module.css";

export default function ChatRoom({ chatUserId, socket }) {
  const [error, setError] = useState(null);
  const [chatRoomData, setChatRoomData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [chatRoomUserData, setChatRoomUserData] = useState(null);
  const [chatRoomGroupData, setChatRoomGroupData] = useState(null);
  const [messagesDate, setMessagesDate] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const requestData = {
        chatUserId: chatUserId,
      };

      try {
        const response = await fetch("http://localhost:3000/chat-room", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          mode: "cors",
          body: JSON.stringify(requestData),
        });
        const data = await response.json();
        if (!response.ok) {
          setError(data.error);
        } else {
          setChatRoomData(data.chatData);
          setUserData(data.userData);
          setChatRoomUserData(data.chatRoomUserData);
          setChatRoomGroupData(data.chatRoomGroupData);

          console.log("userData", data.userData);
          console.log("chatData", data.chatData);
          console.log("chatRoomUserData", data.chatRoomUserData);
          console.log("chatRoomGroupData", data.chatRoomGroupData);

          socket.emit("join_room", {
            userId: data.userData._id,
            roomId: data.chatData._id,
          });
        }
      } catch (err) {
        setError(err.error);
      }
    };

    fetchData();

    socket.on("receive_message", (newMessage) => {
      setChatRoomData((prevChatRoomData) => {
        return {
          ...prevChatRoomData,
          messages: [...prevChatRoomData.messages, newMessage],
        };
      });
    });

    return () => {
      socket.off("receive_message");
    };
  }, [chatUserId]);

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
      setMessagesDate([...dates]);
    }
  }, [chatRoomData]);

  return (
    <div className={style.chatRoomContainer}>
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
      )}

      <div className={style.chatRoomMessagesContainer}>
        {error && <p>{error}</p>}

        {!chatRoomData && (
          <h3 className={style.chatRoomLoading}>Loading messages...</h3>
        )}

        {chatRoomData &&
          chatRoomData.messages.map((message, index) => (
            <>
              {index !== 1 &&
                messagesDate[index - 1] !== messagesDate[index] && (
                  <div className={style.messagesDate}>
                    {messagesDate[index]}
                  </div>
                )}

              <div
                key={message._id || message.timestamp}
                className={style.messagesContainer}
                style={{
                  borderRadius: "5px",
                  ...(message.userName ===
                  `${userData.firstName} ${userData.lastName}`
                    ? { alignSelf: "flex-end", backgroundColor: "#d9fdd3" }
                    : { alignSelf: "flex-start", backgroundColor: "#ffffff" }),
                }}
              >
                <div className={style.messageContainer}>

                  {chatRoomGroupData ? <h3 className={style.messageAuthor}>{message.userName ===
                  `${userData.firstName} ${userData.lastName}`? "" : message.userName}</h3> : ""}

                  {message.text && (
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
                  )}

                  {message.image && (
                    <img
                      src={message.image.url}
                      className={style.chatRoomImg}
                    />
                  )}

                  <p className={style.messageHours}>
                    {handleMessageTimestamp(message.timestamp, "hours")}
                  </p>
                </div>
              </div>
            </>
          ))}
      </div>
      <InputBar
        socket={socket}
        setError={setError}
        chatRoomData={chatRoomData}
        userData={userData}
      />
    </div>
  );
}
