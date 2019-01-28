
// 変数をまとめるオブジェクト
const main_obj = {};

main_obj.repeat_count = 0;  // 音声の再生回数を数える
main_obj.button_options = {};

// 追加するボタンのクリックイベント
main_obj.button_options.onClick = function(){
    Questions();
    this.disabled = true;
};


// 解答した番号を格納していく配列
main_obj.your_answer = [];

// 問題の番号を表す
let question_number = 0;

// 読み込み終了とともに実行する
window.onload = () => {

    // サーバからのデータを問題文と解答番号に分割する
    main_obj.questions = question.map( text => {
        const data = text.split("¥¥");
        return ({answer: data[0], question: data[1],});
    });

    // 問題のタイトルを表示する
    idDom("title").innerText = title;

    main_obj.audio = idDom('player');      // audio オブジェクト
    main_obj.play_button = idDom('play');   // 再生ボタン
    main_obj.box = idDom('box');

    // 向こうな HTMl Number を有効な文字に置き換える
    main_obj.replaced_text = Escape(text);
};


// 解答ボタンが押された時のイベント
function Next(event){

    // ラジオボタンを配列で取得
    const radios = document.getElementsByTagName('input');

    // ボタンが選択されているのかのチェック
    for(let radio of radios){

        // 選択されているラジオボタンがあった場合
        if(radio.checked){
            main_obj.your_answer.push(radio.value);
            question_number++;

            // 問題を 6 出し終えた場合の処理
            if (question_number === 6) Finished(event);

            // それ以外の場合は HTML の更新を行う
            else{
                idDom('wrap').innerHTML = Template();
                idDom('question').innerText = main_obj.questions[question_number]['question'];
            }
            return
        }
    }

    // 選択されていない状態で解答ボタンが押された場合
    idDom('notice').innerText = '解答を選択してください';
}


// 問題表示用のテンプレート
function Template(){

    return('<div id=\'question0\' class=\'page1\'>\n' +
        '    <div id="question"></div>\n' +
        '\n' +
        '    <form class="choices">\n' +
        '        <div class="choice">\n' +
        '            <input type="radio" value="0" name="choice">\n' +
        '            <label>正しくない</label>\n' +
        '        </div>\n' +
        '\n' +
        '        <div class="choice">\n' +
        '            <input type="radio" value="1" name="choice">\n' +
        '            <label>正しい</label>\n' +
        '        </div>\n' +
        '\n' +
        '        <div class="choice">\n' +
        '            <input type="radio" value="2" name="choice">\n' +
        '            <label>どちらでもない</label>\n' +
        '        </div>\n' +
        '    </form>\n' +
        '\n' +
        '    <div id="notice" style="color: red"></div>\n' +
        '\n' +
        '    <button id="next" onclick="Next(event)">次の問題</button>\n' +
        '</div>')
}


// 問題を出し終えた後に実行する関数
function Finished(event){
    event.target.disabled = true;  // ボタンを使えなくする
    setTimeout(Result, 1000);      // 1 秒後画面上に結果を表示する
}


// 結果を表示させる関数
function Result(){

    // 模範解答と答案の比較の結果を受け取る
    const results = Compare(main_obj.questions, main_obj.your_answer);

    // 判定結果をもとに挿入
    for(let result of results){
        resultTemplate(result);
    }
}


// 解答の正誤を確認する関数
function Compare(base, answer){

    // true or false が入る配列
    const result = [];

    // 模範解答と答案を１つづつ比較していく
    for(let i = 0; i < base.length; i++){
        result.push(base[i]['answer'] === answer[i]);
    }

    // 結果を格納した配列を返す
    return result
}


// 解答結果を表示させるための雛型
function resultTemplate(result){

    // true or false に応じて画面への出力をか変える
    const display = result === true ? '<p style="color: red">正解</p>' : '<p style="color: blue;">不正解</p>';

    // div 要素を作成して結果を格納していく
    const div = document.createElement('div');
    div.innerHTML = display;

    // 所定位置の末尾に追加する
    idDom('result').appendChild(div);

    // 音声の文字起こしを表示させる関数
    sampleText();
}


// 音声を文字に起こしたもの
function sampleText(){
    // 文字起こしの挿入
    idDom('text').innerHTML = main_obj.replaced_text;
}


// audio が再生された時のイベント
function Play() {

    if(main_obj.repeat_count === 1){
        idDom('show_question').disabled = true;
    }

    // audio の再生ボタン
    main_obj.audio.play();
    
    // 音声再生中はボタンを無効化する
    playDisable(true);
}


// audio の再生が終了した時のイベント
function End() {
    
    // 再生回数をカウント
    main_obj.repeat_count++;
    if (main_obj.repeat_count === 2) Questions();  // 2 回再生すると別処理

    else {
        playDisable(false);  // ボタンを有効化する
        main_obj.play_button.innerText = 'もう一度再生する';
        createButton(main_obj.button_options);
    }
}

// 再生が終了した後に問題を画面に表示させる
function Questions(){

    playDisable(true);  // 再生ボタンを無効化する

    idDom('show_question').disabled = true;

    // 問題文と選択肢を表示させる
    idDom('wrap').innerHTML = Template();
    idDom('question').innerText = main_obj.questions[question_number]['question'];
}


// 再生終了後にボタンを作る関数
function createButton(options) {

    // 新しいボタン要素を作る
    const button = document.createElement('button');

    // ボタンが押された時のイベント処理
    button.addEventListener('click', options.onClick);
    button.id = 'show_question';
    button.innerText = '問題を見る';

    // HTML へ挿入する
    main_obj.box.appendChild(button);
}


// 再生ボタンを無効化する関数
function playDisable(bool) {

    // 再生ボタンの有効無効を決める
    main_obj.play_button.disabled = bool === true;
}


// id で DOM オブジェクトを作成する
function idDom(id){return document.getElementById(id);}


// HTML 数値を有効な文字に変換する
function Escape(text){
    let replaced_text = text.replace(/&#34;/g, "'");
    replaced_text = replaced_text.replace(/&#39;/g, "'");
    replaced_text = replaced_text.replace(/&gt;/g, ">" );
    replaced_text = replaced_text.replace(/&lt;/g, "<");
    return replaced_text;
}