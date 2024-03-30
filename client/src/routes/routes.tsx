import {
  Navigate,
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
        index: true, 
        element: <Navigate to="/home" replace /> 
      },
      {
        path: "/home",
        element: <SearchPage />,
      },
      {
        path: "/cohorts",
        element: <CohortsPage />,
      },
      {
        path: "/dashboard",
        element: <DashboardPage />,
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
      // We can replace with 404 page if you want, or just redirect to home page.
      {
        path: "*",
        element: <Navigate to="/home" replace />
      }
    ]
  }
]);
