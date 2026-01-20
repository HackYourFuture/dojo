import './styles/index.css';
// When using TypeScript 4.x and above
import '@mui/lab/themeAugmentation';

import { ThemeProvider, createTheme } from '@mui/material/styles';

import CssBaseline from '@mui/material/CssBaseline';
import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#B12900',
    },
    background: {
      default: '#ffffff',
    },
  },
  typography: {
    button: {
      textTransform: 'none',
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_APP_CLIENTID}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
