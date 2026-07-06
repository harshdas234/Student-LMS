const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User Schema
// Defines the structure of a user document in MongoDB.
const UserSchema = new mongoose.Schema({

  // Basic user information
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true, // Ensures no duplicate email addresses
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },

  // User role determines access permissions
  role: {
    type: String,
    enum: ['student', 'instructor'],
    default: 'student',
  },

  // Password is stored as a hashed value
  // 'select: false' prevents it from being returned in queries by default
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },

  // Automatically stores the account creation date
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


// Middleware
// Hash the user's password before saving it to the database.
UserSchema.pre('save', async function () {

    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

});


// Instance Method
// Generates a JSON Web Token (JWT) after successful login.
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    {
      id: this._id,
      role: this.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};


// Instance Method
// Compares the entered password with the hashed password stored in the database.
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


// Export the User model
module.exports = mongoose.model('User', UserSchema);