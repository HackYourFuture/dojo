# Dojo

## Overview

Dojo is HackYourFuture's in-house management tool designed to track HackYourFuture trainee progress, performance, attendance, assignments, graduation status, and other relevant data, facilitating efficient management of trainees information.

## Table of contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contributors / Contact](#contributors--contact)

## Features

- Track student progress and performance
- Monitor attendance
- Manage and track assignments
- Generate real-time reports
- Cohorts information
- User-friendly interface for instructors and administrators
- Secure authentication and authorization

## Technology Stack

This project is built using the MERN stack.

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![React Query](https://img.shields.io/badge/-React%20Query-FF4154?style=for-the-badge&logo=react%20query&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%2523323330.svg?style=for-the-badge&logo=typescript&logoColor=%2523F7DF1E)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-%23563D7C.svg?style=for-the-badge&logo=MUI&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Nodemon](https://img.shields.io/badge/NODEMON-%23323330.svg?style=for-the-badge&logo=nodemon&logoColor=%BBDEAD)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/HackYourFuture/dojo.git
   cd Dojo
   ```

2. Install dependencies for both server and client:

   ```bash
   cd server
   npm install
   cd ../client
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the `client` directory and add the following:

   ```
   VITE_APP_CLIENTID=YOUR_CLIENT_ID_FROM_GOOGLE

   VITE_BACKEND_PROXY_TARGET=https://dojo-test.hackyourfuture.net/
   ```

4. Setup and start backend server:
   Follow [these steps](server/README.md)

5. Start the frontend development server:
   Follow [these steps](client/README.md)

## Usage

1. Navigate to `http://localhost:5173` in your browser.
2. Log in with your HackYourFuture google account.
3. Search for a trainee to track trainee progress, contact information, manage attendance and assignments, and check employment status/history.
4. Use the dashboard to check reports about graduation percentage, country of origin, ...etc.

## Project Structure

### Server (Backend)

- `scripts/`: Entry point for the backend server.
- `src/`: Contains the following folders:
- `api-docs/`: Swagger api documentation.
- `controllers/`: Logic for handling requests and responses.
- `middleware/`: Custom middleware for authentication and validation.
- `models/`: Mongoose models for database schemas.
- `repositories/`:
- `routes/`: Contains Express routes for various functionalities.
- `schemas/`: Contains the structure and property of the schemas in DB.
- `services/`: Services logic.
- `utils/`: Reusable helper functions and logic.

### Client (Frontend)

- `src/`: Contains all React components and application logic.
- `assets/`: Contains all the assets and images used.
- `components/`: Reusable UI components.
- `hooks/`: API calls and data fetching logic.
- `pages/`: Main application pages (Login, Dashboard, TraineeProfile, etc.).
- `routes/`: Contains Routes and navigating between different pages logic.
- `styles/`: CSS and styling files.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Open a Pull Request.
6. Make sure the deployment build is successful.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributors / Contact

For any inquiries or feedback, please contact us:

- [Stas](https://github.com/stasel)
- [Aya](https://github.com/Aya-Alabrash)
- [Sima](https://github.com/sima-milli)
