import React, { useState, useEffect, createContext } from "react";
import ReactDOM from "react-dom/client";
import io from "socket.io-client";
import Router from "./Router";

export const UserIdContext = createContext();
export const SocketContext = createContext();

function App() {
  const [userId, setUserId] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (userId) {
      const newSocket = io("https://backend-messaging-app.fly.dev");
      setSocket(newSocket);

      newSocket.emit("user_connected", { userId });

      const handleDisconnect = () => {
        newSocket.emit("user_disconnected", { userId });
      };

      window.addEventListener("beforeunload", handleDisconnect);

      return () => {
        handleDisconnect();
        window.removeEventListener("beforeunload", handleDisconnect);
        newSocket.disconnect();
      };
    }
  }, [userId]);

  return (
    <React.StrictMode>
      <UserIdContext.Provider value={{ setUserId }}>
        <SocketContext.Provider value={{ socket, setSocket }}>
          <Router />
        </SocketContext.Provider>
      </UserIdContext.Provider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
