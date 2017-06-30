/**
 * Created by chun on 2017/6/12.
 */
var vueApp;
var caseHref = "case.html?uid=";
var accountBgArr = [
    "images/home/bg-kddy.jpg",
    "images/home/bg-duliyu.jpg",
    "images/home/bg-xmt.jpg",
    "images/home/bg-yzdy.jpg"
];
//数据初始化
function vueAppInit(){
    vueApp = new Vue({
        el: '#tpListDiv',
        data: {
            'items': [
                {'name': "", 'logo': "", 'subtitle': "", 'bg': "", 'href': ""}
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
    loadTpList();
});
//媒体列表
function loadTpList(){
    $.ajax({
        type: "get",
        // url: "server/home.json",
        url: accountAjaxUrl,
        data: "",
        dataType: "jsonp",
        jsonp: "callback",
        jsonpCallback: "jsonpback",
        success:function(data){
            var jsonData = eval(data);
            var dataArr = jsonData['tp'];
            for(var i=0, arrSize=dataArr.length; i<arrSize; i++){
                dataArr[i]['logo'] = getimgUrl + dataArr[i]['logo'];
                dataArr[i]['bg'] = accountBgArr[getRandom(0, 3)];
                var tmpHref = String(dataArr[i]['href']);
                tmpHref = (tmpHref.charAt(0) == "/") ? tmpHref.slice(1) : tmpHref;
                dataArr[i]['href'] = caseHref + tmpHref;
            }
            vueApp.items = vueApp.items.concat(dataArr);
            //关闭加载动画
            loadAnimHide();
        },
        error:function(error){
            console.log(error);
        }
    });
}