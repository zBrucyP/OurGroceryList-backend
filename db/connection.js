const postgres = require('postgres'); // manage tasks with mongo

const options = {
    host: 'ec2-34-200-106-49.compute-1.amazonaws.com',
    port: 5432,
    database: dcbcmlgddgijb2,
    username: process.env.postgres_username,
    password: process.env.postgres_password,
    timeout: 10,
}

const db = postgres(options);

module.exports = db;