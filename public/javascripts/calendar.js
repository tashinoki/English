
window.onload = () => {

    const table = document.getElementById("body");

    const date = new Date();
    const today = { year: 0, month: 0 };
    const day_info = {start_info: 0, last_info: 0};

    setYM(today, date);
    titleInsert(today);
    setInfo(today, day_info);

    insertCalendar(table, day_info.start_info, day_info.last_info);


    document.getElementById("prev").addEventListener("click", function(){

        const days = document.getElementsByClassName("day");
        for(let i = 0; i < days.length; i++) days[i].innerText = "";

        date.setMonth(date.getMonth() - 1);
        setYM(today, date);
        titleInsert(today);
        setInfo(today, day_info);
        insertCalendar(table, day_info.start_info, day_info.last_info);
    });

    document.getElementById("next").addEventListener("click", function(){

        const days = document.getElementsByClassName("day");
        for(let i = 0; i < days.length; i++) days[i].innerText = "";

        date.setMonth(date.getMonth() + 1);
        setYM(today, date);
        titleInsert(today);
        setInfo(today, day_info);
        insertCalendar(table, day_info.start_info, day_info.last_info);
    });


    // テーブル内に日付を入力する函数
    function insertCalendar(table, start_info, last_info) {
        let start_day = 0;
        let flag = false;
        for(let i = 0; i < table.rows.length; i++){
            for (let j=0; j < table.rows[i].cells.length; j++){
                if(i === 0 && j === start_info.getDay()) flag = true;
                if(flag){
                    start_day++;
                    table.rows[i].cells[j].innerText = start_day;
                    if(start_day === last_info.getDate()) flag = false;
                }else table.rows[i].cells[j].innerText = "";
            }
        }
    }


    function setYM(today, date){
        today.year = date.getFullYear();
        today.month = date.getMonth();
    }

    function setInfo(today, day_info){
        day_info.start_info = new Date(today.year, today.month, 1);
        day_info.last_info = new Date(today.year, today.month + 1, 0);
    }

    function titleInsert(today){
        let month = today.month + 1;
        if(month < 10) month = "0" + month;
        document.getElementById("year").innerText = today.year;
        document.getElementById("month").innerText = month;
    }
};
