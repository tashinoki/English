
// 副作用ありまくりのプログラム

// 初期からどれだけずれたのかを取得する
let calender_counter = 0;

// 今日の日付を格納しているセルの id
let style_target = null;

// DOM が読み込まれたら実行
window.onload = () => {

    // テーブルを表示する部分のオブジェクトを取得
    const table = document.getElementById("body");

    idDistribute(table);

    // 現在時刻
    const date = new Date();
    const calender_slider = new Date(date.getFullYear(), date.getMonth());


    // カレンダー作成に必要な情報のオブジェクト化
    const today = { year: 0, month: 0 };
    const day_info = {start_info: 0, last_info: 0};

    setYM(today, calender_slider);        // その日の月と西暦をセット
    titleInsert(today);        // タイトルの表示
    setInfo(today, day_info);  // カレンダーの表示

    // テーブルに日付を挿入
    insertCalendar(table, day_info.start_info, day_info.last_info);

    // 土日に該当する箇所のスタイル定義
    Holiday();

    // カレンダーのスタイル定義
    todayStyle(style_target, calender_counter);


    // カレンダーの前の月を表示させるボタン
    document.getElementById("prev").addEventListener("click", function(){

        // 何月のカレンダーを見ているか示す
        calender_counter--;

        // カレンダーの初期化を行う
        const days = document.getElementsByClassName("day");
        for(let i = 0; i < days.length; i++) days[i].innerText = "";

        // カレンダースライダーの値を1減らす
        calender_slider.setMonth(calender_slider.getMonth() - 1);

        // todayに月と西暦を保存
        setYM(today, calender_slider);

        // タイトルの表示
        titleInsert(today);

        // 最初の日と最終日の情報を保存
        setInfo(today, day_info);

        // テーブルにカレンダーを表示
        insertCalendar(table, day_info.start_info, day_info.last_info);

        // カレンダーのスタイルを定義
        todayStyle(style_target, calender_counter);
    });


    // カレンダーの次の月を表示させるボタン
    document.getElementById("next").addEventListener("click", function(){

        // 今何月のカレンダーを見ているかを示す
        calender_counter++;

        // カレンダーの表示内容を初期化する
        const days = document.getElementsByClassName("day");
        for(let i = 0; i < days.length; i++) days[i].innerText = "";

        // カレンダー遷移管理オブジェクトをプラスする
        calender_slider.setMonth(calender_slider.getMonth() + 1);

        // todayに月と西暦を保存
        setYM(today, calender_slider);

        // タイトルの表示
        titleInsert(today);

        // 最初の日と最終日の情報を保存
        setInfo(today, day_info);

        // テーブルにカレンダーを表示
        insertCalendar(table, day_info.start_info, day_info.last_info);

        // カレンダーのスタイルを定義
        todayStyle(style_target, calender_counter);
    });


    // テーブル内に日付を入力する函数
    function insertCalendar(table, start_info, last_info) {

        // 初期の日付を0にする
        let start_day = 0;

        // true の時だけカレンダーに書き込む
        let flag = false;

        // テーブルの全てのセルにアクセス
        for(let row = 0; row < table.rows.length; row++){

            // 行の各列に対して1行ずつ
            for (let cal = 0; cal < table.rows[row].cells.length; cal++){

                // その月の最初の日と一致すればフラグを立てる
                if(row === 0 && cal === start_info.getDay()) flag = true;

                // フラグの立っている間
                if(flag){
                    // 日付を加算する
                    start_day++;

                    // 西暦と月が同じ場合のみ
                    if(today.month === date.getMonth() && today.year === date.getFullYear()) {
                        // 今日の日付が格納されるセルの id を取得する
                        if (start_day === date.getDate()) style_target = table.rows[row].cells[cal].id;
                    }

                    // セルに値を入れていく
                    table.rows[row].cells[cal].innerHTML = `<sapn class="value">${start_day}</sapn>`;

                    table.rows[row].cells[cal].onclick = Edit;

                    // その月の最後の日と一致すればフラグを下ろす
                    if(start_day === last_info.getDate()) flag = false;
                }

                // フラグが降りている間
                else table.rows[row].cells[cal].innerText = "";
            }
        }
    }


    // その月の西暦と月を表示させる
    function setYM(today, date){

        // 西暦を取得
        today.year = date.getFullYear();

        // 月を取得
        today.month = date.getMonth();
    }

    // その月の最初の情報と最後の情報を取得する
    function setInfo(today, day_info){

        // 最初の日付情報
        day_info.start_info = new Date(today.year, today.month, 1);

        // 最後の日付情報
        day_info.last_info = new Date(today.year, today.month + 1, 0);
    }


    // その日の西暦と月を表示させる
    function titleInsert(today){

        // プラス一をして表示させる
        let month = today.month + 1;

        //月の表示は二桁に揃える
        if(month < 10) month = "0" + month;

        // DOM に表示させる
        document.getElementById("year").innerText = today.year;
        document.getElementById("month").innerText = month;
    }

    // ポップアップを消すボタン
    const close_button = document.getElementById('close');
    close_button.addEventListener('click', closePopup);

};


