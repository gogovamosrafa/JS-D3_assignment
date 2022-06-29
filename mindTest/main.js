$(function(){
    // 將currentQuiz設定為空
    var currentQuiz = null;
    $("#startButton").on("click",function(){
        if(currentQuiz==null){
            //開始作答
            currentQuiz = 0;
            $("#question").text(questions[0].question);
            //將選項區清空(可以試著先不寫)
            $("#options").empty();
            //將選項逐個加入
            questions[0].answers.forEach(function(element, index, array){
                $("#options").append(`<input name='options' type='radio' value='${index}'><label>${element[0]}</label><br><br>`);
                
            })
            $("#startButton").attr("value","Next");
        }else{
            //已經開始作答從這邊繼續
            //尋訪哪一個選項有被錄取
            $.each($(":radio"),function(i,val){
                if(val.checked){
                    //已經要通往最終結果(A~D)
                    //判斷是否為數字
                    if(isNaN(questions[currentQuiz].answers[i][1])){
                        var finalResult = questions[currentQuiz].answers[i][1];
                        $("#question").text(finalAnswers[finalResult][0]);
                        $("#options").empty;
                        $("#options").append(`$(finalAnswers[finalResult][1]<br><br>`);
                        currentQuiz = null;
                        $("#startButton").attr('value','重新開始');


                    }else{//正常跳下一題(原始資料為從1開始,要-1對照js array)
                        currentQuiz = questions[currentQuiz].answers[i][1]-1;
                        $("#question").text(questions[currentQuiz].question);
                        $("#options").empty();
                        questions[currentQuiz].answers.forEach(function(element, index, array){
                            $("#options").append(`<input name='options' type='radio' value='${index}'><label>${element[0]}</label><br><br>`);
                            
                        })

                    }
                    return false;
                }

            })
        }
    })
})