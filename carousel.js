var swiper = $("#swiper");
var no = 0; //转动过的次数
var shiftNo = 0;
var count = 0;
var cssArray = new Array(15);
var allowStop = false;
var stopFlag = false; //停止的标志
var changeFlag = false; //图片更换的标志
var personArray = [{image: "https://avatars1.githubusercontent.com/u/13199456?s=460&v=4"}, 
{image: "https://img2.wmnetwork.cc/attachment/weibo/thumb/avatar/201710/24/f1ad5ed90cb2ec793f2465ce94ad41a2.jpg"},
{image: "https://img2.wmnetwork.cc/attachment/weibo/thumb/avatar/201710/26/723a4d86fecd1a0d2d2ee3b9a90d39bd.jpg"}];
//计算视野内15张图片的css
for(var i=0,pos=0;i<15;i++){  
    var d = Math.abs(i-7);
    var scale = 1-0.1*d;
    cssArray[i] = {
        opacity:(i==7?"1":"0.9"),
        transform: ("scale("+scale+")"), //scale按0.1逐级递减
        position:"absolute",
        top:0,
        left:(pos+"px"),
        zIndex:(8-d)
    };
    if(i<=6){ //下一张图片在上一张图片一半处
        pos += 100*scale; //左侧
    }else{  
        pos += 200*scale - 100*(scale-0.1);  // 右侧
    }
}
Array.prototype.repeat = function(n){ 
	var temp = [];
	for(var i = 0;i < n;i ++){
		temp = temp.concat(this);
	}
	return temp;
}
personArray = personArray.repeat(45);
var personNumber = personArray.length;


function shift(){
    var swiperItems = $(".swiper-item");
    for(var i=0;i<15;i++){
        swiperItems.eq((no+i)%45).css({
            display:"inline-block"
        }).css(cssArray[i]);
    };
    for(var i=15;i<45;i++){
        swiperItems.eq((no+i)%45).css({
            display:"none"
        });
    }
    // 如果一轮结束，则载入缓存组数据
    if(no%15==0 && no!=0){
        for(var i=30;i<45;i++){
            swiperItems.eq((no+i)%45).attr({
                'src':personArray[(no+i)%personNumber].image
            });
        }
    }
    no++;
}

function stopCallback(){
    // $(".slowdownButton").addClass("start-btn").removeClass("slowdownButton");
}

function run(speed,callback){
    if(speed > 100){
        $(".swiper-item").css({
            transition:("all "+speed/1000+"s")
        });
    }
    shift();
    var runTimeout = setTimeout(function(){
        if(stopFlag){ //减速过程
            if(speed < 450){ //最低速度
                speed += 30;
                console.log(speed)
                if(!changeFlag){ //只执行一次
                    // $(".swiper-item").eq((no+11+7)%45).attr("src",prize_avatar);
                    changeFlag = true;
                }
            }else{  
                callback && callback();
                stopFlag = false;
                allowStop = false;
                changeFlag = false;
                return; //停止
            }
        }else if(speed > 100){ //加速过程 
            speed -= 30; 
            if(speed<100){ //最高速度
                allowStop = true;
                $(".swiper-item").css({ //取消transition
                    transition:""
                });
            }
        }
        run(speed,callback);
        clearTimeout(runTimeout);
        runTimeout = null;
    },speed)
}

function start(){
    run(450,stopCallback);
}

function stop(){
    stopFlag = true;
}

function events(){
	$("body").on("click", function(e){
		var target = $(e.target);
		if(target.hasClass("start-btn")){
			start();
			target.addClass("stop-btn").removeClass("start-btn").text("stop");
		}else if(target.hasClass("stop-btn")){
			stop();
			target.addClass("start-btn").removeClass("stop-btn").text("start");
		}
		
	});
}

$(function(){ //界面初始化操作
	var htmlStr = "";
	if(personArray.length>0){
	    for(var i = 0;i < 45;i ++){
	        htmlStr += "<img class='swiper-item' src='"+personArray[i].image+"'></img>";
	    }
	    swiper.append(htmlStr);
	    shift();
	}
	events();
})