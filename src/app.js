const express = require('express');
require("dotenv").config()
const app = express()

// imported files
const { connectToDataBase } = require('./config/db');

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

//connecting to database
connectToDataBase()

// Routes

// ..............
app.get("/", (req , res) => {
    res.status(200).send("This is home route, pls select a route to perform an action")
    console.log("Home route")
})

module.exports = app;