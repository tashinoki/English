

// このプログラムはクラス構文を使うべき

const connect = require('mysql');
const mysql = {};

// DBへの接続
mysql.connect = connect.createConnection({

    host: '127.0.0.1',
    user: 'root',
    password: 'fMxJUM6G',
    database: 'english'
});


// 新規ユーザのためのテーブル作成関数
mysql.createTB = function(user_name, date){
    const sql = "create table ?? (date date default ?, time time default 0, num int(50) default 0)";
    this.connect.query(sql, [user_name, date], (err, results) => {
        if(err) throw err;
    });
};


// ユーザーデータを取得する関数
mysql.userData = function(user_name){
    const sql = "select * from ??";
    this.connect.query(sql, [user_name], (err, results) => {
        if(err) throw err;
        return results;
    });
};


// 合計の勉強時間と最終ログインの記録
mysql.saveTime = function(data){
    const sql = 'update `users` set sum_time = ?, last_date = ?, today_time = ? where user_name = ?';
    this.connect.query(sql, data, (err, results) => {
        if(err) throw err;
        });
};


// 日々の記録の更新
mysql.saveDaily = function(data){

    /*
    data[0]: ユーザー名
    data[1]: 勉強時間
    data[2]: 更新する日付
    */

    // 今日と同じ日付がテーブルにあるか検索
    const search = 'select date from ?? where date = ?';
    this.connect.query(search, [data[0], data[2]], (err, results) => {
        if(err) throw err;

        // なければ新しい行を追加する
        if(Object.is(results.length, 0)){
            const insert = 'insert into ?? (date) values (?)';
            this.connect.query(insert, [data[0], data[2]], err => {
                if(err) throw err;
            })
        }

        // 今日と同じ日付の値を更新する
        const sql = 'update ?? set time = ? where  date = ?';
        this.connect.query(sql, data, err => {
            if(err) throw err
        });
    });

};

mysql.compDate = function(data){
    const query = "insert into ?? (date) values (?)";
    this.connect.query(query, data, err => {if(err) throw err});
};

module.exports = mysql;
