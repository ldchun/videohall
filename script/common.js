/**
 * Created by chun on 2017/6/12.
 */
var mUrlBase = "http://10.111.123.8:9000/";
/**** 功能Api ****/
var getimgUrl = mUrlBase + "img/";
var loadimgUrl = "http://www.webls.cn/server/loadimg.php?imgurl=";
/*AjaxUrl*/
var accountAjaxUrl = mUrlBase + "account";
var articleAjaxUrl = mUrlBase + "article/";
var moviesAjaxUrl  = mUrlBase + "article/movies/";

/************ 自定义常用函数 *************/

/*取消事件的默认行为(兼容IE)*/
var stopDefault = function (ev) {
    var e = ev || window.event;
    if (e && e.preventDefault) {
        e.preventDefault();	//W3C
    } else {
        window.event.returnValue = false; //IE
    }
};
/*阻止事件冒泡(兼容IE)*/
var stopPropagation = function (ev) {
    var e = ev || window.event;
    if (e.stopPropagation) { //W3C
        e.stopPropagation();
    } else {
        e.cancelBubble = true; //IE
    }
};
//事件
var eventFn = {
    //注册
    add: function(elem, event, func){
        if(event === undefined){return;}
        if(elem.addEventListener){
            elem.addEventListener(event, func, false);
        } else if(elem.attachEvent){
            elem.attachEvent('on'+event, func);
        } else{
            elem['on'+event] = func;
        }
    },
    //注销
    remove: function(elem, event, func){
        if(event === undefined){return;}
        if(elem.removeEventListener){
            elem.removeEventListener(event, func, false);
        } else if(elem.detachEvent){
            elem.detachEvent('on'+event, func);
        } else{
            elem['on'+event] = null;
        }
    }
};
//获取请求参数
function GetRequest(){
    var url = decodeURI(location.search);
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            var paraItem = strs[i].split("=");
            theRequest[paraItem[0]]=(paraItem[1]);
        }
    }
    return theRequest;
}
//获取请求链接
function GetRequestHref(){
    var url = decodeURI(location.search);
    var theHref = "";
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var hrefIndex = str.indexOf("=");
        if(hrefIndex != -1){
            theHref = str.slice(hrefIndex+1);
        }
    }
    return theHref;
}
//判断是否为null
function isNull(obj){
    return (obj == null || obj == "null");
}
//判断是否为数字类型
function isNumber(obj){
    var val = Number(obj);
    return (!isNaN(val));
}
//判断是否为字符串
function isString(obj){
    return Object.prototype.toString.call(obj) === "[object String]";
}
//判断是否为数组类型
function isArray(obj){
    return Object.prototype.toString.call(obj) === '[object Array]';
}
//处理未定义参数
function fatUndef(str, val){
    val = (val === undefined) ? "" : val;
    return (str === undefined) ? val : str;
}
//获取随机数
function getRandom(start, end){
    return Math.floor(Math.random()*Math.abs(end-start) + start);
}

/************ 功能定义函数 *************/

//返回顶部
function backTopFun(){
    var screenH = $(window).height();
    var $backElem = $("#goTop");
    //页面滚动
    $(window).on("scroll", function(){
        //返回顶部
        var bodyScroll = document.body.scrollTop || document.documentElement.scrollTop;
        var gohide = "gohide";
        if (bodyScroll > screenH) {
            $backElem.removeClass(gohide);
        }
        else {
            $backElem.addClass(gohide);
        }
    });
    //点击
    $backElem.on('click', function(){
        $("html, body").stop().animate({
            scrollTop: 0
        }, 500);
    });
}

/************ 初始化设置（公共部分） *************/

//初始化
$(document).ready(function(){
    //返回顶部
    if($("#goTop")){
        backTopFun();
    }
});