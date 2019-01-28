

// Timeフォーマットを秒数に変換するモジュール
const second = function(){
    this.second = 0;
};


// Timeフォーマットを秒数に変換する
second.prototype.toSecond = function(time){

    // 配列の要素数が3の場合
    if(Object.is(time.length, 3)) {
        this.fromHour(time[0]);
        this.fromMinute(time[1]);
        this.fromSecond(time[2]);
    }
};


// 時間を秒数に変換
second.prototype.fromHour = function(hour){
    this.second += hour * 3600;
};


// 分を秒数に変換する
second.prototype.fromMinute = function(minute){
    this.second += minute * 60;
};


// 秒数をそのまま足し合わせる。
second.prototype.fromSecond = function(second){
    this.second += second;
};


module.exports = second;
