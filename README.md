# Real-Time Chat Application

A full-stack real-time one-to-one chat application built with Next.js, Express.js, Socket.IO, and MongoDB.

## 🌐 Live Demo

- **Frontend**: [https://japam-chat-socket-io.vercel.app/](https://japam-chat-socket-io.vercel.app/)
- **Backend API**: [https://japam-chat-socket-io.onrender.com](https://japam-chat-socket-io.onrender.com)

## Features

- 🔐 JWT Authentication (Register, Login, Logout)
- 💬 Real-time messaging with Socket.IO
- 👥 Online/Offline user status tracking
- 📜 Chat history storage and retrieval
- ⌨️ Typing indicators
- ✅ Message read receipts (Grey tick = sent, Blue tick = read)
- 🎨 Modern UI with Tailwind CSS
- 🌙 Dark mode support
- 📱 Responsive design
- 🔍 User search functionality
- ⚡ Smooth animations and transitions
- 🔄 Auto keep-alive to prevent server sleep (Render free tier)

## Tech Stack

### Backend
- Node.js
- Express.js
- Socket.IO
- MongoDB (Mongoose)
- JWT (jsonwebtoken)
- bcryptjs
- Axios (for keep-alive)

### Frontend
- Next.js
- React
- Tailwind CSS
- Socket.IO Client

## Project Structure

```
japam_assignment_backend/
├── backend/          # Express.js backend
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── socket/
│   │   ├── services/
│   │   └── server.js
│   └── package.json
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
cp env.example .env
```

4. Update `.env` with your configuration:
```env
PORT=5000
SERVER_URL=https://japam-chat-socket-io.onrender.com
CLIENT_URL=http://localhost:3000,https://japam-chat-socket-io.vercel.app
MONGODB_URI=mongodb://localhost:27017/japam_chat
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
KEEP_ALIVE_ENABLED=true
```

5. Start the server:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file (optional, defaults are set):
```env
NEXT_PUBLIC_API_URL=https://japam-chat-socket-io.onrender.com
NEXT_PUBLIC_SOCKET_URL=https://japam-chat-socket-io.onrender.com
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

### Running Both Servers

Open two terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

## Deployment

### Backend (Render)

1. Connect your GitHub repository to Render
2. Set build command: `cd backend && npm install`
3. Set start command: `cd backend && npm start`
4. Add environment variables in Render dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CLIENT_URL` (your Vercel frontend URL)
   - `SERVER_URL` (your Render backend URL)
   - `KEEP_ALIVE_ENABLED=true`

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set root directory to `frontend`
3. Add environment variables:
   - `NEXT_PUBLIC_API_URL` (your Render backend URL)
   - `NEXT_PUBLIC_SOCKET_URL` (your Render backend URL)

## Keep-Alive Feature

The backend includes an automatic keep-alive service that pings the server every 14 minutes to prevent Render's free tier from sleeping. This is automatically enabled when:
- `RENDER` environment variable is set (automatically set by Render)
- OR `KEEP_ALIVE_ENABLED=true` is set

## API Endpoints

### Authentication

#### Register User
- **POST** `/api/auth/register`
- **Body:**
  ```json
  {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

#### Login User
- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

#### Get Current User
- **GET** `/api/auth/me`
- **Headers:** `Authorization: Bearer <token>`

#### Logout User
- **POST** `/api/auth/logout`
- **Headers:** `Authorization: Bearer <token>`

### Users

#### Get All Users
- **GET** `/api/users`
- **Headers:** `Authorization: Bearer <token>`

#### Get Online Users
- **GET** `/api/users/online`
- **Headers:** `Authorization: Bearer <token>`

### Messages

#### Get Chat History
- **GET** `/api/messages/:userId`
- **Headers:** `Authorization: Bearer <token>`

#### Get Chats List
- **GET** `/api/messages/chats/list`
- **Headers:** `Authorization: Bearer <token>`

### Health Check

#### Server Health
- **GET** `/api/health`
- Returns server status and uptime

## Socket.IO Events

### Client to Server Events

#### Send Message
- **Event:** `send_message`
- **Payload:**
  ```json
  {
    "receiverId": "user_id",
    "content": "Hello, how are you?"
  }
  ```

#### Typing Start/Stop
- **Event:** `typing_start` / `typing_stop`
- **Payload:**
  ```json
  {
    "receiverId": "user_id"
  }
  ```

### Server to Client Events

#### Receive Message
- **Event:** `receive_message`
- **Payload:**
  ```json
  {
    "message": {
      "id": "message_id",
      "senderId": "sender_id",
      "content": "Hello!",
      "isRead": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

#### User Online/Offline
- **Event:** `user_online` / `user_offline`
- **Payload:**
  ```json
  {
    "userId": "user_id",
    "username": "johndoe",
    "isOnline": true
  }
  ```

## Environment Variables

### Backend (.env)
```env
PORT=5000
SERVER_URL=https://japam-chat-socket-io.onrender.com
CLIENT_URL=http://localhost:3000,https://japam-chat-socket-io.vercel.app
MONGODB_URI=mongodb://localhost:27017/japam_chat
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
KEEP_ALIVE_ENABLED=true
```

### Frontend (.env.local) - Optional
```env
NEXT_PUBLIC_API_URL=https://japam-chat-socket-io.onrender.com
NEXT_PUBLIC_SOCKET_URL=https://japam-chat-socket-io.onrender.com
```

## License

ISC
