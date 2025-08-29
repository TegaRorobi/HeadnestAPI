const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const emailQueue = require('../../queue');
require('dotenv').config();

const router = express.Router();

// Passport Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
        } else {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
            password: null, 
          });
          console.log(`New Google user created: ${user.email}`);
          console.log('Adding welcome email job to queue...');
          await emailQueue.add("send-welcome-email", { email: user.email });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);


// Starting Google OAuth
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);


// Google callback route
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({
      message: 'Login successful',
      token,
      user: req.user,
    });
  }
);


// Manual login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  if (!user.password) {
    return res.status(400).json({
      message: "This email was registered via Google. Please login with Google or reset your password."
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  // This here should be access token, so the expiration duration should reduce (I'd set it to 12 hours)
  //const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  const accessToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '12h' });
  const refreshToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

  //res.json({ message: 'Login successful', token, user });
  res.json({ message: 'Login successful', token: accessToken, refreshToken, user });
});

module.exports = router;
