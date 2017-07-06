/**
 * Created by chun on 2017/6/12.
 */
var vueApp;
//数据初始化
function vueAppInit(){
    vueApp = new Vue({
        el: '#artPopCon',
        data: {
            "items": [
                { "mvname": "", "mvsub": "", "mvbg": "", "mvhref": ""}
            ]
        }
    });
    //默认清空
    vueApp.items = [];
}
vueAppInit();
//初始化
$(document).ready(function(){
    loadData();
});
//获取参数
function getInData(){
    var inData = {};
    inData.artid = "1";
    //获取参数
    var hrefPara = GetRequest();
    if(typeof(hrefPara.artid) != 'undefined'){
        inData.artid = hrefPara.artid;
    }
    return inData;
}
//获取信息
function loadData(){
    var inData = getInData();
    $.ajax({
        type: "get",
        // url: "server/article.json",
        url: articleAjaxUrl + inData.artid,
        data: "",
        dataType: "jsonp",
        jsonp: "callback",
        jsonpCallback: "jsonpback",
        success:function(data){
            var jsonData = eval(data);
            var dataJson = jsonData['data'];
            //加载文章
            loadArticle(dataJson);
            //关闭加载动画
            loadAnimHide();
            //加载影片
            if(parseInt(dataJson['mvnum']) > 0){
                loadMovie();
            }else{
                $('#slideOpen').hide();
            }
        },
        error:function(error){
            console.log(error);
        }
    });
}
//拖动
function slideOpenDrag(){
    var theElem = document.getElementById('slideOpen');
    theElem.style.display = "block";
    var btnW = 70, btnH = 60;
    var conW = $("#artCon").width();
    var conH = $("#artCon").height();
    var offX, offY;
    eventFn.add(theElem, "touchstart", function(ev){
        var touches = ev.touches[0];
        offX = touches.clientX - theElem.offsetLeft;
        offY = touches.clientY - theElem.offsetTop;
    });
    eventFn.add(theElem, "touchmove", function(ev){
        var touches = ev.touches[0];
        var newLeft = touches.clientX - offX;
        var newTop  = touches.clientY - offY;
        //不超过边框
        newLeft = (newLeft < 0) ? 0 : newLeft;
        newTop  = (newTop < 0) ? 0 : newTop;
        newLeft = (newLeft > (conW-btnW)) ? (conW-btnW) : newLeft;
        newTop  = (newTop > (conH-btnH)) ? (conH-btnH) : newTop;
        //设置样式
        theElem.style.left = newLeft + "px";
        theElem.style.top  = newTop + "px";
        theElem.style.right = "auto";
        theElem.style.bottom = "auto";
    });
    eventFn.add(theElem, "touchend", function(ev){
        var styleLeft  = {left: 0, right: "auto"};
        var styleRight = {right:0, left: "auto"};
        var styleObj = (theElem.offsetLeft < (conW-btnW)/2) ? styleLeft : styleRight;
        $(theElem).stop().animate(styleObj, 300);
    });
}
//侧面板
function slidePanelInit(){
    var msTime = 300;
    var open = "open";
    var $openElem = $("#slideOpen");
    var $closeElem = $("#slideClose");
    var $slideOver = $("#slideOver");
    $openElem.on('click', function(){
        $("#slidePanel").addClass(open);
        $slideOver.stop().fadeIn(msTime);
    });
    var slideHide = function(){
        $("#slidePanel").removeClass(open);
        $slideOver.stop().fadeOut(msTime);
    };
    $closeElem.on('click', slideHide);
    $slideOver.on('click', slideHide);
}
//文章
function loadArticle(data){
    var dataObj = data;
    //设置第三方名称
    dataObj['accname'] = fatUndef(dataObj['accname']);
    // document.getElementById("hdTitle").innerHTML = dataObj['accname'];
    document.getElementById("hdTitle").innerHTML = dataObj["arttit"];
    //加载文章
    // iframeElem.setAttribute("src", dataObj.arthref);
    var artHtmlElem = document.getElementById("artHtml");
    artHtmlElem.innerHTML = dataObj['artcon'];
    var $img = $(artHtmlElem).find('img[data-src]');
    var imgNum = $img.size();
    for(var i=0; i<imgNum; i++){
        var $imgThis = $img.eq(i);
        $imgThis.attr('src', $imgThis.attr('data-src'));
    }
    //侧边栏信息：标题
    dataObj['arttit'] = fatUndef(dataObj['arttit']);
    document.getElementById("artTitlePop").innerHTML = dataObj.arttit;
}
//影片
function loadMovie(){
    var inData = getInData();
    $.ajax({
        type: "get",
        // url: "server/video.json",
        url: moviesAjaxUrl + inData.artid,
        data: "",
        dataType: "jsonp",
        jsonp: "callback",
        jsonpCallback: "jsonpback",
        success:function(data){
            var jsonData = eval(data);
            var dataJson = jsonData['data'];
            //拖动
            slideOpenDrag();
            //侧面板
            slidePanelInit();
            //加载影片
            var dataArr = dataJson;
            var mvSize = dataArr.length;
            // 影片数量
            document.getElementById("mvNumPop").innerHTML = mvSize;
            //处理影片数据
            dataArr = handleMovieData(dataArr);
            vueApp.items = vueApp.items.concat(dataArr);
        },
        error:function(error){
            console.log(error);
        }
    });
}