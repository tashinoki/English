
const express = require('express');
const router = express.Router();
const mysql = require("./ServerJS/mysql");
const ProcessTime = require("./ServerJS/processTimeData");
const time_data = new ProcessTime();

router.get('/', (req, res, next) => {
    const index = 0;
    const data = {
        title: 'Profile',
        index: index
    };


    const sql = 'select `date`, `time` from ?? order by date desc';
    mysql.connect.query(sql, req.session.user.user_name, (err, results) => {
        if(err) throw err;
        data.graph = time_data.calWeek(results, index);
        data.max = Math.floor(results.length / 7);
        res.render('Profile/profile', data);
    });
});

module.exports = router;
