const nodemailer = require("nodemailer");
const PreferenceModel = require("../models/Preferences");
const agenda = require("../config/agenda");
const MoodModel = require("../models/MoodCheckin");
const JournalModel = require("../models/JournalEntry");


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

agenda.define("send morning reminders", async() => {
    const now = new Date();
    const dayStart = new Date(now.setHours(0,0,0,0));
    const dayEnd = new Date(now.setHours(23,59,59,999));

    const preferences = await PreferenceModel.find({
        reminders: "yes, in the morning",
        $or: [
            {lastReminderSentDate: {$lt: dayStart}},
            {lastReminderSentDate: null}
        ]
    }).populate("userId");

    for(const preference of preferences) {
        const user = preference.userId;

        const moodToday = await MoodModel.exists({
            userId: user._id,
            createdAt: {$gte: dayStart, $lte: dayEnd}
        });

        const journalToday = await JournalModel.exists({
            userId: user._id,
            createdAt: {$gte: dayStart, $lte: dayEnd}
        });

        if(moodToday || journalToday) continue;

        await transporter.sendMail({
          from: `"Headnest" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: `Good morning ${user.name || ""}`,
          text: `Start your day with a quick check-in. How are you feeling today?`,
        });
        preference.lastReminderSentDate = new Date();
        await preference.save();

        console.log("Morning reminders sent")
    }
});

agenda.define("send evening reminders", async() => {
    const now = new Date();
    const dayStart = new Date(now.setHours(0, 0, 0, 0));
    const dayEnd = new Date(now.setHours(23, 59, 59, 999));

    const preferences = await PreferenceModel.find({
      reminders: "yes, in the evening",
      $or: [
        { lastReminderSentDate: { $lt: dayStart } },
        { lastReminderSentDate: null },
      ],
    }).populate("userId");

    for (const preference of preferences) {
      const user = preference.userId;

      const moodToday = await MoodModel.exists({
        userId: user._id,
        createdAt: { $gte: dayStart, $lte: dayEnd },
      });

      const journalToday = await JournalModel.exists({
        userId: user._id,
        createdAt: { $gte: dayStart, $lte: dayEnd },
      });

      if (moodToday || journalToday) continue;

      await transporter.sendMail({
        from: `"Headnest" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `Good evening ${user.name || ""}`,
        text: `Start your day with a quick check-in. How are you feeling today?`,
      });
      preference.lastReminderSentDate = new Date();
      await preference.save();

      console.log("Evening reminders sent");
    }
});

module.exports = agenda;