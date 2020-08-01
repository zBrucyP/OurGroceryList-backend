const express = require('express');
const bcrypt = require('bcryptjs'); // was causing node not to launch
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const router = express.Router();

const db = require('../db/connection'); 
const users = db.get('users');
users.createIndex('username');

const schema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(4)
        .max(25)
        .required(),
    
    password: Joi.string()
        .trim()
        .min(8)
        .max(100)
        .required()
});

function createSendAccessToken(user, res, next) {
    const payload = { 
        id: user._id,
        username: user.username,
    };

    // create authentication token and respond w/ it
    jwt.sign(payload, process.env.TOKEN_SECRET, {expiresIn: '2h'}, (err, token) => {
        if(err) {
            repondError422(res, next);
        } else {
            res.json({
                token: token
            });
        }
    });
}

router.get('/', (req, res) => {
    res.json('in auth base');
});

router.post('/login', (req, res, next) => {
    const validation = schema.validate({
        username: req.body.username,
        password: req.body.password
    });
    
    if(validation.error === undefined) { // user-entered data passed validation check
        // check if user exists in database
        users.findOne({username: req.body.username}).then((user) => {
            if(user) { // user was found
                // authenticate the user
                bcrypt.compare(req.body.password, user.password).then((result) => {
                    if(result) { // password is correct, authenticate user
                        createSendAccessToken(user, res, next);
                    } else { // password is incorrect
                        repondError422(res, next);
                    }
                });
            } else { // user was not found, return error
                repondError422(res, next);
            }
        });
    } else { // user-entered data did not meet requirements or there was another error
        res.status(422);
        next(validation.error);
    }
});

router.post('/signup', (req, res, next) => {
    const validation = schema.validate({
        username: req.body.username,
        password: req.body.password
    });
    
    if(validation.error === undefined) { // user-entered data passed validation check
        users.findOne({username: req.body.username}).then((user) => {
            if(user) { // username is already in use, return error
                const error = new Error('Username is not available');
                res.status(409);
                next(error);
            } else { // username not in use, create new user
                //salt and hash the password
                bcrypt.hash(req.body.password, 10).then((hash, err) => { 
                    
                    // new user object to store in db
                    const newUser = { 
                        username: req.body.username,
                        password: hash
                    };

                    // insert new user into db and respond
                    users.insert(newUser).then((insertedUser) => { 
                        createSendAccessToken(insertedUser, res, next);
                    });
                });
            }
        });
    } else { // user-entered data did not meet requirements or there was another error
        res.status(422);
        next(validation.error);
    }
});

function repondError422(res, next, errorReason) {
    res.status(422);
    const error = new Error('Cannot login');
    next(error);
}

module.exports = router;