let player; //yt player
let currentPlay = 0 //紀錄目前播放歌曲

// youtube載入framework後自動會呼叫的
function onYouTubeIframeAPIReady(){
    player = new YT.Player("player",{ //player為id
        height:"390",
        width:"640",
        videoId:playList[currentPlay],
        playerVars:{
            autoplay:0,
            controls:0,
            start:playTime[currentPlay][0], //開始秒數
            end:playTime[currentPlay][1], // 結束秒數
            iv_load_policy:3,
            rel:0
        },
        events:{
            onReady:onPlayerReady,
            onStateChange:onPlayerStateChange

        }

    });

}
function onPlayerReady(event){
    $("#playButton").on("click",function(){
        // 將標題title顯示到h2上
        $("h2").text(player.getVideoData().title);
        player.playVideo();
    });

}

function onPlayerStateChange(event){
    // console.log(event);
    if(Math.floor(player.getCurrentTime())==playTime[currentPlay][1]){
        if(currentPlay<playList.length-1){
            //Go Next
            currentPlay++;
            player.loadVideoById({
                videoId:playList[currentPlay],
                startSeconds:playTime[currentPlay][0],
                endSeconds:playTime[currentPlay][1],
                suggestedQuality:"large"
            });
        }else{
            //Stop & Load the first song
            currentPlay = 0;
            player.cueVideoById({
                videoId:playList[currentPlay],
                startSeconds:playTime[currentPlay][0],
                endSeconds:playTime[currentPlay][1],
                suggestedQuality:"large"
            });
        }   
    }
    if(event.data==1){
        $("h2").text(player.getVideoData().title);
    }
    
    
}