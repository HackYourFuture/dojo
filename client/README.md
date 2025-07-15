# Dojo Client

Frontend application for HackYourFuture's trainee management system

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-%23007FFF.svg?style=for-the-badge&logo=mui&logoColor=white)


## Technology Stack
- **React** - Modern React with hooks and concurrent features
- **TypeScript**
- **Vite** - For development server
- **Material-UI (MUI)** - Comprehensive component library
- **React Router** - Client-side routing
- **React Query** - Server state management and caching
- **Axios** - HTTP client for API requests

## Prerequisites

Before you begin, ensure you have the following installed:

**Node.js 22 or higher**

## Setup

1. **Install dependencies**:
   ```bash
   npm run setup
   ```

2. **Set up environment variables**:
   Create a `.env` file in the client directory:
   ```bash
   # Backend API URL (optional - defaults to http://localhost:7777)
   VITE_BACKEND_PROXY_TARGET=http://localhost:7777
   
   # Google OAuth Client ID (required for authentication)
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   ```

## Development

### Starting the Development Server

```bash
npm run dev
```

The application will open automatically in your browser at `http://localhost:5173`.

## Building for Production

```bash
npm run build
```

The build files will be generated in the `dist/` directory.

## Environment Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_BACKEND_PROXY_TARGET` | Backend API URL | `http://localhost:7777` | No |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID | - | Yes |

### API Proxy Configuration
You need to setup `VITE_BACKEND_PROXY_TARGET` variable to point to the correct backend URL. If you use the default http://localhost:7777, you need to run the local server first. Read more about local backend development in the server's [README.md](../server/)
The development server automatically proxies API requests:
- `/api/*` → Backend server
- `/api-docs/*` → Backend API documentation

This eliminates CORS issues during development.

## Authentication

The application uses Google OAuth for authentication:

1. Users sign in with their Google accounts
2. Protected routes require authentication
3. User sessions persist across browser refreshes

Make sure you have `VITE_GOOGLE_CLIENT_ID` setup correctly. Check out the server [README.md](../server/README.md#google-authentication-setup) for more info.

## API Integration

The client communicates with the backend API through:
- **Axios** for HTTP requests
- **React Query** for caching and state management
- **Automatic retry** for failed requests
- **Optimistic updates** for better UX
