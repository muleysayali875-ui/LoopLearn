# LoopLearn — Student Resource Exchange

LoopLearn is a student platform where students can donate, exchange, or lend educational resources such as textbooks, notes, calculators, and lab supplies.

## Features

- Browse available educational resources.
- Share resources with other students.
- Add and manage resource listings.
- Connect students who need or can share resources.
- Secure authentication for user accounts.

## Technology Stack

- **Frontend:** React, Vite, React Router, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT and bcrypt
- **Testing:** Vitest and Supertest

## Prerequisites

Install the following before running the project:

- Node.js 18 or later
- npm 9 or later
- MongoDB Atlas account or a local MongoDB instance

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/muleysayali875-ui/LoopLearn.git
cd LoopLearn
```

### 2. Set Up the Backend

Open a terminal in the project root and run:

```powershell
cd backend
npm install
Copy-Item .env.example .env
```

Open `backend/.env` and configure the required environment variables. Use your own MongoDB connection string and a secure JWT secret.

Start the backend:

```powershell
npm run dev
```

The backend runs at:

`http://localhost:5000`

### 3. Set Up the Frontend

Open a **second terminal** in the project root and run:

```powershell
cd frontend
npm install
Copy-Item .env.example .env
```

Configure `frontend/.env` if required. For local development, the API URL is typically:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend:

```powershell
npm run dev
```

Open the local URL displayed in the terminal, typically:

`http://localhost:5173`

## Environment Variables

Keep environment variables in local `.env` files.

- **Backend:** Configure the database connection, server settings, JWT secret, and other required backend variables.
- **Frontend:** Configure the backend API URL using `VITE_API_BASE_URL`.

Refer to the corresponding `.env.example` files for the exact variable names required by the project.

## Security

- Never commit `.env` files or real credentials to GitHub.
- Keep database credentials and JWT secrets private.
- Use strong secrets and appropriate production environment settings when deploying.

## License

This project was developed as a student project.
