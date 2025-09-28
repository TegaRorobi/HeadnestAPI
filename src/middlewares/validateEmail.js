const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString("hex");
};

const sendVerificationLink = async (user) => {
  const token = generateToken();
  const hashToken = await bcrypt.hash(token, 10);

  user.verificationToken = hashToken;
  user.verificationTokenExpires = Date.now() + 15 * 60 * 1000;
  await user.save();

  const link = `${process.env.APP_URL}/user/auth/verify-email?email=${encodeURIComponent(
    user.email
  )}&token=${token}`;

  await transporter.sendMail({
    from: `"Headnest" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Email verification",
    text: `Click this link to verify your email ${link} \n\nLink expires in 15 minutes.`,
    html: `<p>Click <a href="${link}">here</a> to verify your email. Link expires in 15 minutes.</p>`,
  });
  console.log("Verification Link sent");
};

module.exports = { sendVerificationLink };
