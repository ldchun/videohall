/**
 * Created by chun on 2017/6/12.
 */
var htmlUrlBase = "http://10.111.123.7:8680/www/videohall/";
var mUrlBase = "http://10.111.123.8:9000/";
/**** 功能Api ****/
var getimgUrl = mUrlBase + "img/";
var loadimgUrl = "http://www.webls.cn/server/loadimg.php?imgurl=";
/*AjaxUrl*/
var accountAjaxUrl = mUrlBase + "account";
var articleAjaxUrl = mUrlBase + "article/";
var moviesAjaxUrl  = mUrlBase + "article/movies/";
var backVideoMagUrl = mUrlBase + "manager/";
var acclistAjaxUrl = mUrlBase + "manager/account/list";
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
    return ((str === undefined) || isNull(str)) ? val : str;
}
//获取随机数
function getRandom(start, end){
    return Math.floor(Math.random()*Math.abs(end-start) + start);
}
//去掉字符串前后字符串
function trimString(str){
    return String(str).replace(/(^\s*)|(\s*$)/g, "");
}
String.prototype.Trim = function() {
    var str = this;
    return (isString(str)) ? str.replace(/(^\s*)|(\s*$)/g, "") : str;
};
//小于10的数值前面增加0
function addZero(val){
    var value = (val < 10)? ("0"+val) : val;
    return value.toString();
}
//获取时间的 年、月、日
function getDate(time){
    var date;
    if(time){
        date = new Date(time);
    }else{
        date = new Date();
    }
    return {
        year : date.getFullYear(),
        month: addZero(date.getMonth()+1),
        day: addZero(date.getDate())
    };
}
//Extend the Object : flag：true -> deep copy
function extendObj(defObj, inObj, flag){
    var curFlag = true;
    curFlag = (flag === undefined) ? curFlag : flag;
    for(var para in inObj){
        var curOpt = inObj[para];
        if(isArray(curOpt) && curFlag ){
            for(var i=0,size=curOpt.length; i<size; i++){
                defObj[para][i] = curOpt[i];
            }
        }
        else{
            if(typeof(curOpt) === "object"){
                extendObj(defObj[para], curOpt, curFlag);
            }
            else{
                defObj[para] = curOpt;
            }
        }
    }
    return defObj;
}
//layer弹窗
function layerPopOpen(options){
    var layerOpt = {
        type: 1,
        title: ['', "padding-left:70px;font-size:16px;text-align:center;color:#FFF;background:#8C7551;"],
        skin: 'demo-class',
        area: ['420px', 'auto'], //宽高
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        btn: ['确定', '取消'],
        yes: function(){layer.close("page");},
        btn2: function(){layer.closeAll();},
        btnAlign: 'c',
        content: $("#popDiv")
    };
    if (typeof(options) === 'undefined'){options = {};}
    if (typeof(options) === "object") {
        for(var para in options){
            var curVal = options[para];
            if(isArray(curVal)){
                for(var i=0,size=curVal.length; i<size; i++){
                    layerOpt[para][i] = curVal[i];
                }
            }
            else{
                layerOpt[para] = curVal;
            }
        }
    }
    //弹窗
    layer.open(layerOpt);
}
/**********  校验 **********/
//提示框关闭
function tipHide(){
    $(".jq_tips_box").hide().remove();
    layer.closeAll('tips');
}
//提示框显示信息
function tipShow(elem, msgStr){
    tipHide();
    layer.tips(msgStr, elem, {tips: [1, '#78BA32']});
}
/****  校验函数 ****/
//校验是否为空
function EmptyCheck(elem, value, msg){
    var res = true;
    if(value == ''){
        tipShow(elem, msg);
        res = false;
    } else{
        tipHide();
    }
    return res;
}
//密码校验
function PasswordCheck($elem, value){
    var res = true;
    if (value == "") {
        tipShow($elem, "密码不能为空");
        res = false;
    } else if (value.length < 6) {
        tipShow($elem, "密码长度不能小于6位");
        res = false;
    } else {
        $elem.val(jQuery.trim(value));
        tipHide();
    }
    return res;
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
//影片数据处理
function handleMovieData(data){
    var dataArr = data;
    for(var i=0, arrSize=dataArr.length; i<arrSize; i++){
        //判断异常处理
        dataArr[i]['mvtag'] = fatUndef(dataArr[i]['mvtag'], []);
        dataArr[i]['mvscore'] = fatUndef(dataArr[i]['mvscore']);
        dataArr[i]['mvtime'] = fatUndef(dataArr[i]['mvtime']);
        dataArr[i]['mvstate'] = fatUndef(dataArr[i]['mvstate']);
        //组合显示标签、时间、地区
        dataArr[i]['mvtag'] = isArray(dataArr[i]['mvtag']) ? dataArr[i]['mvtag'].join("/") : dataArr[i]['mvtag'];
        dataArr[i]['mvtime'] = dataArr[i]['mvtime']+"("+dataArr[i]['mvstate']+")";
    }
    return dataArr;
}
//判断是否为有效链接
function isValidHref(str){
    return (isString(str) && (str != ''));
}
//隐藏加载动画
function loadAnimHide(){
    var $loadElem = $("#loadBox");
    $loadElem.stop().fadeOut(200);
}
//格式化时间
function fatDate(time, options){
    var setting = {
        mode: 0, // 0->日，1->月，2->年
        join: "-"
    };
    if (options === undefined){options = {};}
    if (typeof(options) === "object") {
        setting = extendObj(setting, options);
    }
    var timeDate = getDate(time);
    var joinStr = setting.join;
    var modeVal = parseInt(setting.mode);
    var timeTxt = "";
    var timeVal = "";
    switch(modeVal){
        case 2: //年
            timeTxt = timeDate.year+"年";
            timeVal = timeDate.year;
            break;
        case 1: //月
            timeTxt = timeDate.year+"年"+timeDate.month+"月";
            timeVal = timeDate.year+joinStr+timeDate.month;
            break;
        default: //日
            timeTxt = timeDate.year+"年"+timeDate.month+"月"+timeDate.day+"日";
            timeVal = timeDate.year+joinStr+timeDate.month+joinStr+timeDate.day;
    }
    return {
        txt: String(timeTxt),
        val: String(timeVal)
    };
}
//时间选择 初始化
function TimeDPInit(options){
    var nowTime = new Date();
    var oldTime = nowTime.getTime()-24*60*60*1000;
    var setting = {
        startEl: document.getElementById("startTime"),
        endEl: document.getElementById("endTime"),
        deftime: {
            start: oldTime,
            end: nowTime
        },
        viewMode: 0, // 0->日，1->月，2->年
        callback: null
    };
    if (options === undefined){options = {};}
    if (typeof(options) === "object") {
        setting = extendObj(setting, options);
    }
    var dpViewMode = setting.viewMode;
    //datapicker参数设置
    var startDateVal = "2010-01-01";
    var fatStartDate = fatDate(startDateVal, {mode: dpViewMode});
    var fatEndDate = fatDate(nowTime, {mode: dpViewMode});
    var fatDefStart = fatDate(setting.deftime.start, {mode: dpViewMode});
    var fatDefEnd = fatDate(setting.deftime.end, {mode: dpViewMode});
    var formatDp = '';
    switch(dpViewMode){
        case 2: //年
            formatDp = 'yyyy年';
            break;
        case 1: //月
            formatDp = 'yyyy年mm月';
            break;
        default: //日
            formatDp = 'yyyy年mm月dd日';
    }
    var dpStartOpt = {
        language: 'zh-CN',
        startView: dpViewMode,
        minViewMode: dpViewMode,
        startDate: fatStartDate.val,
        endDate: fatEndDate.val,
        autoclose: true,
        format: formatDp
    };
    var dpOpt = {
        language: 'zh-CN',
        startView: dpViewMode,
        minViewMode: dpViewMode,
        startDate: fatDefStart.val,
        endDate: fatEndDate.val,
        autoclose: true,
        format: formatDp
    };
    var $startEl = $(setting.startEl);
    var $endEl = $(setting.endEl);
    var startDPOpt = dpStartOpt;
    var endDPOpt = dpOpt;
    //结束时间
    var endDP = $endEl.datepicker(endDPOpt);
    /*endDP.on('changeDate',function(ev){
        var endTime = ev.date.valueOf();
        var fatCurDate = fatDate(endTime, {mode: dpViewMode});
        $endEl.datepicker('update', fatCurDate.val);
    });*/
    //设置初始值
    $endEl.val(fatDefEnd.txt);
    $endEl.datepicker('update', fatDefEnd.val);
    //开始时间
    if($startEl){
        var startDP = $startEl.datepicker(startDPOpt);
        startDP.on('changeDate',function(ev){
            var startTimeUTC = $startEl.datepicker('getUTCDate');
            var endTimeUTC = $endEl.datepicker('getUTCDate');
            var fatCurStart = fatDate(startTimeUTC, {mode:dpViewMode});
            if(startTimeUTC > endTimeUTC){
                $endEl.val(fatCurStart.txt);
            }
            $endEl.datepicker('setStartDate', fatCurStart.val);
            $endEl.focus();
        });
        //设置初始值
        $startEl.val(fatDefStart.txt);
        $startEl.datepicker('update', fatDefStart.val);
    }
    //日历小图标点击触发日历窗口
    $(".icon-calendar").on('click', function(){
        $(this).siblings().filter('input').trigger('focus');
    });
    //回掉函数
    if(setting.callback){
        setting.callback();
    }
}
//加载公众号列表
function AccList(options){
    var setting = {el: "#acclist", hasAll: true, tailAll: false, callback: null,
        allOpt: [{"code": "", "name": "全部"}] };
    if (options === undefined){options = {};}
    if (typeof(options) === "object") {
        setting = extendObj(setting, options);
    }
    $.ajax({
        type: "get",
        url: acclistAjaxUrl,
        data: "",
        dataType: "jsonp",
        jsonp: "callback",
        jsonpCallback: "jsonpback",
        success:function(data){
            var jsonData = eval(data);
            var dataArr = jsonData["data"];
            var listArr = [];
            //加载列表
            if(setting.hasAll){
                if(setting.tailAll){
                    listArr = listArr.concat(dataArr, setting.allOpt);
                }
                else{
                    listArr = listArr.concat(setting.allOpt, dataArr);
                }
            }else{
                listArr = dataArr;
            }
            var thisEl = $(setting.el)[0];
            thisEl.innerHTML = "";
            var arrSize = listArr.length;
            for(var i=0; i<arrSize; i++){
                var curObj = listArr[i];
                var optionEl = document.createElement("option");
                optionEl.value = curObj["code"];
                optionEl.innerHTML = curObj["name"];
                thisEl.appendChild(optionEl);
            }
            //回掉函数
            if(setting.callback){
                setting.callback();
            }
        },
        error:function(error){
            console.log(error);
        }
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