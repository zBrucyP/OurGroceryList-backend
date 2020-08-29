const express = require('express');
const Joi = require('joi');

const router = express.Router();

const db = require('../db/connection');
const lists = db.get('lists');

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

});

module.exports = router;