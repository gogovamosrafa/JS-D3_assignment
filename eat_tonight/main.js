let thisURLs = ["https://tenjo.tw/wp-content/uploads/20170411233843_70.jpg",
"https://foodpicks.tw/wp-content/uploads/2020-05-03_100026.jpg",
"https://www.wecook123.com/wp-content/uploads/2017/05/%E7%BE%8E%E5%91%B3%E7%B4%A0%E6%B0%B4%E9%A4%83_fxTDGCDdP4.jpg"
];
$(function(){
    // 用裡面的字對到html的標籤;
    // 代表畫面載進來時,就會跑下面的程式(類似main function)
    // 對應到input元件後，綁定後續的事件
    $("input").on("click",function(){
        // alert("Hi!");
        var numberofListitem = $("li").length;
        var randomChildNumber = (Math.floor(Math.random()*numberofListitem));
        $("h1").text($("li").eq(randomChildNumber).text());
        $("img").attr("src",thisURLs[randomChildNumber]); //setting sorce屬性
    });
});