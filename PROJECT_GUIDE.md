# 📚 Task Tracker - Complete Project Guide

## 🎯 Project Overview
This is a **MERN Stack** application where users can manage their tasks. It includes Authentication, Light/Dark mode, and a beautiful UI.

---

## 📁 Project Structure

```
task-tracker-mern/
├── backend/                    # Server-side code (Node.js + Express)
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   └── authController.js  # Login/Register logic
│   ├── middleware/
│   │   └── auth.js            # JWT token verification
│   ├── models/
│   │   ├── User.js            # User schema (email, password)
│   │   └── Task.js            # Task schema (title, status, priority)
│   ├── routes/
│   │   ├── authRoutes.js      # Auth API routes
│   │   └── taskRoutes.js      # Task CRUD routes
│   ├── .env                   # Environment variables
│   ├── .env.example           # Example env file
│   ├── package.json           # Dependencies list
│   └── server.js              # Main server file
│
├── frontend/                   # Client-side code (React + Vite)
│   ├── src/
│   │   ├── api/
│   │   │   └── taskApi.js     # Backend API calls
│   │   ├── components/
│   │   │   ├── Login.jsx      # Login form
│   │   │   ├── Register.jsx   # Register form
│   │   │   ├── TaskForm.jsx   # New task form
│   │   │   ├── TaskItem.jsx   # Single task display
│   │   │   └── TaskList.jsx   # All tasks display
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # User authentication state
│   │   │   └── ThemeContext.jsx  # Light/Dark mode state
│   │   ├── App.jsx            # Main app component
│   │   ├── main.jsx           # React entry point
│   │   └── index.css          # All styles
│   ├── index.html             # HTML template
│   ├── package.json           # Dependencies list
│   └── vite.config.js         # Vite configuration
│
├── .gitignore                 # Git ignore file
└── README.md                  # Project documentation
```

---

## 🔧 Backend Files Explained

### 1. **server.js** (Main Server File)
**What it does:**
- Starts the Express server
- Connects to MongoDB
- Sets up routes
- Runs the server on port 5000

**Important Code:**
```javascript
app.use('/api/auth', authRoutes);    // Login/Register routes
app.use('/api/tasks', taskRoutes);   // Task CRUD routes
```

---

### 2. **config/db.js** (Database Connection)
**What it does:**
- Creates a connection to MongoDB
- Uses MONGODB_URI from the `.env` file
- Shows a message when connection is successful

**Important:**
- Will throw an error if MongoDB is not running
- Connection string must be in the `.env` file

---

### 3. **models/User.js** (User Schema)
**What it does:**
- Defines the user data structure (name, email, password)
- Encrypts password using bcrypt (for security)
- Generates JWT token (after login)
- Matches password (during login)

**Fields:**
- `name` - User's name (required)
- `email` - Unique email (required, lowercase)
- `password` - Encrypted password (minimum 6 characters)

**Important Methods:**
- `getSignedJwtToken()` - Creates JWT token
- `matchPassword()` - Verifies password

---

### 4. **models/Task.js** (Task Schema)
**What it does:**
- Defines the task data structure
- Each task is linked to a user

**Fields:**
- `title` - Task title (required, max 100 chars)
- `description` - Task details (optional, max 500 chars)
- `status` - pending / in-progress / completed
- `priority` - low / medium / high
- `dueDate` - Due date (optional)
- `user` - Which user owns the task (required)

---

### 5. **controllers/authController.js** (Auth Logic)
**What it does:**
- Handles Register, Login, and GetMe functions

**Functions:**

**a) register** - Creates a new user
- Returns error if email already exists
- Encrypts and saves the password
- Returns JWT token

**b) login** - Logs in the user
- Checks email and password
- Returns token if password matches
- Returns error for invalid credentials

**c) getMe** - Returns current logged in user's info
- Identifies user from JWT token

---

### 6. **middleware/auth.js** (JWT Verification)
**What it does:**
- Secures protected routes
- Verifies JWT token
- Proceeds with request if token is valid
- Returns 401 error if token is invalid

**Usage:**
```javascript
router.get('/api/tasks', protect, getTasks);  // protect middleware
```

---

### 7. **routes/authRoutes.js** (Auth API Routes)
**Routes:**
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user's info (protected)

---

### 8. **routes/taskRoutes.js** (Task API Routes)
**What it does:**
- Handles all CRUD operations for tasks
- All routes are protected (login required)

**Routes:**
- `GET /api/tasks` - Get all tasks of logged in user
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

**Security:**
- Each route checks if the task belongs to the user
- Cannot access other users' tasks

---

## 🎨 Frontend Files Explained

### 1. **main.jsx** (Entry Point)
**What it does:**
- Starts the React app
- Wraps with ThemeProvider and AuthProvider
- Renders the App component

**Providers:**
- `ThemeProvider` - Manages Light/Dark mode
- `AuthProvider` - Manages user authentication

---