// ポップアップを消去する関数
function closePopup(){

    // ポップアップを消去する
    $('.popup-overlay, .popup-content').removeClass('active');

    // フェイドアウト画面を消す
    const fadeout = document.getElementById('fadeout');
    fadeout.style.visibility = 'hidden';
}


// 休日のデザインを変える関数
function Holiday(){

    // テーブルオブジェクト
    const table = document.getElementById('body');

    // テーブルの各セルにアクセスする
    for(let row = 0; row < table.rows.length; row++){
        for(let cal = 0; cal < table.rows[row].cells.length; cal++){

            // 日曜に対応する列の色を赤にする
            if(cal === 0) table.rows[row].cells[cal].style.color = 'red';

            // 土曜に対応する列の色を青にする
            else if(cal === 6) table.rows[row].cells[cal].style.color = 'blue';
        }
    }
}


// 今日のスタイルを変更
function todayStyle(date, counter){

    const id = date;

    // counter === 0 は今日の月を表す
    if(counter === 0) document.getElementById(id).style.backgroundColor = '#C7C8C6';
    else document.getElementById(id).style.backgroundColor = null;
}


// 月のまたぎを管理するオブジェクトの作成
function idDistribute(table){

    // テーブルの左上
    let num = 1;

    // テーブルの各行にアクセス
    for(let row = 0; row < table.rows.length; row++){

        // 行の各セルにアクセス
        for(let cal = 0; cal < table.rows[row].cells.length; cal++){

            // セルに id を付け加えていく
            table.rows[row].cells[cal].id = String(num);

            // 付け加える id の更新
            num++;
        }
    }
}


// 編集機能
function Edit(event){

    // クリックされたセルを取得する
    const cell = event.target;
    let date = cell.childNodes[0].innerText;
    if(date < 10) date = '0' + date;

    // カレンダーの西暦と月を取得する
    const year = document.getElementById('year').innerText;
    const month = document.getElementById('month').innerText;

    // サーバへのリクエスト
    const request_query = `${year}-${month}-${date}`;

    // プロミスオブジェクト
    dataRequest(request_query).then( res => {

        // オブジェクトの要素を配列で返し、長さが0の場合
        if(Object.keys(res).length === 0) res.time = '無効な日付です';

        // ポップアップを表示させる要素にアクティブクラスを追加する
        $('.popup-content, .popup-overlay').addClass('active');

        // フェイドアウト要素を見えるようにする
        const fadeout = document.getElementById('fadeout');
        fadeout.style.visibility = 'visible';

        // プップアップ要素に内容を出力する
        const title_show = document.getElementById('title_show');
        const show_text = `${year}年${month}月${date}日`;
        title_show.innerText = show_text;
        const study_time = document.getElementById('study_time');
        study_time.innerText = res.time;
    });
}


// サーバーへのリクエスト処理
function dataRequest(date){

    // レスポンス変数の初期化
    let res = null;

    // プロミスオブジェクトに関数をわたす
    return new Promise(resolve => {

        // Ajax 通信
        fetch('/calendar/data?date=' + date).then( response => {

            response.json().then( data => {

                // データベースに保存されていない日付けの場合
                if(data === undefined) res = data;

                // レスポンスをオブジェクトに代入する
                else res = data;

                // リゾルブへレスポンスを渡す
                resolve(res);
            });
        });
    });

}

