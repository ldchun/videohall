/**
 * Created by chun on 2017/7/3.
 */
var tableIdArr;
var tableDataArr;
var curPageStart = 0;
//加载页面
function loadhtml(){
    //时间选择
    TimeDPInit();
    //公众号列表
    AccList({callback: inSubmit});
    //查询
    $("#inSubmit").on('click', function(){
        curPageStart = 0;
        inSubmit();
    });
    //窗口大小调整
    $(window).on('resize', function(){
        setTimeout(function(){
            $("#tableEl").bootstrapTable('resetView');
        }, 300);
    });
    inSubmit();
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
        curPageStart = inData.pageStart;
    }
    return inData;
}
//表格
function tableFun(){
    /************* 表格点击事件 ************/
    window.eventMvState = {
        'click .swbox': function(e, value, row, index) {
            var _this = this;
            var curData = tableDataArr[index];
            var on = "on";
            var $this = $(_this);
            var stateVal = !$this.hasClass(on);
            var idObj = tableIdArr[index];
            var inData = {
                mvid: idObj["mvid"],
                resid: idObj["resid"],
                mvname: curData["mvname"],
                state: stateVal
            };
            //更新视频状态
            updateMvInfo(inData);
        }
    };
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
        function fatMvImg(value, row, index) {
            return '<img src='+value +' alt="" >';
        }
        function fatMvHref(value, row, index) {
            return '<a href='+value+ " data-index="+index+' class="linka marka" target="_blank">'+value+'</a>';
        }
        function fatMvState(value, row, index) {
            var stateVal = value;
            var spanEl = document.createElement('span');
            var checkedVal = stateVal ? 'swbox on' : 'swbox';
            spanEl.className = checkedVal;
            swboxLoad(spanEl, {class: "swbox-mini"});
            return spanEl.outerHTML;
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
            tableIdArr = [];
            tableDataArr = [];
            if(dataTotal > 0) {
                var idArr = [];
                var pageSize = dataRows.length;
                for (var i = 0; i < pageSize; i++) {
                    var curObj = dataRows[i];
                    var curArr = [];
                    curObj["mvhref"] = fatUndef(curObj["mvhref"], "-");
                    curObj["mvstate"] = fatUndef(curObj["mvstate"], true);
                    tableDataArr[i] = curObj;
                    curArr = [
                        curObj["sort"], curObj["mvbg"], curObj["mvname"], curObj["mvhref"], curObj["remark"], curObj["mvstate"]
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
            url: bkMvListUrl,
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
                { field: 0, width: "5%", align: 'center', valign: 'middle', halign: 'center', sortable: false },
                { field: 1, width: "12%", align: 'center', valign: 'middle', halign: 'center', sortable: false, formatter:fatMvImg },
                { field: 2, width: "20%", align: 'center', valign: 'middle', halign: 'center', sortable: false },
                { field: 3, width: "30%", align: 'left', valign: 'middle', halign: 'center', sortable: false, formatter:fatMvHref },
                { field: 4, width: "20%", align: 'center', valign: 'middle', halign: 'center', sortable: false },
                { field: 5, width: "10%", align: 'center', valign: 'middle', halign: 'center', sortable: false,
                    events: eventMvState, formatter:fatMvState}
                /*{ field: 5, width: "10%", align: 'center', valign: 'middle', halign: 'center', sortable: false,
                    events: clickEvents, formatter:fatOpBtn }*/
            ],
            onLoadSuccess: function (res) {
                //影片地址快速编辑
                $tableElem.find("a.linka").each(function(){
                    //发送服务器
                    var _this = this;
                    var index = _this.getAttribute("data-index");
                    var dataRow = tableDataArr[index];
                    var inData = {
                        mvid: dataRow["mvid"],
                        resid: dataRow["resid"],
                        mvname: dataRow["mvname"],
                        status: fatState(dataRow["state"]).bool,
                        remark: dataRow["remark"]
                    };
                    //更新影片地址
                    fastUpdateMvHref(this, inData, function(){
                        //刷新到修改页
                        $tableElem.bootstrapTable('refreshOptions',{pageStart: curPageStart});
                    });
                });
            },
            onExpandRow: function(index, row, $detail){
                var $thisEl = $detail;
                //状态切换
                $thisEl.find('.swbox').each(function(){
                    var _this = this;
                    //加载
                    swboxLoad(_this, {class: "swbox-mini no-radius"});
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
                        //更新视频状态
                        updateMvInArtState(_this, inData);
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
        //更新影片信息
        updateMvInfo(inData)
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