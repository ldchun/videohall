/**
 * Created by chun on 2017/7/3.
 */
var tableIdArr;
var tableDataArr;
var backVideoListUrl    = backVideoMagUrl + "list";
var backVideoUpdateUrl  = backVideoMagUrl + "resource/update";
var backStatusUpdateUrl = backVideoMagUrl + "article/status/update";
var articleUrl =  htmlUrlBase+ "article.html?artid=";
var stateWords = {on:"启用", off: "停用"};
//初始化加载
function swboxLoad(el, options){
    var setting = {class: "swbox-mini no-radius", onTxt: stateWords.on, offTxt: stateWords.off};
    if (options === undefined){options = {};}
    if (typeof(options) === "object") {
        setting = extendObj(setting, options);
    }
    var thisEl = el;
    thisEl.className = thisEl.className+ " "+setting.class;
    var txtEl = document.createElement('span');
    var togEl = document.createElement('span');
    txtEl.className = "swbox-txt";
    togEl.className = "swbox-tog";
    txtEl.setAttribute("data-on", setting.onTxt);
    txtEl.setAttribute("data-off", setting.offTxt);
    thisEl.appendChild(txtEl);
    thisEl.appendChild(togEl);
}
//加载页面
function loadhtml(){
    //时间选择
    TimeDPInit();
    //公众号列表
    AccList({callback: inSubmit});
    //查询
    $("#inSubmit").on('click', inSubmit);
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
    var startTimeUTC = $("#startTime").datepicker('getDate');
    inData.startTime = fatDate(startTimeUTC).val;
    var endTimeUTC = $("#endTime").datepicker('getDate');
    inData.endTime = fatDate(endTimeUTC).val;
    inData.accname = $("#acclist").val();
    inData.mvname = trimString($("#mvName").val());
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
    var stateTxt = valNum ? stateWords['off'] : stateWords['on'];
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
            return '<img src='+value +' alt="" >';
        }
        function fatVideoHref(value, row, index) {
            return '<a href='+value+ " data-index="+index+' class="linka" target="_blank">'+value+'</a>';
        }
        function fatVideoState(value, row, index) {
            var stateObj = fatState(value);
            return '<span class='+ stateObj.css +'>'+stateObj.txt+'</span>';
        }
        //详情信息
        function detailFat(index, row){
            var curData = tableDataArr[index];
            var curDetail = curData['artlist'];
            var htmlStr = "<div class='detail-con'>";
            var artNum = curDetail.length;
            for(var i=0; i<artNum; i++){
                var curObj = curDetail[i];
                var curArtid = curObj['artid'];
                var checkedVal = curObj['state'] ? 'swbox on' : 'swbox';
                var swboxStr = '<span class="'+checkedVal+'" data-index='+index+' data-artid='+curArtid+' ></span>';
                var spanStr = "<span>"+"【"+curObj['accname']+"】 "+curObj['arttit']+"</span>";
                var artHref = articleUrl + curArtid;
                var aStr = "<a href="+artHref+" target='_blank'>"+spanStr+"</a>";
                var pStr = "<p>"+swboxStr+aStr+"</p>";
                htmlStr += pStr;
            }
            htmlStr += "</div>";
            return htmlStr;
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
                    curObj["mvhref"] = fatUndef(curObj["mvhref"], "-");
                    tableDataArr[i] = curObj;
                    curArr = [
                        curObj["sort"], curObj["mvbg"], curObj["mvname"], curObj["mvhref"], curObj["remark"], "编辑"
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
            detailView: true,
            detailFormatter: detailFat,
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
                { field: 1, width: "12%", align: 'center', valign: 'middle', halign: 'center', sortable: false, formatter:fatVideoImg },
                { field: 2, width: "20%", align: 'center', valign: 'middle', halign: 'center', sortable: false },
                { field: 3, width: "30%", align: 'center', valign: 'middle', halign: 'center', sortable: false, formatter:fatVideoHref },
                { field: 4, width: "20%", align: 'center', valign: 'middle', halign: 'center', sortable: false },
                // { field: 5, width: "8%", align: 'center', valign: 'middle', halign: 'center', sortable: false, formatter:fatVideoState },
                { field: 5, width: "10%", align: 'center', valign: 'middle', halign: 'center', sortable: false,
                    events: clickEvents, formatter:fatOpBtn }
            ],
            onLoadSuccess: function (res) {
                //地址快速编辑
                $tableElem.find("a.linka").editable({
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
                        //发送服务器
                        var theEl = this;
                        var index = theEl.getAttribute("data-index");
                        var dataRow = tableDataArr[index];
                        var inData = {
                            mvid: dataRow["mvid"],
                            resid: dataRow["resid"],
                            mvname: dataRow["mvname"],
                            mvhref: tmpVal,
                            status: fatState(dataRow["state"]).bool,
                            remark: dataRow["remark"]
                        };
                        //保存到服务器
                        saveToServer(inData);
                    }
                });
            },
            onExpandRow: function(index, row, $detail){
                var $thisEl = $detail;
                //状态切换
                $thisEl.find('.swbox').each(function(){
                    var _this = this;
                    //加载
                    swboxLoad(_this);
                    //注册点击
                    eventFn.add(_this, 'click', function(){
                        var on = "on";
                        var $this = $(_this);
                        var stateVal = !$this.hasClass(on);
                        var index = $this.attr("data-index");
                        var idObj = tableIdArr[index];
                        var inData = {
                            mvid: idObj["mvid"],
                            artid: $this.attr("data-artid"),
                            state: stateVal
                        };
                        layer.msg('提交中...', {icon: 16, shade: 0.3, time: 0});
                        //提交服务器
                        $.ajax({
                            type: "get",
                            url: backStatusUpdateUrl,
                            data: inData,
                            dataType: "jsonp",
                            jsonp: "callback",
                            // jsonpCallback: "jsonpback",
                            success:function(data){
                                layer.closeAll();
                                var jsonData = eval(data);
                                var res = jsonData['success'];
                                if(res){
                                    layer.msg('保存成功！', {icon: 1, time: 1000});
                                    //更新状态
                                    var on = "on";
                                    (inData.state) ? $this.addClass(on) : $this.removeClass(on);
                                }
                                else{
                                    var msg = jsonData['message'];
                                    layer.msg(msg, {icon: 2, time: 1000});
                                }
                            },
                            error:function(error){
                                console.log(error);
                                layer.closeAll();
                                layer.msg('保存失败！', {icon: 2, time: 1000});
                            }
                        });
                    });
                });
            }
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
        setting = extendObj(setting, options);
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
//保存到服务器
function saveToServer(inData){
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
}
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
        //保存到服务器
        saveToServer(inData);
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