
const toSecond = require("./toSecond");
const to_second = new toSecond();

class ProcessTime{

    // 一週間の勉強時間を計算するためのデータを用意する間数
    calWeek(row, index){
        let start_index = index * 7;
        const range = 7;
        let data = [];

        start_index = this.rangeWeek(start_index, row);

        for(let count = start_index; count < range + start_index; count ++){
            to_second.second = 0;

            // 日付情報を日本時間に修正する
            let date = row[count]["date"];
            date.setHours(date.getHours() + 9);
            date = JSON.stringify(date).split("T")[0].replace(/"/, '');


            // データベースの時間列を配列に直して秒数変換する
            const second = row[count]["time"];
            to_second.toSecond(second.split(":").map( x => Number(x)));

            // オブジェクト形式でデータを確保
            const buf = {
                date: date,
                time: Math.ceil(to_second.second / 60)
            };
            data.push(buf);
        }
        return data;
    }


    // 一週間分のデータを表示させるためのレンジの調整
    rangeWeek(start, row){
        if(row[start + 7 -1])
            return start;
        else
            return row.length - 7;
    }

    calMonth(row){

        const data = [];
        for(let count = 0; count < row.length; count++){
            to_second.second = 0;

            // 日付情報を日本時間に修正する
            let date = row[count]["date"];
            date.setHours(date.getHours() + 9);
            date = JSON.stringify(date).split("T")[0].replace(/"/, '');


            // データベースの時間列を配列に直して秒数変換する
            const second = row[count]["time"];
            to_second.toSecond(second.split(":").map( x => Number(x)));

            const buf = {
                date: date,
                time: Math.ceil(to_second.second / 60)
            };
            data.push(buf);
        }
        return data.reverse();
    }

    rangeMonth(){

    }

    calYear(){

    }
}

module.exports = ProcessTime;
