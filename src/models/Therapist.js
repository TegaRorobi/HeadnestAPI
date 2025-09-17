
const mongoose = require('mongoose');

const therapistSchema = new mongoose.Schema({
  // This is a "foreign key" link to the User model, which would store ObjectId of the User document.
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  specialization: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  qualifications: {
    type: [String], // An array of strings for qualifications
    default: []
  },
  rate: {
    type: Number,
    required: [true, 'Rate is required'],
    min: [0, 'Rate cannot be negative']
  }, 
  avatar: {
    type: String, // A URL for the avatar image
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Therapist', therapistSchema);
