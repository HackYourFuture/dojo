import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  RouterProvider,
} from "react-router-dom";
import './index.css'
import { router } from './routes';

import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider 
      clientId="1040913117934-88mps612v61m4jnhq1ukbp31oc0q10jh.apps.googleusercontent.com"
    >
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
