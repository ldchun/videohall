/**
 * Created by chun on 2017/7/3.
 */
var tableIdArr;
var tableDataArr;
var backVideoListUrl   = backVideoMagUrl + "list";
var backVideoUpdateUrl = backVideoMagUrl + "resource/update";
//加载页面
function loadhtml(){
    //查询
    $("#searchBkVideo").on('click', inSubmit);
    inSubmit();
    //窗口大小调整
    $(window).on('resize', function(){
        setTimeout(function(){
            $("#listTable").bootstrapTable('resetView');
        }, 300);
    });
}
$(document).ready(function(){
    loadhtml();
});
//提交
function inSubmit(){
    tableFun();
}
//输入参数
function getInData(params){
    var inData = {};
    inData.mvname = trimString($("#inBkVideo").val());
    //表格参数
    if(typeof(params) != 'undefined'){
        inData.pageSize  = params.limit;
        inData.pageStart = params.offset;
        inData.sortName  = params.sort;
        inData.sortOrder = params.order;
    }
    return inData;
}
//状态格式化
function fatState(state){
    var value = state;
    var valNum = (Number(value) == 0);
    var cssClass = valNum ? "markun" : "markok" ;
    var stateTxt = valNum ? "无效" : "正常" ;
    var stateVal = valNum ? 0 : 1 ;
    return { css: cssClass, txt: stateTxt, val: stateVal, bool: !valNum };
}
//表格
function tableFun(){
    // 表格点击事件
    window.clickEvents = {
        'click .opbtn': function(e, value, row, index) {
            tableEditShow(index);
        }
    };
    //表格初始化
    function tableInit(){
        var $tableElem = $('#tableEl');
        /*************** 格式化文本 ****************/
        function fatOpBtn(value, row, index) {
            return '<a class="opbtn"'+' title="请点击">'+value+'</a>';
        }
        function fatVideoImg(value, row, index) {
            return '<img src='+value +'>';
        }
        function fatVideoHref(value, row, index) {
            return '<a href='+value+ ' class="linka" target="_blank">'+value+'</a>';
        }
        function fatVideoState(value, row, index) {
            var stateObj = fatState(value);
            return '<span class='+ stateObj.css +'>'+stateObj.txt+'</span>';
        }
        //返回数据
        function resHandler(res) {
            var dataObj = {"rows": [], "total": 0};
            var jsonData = eval(res);
            var dataRows  = jsonData['rows'];
            var dataTotal = jsonData['total'];
            if(dataTotal > 0) {
                tableIdArr = [];
                tableDataArr = [];
                var idArr = [];
                var pageSize = dataRows.length;
                for (var i = 0; i < pageSize; i++) {
                    var curObj = dataRows[i];
                    var curArr = [];
                    tableDataArr[i] = curObj;
                    curArr = [
                        curObj["sort"], curObj["mvbg"], curObj["mvname"], curObj["mvhref"], curObj["remark"], curObj["state"], "编辑"
                    ];
                    dataRows[i] = curArr;
                    //记录id
                    idArr[i] = { "mvid": curObj["mvid"], "resid": curObj["resid"] };
                }
                tableIdArr = idArr;
                dataObj = {"rows": dataRows, "total": dataTotal};
            }
            return dataObj;
        }
        //输入参数
        function inParams(params) {
            var inData = new getInData(params);
            return inData;
        }
        $tableElem.bootstrapTable('destroy');
        $tableElem.bootstrapTable({
            url: backVideoListUrl,
            method: 'get',
            dataType: 'jsonp',
            queryParams: inParams,
            cache: false,
            classes: "table table-hover nobdlr",
            striped: true,
            sortName: "",
            sortOrder: 'desc', //'asc'、'desc'
            sortStable: true,
            sidePagination: 'server', //'client'、'server'
            pagination: true,
            paginationLoop: false,
            pageSize: 10,
            pageList: [10, 25, 50, 100, "All"],
            search: false,
            searchText: "",
            searchOnEnterKey: false,
            searchAlign: "left",
            cardView: false,
            detailView: false,
            showToggle: false,
            singleSelect: false,
            selectItemName: "",
            clickToSelect: false,
            showColumns: false,
            showRefresh: false,
            minimumCountColumns: 1,
            smartDisplay: false,
            responseHandler: resHandler,
            columns: [
                { field: 0, width: "6%", align: 'center', valign: 'middle', halign: 'center', sortable: false },
                { field: 1, width: "10%", align: 'center', valign: 'middle', halign: 'center', sortable: false, formatter:fatVideoImg },
                { field: 2, width: "20%", align: 'center', valign: 'middle', halign: 'center', sortable: false },
                { field: 3, width: "28%", align: 'center', valign: 'middle', halign: 'center', sortable: false, formatter:fatVideoHref },
                { field: 4, width: "20%", align: 'center', valign: 'middle', halign: 'center', sortable: false },
                { field: 5, width: "8%", align: 'center', valign: 'middle', halign: 'center', sortable: false, formatter:fatVideoState },
                { field: 6, width: "8%", align: 'center', valign: 'middle', halign: 'center', sortable: false,
                    events: clickEvents, formatter:fatOpBtn }
            ]
        });
    }
    tableInit();
}
//弹窗信息初始化加载
function infoPopInit(options){
    var setting = {
        mvname: '', mvhref: '', status:1, remark: ''
    };
    if (options === undefined){options = {};}
    if (typeof(options) === "object") {
        setting = $.extend(false, {}, setting, options);
    }
    var $mvnamePop = $("#mvnamePop");
    var $mvhrefPop = $("#mvhrefPop");
    var $statePop = $("#statePop");
    var $remarkPop = $("#remarkPop");
    $mvnamePop.val(setting.mvname);
    $mvhrefPop.val(setting.mvhref);
    $statePop.val(fatState(setting.status).val);
    $remarkPop.val(setting.remark);
}
/*************  编辑  ****************/
//编辑保存
function listEditSave(idObj){
    var $mvnamePop = $("#mvnamePop");
    var $mvhrefPop = $("#mvhrefPop");
    var $statePop = $("#statePop");
    var $remarkPop = $("#remarkPop");
    var inData = {
        mvid: idObj["mvid"],
        resid: idObj["resid"],
        mvname: $mvnamePop.val(),
        mvhref: $mvhrefPop.val(),
        status: fatState($statePop.val()).bool,
        remark: $remarkPop.val()
    };
    //删除前后的空白字符
    for(var para in inData){
        inData[para] = jQuery.trim(inData[para]);
    }
    // 输入校验
    do{
        if(!EmptyCheck($mvhrefPop, inData.mvhref, "视频地址不能为空")){
            break;
        }
        //发送服务器
        $.ajax({
            type: "get",
            url: backVideoUpdateUrl,
            data: inData,
            dataType: "jsonp",
            jsonp: "callback",
            // jsonpCallback: "jsonpback",
            success:function(data){
                var jsonData = eval(data);
                console.log(jsonData);
                var res = jsonData['success'];
                if(res){
                    layer.closeAll('page');
                    layer.msg('保存成功！', {icon: 1, time: 1000});
                    //提交查询
                    inSubmit();
                }
                else{
                    var msg = jsonData['message'];
                    layer.msg(msg, {icon: 2, time: 1000});
                }
            },
            error:function(error){
                console.log(error);
                layer.msg('保存失败！', {icon: 2, time: 1000});
            }
        });
    }while(0);
}
//编辑显示
function tableEditShow(index){
    var jsonData = tableDataArr[index];
    var popData = {
        mvname: jsonData["mvname"],
        mvhref: jsonData["mvhref"],
        status: jsonData["status"],
        remark: jsonData["remark"]
    };
    //更新信息
    infoPopInit(popData);
    //弹窗
    layerPopOpen({
        title: ["视频信息"],
        yes: function(){
            listEditSave(tableIdArr[index]);
        }
    });
}