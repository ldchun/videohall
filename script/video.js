/**
 * Created by chun on 2017/6/12.
 */
var vueApp;
//数据初始化
function vueAppInit(){
    vueApp = new Vue({
        el: '#vdVideo',
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
    //加载列表
    loadVideoList();
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
    inData.arttit = fatUndef(hrefPara['arttit']);
    return inData;
}
//视频列表
function loadVideoList(){
    var inData = getInData();
    //設置文章标题
    document.getElementById("hdTitle").innerHTML = inData['arttit'];
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
            var dataArr = jsonData['data'];
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
            vueApp.items = vueApp.items.concat(dataArr);
        },
        error:function(error){
            console.log(error);
        }
    });
}