### 2. **App.jsx** (Main Component)
**What it does:**
- Shows Login/Register page if user is not logged in
- Shows Task Tracker if user is logged in
- Fetches tasks
- Handles Add, Update, Delete operations

**States:**
- `tasks` - List of all tasks
- `loading` - Loading state
- `error` - Error messages
- `showRegister` - Whether to show Login or Register page

**Functions:**
- `fetchTasks()` - Fetches tasks from backend
- `handleAddTask()` - Adds a new task
- `handleUpdateTask()` - Updates a task
- `handleDeleteTask()` - Deletes a task

---

### 3. **context/AuthContext.jsx** (Authentication State)
**What it does:**
- Manages user authentication state
- Provides Login, Register, Logout functions
- Saves JWT token in localStorage

**States:**
- `user` - Current logged in user's info
- `token` - JWT token
- `loading` - Auth loading state

**Functions:**
- `register(name, email, password)` - Registers user
- `login(email, password)` - Logs in user
- `logout()` - Logs out user
- `loadUser()` - Loads user info from token

**How it works:**
1. Checks for token when page loads
2. Fetches user info if token exists
3. Shows login page if token doesn't exist

---

### 4. **context/ThemeContext.jsx** (Theme State)
**What it does:**
- Manages Light/Dark mode
- Saves theme in localStorage
- Updates CSS when theme changes

**States:**
- `theme` - 'light' or 'dark'

**Functions:**
- `toggleTheme()` - Switches between Light ↔ Dark

**How it works:**
1. Loads saved theme from localStorage
2. Default is light mode
3. Theme changes via toggle button
4. Sets `data-theme` attribute

---

### 5. **components/Login.jsx** (Login Form)
**What it does:**
- Email and password input fields
- Calls AuthContext's login function on Login button click
- Shows error messages
- Option to switch to Register page

**Validation:**
- Email and password are required
- Shows error for invalid credentials

---

### 6. **components/Register.jsx** (Register Form)
**What it does:**
- Name, Email, Password, Confirm Password fields
- Calls AuthContext's register function on Register button click
- Checks if passwords match
- Minimum 6 characters validation

**Validation:**
- All fields are required
- Password and Confirm Password must match
- Password must be minimum 6 characters

---

### 7. **components/TaskForm.jsx** (New Task Form)
**What it does:**
- Form to add a new task
- Title, Description, Status, Priority, Due Date fields
- Passes data to parent component on submit

**Fields:**
- Title (required)
- Description (optional)
- Status (pending/in-progress/completed)
- Priority (low/medium/high)
- Due Date (optional)

---

### 8. **components/TaskItem.jsx** (Single Task Display)
**What it does:**
- Displays a single task
- Can switch to edit mode
- Can update and delete tasks
- Shows priority and status badges

**Features:**
- Edit button - To edit the task
- Delete button - To delete the task
- Color-coded priority badges
- Status indicators

---

### 9. **components/TaskList.jsx** (All Tasks Display)
**What it does:**
- Shows list of all tasks
- Shows task statistics (pending, in-progress, completed)
- Shows empty state when there are no tasks

**Features:**
- Task count by status
- Responsive grid layout
- Empty state message

---

### 10. **api/taskApi.js** (API Calls)
**What it does:**
- Makes backend API calls
- Automatically adds JWT token to headers
- Handles errors

**Functions:**
- `getTasks()` - Fetch all tasks
- `createTask(taskData)` - Create a new task
- `updateTask(id, taskData)` - Update a task
- `deleteTask(id)` - Delete a task

**Important:**
- JWT token is sent in every request
- Token is automatically fetched from localStorage

---

### 11. **index.css** (All Styles)
**What it does:**
- All styling in one file
- Uses CSS variables (easy theming)
- Separate colors for Light and Dark mode
- Responsive design (mobile, tablet, desktop)

**Key Features:**
- `:root` - Light mode colors
- `[data-theme="dark"]` - Dark mode colors
- Glassy card effects
- Smooth animations
- Mobile-first responsive design

**Color Variables:**
- `--primary-color` - Main theme color
- `--text-primary` - Text color
- `--card-bg` - Card background
- `--border-color` - Border color

---

## 🔐 Authentication Flow

### Registration:
1. User fills the Register form
2. Frontend calls `AuthContext.register()`
3. Backend runs `authController.register`
4. Password is encrypted with bcrypt
5. User is saved in database
6. JWT token is generated
7. Token is returned to frontend
8. Token is saved in localStorage
9. User is automatically logged in

### Login:
1. User fills the Login form
2. Frontend calls `AuthContext.login()`
3. Backend runs `authController.login`
4. User is found by email
5. Password match is checked
6. JWT token is generated if match
7. Token is returned to frontend
8. Token is saved in localStorage
9. User is logged in

### Protected Routes:
1. Frontend sends token in every API call
2. Backend `auth.protect` middleware verifies token
3. Request proceeds if token is valid
4. Returns 401 error if token is invalid

