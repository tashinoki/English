
const format = {};

// DBのフォーマットに変換する関数 (新規ユーザーのため)
format.fromDate = function(date){

    let db = {
        year: String(date.getFullYear()),
        month: String(date.getMonth() + 1),
        day: String(date.getDate()),
        hour: String(date.getHours()),
        minute: String(date.getMinutes()),
        second: String(date.getSeconds())
    };

    // 一桁の場合は二桁にする
    db.month = this.digit(db.month);
    db.day = this.digit(db.day);
    db.hour = this.digit(db.hour);
    db.minute = this.digit(db.minute);
    db.second = this.digit(db.second);

  return db;
};


// DBからのフォーマットを変換する関数
format.fromDB = date => {
  return date;
};


// 1桁のものに0を加える
format.digit = target => {
    if(Object.is(target.length, 1)) return '0' + target;
    return target;
};

module.exports = format;

