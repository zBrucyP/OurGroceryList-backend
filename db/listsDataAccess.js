const db = require('../db/connection');

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
        console.log(e);
    }
}

async function getAllLists() {

}

module.exports = { 
    addList,
    getAllLists,
}