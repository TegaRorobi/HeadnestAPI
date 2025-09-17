const mongoose = require('mongoose');

const moodCheckinSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mood: {
    type: String,
    enum: [
      'Happy',
      'Sad', 
      'Anxious',
      'Calm',
      'Excited',
      'Frustrated',
      'Peaceful',
      'Overwhelmed',
      'Worried',
      'Grateful',
      'Stressed'
    ],
    required: true
  },
  notes: {
    type: String,
    maxlength: 500,
    default: ''
  }
}, {
  timestamps: true
});

moodCheckinSchema.index({ userId: 1, createdAt: -1 });

const MoodCheckin = mongoose.model('MoodCheckin', moodCheckinSchema);

module.exports = MoodCheckin;