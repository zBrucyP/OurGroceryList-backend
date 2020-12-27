const db = require('../db/connection');
const CONSTANTS = require('../utils/constants').constants;

async function addList(list) {
  try {
    const newListCall = await db`
            INSERT INTO lists (
                name, description, owner
            ) VALUES (
                ${list.name}, ${list.description}, ${list.ownerID}
            )
            returning *
        `.then((addedList) => {
      if (addedList && addedList.count === 1) {
        list.wasSuccessfullyAdded = true;
      }
    });
  } catch (e) {
    const error = new Error(CONSTANTS.ERROR_DB_CALL_FAILED);
    list.errors.push(error);
  }
}

async function getAllListsForUser(user) {
  try {
    const getListsCall = await db`
            SELECT *
            FROM lists
            WHERE owner=${user.id}
        `.then((lists) => {
      user.getListsWasSuccessful = true;
      user.lists = lists;
    });
  } catch (e) {
    const error = new Error(CONSTANTS.ERROR_DB_CALL_FAILED);
    list.errors.push(error);
  }
}

async function deleteList(list) {
  try {
    const deleteListCall = await db`
            DELETE FROM lists
            WHERE id=${list.id}
        `.then((deletedList) => {
      if (deletedList.count === 1) {
        list.wasDeleted = true;
      }
    });
  } catch (e) {
    const error = new Error(CONSTANTS.ERROR_DB_CALL_FAILED);
    list.errors.push(error);
  }
}

async function getListItems(list) {
  try {
    const listItemsCall = await db`
            SELECT *
            FROM list_items
            WHERE list_id=${list.id}
        `.then((returnedListItems) => {
      list.items = returnedListItems;
      list.getDetailsSuccessful = true;
    });
  } catch (e) {
    const error = new Error(CONSTANTS.ERROR_DB_CALL_FAILED);
    list.errors.push(error);
  }
}

async function addListItems(list) {
  try {
    const addItemsCall = await db`
            insert into list_items ${db(
              list.listItems,
              'list_id',
              'name',
              'description',
              'price',
              'quantity',
              'bought',
            )}
        `.then((itemsInserted) => {
      list.itemsAddedSuccessfully = true;
    });
  } catch (e) {
    const error = new Error(CONSTANTS.ERROR_DB_CALL_FAILED);
    list.errors.push(error);
  }
}

module.exports = {
  addList,
  getAllListsForUser,
  deleteList,
  getListItems,
  addListItems,
};
