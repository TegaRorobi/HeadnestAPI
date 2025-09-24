const Agenda = require("agenda");
require("dotenv").config();

const agenda = new Agenda({
  db: {
    address: process.env.MONGODB_URI,
    collection: "reminderJobs",
  },
});

agenda.on("ready", () => {
    console.log("Agenda connected to MongoDB and ready to schedule jobs.");
});

module.exports = agenda;
