const express = require('express')
const router = express.Router();
const User = require('../model/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = router;

router.post("/signup", (req, res, next) => {
    console.log(`working with email: ${req.body.email} and password: ${req.body.password}`)
    bcrypt.hash(req.body.password, 10)
        .then(
            hash => {
                const user = new User({
                    email: req.body.email,
                    password: hash
                })

                user.save()
                    .then(resp => {
                        res.status(201).json({
                            message: 'User Created',
                            result: resp
                        })
                    })
            }
        )
        .catch(e => {
            res.status(500).json({
                error: e
            })
        });
})

router.post("/login", (req, res, next) => {
    let fetchedUser;
//Validate the incoming credentials with DB
    User.findOne({ email: req.body.email})
        .then(user => {
            if(!user) {
                return res.status(401).json({ // if user doesn't exist
                    message: "Authentication Failed!!!"
                });
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password)
        })
        .then(result => {
            if(!result) { // if passwords don't match
                return res.status(401).json({
                    message: "Authentication Failed!!!"
                });
            }

            const token = jwt.sign({
                    email: fetchedUser.email,
                    userId: fetchedUser._id
                },
                'test_secret_key',
                {
                    expiresIn: '1h'
                }
            );

            res.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: fetchedUser._id
            });
        })
        .catch(err => {
            return res.status(401).json({
                message: "Authentication Failed!!!"
            });
        });
});
