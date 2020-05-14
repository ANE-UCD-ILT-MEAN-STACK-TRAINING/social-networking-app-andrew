const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require("mongoose");
const postRoutes = require('./routes/posts')
const path = require("path")

mongoose
    .connect("mongodb://localhost:27017/MyPosts?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false")
    .then(() => console.log("connected to database"))
    .catch(() => console.log("connection failed"));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    next();
});

app.use('/api/posts', postRoutes);
module.exports = app;
