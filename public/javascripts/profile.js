
// 初期条件として一週間のボタンを押せなくする
document.getElementById("week").disabled = true;

let this_year = new Date().getFullYear();
let this_month = new Date().getMonth();

// インデックスが0の場合、次の週へのボタンを押せなくする
if(Object.is(index, 0)){
    document.getElementById("next").disabled = true;
}


// 前の週を表示するボタン
const prev = document.getElementById("prev");
prev.addEventListener('click', event => {
    index++;
    graph_req(index);
});


// 次の週を表示するボタン
const next = document.getElementById("next");
next.addEventListener('click', event => {
    index--;
    graph_req(index);
});


// タイプの切り替え（一週間）
const week = document.getElementById("week");
week.addEventListener('click', function(event){
    index = 0;
    type = this.id;
    graph_req(index);
    next.innerText = "次の週";
    prev.innerText = "前の週";
    disToggle(this);
});

// タイプの切り替え（一ヶ月）
const month = document.getElementById("month");
month.addEventListener('click', function(event){
    index = 0;
    type = this.id;
    graph_req(index);
    next.innerText = "次の月";
    prev.innerText = "前の月";
    disToggle(this);
});


// タイプの切り替え（一年間）
const year = document.getElementById("year");
year.addEventListener('click', function(event){
    index = 0;
    type = this.id;
    next.innerText = "次の年";
    prev.innerText = "前の年";
    disToggle(this);
});

// グラフ更新用のAjax通信
const graph_req = index => {

    $.ajax({
        url: './graph',
        data: {
            index: index,
            type: type,
            year: this_year,
            month: this_month
        },

        // レスポンスの受け取り
        success: results => {

            // グラフデータの更新
            labels = results.graph_data.map( x => x.date).reverse();
            data = results.graph_data.map( x => x.time).reverse();
            graph_title = labels[0] + "〜" + labels[labels.length - 1];


            // グラフインスタンスに更新データをセットしてアップデート
            chart.data.labels = labels;
            chart.data.datasets[0].data = data;
            chart.data.datasets[0].label = graph_title;
            chart.update();
            range(Number(results.index));  // ボタンの無効化と有効化
        }
    });
};


// インデックスの値でボタンを無効にする
const range = (index) => {

    if(Object.is(index, 0)) {
        document.getElementById("next").disabled = true;
        document.getElementById("prev").disabled = false;
    }

    else if(Object.is(index, max)) {
        document.getElementById("next").disabled = false;
        document.getElementById("prev").disabled = true;
    }

    else {
        document.getElementById("next").disabled = false;
        document.getElementById("prev").disabled = false;
    }
};


// グラフの切り替えを行うボタンのリストと関数
const btn_list = [week, month, year];
const disToggle = target => {
    btn_list.forEach( x => {
       x.disabled = Object.is(x, target);
    });
};
