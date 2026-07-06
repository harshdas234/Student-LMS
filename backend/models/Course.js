const mongoose = require('mongoose');

// Course Schema
// Defines the structure of a course document in MongoDB.
const CourseSchema = new mongoose.Schema({

  // Basic course information
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a course title'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },

  // Instructor who created the course
  // Stores the ObjectId of a User document
  instructor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },

  // Course pricing and thumbnail
  price: {
    type: Number,
    default: 0,
  },
  thumbnail: {
    type: String,
    default: 'no-photo.jpg',
  },

  // Students enrolled in the course
  // Each entry references a User document
  enrolledStudents: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],

  // Course content organized into modules and lessons
  modules: [{
    title: String,
    lessons: [{
      title: String,
      content: String,
      videoUrl: String,
      duration: String
    }]
  }],

  // Automatically stores the course creation date
  createdAt: {
    type: Date,
    default: Date.now,
  },

});

// Export the Course model
module.exports = mongoose.model('Course', CourseSchema);