import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthenticationPage from "./components/authentication-page/AuthenticationPage.jsx";
import GeneralChat from "./components/general-chat/GeneralChat";
import UserProfile from "./components/user-profile/UserProfile";

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <GeneralChat />,
    },
    {
      path: "user-profile",
      element: <UserProfile />,
    },
    {
      path: "authentication-page",
      element: <AuthenticationPage />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
