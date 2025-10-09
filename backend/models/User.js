
// USER MODEL
// User ka data structure (naam, email, password)

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User Schema - User ka blueprint
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name zaroori hai'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email zaroori hai'],
      unique: true,                    
      lowercase: true,            
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Valid email dalo'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password zaroori hai'],
      minlength: 6,                    // Minimum 6 characters
      select: false                   
    }
  },
  {
    timestamps: true                   // createdAt aur updatedAt automatically add hoga
  }
);

// Password ko save karne se pehle encrypt karo (Security ke liye)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// JWT Token generate karo (Login ke baad user ko token milega)
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Password match karo (Login ke time check karne ke liye)
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
