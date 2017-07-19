/**
 * Created by chun on 2017/6/12.
 */
var vueApp;
var videoHref = "video.html?artid=";
var articleHref = "article.html?artid=";
var tmpUid;
var tmpArtTime = false;
//数据初始化
function vueAppInit(){
    vueApp = new Vue({
        el: '#caseBody',
        data: {
            "list": [
                {
                    "article": {"artid": "", "arttit": "", "artsub": "", "artbg": "", "arttime": false},
                    "movie": [
                        { "mvname": "", "mvsub": "", "mvbg": "", "mvhref": "" }
                    ]
                }
            ]
        }
    });
    //默认清空
    vueApp.list = [];
}
vueAppInit();
//初始化
$(document).ready(function(){
    //加载信息
    loadData();
    //页面滚动
    $(window).on("scroll", function (){
        //顶部背景显现
        var nohdH = -20;
        var nohd = "nohd";
        var nohdtitH = -120;
        var nohdtit = "nohdtit";
        var $vhCase = $("#vhCase");
        var caseTpHdElem = document.getElementById("caseTpHd");
        var thisTop = caseTpHdElem.getBoundingClientRect().top;
        (thisTop < nohdH) ? $vhCase.addClass(nohd) : $vhCase.removeClass(nohd);
        (thisTop < nohdtitH) ? $vhCase.addClass(nohdtit) : $vhCase.removeClass(nohdtit);
    });
});
//获取参数
function getInData(){
    var inData = {};
    inData.uid = "1";
    //获取参数
    var hrefPara = GetRequest();
    if(typeof(hrefPara.uid) != 'undefined'){
        inData.uid = hrefPara.uid;
    }
    tmpUid = inData.uid;
    return inData;
}
//获取信息
function loadData(){
    var inData = getInData();
    $.ajax({
        type: "get",
        // url: "server/case.json",
        url: caseAjaxUrl + inData.uid,
        data: "",
        dataType: "jsonp",
        jsonp: "callback",
        jsonpCallback: "jsonpback",
        success:function(data){
            var jsonData = eval(data);
            //第三方信息
            loadAccount(jsonData['data']['account']);
            //列表
            loadArtList(jsonData['data']['list']);
            //关闭加载动画
            loadAnimHide();
        },
        error:function(error){
            console.log(error);
        }
    });
}
//第三方信息
function loadAccount(data){
    var dataObj = data;
    dataObj['accname'] = fatUndef(dataObj['accname']);
    dataObj['accsub']  = fatUndef(dataObj['accsub']);
    document.getElementById("hdTitle").innerHTML = dataObj['accname'];
    document.getElementById("accName").innerHTML = dataObj['accname'];
    document.getElementById("accSub").innerHTML  = dataObj['accsub'];
    //设置背景
    var imgSrc = "";
    switch(parseInt(tmpUid)){
        case 1:
            imgSrc = accountBgArr[0];
            break;
        case 3:
            imgSrc = accountBgArr[1];
            break;
        case 5:
            imgSrc = accountBgArr[2];
            break;
    }
    var bgImgEl = document.getElementById("caseTpBgImg");
    bgImgEl.setAttribute('src', imgSrc);
}
//处理文章时间
function handleArtTime(time){
    var timeVal = false;
    if((typeof(time) != "undefined") && !isNull(time)){
        var theDate = getDate(time);
        timeVal = parseInt(theDate.month)+"月"+theDate.day+"日";
    }
    return timeVal;
}
//判断是否显示文章时间
function isShowArtTime(time){
    return (time != false);
}
//列表
function loadArtList(data){
    var dataArr = data;
    for(var i=0, arrSize=dataArr.length; i<arrSize; i++){
        dataArr[i]['article']['arthref'] = articleHref + dataArr[i]['article']['artid'];
        dataArr[i]['article']['artall']  = videoHref + dataArr[i]['article']['artid']+"&arttit="+decodeURI(dataArr[i]['article']['arttit']);
        dataArr[i]['article']['artbg']   = getimgUrl + dataArr[i]['article']['artbg'];
        //时间
        var strArtTime = handleArtTime(dataArr[i]['article']['arttime']);
        if(tmpArtTime != strArtTime){
            tmpArtTime = strArtTime;
            dataArr[i]['article']['arttime'] = strArtTime;
        }else{
            dataArr[i]['article']['arttime'] = false;
        }
    }
    vueApp.list = vueApp.list.concat(dataArr);
}