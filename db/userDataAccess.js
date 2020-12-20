const db = require('../db/connection');
const bcrypt = require('bcryptjs'); // was causing node not to launch 

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
                            );
                        `
                        .then((newUser) => {
                            console.log(newUser);
                            return true;
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

async function findUser (email) {
    const existingUser = await db`
        SELECT *
        FROM users
        WHERE email=${email}
    `
    .then((user) => {
        console.log(user[0]); //TODO: check that we are returning just a user object
        return user;
    });
}

module.exports = {
    insertUser,
    findUser,
}