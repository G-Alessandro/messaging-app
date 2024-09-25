import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { SocketContext } from "../../main.jsx";
import ChatRoom from "../home-page/chat-room/ChatRoom.jsx";

export default function ChatRoomPage() {
  const location = useLocation();
  const { chatUserId } = location.state;
  const { socket } = useContext(SocketContext);

  return <ChatRoom socket={socket} chatUserId={chatUserId} />;
}
