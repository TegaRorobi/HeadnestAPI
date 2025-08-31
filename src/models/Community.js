const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  category: {
    type: String,
    enum: [
      'Depression Support',
      'Anxiety Help', 
      'Stress Management',
      'General Wellness',
      'Grief Support',
      'Addiction Recovery',
      'Teen Mental Health',
      'Workplace Stress'
    ],
    required: true
  },
  guidelines: {
    type: String,
    default: 'Be respectful and supportive. No judgment or harmful advice. Share experiences, not medical advice. Keep personal information private. All conversations are anonymous.'
  },
  iconColor: {
    type: String,
    enum: ['#2563eb', '#7c3aed', '#059669', '#dc2626', '#ea580c', '#0891b2', '#4338ca', '#be185d'],
    default: '#2563eb'
  },
  members: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  memberCount: {
    type: Number,
    default: 0,
    max: 5000
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isAnonymous: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});


communitySchema.index({ category: 1, isActive: 1 });
communitySchema.index({ 'members.userId': 1 });

const Community = mongoose.model('Community', communitySchema);

module.exports = Community;