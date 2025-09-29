const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  paystackReference: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'NGN'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'bank_transfer', 'ussd', 'qr', 'mobile_money'],
    default: 'card'
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed', 'abandoned'],
    default: 'pending'
  },
  authorizationCode: { 
    type: String,
    trim: true
  },
  paystackData: {
    authorization_url: String,
    access_code: String,
    transaction_id: String,
    gateway_response: String,
    paid_at: Date,
    channel: String,
    fees: Number,
    customer: {
      email: String,
      customer_code: String
    }
  },
  metadata: {
    session_type: {
      type: String,
      default: 'therapy_session'
    },
    therapist_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    appointment_date: Date
  },
  verifiedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

paymentSchema.index({ paystackReference: 1 });
paymentSchema.index({ userId: 1, status: 1 });
paymentSchema.index({ appointmentId: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
