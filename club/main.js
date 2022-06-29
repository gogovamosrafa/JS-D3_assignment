$(function(){
    $("#courseTable").append("<tr><th>場次</th><th>時間</th><th>主題</th></tr>")
    // 先算topic有幾筆資料
    var topicCount = topic.length;
    
    // 一天的毫秒: 1sec = 1000 ms
    var millisecsPerDay = 24*60*60*1000;
   

    function addtable(){

    for(var x=0;x<topicCount;x++){
        let thisDateObject = new Date(startDate.getTime() + 7 * x * millisecsPerDay)
        if(topic[x].indexOf('停課')>=0){
        $("#courseTable").append(
            // 變數:${}
            `<tr class='greyFont'>
            <td>${x+1}</td>
            <td class="greyFont">${thisDateObject.getMonth() + 1}/${thisDateObject.getDate()}</td>
            <td>${topic[x]}</td><
            /tr>`
            );}
        else{
        $("#courseTable").append(
            // 變數:${}
            `<tr>
            <td>${x+1}</td>
            <td>${thisDateObject.getMonth() + 1}/${thisDateObject.getDate()}</td>
            <td>${topic[x]}</td>
            </tr>`
            )};
        }
       
    }
    window.onload = addtable()
    $("input").on("change", function(){
        let myMonth = $("input").val().slice(5,7)
        let myDate = $("input").val().slice(8)
        // let thisType = document.getElementById("myDate");
        //get month and date
        // let myMonth = new Date($("input").val()).getMonth;
        // let myDate = new Date($("input").val()).getDate;
        $("#courseTable").empty();
        $("#courseTable").append("<tr><th>場次</th><th>時間</th><th>主題</th></tr>")
        setMonthAndDay(myMonth, myDate)
        addtable();
    })
        
});