const express = require('express');
const router = express.Router();

const listService = require('../service/listService');
const CONSTANTS = require('../utils/constants').constants;

router.get('/', (req, res) => {
    res.json('in api lists');
});

router.post('/newlist', async (req, res, next) => {
    const list = {
        id: null,
        name: req.body.name,
        description: req.body.description,
        ownerID: req.user.id,
        wasSuccessfullyAdded: false,
        errors: [],
    };
    try {
        await listService.addList(list);
        if (list.wasSuccessfullyAdded) {
            respondSuccess200(res, CONSTANTS.SUCCESS_MESSAGE_LIST_ADDED, '');
        } else {
            repondError500(res, next, CONSTANTS.ERROR_MESSAGE_ADD_LIST_FAILED);
        }
    } catch (e) {
        console.log(e);
    }
});

router.get('/getAll', async (req, res, next) => {
    const user = {
        id: req.user.id || '',
        getListsWasSuccessful: false,
        lists: [],
        errors: [],
    };
    if (user.id != '') {
        try {
            await listService.getAllLists(user);
            if (user.getListsWasSuccessful) {
                respondSuccess200(res, '', user.lists);
            } else {
                repondError500(res, next, CONSTANTS.ERROR_GET_LISTS_FAILED);
            }
        } catch (e) {
            repondError500(res, next, CONSTANTS.ERROR_GET_LISTS_FAILED);
        }
    } else {
        respondError400(res, next, CONSTANTS.ERROR_USER_NOT_PROVIDED);
    }
});

router.post('/deleteList', async (req, res, next) => {
    const list = {
        id: req.body.list_id,
        wasDeleted: false,
        errors: [],
    };

    if (list.id) {
        await listService.deleteList(list);
        if (list.wasDeleted) {
            respondSuccess200(res, '', '');
        } else {
            repondError500(res, next, CONSTANTS.ERROR_DELETE_LIST_FAILED);
        }
    } else {
        respondError400(res, next, CONSTANTS.ERROR_INFO_NOT_PROVIDED);
    }
});

router.post('/listDetails', async (req, res, next) => {
    const list = {
        id: req.body.id,
        name: null,
        items: [],
        getListItemsSuccessful: false,
        getDetailsSuccessful: false,
        errors: [],
    };

    if (list.id) {
        await listService.getListItems(list);
        await listService.getListDetails(list)
        if (list.getDetailsSuccessful) respondSuccess200(res, '', list);
        else repondError500(res, next, CONSTANTS.ERROR_GET_LIST_ITEMS_FAILED);
    } else {
        respondError400(res, next, CONSTANTS.ERROR_INFO_NOT_PROVIDED);
    }
});

router.post('/addListItems', async (req, res, next) => {
    const list = {
        listItems: req.body.listItems,
        itemsAddedSuccessfully: false,
        errors: [],
    };

    if (list.listItems) {
        await listService.addListItems(list);
        if (list.itemsAddedSuccessfully) respondSuccess200(res, '', '');
        else repondError500(res, next, CONSTANTS.ERROR_ADD_LIST_ITEMS_FAILED);
    } else {
        respondError400(res, next, CONSTANTS.ERROR_INFO_NOT_PROVIDED);
    }
});

router.post('/updateListItems', async (req, res, next) => {
    const list = {
        listItems: req.body.listItems,
        itemsUpdatedSuccessfully: false,
        errors: [],
    };

    if (list.listItems) {
        await listService.updateListItems(list);
        if (list.itemsUpdatedSuccessfully) respondSuccess200(res, '', '');
        else repondError500(res, next, CONSTANTS.ERROR_UPDATE_LIST_ITEMS_FAILED);
    } else {
        respondError400(res, next, CONSTANTS.ERROR_INFO_NOT_PROVIDED);
    }
});

function respondSuccess200(res, message, payload) {
    res.status(200);
    res.json({
        actionSuccessful: true,
        message: message,
        payload: payload,
    });
}

function repondError500(res, next, errorReasonForUser) {
    res.status(500);
    res.json({
        errorMessage: errorReasonForUser,
    });
}

function respondError400(res, next, errorReasonForUser) {
    res.status(400);
    res.json({
        errorMessage: errorReasonForUser,
    });
}

module.exports = router;
