const mongoose = require("mongoose");

const therapyChatSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderType: {
      type: String,
      enum: ["user", "therapist"],
      required: true,
    },
    message: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    messageType: {
      type: String,
      enum: ["text", "notification", "system"],
      default: "text",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

therapyChatSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 });

therapyChatSchema.index({ sessionId: 1, createdAt: -1 });
therapyChatSchema.index({ senderId: 1 });

const TherapyChat = mongoose.model("TherapyChat", therapyChatSchema);

module.exports = TherapyChat;
