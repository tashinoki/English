
const express = require('express');
const router = express.Router();
const mysql = require('./ServerJS/mysql.js').connect;
const fs = require('fs');
const player = require('play-sound')();
const txtReq = require("./ServerJS/google");

router.post('/', (req, res, next) => {

    const {rank, id, speed, pitch} = req.body;
    const table = "listening_" + rank;
    const file_name = "Sound/" + rank + id + speed + pitch + ".mp3";

    fs.stat(file_name, (error) => {
        if(error) {
            mysql.query('select `text` from ?? where id = ?', [table, id], (err, results) => {
                if (err) throw err;
                txtReq(results[0].text, speed, pitch, file_name);
            });
        }

        else player.play(file_name, err => {if(err) throw err});
    });

    const data = {word: "hello"};
    res.send(data);
});

module.exports = router;