---

## 🎨 Theme System

### Light Mode:
- Background: Light gradient
- Cards: White with transparency
- Text: Dark colors
- Default theme

### Dark Mode:
- Background: Dark gradient
- Cards: Dark with transparency
- Text: Light colors
- Activated via toggle

### How it works:
1. ThemeContext manages theme state
2. `data-theme` attribute is set when theme changes
3. CSS variables are automatically updated
4. Theme is saved in localStorage
5. Theme persists on page reload

---

## 🔄 Task Management Flow

### Create Task:
1. User fills the TaskForm
2. `handleAddTask()` function is called
3. `createTask()` API call is made
4. Backend saves task in database
5. New task is added to frontend state
6. TaskList is updated

### Update Task:
1. User clicks Edit button
2. TaskItem switches to edit mode
3. User makes changes
4. `handleUpdateTask()` is called on Save button click
5. `updateTask()` API call is made
6. Backend updates the task
7. Frontend state is updated

### Delete Task:
1. User clicks Delete button
2. Confirmation dialog is shown
3. `handleDeleteTask()` is called on confirmation
4. `deleteTask()` API call is made
5. Backend deletes the task
6. Task is removed from frontend state

---

## 🚀 How to Run

### Backend:
```bash
cd backend
npm install
# Create .env file:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-tracker
JWT_SECRET=yourSecretKey123
JWT_EXPIRE=30d

npm run dev
```

### Frontend:
```bash
cd frontend
npm install
npm run dev
```

### Access:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

---

## 📊 Database Schema

### Users Collection:
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (encrypted),
  createdAt: Date,
  updatedAt: Date
}
```

### Tasks Collection:
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  status: String (pending/in-progress/completed),
  priority: String (low/medium/high),
  dueDate: Date,
  user: ObjectId (reference to User),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔑 Key Concepts

### 1. **JWT (JSON Web Token)**
- Token is received when user logs in
- Token is sent in every request
- Backend verifies token to identify user
- Token is saved in localStorage

### 2. **bcrypt (Password Hashing)**
- Password is not saved in plain text
- Encrypted with bcrypt before saving
- Password is compared during login
- Essential for security

### 3. **Context API**
- React's state management
- AuthContext - User state
- ThemeContext - Theme state
- All components can access it

### 4. **Protected Routes**
- Some routes require login
- Middleware checks token
- 401 error for invalid token
- Essential for security

### 5. **Responsive Design**
- Mobile, Tablet, Desktop support
- Uses CSS media queries
- Flexible layouts
- Touch-friendly buttons

---

## ❌ Common Errors & Solutions

### 1. "MongoDB connection error"
**Problem:** MongoDB is not running
**Solution:** Start MongoDB with `mongod` command

### 2. "Invalid credentials"
**Problem:** Email or password is incorrect
**Solution:** Enter correct email and password

### 3. "User already exists"
**Problem:** Email is already registered
**Solution:** Login or use a different email

### 4. "Failed to fetch tasks"
**Problem:** Backend is not running
**Solution:** Start the backend server

### 5. "Token expired"
**Problem:** JWT token has expired
**Solution:** Logout and login again

---

## 🎯 Important Notes

✅ **Email/Password is Dynamic** - Whatever you register with will work for login
✅ **Password is Secure** - Encrypted with bcrypt
✅ **JWT Token** - Valid for 30 days
✅ **Light/Dark Mode** - Theme toggle button in header
✅ **Responsive** - Perfect on both mobile and desktop
✅ **Private Tasks** - Each user has their own tasks
✅ **Real-time Updates** - Task add/update/delete reflects instantly

---

## 📝 Summary

### Backend (Node.js + Express + MongoDB):
- **server.js** - Main server
- **db.js** - Database connection
- **User.js** - User model
- **Task.js** - Task model
- **authController.js** - Login/Register logic
- **auth.js** - JWT verification
- **authRoutes.js** - Auth API routes
- **taskRoutes.js** - Task CRUD routes

### Frontend (React + Vite):
- **main.jsx** - Entry point
- **App.jsx** - Main component
- **AuthContext.jsx** - User state
- **ThemeContext.jsx** - Theme state
- **Login.jsx** - Login form
- **Register.jsx** - Register form
- **TaskForm.jsx** - New task form
- **TaskItem.jsx** - Single task
- **TaskList.jsx** - All tasks
- **taskApi.js** - API calls
- **index.css** - All styles

---

## 🎓 Learning Points

1. **MERN Stack** - MongoDB, Express, React, Node.js
2. **JWT Authentication** - Secure login system
3. **Password Hashing** - bcrypt for security
4. **Context API** - State management
5. **RESTful API** - CRUD operations
6. **Responsive Design** - Mobile-first approach
7. **Dark Mode** - Theme switching
8. **Protected Routes** - Middleware authentication

---

**Happy Coding! 🚀**
