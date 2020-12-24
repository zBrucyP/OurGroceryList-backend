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
        ownerID: req.body.userID,
        wasSuccessfullyAdded: false,
        errors: []
    };
    try {
        await listService.addList(list);
        if (list.wasSuccessfullyAdded) { respondSuccess200(res, CONSTANTS.SUCCESS_MESSAGE_LIST_ADDED) }
        else { repondError500(res, next, CONSTANTS.ERROR_MESSAGE_ADD_LIST_FAILED) } 
    } catch (e) {
        console.log(e);
    }
});

router.get('/getAll', (req, res) => {
    const user = req.user;
    if (user) {
        lists.find({ users_email: user.email }).then((lists) => {
            res.json(lists);
        });
    } else {
        res.status(400);
        res.json();
    }
});

router.post('/deleteList', (req, res) => {
    const list_id = req.body.list_id;

    if(list_id) {
        lists.remove({ _id: list_id }).then(() => {
            res.status(200).json();
        });
    } else {
        res.json('no list id included');
    }
});

router.post('/updateList', (req, res) => {

});

router.get('/list', (req, res) => {
    const list_id = req.query.list_id; // get list id from url query param

    if(list_id) {
        lists.findOne({ _id: list_id }).then((list) => {
            res.status(200);
            res.json(list);
        });
    } else {
        res.json('no list id in request');
    }
});

router.post('/addListItem', (req, res) => {
    const list_id = req.query.list_id; // get list id from url query param
    const item_to_add = {
       name: req.body.name,
       bought: req.body.bought || false,
       price: req.body.price || 0
    }; 

    if(item_to_add.name != ''){
        if(list_id) {
            lists.findOneAndUpdate({ _id: list_id}, { $push: { listItems: item_to_add } }).then((updatedList) => {
                res.status(200).json('list item added');
            });
        } else {
            res.json('no list id in request');
        }
    } else {
        res.json('no item name provided');
    }
});


function respondSuccess200(res, message) {
    res.status(200);
    res.json({
        actionSuccessful: true,
        message: message,
    })
}

function repondError500(res, next, errorReasonForUser) {
    res.status(500);
    res.json({
        errorMessage: errorReasonForUser
    });
}

module.exports = router;