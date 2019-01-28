
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    const data = {
        title: 'Blog'
    };

    res.render('Blog/blog', data);
});

module.exports = router;
