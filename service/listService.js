const Joi = require('joi');

const listDataAccess = require('../db/listsDataAccess');

const ListSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(40)
        .trim()
        .required(),

    description: Joi.string()
        .max(140)
        .trim(),

    ownerID: Joi.string()
        .required(),
});


async function addList(list) {
    const validation = ListSchema.validate({
        name: list.name,
        description: list.description,
        ownerID: list.ownerID,
    });

    if(validation.error === undefined) { // no error, continue
        await listDataAccess.addList(list).then(() => {
            if (list.wasSuccessfullyAdded) {
                return true;
            } else {
                const error = new Error(CONSTANTS.ERROR_DB_CALL_FAILED);
                list.errors.push(error);
            }
        });
    } else{
        const error = new Error(CONSTANTS.ERROR_SCHEMA_VALIDATION);
        list.errors.push(error);
    }
}

function getAllLists() {

}


module.exports = {
    addList,
    getAllLists,
}