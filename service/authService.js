const userDataAccess = require('../db/userDataAccess');
const Joi = require('joi');
const bcrypt = require('bcryptjs');

const signupSchema = Joi.object({
    email: Joi.string().email().trim().required(),

    fname: Joi.string().trim().min(2).max(50).required(),

    password: Joi.string().trim().min(8).max(100).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().trim().required(),

    password: Joi.string().trim().min(8).max(100).required(),
});

async function signup(user) {
    const validation = signupSchema.validate({
        fname: user.fname,
        password: user.password,
        email: user.email,
    });

    if (validation.error === undefined) {
        // user-entered data passed validation check
        await userDataAccess.insertUser(user).then((userInserted) => {
            if (user.userWasCreated) user.signupWasSuccessful = true;
        });
    } else {
        // user-entered data did not meet requirements or there was another error
        return false;
    }
}

async function login(user) {
    const validation = loginSchema.validate({
        email: user.email,
        password: user.password,
    });

    if (validation.error === undefined) {
        // user-entered data passed validation check
        await userDataAccess.findUser(user).then(async () => {
            if (user.wasFound) {
                // user was found
                await bcrypt
                    .compare(user.password, user.passwordHashFromDB)
                    .then((result) => {
                        // validate user
                        user.password = '';
                        user.passwordHashFromDB = '';
                        user.loginWasSuccessful = true;
                    });
            } else {
                return false;
            }
        });
    } else {
        // user-entered data did not meet requirements or there was another error
        next('login schema validation failed');
    }
}

module.exports = {
    signup,
    login,
};
