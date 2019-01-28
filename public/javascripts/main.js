

const onClick = (e) => {

    const target_name = e.target.name;
    $.get('/main/test', {
        kind: target_name
    }, date => {
        console.log(date);
    });
};

window.onload = () => {

    document.getElementById('disp_sum').innerText = hour + '時間' + min + '分';
};
