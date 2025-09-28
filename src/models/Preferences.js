const mongoose = require("mongoose");

const PreferenceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    experience: {
        type: String,
        required: true,
        enum: ["new to this", "some experience", "quite experienced"]
    },
    reminders: {
        type: String,
        enum: ["yes, in the morning", "yes, in the evening", "no"]
    },
    lastReminderSentDate: {
        type: Date,
        default: null
    }
});

module.exports = mongoose.model("userPreference", PreferenceSchema);