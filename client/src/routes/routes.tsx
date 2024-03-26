import {
  createBrowserRouter,
} from "react-router-dom";
import Root from "./root";
import LoginPage from "../pages/LoginPage";
import SearchPage from "../pages/SearchPage";
import DashboardPage from "../pages/DashboardPage";
import CohortsPage from "../pages/CohortsPage";
import ErrorPage from "../pages/ErrorPage";
import TraineePage from "../pages/TraineePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
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
        path: "/trainee",
        element: <TraineePage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/home",
        element: <SearchPage />,
      },
      {
        path: "/search",
        element: <SearchPage />,
      },
    ]
  }
]);
