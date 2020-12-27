const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const authService = require('../service/authService');
const CONSTANTS = require('../utils/constants');

function createSendAccessToken(user, res, next) {
    const payload = {
        id: user.id,
        fname: user.fname,
        email: user.email,
    };

    // create authentication token and respond w/ it
    jwt.sign(
        payload,
        process.env.TOKEN_SECRET,
        { expiresIn: '2h' },
        (err, token) => {
            if (err) {
                repondError500(res, next);
            } else {
                res.json({
                    fname: user.fname,
                    token: token,
                });
            }
        },
    );
}

router.get('/', (req, res) => {
    res.json('in auth base');
});

router.post('/login', async (req, res, next) => {
    const user = {
        id: '',
        fname: '',
        password: req.body.password,
        passwordHashFromDB: '',
        email: req.body.email,
        wasFound: false,
        loginWasSuccessful: false,
        errors: [],
    };

    await authService.login(user);
    if (user.loginWasSuccessful) {
        createSendAccessToken(user, res, next);
    } else {
        respondError401(res, next, CONSTANTS.ERROR_MESSAGE_FAILED_LOGIN);
    }
});

router.post('/signup', async (req, res, next) => {
    const user = {
        id: '',
        fname: req.body.fname,
        password: req.body.password,
        email: req.body.email,
        userWasCreated: false,
        signupWasSuccessful: false,
        errors: [],
    };

    await authService.signup(user);
    if (user.signupWasSuccessful) {
        createSendAccessToken(user, res, next);
    } else {
        respondError500(res, next, CONSTANTS.ERROR_MESSAGE_SIGNUP_FAILED);
    }
});

function respondError500(res, next, errorReason) {
    res.status(500);
    const error = new Error(errorReason);
    next(error);
}

function respondError401(res, next, errorReason) {
    res.status(401);
    const error = new Error();
    next(error);
}

module.exports = router;
