
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {

    const data = {
        title: 'Calendar'
    };

    res.render('Calendar/calendar', data)
});

module.exports = router;
