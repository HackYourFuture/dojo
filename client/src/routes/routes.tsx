import {
  createBrowserRouter,
} from "react-router-dom";
import Root from "./root";
import LoginPage from "../pages/LoginPage";
import SearchPage from "../pages/SearchPage";
import DashboardPage from "../pages/DashboardPage";
import CohortsPage from "../pages/CohortsPage";
import TraineePage from "../pages/TraineePage";

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
        element: <SearchPage />,
      },
      {
        path: "/search",
        element: <SearchPage />,
      },
      {
        path: "/trainee/:traineeInfo",
        element: <TraineePage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
    ]
  }
]);
