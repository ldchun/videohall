/**
 * Created by chun on 2017/7/3.
 */
var tableIdArr;
var tableDataArr;
//加载页面
function loadhtml(){
    //时间选择
    TimeDPInit();
    //公众号列表
    AccList({callback: inSubmit});
    //查询
    $("#inSubmit").on('click', inSubmit);
    //批量参数
    $("#listDel").on('click', listBatchFun);
    //窗口大小调整
    $(window).on('resize', function(){
        setTimeout(function(){
            $("#tableEl").bootstrapTable('resetView');
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
    //表格参数
    if(typeof(params) != 'undefined'){
        inData.pageSize  = params.limit;
        inData.pageStart = params.offset;
        inData.sortName  = params.sort;
        inData.sortOrder = params.order;
    }
    return inData;
}

//表格
function tableFun(){
    // 表格点击事件
    window.eventArtState = {
        'click .swbox': function(e, value, row, index) {
            var _this = this;
            //注册点击
            eventFn.add(_this, 'click', function(){
                var on = "on";
                var $this = $(_this);
                var stateVal = !$this.hasClass(on);
                var inData = {
                    artid: tableIdArr[index],
                    state: stateVal
                };
                //更新文章状态
                updateArtState(_this, inData);
            });
        }
    };
    window.eventOpBtn = {
        'click .del': function(e, value, row, index) {
            listBatchFun();
        }
    };
    //表格初始化
    function tableInit(){
        var $tableElem = $('#tableEl');
        /*************** 格式化文本 ****************/
        function fatOpBtn(value, row, index) {
            return '<a class="opbtn del"'+' title="请点击">'+"删除"+'</a>';
        }
        function fatArticle(value, row, index) {
            var curObj = value;
            var aEl = document.createElement('a');
            var artHref = articleUrl + curObj['artid'];
            aEl.setAttribute("href", artHref);
            aEl.setAttribute("target", "_blank");
            aEl.className = "marka";
            var accName = (isUndef(curObj["accname"])||(curObj["accname"]=="")) ? "" : ("【"+curObj["accname"]+ "】");
            aEl.innerHTML = accName+curObj['arttit'];
            return aEl.outerHTML;
        }
        function fatArtState(value, row, index) {
            var stateVal = value;
            var spanEl = document.createElement('span');
            var checkedVal = stateVal ? 'swbox on' : 'swbox';
            spanEl.className = checkedVal;
            swboxLoad(spanEl, {class: "swbox-mini"});
            return spanEl.outerHTML;
        }
        /*********** 返回数据 ************/
        function resHandler(res) {
            var dataObj = {"rows": [], "total": 0};
            var jsonData = eval(res);
            tableIdArr = [];
            tableDataArr = [];
            var dataRows  = jsonData['rows'];
            var dataTotal = jsonData['total'];
            if(dataTotal > 0) {
                var idArr = [];
                var pageSize = dataRows.length;
                for (var i = 0; i < pageSize; i++) {
                    var curObj = dataRows[i];
                    var curArr = [];
                    tableDataArr[i] = curObj;
                    curArr = [
                        false, curObj["sort"], curObj["arttime"],
                        {"artid":curObj["artid"],"arttit":curObj["arttit"],"arthref":curObj["arthref"],"accname":curObj['accname']},
                        curObj["artstate"], "操作"
                    ];
                    dataRows[i] = curArr;
                    //记录id
                    tableIdArr[i] = curObj["artid"];
                }
                dataObj = {"rows": dataRows, "total": dataTotal};
            }
            return dataObj;
        }
        //详情信息
        function detailFat(index, row) {
            var curData = tableDataArr[index];
            var dataArr = curData['mvlist'];
            var dataSize = dataArr.length;
            var divEl = document.createElement('div');
            divEl.className = "bkart-mvlist";
            for(var i=0; i<dataSize; i++){
                var curObj = dataArr[i];
                curObj["mvhref"] = fatUndef(curObj["mvhref"], "-");
                var cellEl = document.createElement('div');
                cellEl.className = "bkart-mvli";
                //影片状态
                var spanEl = document.createElement('span');
                var stateVal = curObj["mvstate"];
                var checkedVal = stateVal ? 'swbox on' : 'swbox';
                spanEl.className = checkedVal;
                spanEl.setAttribute('data-mvid', curObj['mvid']);
                swboxLoad(spanEl, {class: "swbox-mini no-radius"});
                //影片图片
                var imgEl = document.createElement("img");
                imgEl.src = curObj["mvbg"];
                //影片名称
                var emEl = document.createElement('em');
                emEl.innerHTML = curObj['mvname'];
                //影片地址
                var aEl = document.createElement('a');
                aEl.setAttribute('data-mvid', curObj['mvid']);
                aEl.setAttribute("href", curObj['mvhref']);
                aEl.setAttribute("target", "_blank");
                var residVal = (curObj['resid'] === undefined) ? "" : curObj['resid'];
                aEl.setAttribute('data-resid', residVal);
                aEl.innerHTML = curObj['mvhref'];
                aEl.className = "marka";
                cellEl.appendChild(spanEl);
                cellEl.appendChild(imgEl);
                cellEl.appendChild(emEl);
                cellEl.appendChild(aEl);
                //添加该行
                divEl.appendChild(cellEl);
            }
            return divEl.outerHTML;
        }
        //输入参数
        function inParams(params) {
            var inData = new getInData(params);
            return inData;
        }
        $tableElem.bootstrapTable('destroy');
        $tableElem.bootstrapTable({
            url: bkArtListUrl,
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
                { field: 0, width: "5%", align: 'center', valign: 'middle', halign: 'center', sortable: false, checkbox:true},
                { field: 1, width: "5%", align: 'center', valign: 'middle', halign: 'center', sortable: false },
                { field: 2, width: "15%", align: 'center', valign: 'middle', halign: 'center', sortable: false },
                { field: 3, width: "55%", align: 'left', valign: 'middle', halign: 'center', sortable: false, formatter:fatArticle },
                { field: 4, width: "10%", align: 'center', valign: 'middle', halign: 'center', sortable: false,
                    events: eventArtState, formatter:fatArtState },
                { field: 5, width: "10%", align: 'center', valign: 'middle', halign: 'center', sortable: false,
                    events: eventOpBtn, formatter:fatOpBtn }
            ],
            onExpandRow: function(index, row, $detail){
                var $thisEl = $detail;
                //影片状态切换
                $thisEl.find('.swbox').each(function(){
                    var _this = this;
                    //加载
                    swboxLoad(_this, {class: "swbox-mini no-radius"});
                    //注册点击
                    eventFn.add(_this, 'click', function(){
                        var on = "on";
                        var $this = $(_this);
                        var stateVal = !$this.hasClass(on);
                        var inData = {
                            mvid: $this.attr("data-mvid"),
                            artid: tableIdArr[index],
                            state: stateVal
                        };
                        //更新影片在某文章的状态
                        updateMvInArtState(_this, inData);
                    });
                });
                //影片地址快速编辑
                $thisEl.find("a.marka").each(function(){
                    var _this = this;
                    var hrefVal = _this.getAttribute("href");
                    var mvidVal = _this.getAttribute("data-mvid");
                    var residVal = _this.getAttribute("data-resid");
                    var $parent = $(this).parent();
                    var nameVal = $parent.find("em").text();
                    var stateVal = $parent.find(".swbox").hasClass("on");
                    var inData = {
                        mvid: mvidVal,
                        resid: residVal,
                        mvname: nameVal,
                        mvhref: hrefVal,
                        status: stateVal
                    };
                    //更新影片地址
                    fastUpdateMvHref(this, inData)
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
function editUpServer(inData){
    //发送服务器
    $.ajax({
        type: "get",
        url: "",
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
        editUpServer(inData);
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

/*************  批量操作  ****************/
function listBatchFun(){
    var $tableElem = $("#tableEl");
    var $rowList = $tableElem.find("tbody tr");
    var idArr = [];
    var rowListSize = $rowList.size();
    for(var i=0;i<rowListSize; i++){
        var $curRow = $rowList.eq(i);
        var $checkbox = $curRow.find('input[type="checkbox"]');
        if($checkbox.is(':checked')){
            var curId = $curRow.find(".del").attr("data-id");
            idArr.push(curId);
        }
    }
    if(idArr.length == 0){
        layer.msg('请选择待删除项！', {icon:0,skin:'layui-layer-lan',title:'提示',time: 1500});
        return ;
    }
    var tipStr = "确定要删除选中项？";
    layer.confirm(tipStr, {
        icon: 3,
        title: ['提示',"color:#FFF;background:#4376a7;"],
        btn: ['确定','取消']
    }, function(){
        //删除操作
        var inData = {
            ids: idArr.join(',')
        };
        //提交动画
        ajaxAnimShow();
        //发送服务器
        /*$.ajax({
            type: "get",
            url: "",
            dataType:"jsonp",
            data: inData,
            async: false,
            jsonp: "callback",
            success:function(data){
                var jsonData = eval(data);
                var res = jsonData['success'];
                if(res){
                    layer.msg('操作成功！', {icon: 1, time: 1000});
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
                layer.msg('操作失败！', {icon: 2, time: 1000});
            }
        });*/
    }, function(){
        return;
    });
}