

// execute anonymous function to question render
(() => {

    let buf = data.question.split(' ');
    buf.splice(data.blank, 0, '(　　)');


    const question = '<h3>' + buf.join(' ') + '</h3>';
    $('#question').html(question);


})();



$('#choice_1').text(data[1]);
$('#choice_2').text(data[2]);
$('#choice_3').text(data[3]);
$('#choice_4').text(data[4]);



// 特殊文字をhtmlタグに変換する
const unescape = function(text){


    let new_text = text.replace(/&lt;/g, "<");
    new_text = new_text.replace(/&#34;/g, '"');
    new_text = new_text.replace(/&gt;/g, ">");

    return new_text;
};


// get radio button element
const input = document.getElementsByTagName('input');


// ボタンが押されると答えを表示する
document.getElementById('answer_button').addEventListener('click', function(){

    document.getElementById('notice').innerHTML = '<p></p>';


    for(let i = 0; i < input.length; i ++) {

        if(input[i].checked){

            const choice_id = `choice_${i+1}`;
            const answer = $('#'+choice_id);

            document.getElementById('answer').innerHTML = '<p>解答:　<span style="text-decoration: underline;">' + answer.text() + '</span></p>';

            if(Object.is(input[i].id, data.answer)){

                document.getElementById('result').innerHTML = '<p style="color: red;">正解</p>'
            }

            else{

                document.getElementById('result').innerHTML = '<p style="color: #005cbf;">不正解</p>';
            }

            document.getElementById('describe').innerHTML = '<p>' + unescape(data.disc) + '</p>';
            document.getElementById('ja').innerHTML = '<p>' + data.ja + '</p>';

            // this はアンサーボタン
            this.disabled = true;
            return
        }
    }

    document.getElementById('notice').innerHTML = '<p style="color: red;">解答を選んでください!</p>';
});
