
// DATABASE CONNECTION
// MongoDB se connect karne ke liye

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // MongoDB se connection banao
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Agar error aaye toh show karo aur server band karo
    console.error(`❌ MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
