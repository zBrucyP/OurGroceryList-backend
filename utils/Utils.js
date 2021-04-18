const { request } = require("express");

function mapRequestObjectToUpdateListItem(requestObject) {
    const updateListItem = {
        id: requestObject.id,
        list_id: requestObject.list_id,
        name: requestObject.name,
        description: requestObject.description,
        price: requestObject.price,
        quantity: requestObject.quantity,
        bought: requestObject.bought,
        updateSuccessful: false,
    }
    return updateListItem;
}

module.exports = {
    mapRequestObjectToUpdateListItem,
}