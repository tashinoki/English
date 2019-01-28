
// 時間を計算するモジュール
const time = function(){
    this.hour = 0;
    this.minute = 0;
    this.second = 0;
};

// 秒数をTimeフォーマットに変換する
time.prototype.toTime = function(second){

    let rest = this.toHour(second);
    rest = this.toMinute(rest);
    this.second = rest;
};


// ミリ秒を秒に変換する
time.prototype.mtoS = second => Math.floor(second / 1000);


// 秒数から時間を求める
time.prototype.toHour = function(second){

    // 3600秒未満の場合
    if(second < 3600){
        this.hour = 0;
        return second;
    }

    const hour = Math.floor(second / 3600);
    this.hour = hour;
    return second - hour * 3600;
};


// 秒数を分に変換する関数
time.prototype.toMinute = function(second){

    // 60秒未満の場合
    if(second < 60){
        this.minute = 0;
        return second;
    }

    const minute = Math.floor(second / 60);
    this.minute = minute;
    return second - minute * 60;
};


module.exports = time;
