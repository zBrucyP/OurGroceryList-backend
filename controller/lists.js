const express = require('express');
const Joi = require('joi');

const router = express.Router();

const ListSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(40)
        .trim()
        .required()
});


router.get('/', (req, res) => {
    res.json('in api lists');
});

router.post('/newlist', (req, res) => {
    const validation = ListSchema.validate({
        name: req.body.listName
    });

    // no error, continue
    if(validation.error === undefined) { 
        // object to insert
        const newList = {
            name: req.body.listName,
            users_email: req.user.email,
            description: req.body.listDescrip,
            listItems: []
        }

        lists.insert(newList).then((insertedList) => {
            res.status(200);
            res.json('successfully added');
        })
    } else{
        console.log(validation.error);
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

module.exports = router;