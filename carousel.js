define(function(){
	var cssArray = new Array(15);
	var personArray = [{image: "https://img2.wmnetwork.cc/attachment/weibo/thumb/avatar/201710/26/0b3d8b3e04122e5196eae6c9e182f5d3.jpg"}, 
	{image: "https://img2.wmnetwork.cc/attachment/weibo/thumb/avatar/201710/24/f1ad5ed90cb2ec793f2465ce94ad41a2.jpg"},
	{image: "https://img2.wmnetwork.cc/attachment/weibo/thumb/avatar/201710/26/723a4d86fecd1a0d2d2ee3b9a90d39bd.jpg"}];
	Array.prototype.repeat = function(n){ 
		var temp = [];
		for(var i = 0;i < n;i ++){
			temp = temp.concat(this);
		}
		return temp;
	}
	personArray = personArray.repeat(45);
	var personNumber = personArray.length;
	var stopCallback = function(){
		$(".brake-btn").addClass("start-btn").removeClass("brake-btn");
		 $("#music")[0].pause();
	};

	var carousel = {
		// elem: $("#swiper"),
		count: 0, //转动过的次数
		shiftNo: 0,
		allowStop: false,
		stopFlag: false, //停止的标志
		changeFlag: false, //图片更换的标志
		styleCalc: function(){ //计算视野内15张图片的css
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
		},
		shift: function(){
		    var swiperItems = $(".swiper-item");
		    var count = this.count;
		    for(var i=0;i<15;i++){
		        swiperItems.eq((count+i)%45).css({
		            display:"inline-block"
		        }).css(cssArray[i]);
		    };
		    for(var i=15;i<45;i++){
		        swiperItems.eq((count+i)%45).css({
		            display:"none"
		        });
		    }
		    // 如果一轮结束，则载入缓存组数据
		    if(count%15==0 && count!=0){
		        for(var i=30;i<45;i++){
		            swiperItems.eq((count+i)%45).attr({
		                'src':personArray[(count+i)%personNumber].image
		            });
		        }
		    }
		    this.count++;
		},
		run: function(speed,callback){
		    if(speed > 100){
		        $(".swiper-item").css({
		            transition:("all "+speed/1000+"s")
		        });
		    }
		    this.shift();
		    var that = this;
		    var runTimeout = setTimeout(function(){
		        if(that.stopFlag){ //减速过程
		            if(speed < 450){ //最低速度
		                speed += 30;
		                if(!that.changeFlag){ //只执行一次
		                    that.changeFlag = true;
		                }
		            }else{  
		                callback && callback();
		                that.stopFlag = false;
		                that.allowStop = false;
		                that.changeFlag = false;
		                return; //停止
		            }
		        }else if(speed > 100){ //加速过程 
		            speed -= 30; 
		            if(speed<100){ //最高速度
		                that.allowStop = true;
		                $(".swiper-item").css({ //取消transition
		                    transition:""
		                });
		            }
		        }
		        that.run(speed,callback);
		        clearTimeout(runTimeout);
		        runTimeout = null;
		    },speed)
		},
		start: function(){
		    this.run(450,stopCallback);
		    $("#music")[0].play();
		},
		stop: function (){
		    this.stopFlag = true;
		},
		events: function(){
			var that = this;
			$("body").on("click", function(e){
				var target = $(e.target);
				if(target.hasClass("start-btn")){
					that.start();
					console.log("start")
					target.addClass("stop-btn").removeClass("start-btn");
				}else if(target.hasClass("stop-btn")){
					that.stop();
					console.log("stop")
					target.addClass("brake-btn").removeClass("stop-btn");
				}
				
			});
		},
		init: function(){
			this.styleCalc();
			var htmlStr = "";
			if(personArray.length>0){
			    for(var i = 0;i < 45;i ++){
			        htmlStr += "<img class='swiper-item' src='"+personArray[i].image+"'></img>";
			    }
			    // this.elem
			    $("#swiper").append(htmlStr);
			    this.shift();
			}
			this.events();
		}
	}
	return carousel;
})
