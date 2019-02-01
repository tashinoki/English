

// 即時関数
(() => {
    document.getElementById('question').innerHTML = '<h3>' + data.ja + '</h3>';
})();


// 解答ボタンが押された場合
$('#submit').on('click', event => {

    const text = $('#input').val();
    const answer = data.question;

    // テキストが未記入の場合
    if(Object.is(text, '')){
        document.getElementById('notice').innerHTML = '<p style="color: red;">解答を記入してください。</p>';
        return;
    }

    // テキストの先頭の文字が大文字でない場合
    else if(text[0].match(/^[a-z]/)){
        document.getElementById('notice').innerHTML = '<p style="color: red;">文章は大文字から始めてください。</p>';
        return;
    }

    // テキストの末尾が適切でない場合
    else if(!text[text.length - 1].match(/[.?!]/)){
        document.getElementById('notice').innerHTML = '<p style="color: red;">文章は[ . , ? , ! ]で終了してください。</p>';
        return;
    }


    // 構成を行うサーバーにAjax通信
    $.ajax({
        url: '/proof',
        data: {
            text: text,
            answer: answer
        },

        success: (result) => {  // 結果の受け取り
            proofResult(result);
            showAnswer();
        }
    });

    // 一度クリックするとボタンを無効にする
    event.target.disabled = true;
});


// 類似度計算をもとに正誤の判定を下す関数
function proofResult(score){

    // 正誤の結果を表紙させるオブジェクト
    const proof_result = document.getElementById('result');

    // スコアが 0.8 以上の場合は正解
    if(score >= 0.8) proof_result.innerHTML = '<p style="color: red">正解</p>';

    // それ以外は不正解とする
    else proof_result.innerHTML = '<p style="color: blue">不正解</p>';
}


// 模範解答を表示さセル
function showAnswer(){

    // 模範解答を表示させるオブジェクト
    const answer = document.getElementById('answer');

    answer.innerHTML = `<p>模範解答</p><p>${data.question}</p>`;
}
