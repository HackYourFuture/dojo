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

| Variable                    | Description            | Default                 | Required |
| --------------------------- | ---------------------- | ----------------------- | -------- |
| `VITE_BACKEND_PROXY_TARGET` | Backend API URL        | `http://localhost:7777` | No       |
| `VITE_GOOGLE_CLIENT_ID`     | Google OAuth Client ID | -                       | Yes      |

### API Proxy Configuration

You need to set up `VITE_BACKEND_PROXY_TARGET` variable to point to the correct backend URL. If you use the default http://localhost:7777, you need to run the local server first. Read more about local backend development in the server's [README.md](../server/)
The development server automatically proxies API requests:

- `/api/*` → Backend server
- `/api-docs/*` → Backend API documentation

This eliminates CORS issues during development.

## 🗂️ Client Structure

- `src/`: Contains all React components and application logic.
- `assets/`: Contains all the assets and images used.
- `components/`: Reusable UI components.
- `hooks/`: API calls and data fetching logic.
- `models/`: Contains TypeScript interfaces, types, and enums.
- `pages/`: Main application pages (Login, Dashboard, TraineeProfile, etc.).
- `routes/`: Contains Routes and navigating between different pages logic.
- `styles/`: CSS and styling files.

## Authentication

The application uses Google OAuth for authentication:

1. Users sign in with their Google accounts
2. Protected routes require authentication
3. User sessions persist across browser refreshes

Make sure you have `VITE_GOOGLE_CLIENT_ID` set up correctly. Check out the server [README.md](../server/README.md#google-authentication-setup) for more info.

## API Integration

The client communicates with the backend API through:

- **Axios** for HTTP requests
- **React Query** for caching and state management
- **Automatic retry** for failed requests
- **Optimistic updates** for better UX

---

## Using TanStack: Example with Strikes Feature (wip)

This project uses React Query's `useQuery` and `useMutation` hooks for data fetching and updates. Here’s how to organize your files and use these hooks, using the `strikes` feature as an example:

### File Structure for API and Data Layers

```
strikes/
├── api/
│   ├── api.ts           # API calls (fetch, add, edit, delete)
│   ├── mapper.ts        # Maps API types to domain models
│   ├── types.ts         # API request/response types
├── data/
│   ├── keys.ts          # Query key factory for React Query
│   ├── mutations.ts     # React Query mutation hooks
│   ├── strike-queries.ts # React Query query hooks
```

- `api.ts`: clean calls using axios
- `mapper.ts`: Sometimes we get from the backend more information than we are using in our UI, or the information is arranged differently. Because of this, it's good to separate the business logic that transforms API responses into the shape your UI needs.
  This file contains functions that map API types (often matching backend structure) to domain models (used in your frontend), ensuring consistency and making it easier to adapt if the backend changes or if you want to refactor your UI.
  For example, you might convert snake_case fields to camelCase, filter out unused properties, or maybe flatten nested data/
- `types.ts`: specifies the request and response type. This way it's very clear to see what data is sent to the backend and what we expect to get back.

-`keys.ts`: In this file we define the key factory for the queries used in the feature. Query keys are unique identifiers for each query in React Query. They help React Query know which data to cache, refetch, or update.
A key factory is a function or object that generates consistent, structured keys for your queries. This makes it easy to manage cache and invalidation, especially as your feature grows.

- `mutations.ts`: This file contains React Query mutation hooks for creating, updating, or deleting data. Mutations trigger changes on the server and, on success, typically invalidate relevant queries to keep the UI in sync.
- `queries.ts`: This file contains React Query query hooks for fetching data from the server. Queries use structured keys to manage caching, loading states, and automatic refetching, making data fetching reliable and efficient.

### Example: Fetching Strikes with useQuery

`data/strike-queries.ts`:

```typescript
import { useQuery } from '@tanstack/react-query';
import { getStrikes } from '../api/api';
import { strikeKeys } from './keys';

export const useGetStrikes = (traineeId: string) =>
  useQuery({
    queryKey: strikeKeys.list(traineeId),
    queryFn: () => getStrikes(traineeId),
  });
```

`data/keys.ts`:

```typescript
export const strikeKeys = {
  all: ['strikes'],
  list: (traineeId: string) => [...strikeKeys.all, 'list', traineeId],
};
```

> 💡 **Note:** This function creates two query keys for us.
>
> 1. all: the key looks like this: ['strikes']
> 2. list: the key looks like this: ['stikes', 'list', `traineeId`].
>    And when invalidating the cache, if you do `queryKey: strikeKeys.list(traineeId)`, it invalidates the cache for this specific traineeId. But if you call `queryKey: strikeKeys.all()`, it will invalidate all the cache queries that start with 'strikes'. Which is pretty cool :)

`api/api.ts`:

```typescript
import axios from 'axios';
import { StrikeResponse } from './types';
import { mapStrikeToDomain } from './mapper';

export const getStrikes = async (traineeId: string) => {
  const { data } = await axios.get<StrikeResponse[]>(`/api/trainees/${traineeId}/strikes`);
  return data.map((strike) => mapStrikeToDomain(strike));
};
```

As you can see, the reporter details we get from the backend are nested.

```typescript
export interface StrikeResponse {
  id: string;
  comments: string;
  date: string; // ISO string from backend
  reason: StrikeReason;
  reporter: ReporterDTO;
}

interface ReporterDTO {
  id: string;
  name: string;
  imageUrl?: string;
}
```

And the strikes model that is used in the frontend is flattend. We are also ignoring the reported id because it is not used in the Strikes component.

```typescript
// models/strike.ts
export interface Strike {
  id: string;
  comments: string;
  date: Date;
  reason: StrikeReason;
  reporterName?: string;
  reporterImageUrl?: string;
}
```

### Using the Hook in a Component

```typescript
const { data: strikes, isPending } = useGetStrikes(traineeId);
```

### Example: Mutating Strikes Data

To add, edit, or delete a strike, use a mutation hook from `data/mutations.ts`:

```typescript
export const useAddStrike = (traineeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (strike: Strike) => {
      return addStrike(traineeId, strike);
    },
    onSuccess: async () => await invalidateStrikesQuery(queryClient, traineeId),
  });
};
```

```typescript
import { useAddStrike } from './data/mutations';

const { mutate: addStrike, isPending } = useAddStrike(traineeId);

// Add a new strike
addStrike(newStrike, {
  onSuccess: () => {
    // Optionally update UI or show a success message
  },
  onError: (error) => {
    // Handle error
  },
});
```

> **Note:** On success, the mutation will invalidate the relevant query so the UI stays in sync with the server.
> This structure keeps your API logic, data fetching, and UI code clean and maintainable. Use this pattern for new features!
