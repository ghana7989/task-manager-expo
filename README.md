# Task Manager App

A full-stack task management application built with React Native (Expo) and Node.js. The app features user authentication, task management with CRUD operations, and real-time UI updates.

## Features

- **User Authentication**
  - Secure signup and login
  - JWT-based authentication
  - Protected routes
  - Automatic token management

- **Task Management**
  - Create new tasks
  - View task list with pull-to-refresh
  - Update task details
  - Toggle task completion status
  - Delete tasks
  - Optimistic UI updates

- **Modern UI/UX**
  - Material Design using React Native Paper
  - Responsive layout
  - Loading states and error handling
  - Smooth animations and transitions
  - Pull-to-refresh functionality

## Tech Stack

### Frontend (Mobile App)
- React Native with Expo
- TypeScript for type safety
- Expo Router for navigation
- React Native Paper for UI components
- Axios for API calls
- AsyncStorage for token management

### Backend (API Server)
- Node.js & Express
- MongoDB with Mongoose
- JWT for authentication
- RESTful API architecture
- Middleware for route protection

## Project Structure

```
task-manager/
├── client/                 # React Native Expo app
│   ├── app/               # App directory (Expo Router)
│   │   ├── (app)/        # Protected app routes
│   │   ├── (auth)/       # Authentication routes
│   │   ├── context/      # React Context providers
│   │   └── lib/          # Utilities and API client
│   └── package.json      # Frontend dependencies
│
└── server/               # Node.js backend
    ├── src/             # Source directory
    │   ├── controllers/ # Route controllers
    │   ├── middleware/  # Express middleware
    │   ├── models/      # Mongoose models
    │   └── routes/      # API routes
    └── package.json     # Backend dependencies
```

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- MongoDB instance
- Expo Go app (for mobile testing)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd task-manager
   ```

2. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the server directory:
   ```
   PORT=5001
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

4. Install frontend dependencies:
   ```bash
   cd ../client
   npm install
   ```

### Running the App

1. Start the backend server:
   ```bash
   cd server
   npm start
   ```

2. Start the Expo development server:
   ```bash
   cd client
   npx expo start
   ```

3. Use the Expo Go app to scan the QR code and run the app on your device

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user

### Tasks
- `GET /api/tasks` - Get all tasks for logged-in user
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get specific task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Expo](https://docs.expo.dev/) for the amazing React Native development platform
- [React Native Paper](https://callstack.github.io/react-native-paper/) for the Material Design components
- [MongoDB](https://www.mongodb.com/) for the database solution
