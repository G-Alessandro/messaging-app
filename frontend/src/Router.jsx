import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthenticationPage from "./components/authentication-page/AuthenticationPage.jsx";
import GeneralChat from "./components/general-chat/GeneralChat";
import UserProfile from "./components/user-profile/UserProfile";
// Creare pagina apposita per sign-in e sing-up
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
