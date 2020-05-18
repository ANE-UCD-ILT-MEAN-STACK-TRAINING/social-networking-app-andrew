const express = require('express')
const router = express.Router();
const multer = require('multer')

const PostController = require("../controllers/posts")
const checkAuth = require('../middleware/check-auth')
const extractFile = require("../middleware/file")

// create
router.post("", checkAuth, extractFile, PostController.createPost);
// all
router.get("", PostController.getPosts);
// single
router.get('/:id', PostController.getPost)
router.put('/:id', checkAuth, extractFile, PostController.updatePost)
router.delete("/:id", checkAuth, PostController.deletePost)

module.exports = router;
