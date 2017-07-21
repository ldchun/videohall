/**
 * Created by chun on 2017/6/12.
 */
var vueApp;
var caseHref = "case.html?uid=";
var accountLogoArr = [
    "images/logo-duliyu.jpg", "images/logo-sir.jpg", "images/logo-hm.jpg"
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
        url: accountAjaxUrl,
        data: "",
        dataType: "jsonp",
        jsonp: "callback",
        jsonpCallback: "jsonpback",
        success:function(data){
            var jsonData = eval(data);
            var dataArr = jsonData['tp'];
            for(var i=0, arrSize=dataArr.length; i<arrSize; i++){
                //logo
                if(i >= accountLogoArr.length){
                    dataArr[i]['logo'] = getimgUrl + dataArr[i]['logo'];
                }else{
                    dataArr[i]['logo'] = accountLogoArr[i];
                }
                //bg
                var bgIndex = i;
                if(bgIndex >= accountBgArr.length){
                    bgIndex = accountBgArr[getRandom(0, accountBgArr.length-1)];
                }
                dataArr[i]['bg'] = accountBgArr[bgIndex];
                var tmpHref = String(dataArr[i]['href']);
                var strArr = tmpHref.split("/");
                var theUid = strArr[strArr.length-1];
                dataArr[i]['href'] = caseHref + theUid;
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