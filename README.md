# Real-Time Chat Application

A full-stack real-time one-to-one chat application built with Next.js, Express.js, Socket.IO, and MongoDB.

## Features

- 🔐 JWT Authentication
- 💬 Real-time messaging with Socket.IO
- 👥 Online/Offline user status
- 📜 Chat history storage and retrieval
- 🎨 Modern UI with Tailwind CSS

## Tech Stack

### Backend
- Node.js
- Express.js
- Socket.IO
- MongoDB (Mongoose)
- JWT (jsonwebtoken)
- bcryptjs

### Frontend
- Next.js
- React
- Tailwind CSS
- Socket.IO Client

## Project Structure

```
japam_assignment_backend/
├── backend/          # Express.js backend
├── frontend/         # Next.js frontend
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
PORT=5000
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/japam_chat
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
```

5. Start the server:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

(To be added in Phase 7)

## API Endpoints

(To be documented as implementation progresses)

## Socket.IO Events

(To be documented as implementation progresses)

## License

ISC

