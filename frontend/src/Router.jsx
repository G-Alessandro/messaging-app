import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthenticationPage from "./components/authentication-page/AuthenticationPage.jsx";
import HomePage from "./components/home-page/HomePage.jsx";

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "authentication-page",
      element: <AuthenticationPage />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
