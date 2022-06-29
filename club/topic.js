var topic = [
    "停課-尚未開學",
    "停課-國定假日",
    "環境準備",
    "隨機性",
    "重複性",
    "條件判斷"
];
let startDate = new Date()
function setMonthAndDay(startMonth, startDay) {
    //設定好月份和日期, month從0開始, 所以輸入值要再-1
    startDate.setMonth(startMonth-1, startDay)
    startDate.setHours(0)
    startDate.setMinutes(0)
    startDate.setSeconds(0)
}



// var startDate = new Date(); //載入的這個moment會被save在startDate




// function setMonthAndDay(startMonth, startDay){
//     //一次設定好月份跟日期,month的起始值為0
//    startDate.setMonth(startMonth-1,startDay);
//    // 把時分秒都歸零
//    startDate.setHours(0);
//    startDate.setMinutes(0);
//    startDate.setSeconds(0);
// }




