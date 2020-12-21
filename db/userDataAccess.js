const db = require('../db/connection');
const bcrypt = require('bcryptjs'); // was causing node not to launch 
const { query } = require('express');
const e = require('express');

// https://www.npmjs.com/package/postgres


async function insertUser(user) {
    try {
        const existingUser = await db`
            SELECT *
            FROM users
            WHERE email=${user.email}
        `
        .then((existingUser) => {
            if (existingUser.count > 0) {
                console.log(existingUser);
                return false;
            } else {
                //salt and hash the password
                bcrypt.hash(user.password, 10).then( async (hash, err) => { 
                    try {
                        const new_user = await db`
                            INSERT INTO users (
                                fname, password, email
                            ) VALUES (
                                ${user.fname}, ${hash}, ${user.email}
                            )
                            returning *
                        `
                        .then((newUser) => {
                            if(newUser.count === 1) {
                                user.id = newUser[0].id;
                                user.userWasCreated = true;
                            }
                        });
                    } catch (e) {
                        console.log(e);
                    }
                });
            }
        });
    } catch(e) {
        console.log(e);
    }
}

async function findUser (user) {
    try {
        const existingUser = await db`
            SELECT *
            FROM users
            WHERE email=${user.email}
        `
        .then((queryResult) => {
            if (queryResult.count === 1) {
                user.passwordHashFromDB = queryResult[0].password;
                user.wasFound = true; 
                user.fname = queryResult[0].fname;
            }
        });
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    insertUser,
    findUser,
}