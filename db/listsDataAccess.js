const db = require('../db/connection');
const CONSTANTS = require('../utils/constants').constants;


async function addList(list) {
    try{
        const newList = await db`
            INSERT INTO lists (
                name, description, owner
            ) VALUES (
                ${list.name}, ${list.description}, ${list.ownerID}
            )
            returning *
        `
        .then((addedList) => {
            if(addedList && addedList.count === 1) { list.wasSuccessfullyAdded = true }
        });
    } catch(e) {
        const error = new Error(CONSTANTS.ERROR_DB_CALL_FAILED);
        list.errors.push(error);
    }
}

async function getAllListsForUser(user) {
    try {
        const lists = await db`
            SELECT *
            FROM lists
            WHERE owner=${user.id}
        `.then((lists) => {
            user.getListsWasSuccessful = true;
            user.lists = lists;
        })
    } catch(e) {
        const error = new Error(CONSTANTS.ERROR_DB_CALL_FAILED);
        list.errors.push(error);
    }
}

async function deleteList(list) {
    try {
        const delList = await db`
            DELETE FROM lists
            WHERE id=${list.id}
        `
        .then((deletedList) => {
            if(deletedList.count === 1) { list.wasDeleted = true } 
        })
    } catch(e) {
        const error = new Error(CONSTANTS.ERROR_DB_CALL_FAILED);
        list.errors.push(error);
    } 
}

module.exports = { 
    addList,
    getAllListsForUser,
    deleteList,
}