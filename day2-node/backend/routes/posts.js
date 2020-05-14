const express = require('express')
const Post = require('../model/post')
const router = express.Router();
const multer = require('multer')

const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg"
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = !isValid ? new Error("Invalid mime type") : null;
        cb(error, "backend/images");
    },
    filename: (req, file, cb) => {
        const name = file.originalname
            .toLowerCase()
            .split(" ")
            .join("-");
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + "-" + Date.now() + "." + ext);
    }
});

/**
 * Image upload
 */
router.post(
    "",
    multer({storage: storage}).single("image"),
    (req, res, next) => {
        const url = req.protocol + "://" + req.get("host");
        const post = new Post({
            title: req.body.title,
            content: req.body.content,
            imagePath: url + "/images/" + req.file.filename
        });
        post.save().then(createdPost => {
            res.status(201).json({
                message: "Post added successfully",
                post: {
                    ...createdPost,
                    id: createdPost._id
                }
            });
        });
    }
);

router.post("", (req, res, next) => {
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

// all
router.get("", (req, res, next) => {
    const pageSize = +req.query.pageSize; // the + makes it into a number
    const currentPage = +req.query.page;
    let fetchedPosts;
    console.log("pagesize:" + pageSize);
    console.log("currentPage: " + currentPage);

    const postQuery = Post.find();

    // if inputs are valid
    if (pageSize && currentPage) {
        let numOfPriorPages = currentPage - 1
        let numItemsToSkip = pageSize * numOfPriorPages
        console.log("numofPriorPages: " + numOfPriorPages);
        console.log("numItemsToSkip: " + numItemsToSkip);
        postQuery.skip(numItemsToSkip).limit(pageSize);
    }

    postQuery
        // .find()
        .then((documents) => {
            fetchedPosts = documents;
            console.log("num fetchedPosts: " + fetchedPosts.length)
            return Post.estimatedDocumentCount()
        })
        .then((count => {
            res.status(200).json({
                message: "Posts fetched successfully!",
                posts: fetchedPosts,
                maxPosts: count
            })
        }))
});

// single
router.get('/:id', (req, res, next) => {
    Post.findById(req.params.id)
        .then(post => {
            if (post)
                res.status(200).json(post)
            else {
                res.status(404).json({
                    message: 'post not found'
                })
            }
        })
})

router.put('/:id',
    multer({storage: storage}).single("image"),
    (req, res, next) => {

        let imagePath = req.body.imagePath;
        if (req.file) {
            const url = req.protocol + "://" + req.get("host");
            imagepath = url + "/images" + req.file.filename;
        }

        const post = new Post({
            _id: req.body.id,
            title: req.body.title,
            content: req.body.content,
            imagePath: imagePath
        });
        console.log(post);
        Post.updateOne({_id: req.params.id}, post)
            .then(updatedPost => {
                res.status(200).json({message: 'Update successful'})
            })
    })

router.delete("/:id", (req, res, next) => {
    Post.deleteOne({_id: req.params.id}).then(result => {
        console.log(result)
        res.status(200).json({message: "Post deleted!"})
    })
})

module.exports = router;
