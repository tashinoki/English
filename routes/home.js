
const express = require('express');
const router = express.Router();
const mysql = require('./ServerJS/mysql.js').connect;

// hello this is home page
router.get('/', (req, res) => {

    // ログイン時の時間を記録しておく
    req.session.user.past = new Date().getTime();

    const {user_name, sum_time, last_time} = req.session.user;
    const data = {
        title: 'Home',
        user_name: user_name,
        sum_time: sum_time,
        last_time: last_time
    };
    console.log(data.sum_time);

    res.render('Home/main', data);
});



// this lesson selector
router.get('/lesson', (req, res, next) => {

    let {type, ja} = req.query;
    const table = type;

    // save table name in session
    req.session.user.table = table;

    const buf = type.split('_');
    const kind = buf[0];
    const field = buf[1];


    let data = {
        title: 'レッスン',
        type: type,
        kind: kind,
        field: field,
        result: [],
        ja: ja
    };

    mysql.query('select `id`, `exp` from ??', [table], (err, results, fields) => {

        if(err) throw err;

        else {
            for (let i = 0; i < results.length; i++) {

                // push the results into array
                data.result.push(results[i]);
            }

            req.session.user.max = data.result.length;
            res.render('Lesson/lesson', data);
        }
    });
});


// this is grammar view
router.get('/lesson/grammar', (req, res, next) => {


    const {field, id} = req.query;
    const {table, max} = req.session.user;

    let data = {
        title: '英文法',
        field: field,
        id: parseInt(id),
        table: table,
        kind: 'grammar',
        max: max
    };

    const sql = 'select * from ?? where id=?';

    // execute query
    mysql.query(sql, [table, id], (err, results) => {

        if(err) throw err;

        data['question'] = results;
        res.render('Home/Grammar/grammar', data);
    });
});


// this is dictating view
router.get('/lesson/dictating', (req, res, next) => {

    const {field} = req.query;
    const data = {
        title: 'ディクテイティング',
        field: field
    };

    res.render('Home/Main/Lesson/dictating', data);
});


// this is writing view
router.get('/lesson/writing', (req, res, next) => {

    const {field, id} = req.query;
    const {table, max} = req.session.user;
    const data = {

        title: 'ライティング',
        field: field,
        id: id,
        table: table,
        max: max,
        kind: 'writing'
    };

    mysql.query('select * from ?? where id = ?', [table, id], (err, results, field) => {

        if(err) throw err;

        data.question = results;
        res.render('Home/Writing/writing', data);
    });
});


// リスニング問題担当
router.get('/lesson/listening', (req, res) => {

    // パラメータを「_」でくぎる
    const type = req.query.type.split("_");

    const table_name = "listening_" + type[0];  // begginner, middle, proffecional

    // sql 文
    const query = "select `title`, `text`, `1`, `2`, `3`, `4`, `5`, `6` from ?? where id=?";
    const data  = {title: "リスニング", id: type[1], rank: type[0]};

    // リスニング問題位を取得する
    mysql.query(query, [table_name, type[1]], (err, results) => {
        if(err) throw err;

        data.question = results[0];
        res.render('Home/Listening/listening', data);
    });
});

module.exports = router;
