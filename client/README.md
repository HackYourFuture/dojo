# 🔩 React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## ⚙️ Setup

In the client directory:

1. Configure the client in `.env`
2. Go to terminal and run:

```terminal
$ cd client
$ npm i
$ npm start
```

3. Navigate to `http://localhost:5173`

## 🗂️ Client Structure

- `src/`: Contains all React components and application logic.
- `assets/`: Contains all the assets and images used.
- `components/`: Reusable UI components.
- `hooks/`: API calls and data fetching logic.
- `models/`: Contains TypeScript interfaces, types, and enums.
- `pages/`: Main application pages (Login, Dashboard, TraineeProfile, etc.).
- `routes/`: Contains Routes and navigating between different pages logic.
- `styles/`: CSS and styling files.
