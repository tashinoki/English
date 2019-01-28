
const express = require('express');
const router = express.Router();
const mysql = require('./ServerJS/mysql');
const toSecond = require('./ServerJS/toSecond');
const dbFormat = require('./ServerJS/dbFormat');


router.get('/', (req, res, next) => {
  const data = {
      title: 'Login'
  };
  res.render('Login/login', data);
});


// get user_name and password
router.post('/', (req, res, next) => {

    // 合計勉強時間と今日の勉強時間を計算するインスタンス
    const sumTime = new toSecond();
    const todayTime = new toSecond();

    const {user_name, password} = req.body;

    let data = {
        title: '',
        user_name: user_name,
        password: password
    };


    // ユーザーを探し出すクエリ
    mysql.connect.query('select * from `users` where `user_name` = ?', [data.user_name], (err, results, fields) => {

        // ユーザーが登録されていない場合の処理
        if (err){
            data.title = 'Error';
            data.message = 'this user is invalid.';
            res.send(err);
        }

        // SQlの実行結果が存在する場合
        if(!(Object.is(results[0], undefined))){

            // 入力されたパスワードとデータベースの値が一致した場合
            if(Object.is(results[0]['password'], data.password)) {

                req.session.user = {
                    user_name: user_name
                };

                // Time Stampフォーマットの加工、時差を考えないといけない
                let last_date = results[0]['last_date'];
                const date_comp = {last: last_date};
                last_date.setHours(last_date.getHours() + 9);
                last_date = JSON.stringify(last_date).split("T")[0].replace(/"/g, '');


                // Timeフォーマットを数値配列に変換
                const sum_time = results[0]['sum_time'].split(':').map( x => Number(x));
                sumTime.toSecond(sum_time);


                // Timeフォーマットを数値配列に変換
                const today_time = results[0]['today_time'].split(':').map( x => Number(x));
                todayTime.toSecond(today_time);


                // 今日の日付を取得する
                const now = dbFormat.fromDate(new Date());
                const today = now.year + "-" + now.month + '-' + now.day;


                // 最終ログイン日との差を得るため
                date_comp.now = new Date();
                date_comp.now.setHours(date_comp.now.getHours());


                // 最終ログイン日と今日の日付が異なる場合
                if(!Object.is(today, last_date)){
                    todayTime.second = 0;
                    let date_dif = date_comp.now.getTime() - date_comp.last.getTime();
                    date_dif = Math.floor(date_dif / 86400000);
                    const date_set = [];
                    let target_date = "";

                    // テーブルに追加すべき日付情報を格納した配列の作成
                    // 日数の差分だけ繰り返し処理を行う
                    for(let i = 1; i < date_dif; i ++){

                        // 現在の日付の1日前
                        date_comp.now.setDate(date_comp.now.getDate() - 1);
                        target_date = dbFormat.fromDate(date_comp.now);
                        date_set.push(target_date.year + "-" + target_date.month + '-' + target_date.day);
                    }
                    const data = [user_name, ""];
                    date_set.reverse().forEach( date => {
                        data[data.length - 1] = date;
                        mysql.compDate(data);
                    });
                }


                // セッションに保存
                req.session.user.sum_second = sumTime.second;
                req.session.user.today_second = todayTime.second;
                req.session.user.last_date = last_date;
                req.session.user.sum_time = sum_time;
                res.redirect('./home');
            }

            else{
                data.title = 'Error';
                data.message = 'パスワードが不正です。';
                res.render('Error/login', data);
            }
        }

        // user is no exist
        else{
            data.title = 'Error';
            data.message = '存在しないユーザーです';
            res.render('Error/login', data);
        }
    });
});

module.exports = router;

