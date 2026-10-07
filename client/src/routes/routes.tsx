import { Navigate, createBrowserRouter } from 'react-router';

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
import VolunteerProfilePage from '../features/volunteers/VolunteerProfilePage';
import VolunteersOverviewPage from '../features/volunteers/VolunteersOverviewPage';

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
                <VolunteersOverviewPage />
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
            path: '/trainee/:traineeInfo/:tab?',
            element: (
              <ProtectedRoute>
                <TraineePage />
              </ProtectedRoute>
            ),
          },
          {
            path: '/organisation/:organisationInfo/:tab?',
            element: (
              <ProtectedRoute>
                <OrganisationProfilePage />
              </ProtectedRoute>
            ),
          },
          {
            path: '/volunteer/:volunteerInfo/:tab?',
            element: (
              <ProtectedRoute>
                <VolunteerProfilePage />
              </ProtectedRoute>
            ),
          },
          {
            path: '/login',
            element: <LoginPage />,
          },
          // Unknown pages, and the old /home and /search, go to the home page.
          {
            path: '*',
            element: <Navigate to="/" replace />,
          },
        ],
      },
    ],
  },
]);
