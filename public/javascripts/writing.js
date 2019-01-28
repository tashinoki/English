

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

    console.log('submit');

    // 構成を行うサーバーにAjax通信
    $.ajax({
        url: 'http://127.0.0.1:3000/proof',
        data: {
            text: text,
            answer: answer
        },

        success: (result) => {  // 結果の受け取り
            console.log(result);
        }
    });

    // 一度クリックするとボタンを無効にする
    event.target.disabled = true;
});
