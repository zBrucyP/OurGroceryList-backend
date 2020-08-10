const express = require('express');

const router = express.Router();


router.get('/', (req, res) => {
    res.json('in api lists');
});


module.exports = router;