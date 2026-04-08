# Expense Sharing App

A simplified Splitwise-style full-stack app for creating groups, adding shared expenses, tracking balances, and viewing settlement suggestions.

## Stack

- Backend: Node.js, Express, MongoDB, Mongoose, Multer
- Frontend: React, Vite, Tailwind CSS

## Features

- Create groups with multiple members
- Add expenses for a selected group
- Upload bill images with expenses
- View group expenses, balances, and settlement transactions
- Delete groups from the dashboard

## Run Locally

### 1. Start MongoDB

This project is currently configured for a local MongoDB instance at:

```bash
mongodb://127.0.0.1:27017/expense-tracker
```

If you are using Docker, this works with:

```bash
docker volume create mongo-data
docker run -d \
  --name expense-tracker-mongo \
  -p 27017:27017 \
  -v mongo-data:/data/db \
  mongo:8.0
```

### 2. Start the backend

From the project root:

```bash
npm install
npm start
```

Backend runs on:

```bash
http://localhost:5001
```

### 3. Start the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

## Notes

- Bill images are stored locally in the `uploads/` folder.
- The frontend uses Vite proxying for backend API requests during development.
