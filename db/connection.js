const monk = require('monk'); // manage tasks with mongo
const db = monk('localhost/grocerylist');

module.exports = db;