const express = require('express');
const Joi = require('joi');

const router = express.Router();

const db = require('../db/connection');
const lists = db.get('lists');

const ListSchema = Joi.object({
    name: Joi.string()
        .min(4)
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
    console.log('in newlist');

    // no error, continue
    if(validation.error === undefined) { 
        // object to insert
        const newList = {
            name: req.body.listName,
            users_email: req.user.email
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
    res.json('');
});

module.exports = router;