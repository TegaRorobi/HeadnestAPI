const express = require('express');
const passport = require('passport');
require("dotenv").config()
const app = express()


// imported files
const logger = require('./logger')
const { connectToDataBase } = require('./src/config/db');
const googleAuthRoutes = require('./src/auth/googleAuth');
const userRoutes = require('./src/routes/userRoutes');
const authRoutes = require('./src/routes/authRoutes');
const moodRoutes = require('./src/routes/moodRoutes');
const communityRoutes = require('./src/routes/communityRoutes');

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());


//connecting to database
connectToDataBase()

// Routes
app.use('/auth', googleAuthRoutes);
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', moodRoutes);
app.use('/api', communityRoutes);

// ..............
app.get("/", (req , res) => {
    logger.info("Home route accessed")
    res.status(200).send("This is home route, pls select a route to perform an action")
})

app.get("/error", (req, res) => {
  logger.error("Something went wrong");
  res.status(500).send("Error happened!");
});

module.exports = app;
