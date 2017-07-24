/**
 * Created by chun on 2017/6/12.
 */
var vueApp;
var videoHref = "video.html?artid=";
var articleHref = "article.html?artid=";
var tmpUid;
var tmpArtTime = false;
var pagePara = {
    pageCount: 0,
    pageSize: 3
};
var loadFn = new loadMore();
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
    //加载列表
    loadFn.init();
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
    inData.pageStart = pagePara.pageCount++ * pagePara.pageSize;
    inData.pageSize = pagePara.pageSize;
    $.ajax({
        type: "get",
        url: caseAjaxUrl + inData.uid,
        data: inData,
        dataType: "jsonp",
        jsonp: "callback",
        // jsonpCallback: "jsonpback",
        success:function(data){
            var jsonData = eval(data);
            //第三方信息
            if(inData.pageStart <= 0){
                loadAccount(jsonData['data']['account']);
            }
            //文章列表
            var listArr = jsonData['data']['list'];
            if(listArr.length > 0){
                //列表
                loadArtList(listArr);
                //恢复状态
                loadFn.reset();
            }else{
                //加载结束关闭
                loadFn.close();
            }
            //关闭加载动画
            loadAnimHide();
        },
        error:function(error){
            console.log(error);
            loadFn.reset();
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
//转换文章背景图片
function fatArtBg(src){
    var artBg = "";
    if((src.indexOf("http") == 0) || (src.indexOf("https") == 0)){
        artBg = src;
    }else{
        artBg = getimgUrl + src;
    }
    return artBg;
}
//列表
function loadArtList(data){
    var dataArr = data;
    for(var i=0, arrSize=dataArr.length; i<arrSize; i++){
        dataArr[i]['article']['arthref'] = articleHref + dataArr[i]['article']['artid'];
        dataArr[i]['article']['artall']  = videoHref + dataArr[i]['article']['artid']+"&arttit="+decodeURI(dataArr[i]['article']['arttit']);
        dataArr[i]['article']['artbg']   = fatArtBg(dataArr[i]['article']['artbg']);
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

//加载更多
function loadMore(){
    this.el = "#caseBody";
    this.windowH = $(window).height();
    this.threshold = 100;
    this.loading = false;
    this.islock = false;
    this.timer = "";
    this.elem = this.el.slice(1);
    this.loadfunc = loadData;
    this.reset = function(){
        this.islock = false;
        this.loading = false;
        this.loadtip(false);
    };
    this.close = function(){
        if(this.timer){clearInterval(this.timer);}
        this.lock();
        this.loadtip(0);
    };
    this.loadtip = function(flag){
        var theClass = "finish";
        var $tipElem = $("#loadMoreTip");
        switch(flag){
            case 1:
                $tipElem.show().removeClass(theClass);
                break;
            case 0:
                $tipElem.show().addClass(theClass);
                break;
            default:
                $tipElem.hide();
        }
    };
    this.lock = function(){
        this.islock = true;
    };
    this.unlock = function(){
        this.islock = false;
    };
    this.getdata = function(){
        this.loadtip(1);
        if(!this.loading && !this.islock){
            this.loading = true;
            this.loadfunc();
        }
    };
    this.scroll = function(){
        var self = this;
        //注册滚动
        $(window).on('scroll', function(){
            if(self.timer){clearInterval(self.timer);}
            if(self.loading || self.islock){return ;}
            var scrollTop  = document.body.scrollTop || document.documentElement.scrollTop;
            var contentH = $('body').height();
            var offH = contentH - self.windowH - scrollTop;
            if(offH <= self.threshold){
                self.getdata();
            }
        });
    };
    this.launch = function(){
        var self = this;
        var checkBottom = function(){
            if(self.loading || self.islock){return ;}
            var scrollTop  = document.body.scrollTop || document.documentElement.scrollTop;
            var contentH = $('body').height();
            var offH = contentH - self.windowH - scrollTop;
            if(offH <= 0){
                self.getdata();
            }else{
                if(self.timer){clearInterval(self.timer);}
            }
        };
        this.timer = setInterval(checkBottom, 1000);
        checkBottom();
    };
    this.init = function(){
        this.reset();
        this.launch();
        this.scroll();
    };
}