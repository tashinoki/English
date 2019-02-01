
const express = require('express');
const routes = express.Router();
const mysql = require('./ServerJS/mysql');
const ProcessTime = require('./ServerJS/processTimeData');
const time_data = new ProcessTime();

routes.get('/', (req, res, next) => {
    let {type, index, year, month} = req.query;
    const dt = new Date(year, month);
    dt.setHours(dt.getHours() + 9);
    dt.setMonth(dt.getMonth() - index);
    year = dt.getFullYear();
    month = dt.getMonth();


    if(month < 9) month = "0" + (Number(month) + 1);
    else month = String(Number(month) + 1);


    const {user_name} = req.session.user;
    const data = {
        type: type,
        index: index
    };

    const type_change = {
        week: () => {
            const sql = 'select `date`, `time` from ?? order by date desc';
            console.log(sql);
            mysql.connect.query(sql, [user_name], (err, results) => {
                    if(err) throw err;
                    data.graph_data = time_data.calWeek(results, index);
                    res.send(data);
            });
        },

        month: () => {
            console.log("month");
            const sql = "select `date`, `time` from ?? where (date_format(date, '%Y%m') = ?) order by date asc";
            mysql.connect.query(sql, [user_name, year + month], (err, results) => {
                if(err) throw err;
                data.graph_data = time_data.calMonth(results);
                res.send(data);
            });
        },

        year: () => {}
    };

    // タイプに対応した関数の実行
    type_change[type]();
});

module.exports = routes;
