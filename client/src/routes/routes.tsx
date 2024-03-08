import {
  createBrowserRouter,
} from "react-router-dom";
import Root from "./root";
import LoginPage from "../pages/LoginPage";
import SearchPage from "../pages/SearchPage";
import HomePage from "../pages/HomePage";
import DashboardPage from "../pages/DashboardPage";
import CohortsPage from "../pages/CohortsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/cohorts",
        element: <CohortsPage />,
      },
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/home",
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/search",
        element: <SearchPage />,
      },
    ]
  }
]);
