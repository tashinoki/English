

const express = require('express');
const router = express.Router();
const mysql = require('./ServerJS/mysql.js');
const format = require('./ServerJS/dbFormat');


router.get('/', (req, res, next) => {

    const data = {
        title: 'Signup'
    };

    res.render('Signup/signup', data);
});


router.post('/', (req, res, next) => {

    // 入力値の受け取り
    const {user_name, password, confirm} = req.body;

    let data = {
        title: 'Error',
        user_name: user_name,
        password: password,
        confirm: confirm
    };


    // 入力に漏れがある場合
    if(Object.is(data.user_name, '') || Object.is(data.password, '') || Object.is(data.confirm, '')){

        data.message = 'Please enter all form';
        res.render('Error/signup', data);
    }

    // パスワードと確認用のパスワードが違う場合
    else if(!Object.is(data.password, data.confirm)){

        data.message = 'Password is differ';
        res.render('Error/signup', data);
    }

    const now = new Date();
    const valid = format.fromDate(now);
    const last_date = valid.year + "-" + valid.month + "-" + valid.day;
    const sql = 'insert into `users` (user_name, password, last_date) values (?, ?, ?)';

    // sqlの実行箇所
    mysql.connect.query(sql,[data.user_name, data.password, last_date], (err, results) => {

        // 希望のユーザー名が既に登録されている場合
        if(err){

            if(Object.is(err.errno, 1062)) {
                data.message = 'このユーザー名は既に登録されています。';
                res.render('Error/signup', data);
                return;
            }

            res.send('登録に失敗しました。');
        }

        else{
            const date = valid.year + "-" + valid.month + "-" + valid.day;
            console.log(date);
            mysql.createTB(data.user_name, date);
            res.redirect('/home');
        }
    });
});

module.exports = router;
