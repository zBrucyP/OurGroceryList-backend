const postgres = require('postgres'); // manage tasks with mongo

const options = {
    host: 'ec2-34-200-106-49.compute-1.amazonaws.com',
    port: 5432,
    database: 'dcbcmlgddgijb2',
    username: process.env.postgres_username,
    password: process.env.postgres_password,
    timeout: 10,
    ssl: {
        rejectUnauthorized: false, //https://help.heroku.com/MDM23G46/why-am-i-getting-an-error-when-i-upgrade-to-pg-8
    },
    dialect: 'postgres',
    dialectOptions: {
        ssl: true,
    }
}

const db = postgres(options);

module.exports = db;