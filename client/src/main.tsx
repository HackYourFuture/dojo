import './styles/index.css';
import 'dayjs/locale/nl';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CssBaseline from '@mui/material/CssBaseline';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { installAxiosInterceptors } from './data/http/interceptors';
import { router } from './routes';
import { theme } from './theme/theme';

installAxiosInterceptors();

const googleClientId = document.querySelector<HTMLMetaElement>('meta[name="google-client-id"]')!.content;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="nl">
          <CssBaseline />
          <RouterProvider router={router} />
        </LocalizationProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
