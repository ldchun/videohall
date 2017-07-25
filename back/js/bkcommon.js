/**
 * Created by chun on 2017/7/3.
 */
//文章
var bkArtListUrl    = backMagUrl + "article/list";
var bkArtStateUpUrl = backMagUrl + "article/update/status";
//影片
var bkMvListUrl  = backMagUrl + "list";
var bkMvInfoUpUrl   = backMagUrl + "resource/update";
var bkMvInArtStateUpUrl  = backMagUrl + "article/status/update";

/***************** 后台功能函数 ******************/
//状态格式化
function fatState(state){
    var value = state;
    var valNum = (Number(value) == 0);
    var cssClass = valNum ? "markun" : "markok" ;
    var stateTxt = valNum ? stateWords['off'] : stateWords['on'];
    var stateVal = valNum ? 0 : 1 ;
    return { css: cssClass, txt: stateTxt, val: stateVal, bool: !valNum };
}

//更新文章状态
function updateArtState(elem, inData){
    // 参数：artid、state
    //动画
    ajaxAnimShow();
    //提交服务器
    $.ajax({
        type: "get",
        url: bkArtStateUpUrl,
        data: inData,
        dataType: "jsonp",
        jsonp: "callback",
        // jsonpCallback: "jsonpback",
        success:function(data){
            ajaxAnimHide();
            var jsonData = eval(data);
            var res = jsonData['success'];
            if(res){
                layer.msg('保存成功！', {icon: 1, time: 1000});
                //更新状态
                var on = "on";
                var $elem = $(elem);
                (inData.state) ? $elem.addClass(on) : $elem.removeClass(on);
            }
            else{
                var msg = jsonData['message'];
                layer.msg(msg, {icon: 2, time: 1000});
            }
        },
        error:function(error){
            ajaxAnimHide();
            console.log(error);
            layer.msg('保存失败！', {icon: 2, time: 1000});
        }
    });
}

//更新影片在某文章的状态
function updateMvInArtState(elem, inData){
    // 参数：mvid、artid、state
    //动画
    ajaxAnimShow();
    //提交服务器
    $.ajax({
        type: "get",
        url: bkMvInArtStateUpUrl,
        data: inData,
        dataType: "jsonp",
        jsonp: "callback",
        // jsonpCallback: "jsonpback",
        success:function(data){
            ajaxAnimHide();
            var jsonData = eval(data);
            var res = jsonData['success'];
            if(res){
                layer.msg('保存成功！', {icon: 1, time: 1000});
                //更新状态
                var on = "on";
                var $elem = $(elem);
                (inData.state) ? $elem.addClass(on) : $elem.removeClass(on);
            }
            else{
                var msg = jsonData['message'];
                layer.msg(msg, {icon: 2, time: 1000});
            }
        },
        error:function(error){
            ajaxAnimHide();
            console.log(error);
            layer.msg('保存失败！', {icon: 2, time: 1000});
        }
    });
}
//更新影片信息
function updateMvInfo(inData, callfun){
    //必须参数：mvid、resid、mvhref、status (扩展：mvname、remark)
    inData.resid = ((inData['resid'] === undefined) || isNull(inData['resid'])) ? "" : inData['resid'];
    inData.mvhref = (isNull(inData['mvhref'])||(inData['mvhref'] == "-")) ? "" : inData['mvhref'];
    //动画
    ajaxAnimShow();
    //提交服务器
    $.ajax({
        type: "get",
        url: bkMvInfoUpUrl,
        data: inData,
        dataType: "jsonp",
        jsonp: "callback",
        // jsonpCallback: "jsonpback",
        success:function(data){
            ajaxAnimHide();
            var jsonData = eval(data);
            var res = jsonData['success'];
            if(res){
                layer.closeAll('page');
                layer.msg('保存成功！', {icon: 1, time: 1000});
                if(typeof(callfun) != "undefined"){
                    callfun();
                }
            }
            else{
                var msg = jsonData['message'];
                layer.msg(msg, {icon: 2, time: 1000});
            }
        },
        error:function(error){
            ajaxAnimHide();
            console.log(error);
            layer.msg('保存失败！', {icon: 2, time: 1000});
        }
    });
}

//快速修改影片地址
function fastUpdateMvHref(elem, inData, callfun){
    var $elem = $(elem);
    $elem.editable({
        toggle: "mouseenter",
        type: "text",
        title: "视频地址",
        disabled: false,
        placeholder: '请输入视频地址',
        autotext: "auto",
        emptytext: "",
        mode: "popup",//popup \ inline
        display: function(value) {return ;},
        validate: function (value) {
            //判断
            var tmpVal = $.trim(value);
            if (tmpVal == "") {
                return '视频地址不能为空!';
            }
            //更新影片地址
            inData.mvhref = tmpVal;
            updateMvInfo(inData, callfun);
        }
    });
}

/***** 页面初始化 *****/
//加载页面
$(document).ready(function(){

});
