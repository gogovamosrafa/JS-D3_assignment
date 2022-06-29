let mapArray, ctx, currentImgMain; // 決定主角所在座標
let imgMountain, imgMain, imgEnemy; // 儲存障礙物、主角、敵人的圖片物件
const gridLength = 200; //每一隔為200*200，長寬加起來各是600 (為3*3的九宮格)

var sources = {
    Mountain:"images/material.png",
    Enemy:"images/Enemy.png"
};
function loadImages(sources, callback) {
    var images = {};
    var loadedImages = 0;
    var numImages = 0;
    // get num of sources
    for(var src in sources) {
      numImages++;
    }
    for(var src in sources) {
      images[src] = new Image();
      images[src].onload = function() {
        if(++loadedImages >= numImages) {
          callback(images);
        }
      };
      images[src].src = sources[src];
    }
}


// initial start 載入畫面發生的事情
$(function(){
    //0 可走, 1 障礙, 2 終點, 3 敵人
    mapArray = [
        [0,1,1],
        [0,0,0],
        [3,1,2],
    ];
    // 找到Canvas元件，getContext2d：拿起畫筆作畫，指定2d的方法繪製
    ctx = $("#myCanvas")[0].getContext("2d");
    imgMain = new Image();
    imgMain.src = "images/spriteSheet.png";
    currentImgMain = {
        // 座標原點從左上角出發，往右X增加，往下Y增加
        "x":0,
        "y":0,
    }
    // 主角繪製至畫面上，怕圖片物件還沒載入完成
    // 圖片物件一載入，就去做後面的function
    imgMain.onload = function(){
        // (圖片物件:imgMain;座標0,0 ;擷取圖片80*130; 從currentImgMain的0，0丟下去; gridLength:縮放成多大)
        ctx.drawImage(imgMain, 0,0,80,130,currentImgMain.x,currentImgMain.y,gridLength,gridLength);
    };
    imgMountain = new Image();
    imgMountain.src = "images/material.png";
    imgEnemy = new Image();
    imgEnemy.src = "images/Enemy.png";
    // 確認mountain，enemy是否被載入
    imgMountain.onload = function(){
        imgEnemy.onload = function(){
            for(var x in mapArray){
                for(var y in mapArray[x]){
                    if(mapArray[x][y]==1){
                        // Draw Mountain
                        //y*gridLength, x*gridLength : 
                        ctx.drawImage(imgMountain, 32,65,32, 32, y*gridLength, x*gridLength, gridLength, gridLength);
                    }else if(mapArray[x][y]==3){
                        // Draw Enemy
                        ctx.drawImage(imgEnemy, 7,40,104, 135, y*gridLength, x*gridLength, gridLength, gridLength);

                    }
                }
            }
        }
    }
    
});

// user interaction / event trigger 當keydown發生時，執行function
$(document).on("keydown", function(event){
    let targetImg, targetBlock, cutImagePositionX;
    // 1. 判斷user按了什麼
    // 2. 判斷目標位置的那一格為何
    // 3. 決定要做的事情(只是轉頭/可以過去/..)
    //targetImg是目標座標,對應到canvas(x,y)
    targetImg = {
        "x":-1,
        "y":-1
    }
    //targetBlock對應到data 2d array
    targetBlock = {
        "x":-1,
        "y":-1
    }
    // 預防瀏覽器預設的偵測
    event.preventDefault();
    switch(event.code){
        case "ArrowLeft":
            targetImg.x = currentImgMain.x - gridLength;
            targetImg.y = currentImgMain.y;
            //x 值 擷取下臉向左的部分
            cutImagePositionX = 175;
            break;
        case "ArrowUp":
            targetImg.x = currentImgMain.x;
            targetImg.y = currentImgMain.y - gridLength;
            
            cutImagePositionX = 355;
            break;
        case "ArrowRight":
            targetImg.x = currentImgMain.x + gridLength;
            targetImg.y = currentImgMain.y;
            //x 值 擷取下臉向左的部分
            cutImagePositionX = 540;
            break;
        case "ArrowDown":
            targetImg.x = currentImgMain.x;
            targetImg.y = currentImgMain.y + gridLength;
            cutImagePositionX = 0;
            break;
        default:
            return;
    }
    // 確認目標位置不會超過地圖
    if(targetImg.x<=400 && targetImg.x>=0 && targetImg.y<=400 && targetImg.y>=0){
        targetBlock.x = targetImg.y / gridLength;
        targetBlock.y = targetImg.x / gridLength;
    }else{
        // -1不在地圖上，會拿不到值
        targetBlock.x = -1;
        targetBlock.y = -1;
    }
    // 清空主角原本所在的位置
    ctx.clearRect(currentImgMain.x, currentImgMain.y, gridLength, gridLength);

    if(targetBlock.x != -1 && targetBlock.y != -1){
        switch(mapArray[targetBlock.x][targetBlock.y]){
            case 0://OK
                $("#talkBox").text("");
                //刷新後讓主角去的地方
                currentImgMain.x = targetImg.x;
                currentImgMain.y = targetImg.y;
                break;
            case 0: //Mountain
                $("#talkBox").text("有山");
                break;
            case 2: //終點
                $("#talkBox").text("抵達終點");
                //刷新後讓主角去的地方
                currentImgMain.x = targetImg.x;
                currentImgMain.y = targetImg.y;
                break;
            case 3: //Enemy
                $("#talkBox").text("Hellow~~");
                break;


        }

    }else{
        $("#talkBox").text("邊界");
    }
    //Re-Draw the Main
    ctx.drawImage(imgMain, cutImagePositionX,0,80,130, currentImgMain.x, currentImgMain.y, gridLength, gridLength);



});