
const express = require('express');
const router = express.Router();
const mysql = require('./ServerJS/mysql').connect;

router.get('/', (req, res, next) => {

    const data = {
        title: 'Calendar'
    };
    res.render('Calendar/calendar', data)
});


// クライアントからのゲットリクエスト
router.get('/data', (req, res) => {

    // get メソッドのパラメータを取得する
    const {date} = req.query;
    const user = req.session.user.user_name;
    const date_format = new Date(date);
    date_format.setHours(date_format.getHours() - 9);  // mysql とのフォーナットを合わせる

    // クエリの実行
    const query = 'select * from ?? where `date`=?';
    searchData(query, user, date_format).then( result => res.send(result));
});

module.exports = router;


// データベースへアクセスする関数
function searchData(query, user, date){
    return new Promise( resolve => {

        // クリエの実行
        mysql.query(query, [user, date], (err, result) => {
            if(err) throw err;

            // 選択された日付がデータベースに保存されていない場合
            if(result[0] === undefined) resolve({});

            // 結果をリゾルブとして渡す
            else resolve(result[0]);
        });
    });
}
