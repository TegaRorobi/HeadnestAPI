const nodemailer = require("nodemailer");
const PreferenceModel = require("../models/Preferences");
const agenda = require("../config/agenda");


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

agenda.define("send morning reminders", async() => {
    const morningRems = await PreferenceModel.find({reminders: "yes, in the morning"}).populate("userId", "email");
    if(!morningRems){
        console.log("user not found");
    }
    for(const morningRem of morningRems) {
        if(!morningRem.userId?.email) continue;

        await transporter.sendMail({
            from: `"Headnest" <${process.env.EMAIL_USER}>`,
            to: morningRem.userId.email,
            subject: "Good Morning",
            text: "Hello! This is your morning reminder",
        });
    }
    console.log("Morning reminders sent");
});

agenda.define("send evening reminders", async() => {
    const eveningRems = await PreferenceModel.find({reminders: "yes, in the evening"}).populate("userId", "email");

    for(const eveningRem of eveningRems) {
        if(!eveningRem.userId?.email) continue;

        await transporter.sendMail({
            from: `"Headnest" <${process.env.EMAIL_USER}>`,
            to: eveningRem.userId.email,
            subject: "Good Evening",
            text: "Hello! This is your evening reminder.",
        });
    }
    console.log("Evening reminders sent");
});

module.exports = agenda;