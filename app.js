const express = require('express');
const passport = require('passport');
require("dotenv").config()
const app = express()
const userRoutes = require('./routes/userRoutes');

// imported files
const { connectToDataBase } = require('./src/config/db');
const googleAuthRoutes = require('./src/auth/googleAuth');

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

//connecting to database
connectToDataBase()

// Routes
app.use('/auth', googleAuthRoutes);
app.use('/users', userRoutes);

// ..............
app.get("/", (req , res) => {
    res.status(200).send("This is home route, pls select a route to perform an action")
    console.log("Home route")
})

module.exports = app;