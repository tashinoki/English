
const express = require('express');
const router = express.Router();
const toTime = require('./ServerJS/toTime');
const mysql = require('./ServerJS/mysql');
const format = require('./ServerJS/dbFormat');



router.get('/', (req, res, next) => {

    // 時間計算のインスタンス
    const todayTime = new toTime();
    const sumTime = new toTime();

    const data = {};
    data.user_name = req.session.user.user_name;


    // 現在の時間を取得し、ログイン時との差を求め、秒数に変換、勉強時間を求める
    const now = new Date().getTime();
    let study_second = now - req.session.user.past;
    study_second = todayTime.mtoS(study_second);


    // 今日の勉強時間の更新
    const today_second = req.session.user.today_second + study_second;
    todayTime.toTime(today_second);


    // 合計の勉強時間の更新
    const sum_second = req.session.user.sum_second + study_second;
    sumTime.toTime(sum_second);


    // 1桁のものに0を付け加えて結合
    const today_time = format.digit(String(todayTime.hour)) + ":" + format.digit(String(todayTime.minute)) + ":" + format.digit(String(todayTime.second));
    const sum_time = format.digit(String(sumTime.hour)) + ":" + format.digit(String(sumTime.minute)) + ":" + format.digit(String(sumTime.second));

    // 最終ログイン時の時間の記録
    let last_date = new Date();
    const valid = format.fromDate(last_date);
    last_date = valid.year + "-" + valid.month + "-" + valid.day;


    // 記録用のクエリの実行
    const saveTime = [sum_time, last_date, today_time, data.user_name];
    const saveDaily = [data.user_name, today_time, last_date];

    mysql.saveTime(saveTime);   // usersテーブルの更新
    mysql.saveDaily(saveDaily);  // 日々の記録の更新

    req.session.destroy();
    data.title = 'Logout';
    res.render('Logout/logout', data);
});

module.exports = router;
