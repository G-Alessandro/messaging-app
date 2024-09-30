import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import { SocketContext } from "../../main.jsx";
import ChatRoom from "../home-page/chat-room/ChatRoom.jsx";

export default function ChatRoomPage() {
  const location = useLocation();
  const { chatUserId } = location.state;
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (socket === null) {
      navigate("/");
    }
  }, [socket]);

  return <ChatRoom socket={socket} chatUserId={chatUserId} />;
}
