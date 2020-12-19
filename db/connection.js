const postgres = require('postgres'); // manage tasks with mongo

const options = {
    host: '127.0.0.1',
    port: 5432,
    database: 'OurGroceryList',
    username: 'user',
    password: 'pass',
    ssl: false,
    max: 100,
    timeout: 10,
}

const db = postgres(options);

module.exports = db;