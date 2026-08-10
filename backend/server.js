// Yeh main server file hai


const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');

// Step 1: .env file se environment variables load karo
dotenv.config();
// console.log("JWT_SECRET =", process.env.JWT_SECRET);

// Step 2: MongoDB se connect karo
connectDB();

// Step 3: Express app banao
const app = express();

// Step 4: Middleware setup (JSON data accept karne ke liye)
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://task-tracker-app-2-pzqx.onrender.com"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Step 5: API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Step 6: Root route (check karne ke liye server chal raha hai ya nahi)
app.get('/', (req, res) => {
  res.json({ message: '✅ Task Tracker API is running!' });
});

// Step 7: Server start karo
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
