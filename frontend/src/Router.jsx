import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthenticationPage from "./components/authentication-page/AuthenticationPage.jsx";
import HomePage from "./components/home-page/HomePage.jsx";
import ChatRoomPage from "./components/chat-room-page/ChatRoomPage";
import UserProfile from "./components/user-profile/UserProfile";

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "user-profile",
      element: <UserProfile />,
    },
    {
      path: "authentication-page",
      element: <AuthenticationPage />,
    },
    {
      path: "chat-room-page",
      element: <ChatRoomPage />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
