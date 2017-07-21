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
    inData.arttit = fatUndef(hrefPara['arttit']);
    return inData;
}

function loadData(){
    var inData = getInData();
    //設置文章标题
    document.getElementById("hdTitle").innerHTML = inData['arttit'];
    //加载列表
    loadVideoList();
}
//视频列表
function loadVideoList(){
    var inData = getInData();
    $.ajax({
        type: "get",
        url: moviesAjaxUrl + inData.artid,
        data: "",
        dataType: "jsonp",
        jsonp: "callback",
        // jsonpCallback: "jsonpback",
        success:function(data){
            var jsonData = eval(data);
            var dataArr = jsonData['data'];
            //处理影片数据
            dataArr = handleMovieData(dataArr);
            vueApp.items = vueApp.items.concat(dataArr);
            //关闭加载动画
            loadAnimHide();
        },
        error:function(error){
            console.log(error);
        }
    });
}