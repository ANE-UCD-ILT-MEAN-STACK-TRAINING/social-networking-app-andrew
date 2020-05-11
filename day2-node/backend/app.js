const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const Post = require("./model/post")
const mongoose = require("mongoose");

mongoose
    .connect("mongodb://localhost:27017/MyPosts?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false")
    .then(() => console.log("connected to database"))
    .catch(() => console.log("connection failed"));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// disable CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, OPTIONS"
    );
    next();
});

app.post("/api/posts", (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    })

    post.save()
        .then((createdPost => {
            res.status(201).json({
                messages: "Post added successfully",
                postId: createdPost._id // return newly created ID
            })
        }))
    // we still need to send the response as we don't want client to be waiting and timeout

});

app.get("/api/posts", (req, res, next) => {
    Post.find()
        .then((posts => {
            console.log("returning" + posts)
            res.status(200).json({
                message: "Posts fetched successfully!",
                posts: posts
            })
        }))
});

app.delete("/api/posts/:id", (req, res, next) => {
    Post.deleteOne({_id: req.params.id}).then(result => {
        console.log(result)
        res.status(200).json({message: "Post deleted!"})
    })
})

module.exports = app;
