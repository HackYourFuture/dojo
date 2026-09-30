import { Navigate, createBrowserRouter } from 'react-router-dom';

import { ApiProvider } from '../auth/hooks/useAuthProvider';
import DashboardPage from '../features/dashboard/DashboardPage';
import LoginPage from '../features/login/LoginPage';
import OrganisationProfilePage from '../features/organisations/OrganisationProfilePage';
import OrganisationsOverviewPage from '../features/organisations/OrganisationsOverviewPage';
import { ProtectedRoute } from './ProtectedRoute';
import Root from './root';
import SearchPage from '../features/search/SearchPage';
import TraineePage from '../features/trainee-profile/TraineePage';
import TraineesPage from '../features/trainees/TraineesPage';
import UsersPage from '../features/admin/users/UsersPage';
import VolunteersPage from '../features/volunteers/VolunteersPage';

export const router = createBrowserRouter([
  {
    element: <ApiProvider />,
    children: [
      {
        path: '/',
        element: <Root />,
        children: [
          {
            index: true,
            element: <Navigate to="/home" replace />,
          },
          {
            path: '/home',
            element: (
              <ProtectedRoute>
                <SearchPage />
              </ProtectedRoute>
            ),
          },
          {
            path: '/trainees',
            element: (
              <ProtectedRoute>
                <TraineesPage />
              </ProtectedRoute>
            ),
          },
          {
            path: '/volunteers',
            element: (
              <ProtectedRoute>
                <VolunteersPage />
              </ProtectedRoute>
            ),
          },
          {
            path: '/organisations',
            element: (
              <ProtectedRoute>
                <OrganisationsOverviewPage />
              </ProtectedRoute>
            ),
          },
          {
            path: '/admin/users',
            element: (
              <ProtectedRoute>
                <UsersPage />
              </ProtectedRoute>
            ),
          },
          {
            path: '/dashboard',
            element: (
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            ),
          },
          {
            path: '/search',
            element: (
              <ProtectedRoute>
                <SearchPage />
              </ProtectedRoute>
            ),
          },
          {
            path: '/trainee/:traineeInfo',
            element: (
              <ProtectedRoute>
                <TraineePage />
              </ProtectedRoute>
            ),
          },
          {
            path: '/organisation/:organisationInfo',
            element: (
              <ProtectedRoute>
                <OrganisationProfilePage />
              </ProtectedRoute>
            ),
          },
          {
            path: '/login',
            element: <LoginPage />,
          },
          // We can replace with 404 page if you want, or just redirect to home page.
          {
            path: '*',
            element: <Navigate to="/home" replace />,
          },
        ],
      },
    ],
  },
]);
