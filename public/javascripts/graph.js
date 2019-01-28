
const ctx = document.getElementById("myChart").getContext("2d");

let labels = graph_data.map( data => data.date).reverse();
let data = graph_data.map( data => Number(data.time)).reverse();
let graph_title = labels[0] + "〜" + labels[labels.length - 1];


// グラフの設定を返す関数
const graph_conf = (labels, data) => {

    return({
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: graph_title,
                backgroundColor: 'rgb(51, 102, 255)',
                borderColor: 'rgb(51, 102, 255)',
                data: data
            }]
        },
        options: {scales: {
                yAxes: [
                    {
                        ticks: {
                            min: 0
                        }
                    }
                ]
            }}
    });
};


// グラフを表示させるインスタンス
const chart = new Chart (ctx, graph_conf(labels, data));

