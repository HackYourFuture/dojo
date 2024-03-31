import {
  Navigate,
  createBrowserRouter,
} from "react-router-dom";
import Root from "./root";
import LoginPage from "../pages/LoginPage";
import SearchPage from "../pages/SearchPage";
import DashboardPage from "../pages/DashboardPage";
import CohortsPage from "../pages/CohortsPage";
import ErrorPage from "../pages/ErrorPage";
import TraineePage from "../pages/TraineePage";
import { ApiProvider } from "../hooks/useAuth";
import { ProtectedRoute } from "../components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    element: <ApiProvider />,
    children: [
      {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
          { 
            index: true, 
            element: <Navigate to="/home" replace /> 
          },
          {
            path: "/home",
            element: <ProtectedRoute><SearchPage /></ProtectedRoute>,
          },
          {
            path: "/cohorts",
            element: <ProtectedRoute> <CohortsPage /></ProtectedRoute>,
          },
          {
            path: "/dashboard",
            element: <ProtectedRoute><DashboardPage /></ProtectedRoute>,
          },
          {
            path: "/search",
            element: <ProtectedRoute><SearchPage /></ProtectedRoute>,
          },
          {
            path: "/trainee/:traineeInfo",
            element: <ProtectedRoute><TraineePage /></ProtectedRoute>,
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
        ],
      },
    ],
  },
]);
