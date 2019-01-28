

// 問題を解答中に、問題選択画面に戻るボタン
document.getElementById('back').addEventListener('click', () => {

    location.href = '/home/lesson?type=' + data.table + '&ja=時制';
});



if(Object.is(data.id, '1')){
    $('#prev').css('pointer-events', 'none');
}

if(Object.is(data.id, data.max)){
    $('#next').css('pointer-events', 'none');
}