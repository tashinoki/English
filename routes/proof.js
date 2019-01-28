
const express = require('express');
const router = express.Router();
const request = require('request');
const {PythonShell} = require('python-shell');


router.get('/', (req, res, next) => {

    console.log('get');

    const {text, answer} = req.query;
    const query_string = text.split(' ').join('+');

    // pythonに渡す引数
    const option = {
        mode: 'text',
        args: [answer, text]
    };

    let result = {};

    // pythonスクリプトの実行
    PythonShell.run('./routes/short_sentence_similarity.py', option, (err, results) => {

        if(err) throw err;

        result.score = results;
        res.send(result);
    });
});

module.exports = router;
