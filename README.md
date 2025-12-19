# Real-Time Chat Application

A full-stack real-time one-to-one chat application built with Next.js, Express.js, Socket.IO, and MongoDB.

## Features

- 🔐 JWT Authentication (Register, Login, Logout)
- 💬 Real-time messaging with Socket.IO
- 👥 Online/Offline user status tracking
- 📜 Chat history storage and retrieval
- ⌨️ Typing indicators
- ✅ Message read receipts
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive design

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
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
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
- **Response:**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "token": "jwt_token_here",
      "user": {
        "id": "user_id",
        "username": "johndoe",
        "email": "john@example.com",
        "isOnline": false
      }
    }
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
- **Response:** Same as register

#### Get Current User
- **GET** `/api/auth/me`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "user_id",
        "username": "johndoe",
        "email": "john@example.com",
        "isOnline": true,
        "lastSeen": "2024-01-01T00:00:00.000Z"
      }
    }
  }
  ```

#### Logout User
- **POST** `/api/auth/logout`
- **Headers:** `Authorization: Bearer <token>`

### Users

#### Get All Users
- **GET** `/api/users`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "users": [
        {
          "id": "user_id",
          "username": "johndoe",
          "email": "john@example.com",
          "isOnline": true,
          "lastSeen": "2024-01-01T00:00:00.000Z"
        }
      ]
    }
  }
  ```

#### Get Online Users
- **GET** `/api/users/online`
- **Headers:** `Authorization: Bearer <token>`

#### Get User by ID
- **GET** `/api/users/:userId`
- **Headers:** `Authorization: Bearer <token>`

### Messages

#### Get Chat History
- **GET** `/api/messages/:userId`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "messages": [
        {
          "id": "message_id",
          "senderId": "sender_id",
          "senderUsername": "johndoe",
          "receiverId": "receiver_id",
          "receiverUsername": "janedoe",
          "content": "Hello!",
          "isRead": false,
          "readAt": null,
          "createdAt": "2024-01-01T00:00:00.000Z"
        }
      ],
      "chatId": "chat_id"
    }
  }
  ```

#### Get Chats List
- **GET** `/api/messages/chats/list`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "chats": [
        {
          "chatId": "chat_id",
          "otherUser": {
            "id": "user_id",
            "username": "janedoe",
            "email": "jane@example.com",
            "isOnline": true
          },
          "lastMessage": {
            "id": "message_id",
            "content": "Hello!",
            "senderId": "sender_id",
            "createdAt": "2024-01-01T00:00:00.000Z"
          },
          "lastMessageAt": "2024-01-01T00:00:00.000Z",
          "updatedAt": "2024-01-01T00:00:00.000Z"
        }
      ]
    }
  }
  ```

## Socket.IO Events

### Client to Server Events

#### Connect
- **Event:** `connection`
- **Auth:** Token must be provided in `socket.handshake.auth.token`
- **Description:** Authenticates user and joins their personal room

#### Send Message
- **Event:** `send_message`
- **Payload:**
  ```json
  {
    "receiverId": "user_id",
    "content": "Hello, how are you?"
  }
  ```

#### Typing Start
- **Event:** `typing_start`
- **Payload:**
  ```json
  {
    "receiverId": "user_id"
  }
  ```

#### Typing Stop
- **Event:** `typing_stop`
- **Payload:**
  ```json
  {
    "receiverId": "user_id"
  }
  ```

#### Mark Message as Read
- **Event:** `mark_message_read`
- **Payload:**
  ```json
  {
    "messageId": "message_id"
  }
  ```

### Server to Client Events

#### Message Sent (Confirmation)
- **Event:** `message_sent`
- **Payload:**
  ```json
  {
    "message": {
      "id": "message_id",
      "senderId": "sender_id",
      "receiverId": "receiver_id",
      "content": "Hello!",
      "isRead": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

#### Receive Message
- **Event:** `receive_message`
- **Payload:**
  ```json
  {
    "message": {
      "id": "message_id",
      "senderId": "sender_id",
      "senderUsername": "johndoe",
      "receiverId": "receiver_id",
      "content": "Hello!",
      "isRead": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

#### User Online
- **Event:** `user_online`
- **Payload:**
  ```json
  {
    "userId": "user_id",
    "username": "johndoe",
    "isOnline": true
  }
  ```

#### User Offline
- **Event:** `user_offline`
- **Payload:**
  ```json
  {
    "userId": "user_id",
    "username": "johndoe",
    "isOnline": false,
    "lastSeen": "2024-01-01T00:00:00.000Z"
  }
  ```

#### User Typing
- **Event:** `user_typing`
- **Payload:**
  ```json
  {
    "userId": "user_id",
    "username": "johndoe",
    "isTyping": true
  }
  ```

#### Message Read
- **Event:** `message_read`
- **Payload:**
  ```json
  {
    "messageId": "message_id",
    "readAt": "2024-01-01T00:00:00.000Z"
  }
  ```

#### Error
- **Event:** `error`
- **Payload:**
  ```json
  {
    "message": "Error message here"
  }
  ```

## Database Schema

### User
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  isOnline: Boolean (default: false),
  lastSeen: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Message
```javascript
{
  senderId: ObjectId (ref: User),
  receiverId: ObjectId (ref: User),
  content: String (required, max: 1000),
  isRead: Boolean (default: false),
  readAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Chat
```javascript
{
  participants: [ObjectId] (ref: User, exactly 2),
  lastMessage: ObjectId (ref: Message),
  lastMessageAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Environment Variables

### Backend (.env)
```env
PORT=5000
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/japam_chat
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

### Frontend (.env.local) - Optional
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

## Development

### Backend Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Testing the Application

1. Start MongoDB (if using local instance)
2. Start backend server: `cd backend && npm run dev`
3. Start frontend server: `cd frontend && npm run dev`
4. Open `http://localhost:3000` in your browser
5. Register a new account or login
6. Start chatting with other users!

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env` file
- For MongoDB Atlas, ensure your IP is whitelisted

### Socket.IO Connection Issues
- Check CORS settings in backend
- Verify `CLIENT_URL` matches your frontend URL
- Ensure JWT token is being sent in socket handshake

### Authentication Issues
- Verify JWT_SECRET is set in backend `.env`
- Check token expiration settings
- Ensure token is stored in localStorage after login

## License

ISC

