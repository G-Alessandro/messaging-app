import React, { useState, createContext } from "react";
import ReactDOM from "react-dom/client";
import Router from "./Router";

export const SocketContext = createContext();

function App() {
  const [socket, setSocket] = useState(null);

  return (
    //<React.StrictMode>
    <SocketContext.Provider value={{ socket, setSocket }}>
      <Router />
    </SocketContext.Provider>
    //</React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
