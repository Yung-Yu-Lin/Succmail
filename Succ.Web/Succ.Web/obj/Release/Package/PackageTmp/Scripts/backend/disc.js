//var Lang = window.navigator.language;

//$(document).ready(function () {
//    //時間亂數
//    var d = new Date();
//    //解除讀取畫面
//    $.unblockUI();
//    //初始化請假區陣列為空
//    var Leave = [];


//    //彈出視窗
//    $('.setting_subject').click(function () {
//        $('.black_pad').css("display", "block");
//        $('.black_pad').css("z-index", "2");
//        $('#modal').css("display", "block");
//    });

//    //關閉彈出視窗
//    $('.fa-times-circle').click(function () {
//        $('.black_pad').css("display", "none");
//        $('.black_pad').css("z-index", "-1");
//        $('#modal').css("display", "none");
//    });

//    //設定啟用按鈕
//    $('.use').find('.use_on').click(function (event) {
//        $(this).attr("class", "btn btn-default btn-sm active use_on");
//        $('.use_off').attr("class", "btn btn-default btn-sm use_off");
//    });
//    $('.use').find('.use_off').click(function (event) {
//        $(this).attr("class", "btn btn-default btn-sm active use_off");
//        $('.use_on').attr("class", "btn btn-default btn-sm use_on");
//    });
//    //設定必填按鈕
//    $('.fill').find('.fill_on').click(function (event) {
//        $(this).attr("class", "btn btn-default btn-sm active fill_on");
//        $('.fill_off').attr("class", "btn btn-default btn-sm fill_off");
//    });
//    $('.fill').find('.fill_off').click(function (event) {
//        $(this).attr("class", "btn btn-default btn-sm active fill_off");
//        $('.fill_on').attr("class", "btn btn-default btn-sm fill_on");
//    });

//    //新增公司討論組(按鈕)
//    $('.add-eventdisc').click(function () {
//        $('#set').css("display", "block");
//        $('#recycle').css("display", "none");
//        $('.check').data("disctype", "2");
//        $('.check').data("action", "/Backend/CreatDisc");
//        $('#audit_div').css("display", "none");

//        //關閉簽核、請假、外出
//        $('#audit_div').css("display", "none");
//        $('#leave_div').css("display", "none");
//        $('#goout_div').css("display", "none");
//        //清除資料
//        $('#DiscName').val("");
//        $('#DiscName').attr("placeholder", t("newdisc"));
//        $('#Adminer').find('option').attr("selected", false);
//        $('#Member').val("");
//        $('#Receiver').val("");
//        $(".chosen-select").trigger("chosen:updated");

//        $('#DiscName').focus();
//    });

//    //新增行政討論組(按鈕)
//    $('.disctype-div').click(function () {
//        $('#audit_div').css("display", "none");
//        $('#leave_div').css("display", "none");
//        $('#goout_div').css("display", "none");
//        $("#LeaveLabel").css("display", "none");
//        $("#GoOutLabel").css("display", "none");
//        switch ($(this).data("type")) {
//            case 'purchs':
//                $('.check').data("disctype", "202");
//                $('#audit_div').css("display", "block");
//                $('.add_admin').find('button').trigger("click");
//                add_admin();
//                break;
//            case 'applyMoney':
//                $('#audit_div').css("display", "block");
//                $('.add_admin').find('button').trigger("click");
//                $('.check').data("disctype", "201");
//                add_admin();
//                break;
//            case 'personLeave':
//                $('#leave_div').css("display", "block");
//                $("#LeaveLabel").css("display", "block");
//                $('.add_admin').find('button').trigger("click");
//                $('.check').data("disctype", "101");
//                add_admin();
//                break;
//            case 'overTime':
//                $('.add_admin').find('button').trigger("click");
//                $('.check').data("disctype", "102");
//                add_admin();
//                break;
//            case 'goOut':
//                $('#leave_div').css("display", "block");
//                $("#GoOutLabel").css("display", "block");
//                $('.add_admin').find('button').trigger("click");
//                $('.check').data("disctype", "103");
//                add_admin();
//                break;
//        }

//    });
//    function add_admin() {
//        //討論組基本設定
//        $('#set').css("display", "block");
//        //回收區Partial View關閉
//        $('#recycle').css("display", "none");
//        //預設確定按鈕Action為/Backend/UpdateDisc 改為建立主題的url
//        $('.check').data("action", "/Backend/CreatDisc");
//        //清除資料
//        $('#DiscName').val("");
//        $('#DiscName').attr("placeholder", t("newdisc"));
//        $('#Adminer').find('option').attr("selected", false);
//        $('#Member').val("");
//        $('#Receiver').val("");
//        $(".chosen-select").trigger("chosen:updated");
//        for (var i = 1; i <= 5; i++)
//        {
//            $('.audit-' + i).find('input').val("");
//            $('.audit-' + i).find('select').val("");
//            if (i > 1)
//            {
//                $('.audit-' + i).css("display", "none");
//            }
//        }
//        $('#DiscName').focus();
//    };

//    //新增/修改討論組
//    $('.check').click(function () {
//        var Url = $(this).data("action");

//        if ($('#DiscName').val().length == 0) {
//            alert(t("EnterDiscName"));
//            $('#DiscName').focus();
//            return false;
//        }
//        if ($('#Adminer').val().length == 0) {
//            alert(t("EnterAdminerDisc"));
//            $('#Adminer').focus();
//            return false;
//        }
//        //簽核流程
//        if ($('.check').data("disctype") == "201" || $('.check').data("disctype") == "202") {
//            var Flow = [];
//            if ($('#audit_div').css("display") == "block") {
//                for (var i = 1; i <= 5; i++) {
//                    if ($('.audit-' + i).css("display") == "block") {
//                        //如果沒有新增審核關卡
//                        if ($('.audit-' + i).find('select').val().length == 0)
//                        {
//                            alert(t("ChooseMember"));
//                            $('.audit-' + i).find('select').focus();
//                            return false;
//                        }
//                        if ($('.audit-' + i).find('input').val().length == 0) {
//                            switch (i) {
//                                case 1:
//                                    $('.audit-1').find('input').val(t("Stage1"));
//                                    break;
//                                case 2:
//                                    $('.audit-2').find('input').val(t("Stage2"));
//                                    break;
//                                case 3:
//                                    $('.audit-3').find('input').val(t("Stage3"));
//                                    break;
//                                case 4:
//                                    $('.audit-4').find('input').val(t("Stage4"));
//                                    break;
//                                case 5:
//                                    $('.audit-5').find('input').val(t("Stage5"));
//                                    break;
//                            }
//                        }
//                        Flow.push({ Name: $('.audit-' + i).find('input').val(), AuditID: $('.audit-' + i).find('select').val(), Serise: i });
//                    }
//                }
//            }
//        }
//        // 假別/事別
//        if ($('.check').data("disctype") == "101" || $('.check').data("disctype") == "103")
//        {
//            //var Leave = [];
//            if ($("#leave_div").children('div').children('span').length <= 0)
//            {
//                alert('請新增假/事別');
//                $('.add_leave').css("border", "1px solid #f77");
//                $('#Leave').focus();
//                return false;
//            }
//            for (var i = 1; i <= ($('.leave_sum').data("count") - 1) ; i++)
//            {
//                //編輯的事/假別才有動作
//                if ($('.leave-' + i).data("update") == "update")
//                {
//                    Leave.push({ ID: $('.leave-' + i).data("id"), Name: $('.leave-' + i).children('label').text(), Action: "update", IsUse: $('.leave-' + i).data("IsUse") });
//                }
//                else
//                {
//                    //Leave.push({ TypeID: $('.leave-' + i).data("id"), TypeName: $('.leave-' + i).children('label').text(), Action: "none", IsUse: true });
//                }
//            }
//        }
//        var para = ({
//            CompID: $("#CurrentCompID").val(),
//            DiscID: $('.title').data("discid"),
//            DiscName: $('#DiscName').val(),
//            DiscussionType: $('.check').data("disctype"),
//            AdminID: $('#Adminer').val(),
//            Member: $('#Member').val(),
//            RegularMember: $('#Receiver').val(),
//            Members: $('#Member').val(),
//            RegularMembers: $('#Receiver').val(),
//            Flow: Flow,
//            Leave: Leave
//        });

//        $.ajax({
//            url: Url,
//            async: false,
//            type: "POST",
//            data: para,
//            success: function (msg) {
//                if (msg == "discname")
//                    alert(t("EnterDiscName"));
//                else if (msg == "adminer") {
//                    alert(t("EnterAdminerDisc"));
//                }
//                else
//                    location.reload();
//                    window.scrollTo(0, 0);
//            },
//            error: function (xhr, ajaxOptions, thrownError) {
//                alert("error");
//            }
//        });
//    });

//    //刪除討論組(丟到回收區)
//    $('.delete').click(function () {
//        $.blockUI();
//        if (confirm(t("RecycleDisc")) == true)
//        {
//            var para = ({
//                DiscID: $(this).data("value")
//            });
//            $.ajax({
//                url: "/Backend/DeleteDisc",
//                async: false,
//                type: "POST",
//                data: para,
//                success: function (msg) {
//                    if (msg == "null")
//                    {
//                        alert(msg);
//                    }
//                    else {
//                        $.unblockUI();
//                        location.reload();
//                        window.scrollTo(0, 0);
//                    }
//                },
//                error: function (xhr, ajaxOptions, thrownError) {
//                    alert("error");
//                }
//            });
//        }
//    });

//    //新增審核機制
//    $('#add_audit').click(function () {
//        var last_count;
//        var next;
//        var value;
//        var text;
//        //取得下一個index
//        for (var i = 1; i <= 5; i++) {
//            if ($('.audit-' + i).data("number") != null) {
//                last_count = $('.audit-' + i).data("number");
//            }
//        }
//        next = last_count + 1;
//        if (next > 5) {
//            return false;
//        }
//        //append 新的關卡
//        $('#audit_div').find('tr').append(
//            '<td><div class="audit-' + next + '" data-number="' + next + '"><input class="audit" placeholder='+ t("StageName")+' name="Name[]" value="" title='+ t("StageName")+' /><i class="del_audit fa fa-circle-o" data-serise="' + next + '"></i><select class="auditer_name" name="AuditID[]" title="審核人"><option></option></select></div></td>'
//        );

//        //把資料塞到option
//        for (var i = 1; i <= ($('.index_option').text() - 1) ; i++) {
//            value = $('.audit-1').find('option[data-index="' + i + '"]').val();
//            text = $('.audit-1').find('option[data-index="' + i + '"]').text();
//            $('.audit-' + next).find('select').append('<option value="'+value+'">'+text+'</option>')
//        }
//    });

//    //新增 假別/事別
//    $('.add_leave').click(function () {
//        var count = $('#leave_div').find('label.leave_sum').data("count");
//        if($('#Leave').val().length ==0){
//            alert(t("EnterName"));
//            $('#Leave').css("border-color","#f77");
//            $('#Leave').focus();
//            return false;
//        }
        
//        $('#leave_div').find('div').append('<span class="leave-' + count + '"style="width:145px;margin-right:12px;"><label>' + $('#Leave').val() + '</label><i class="del-leave fa fa-times-circle"></i></span>');

//        count += 1;
//        $('#leave_div').find('label.leave_sum').data("count", count);

//        Leave.push({ ID: null, Name: $('#Leave').val(), Action: "create", IsUse: false });

//        //假別新增後，清除假別input中的文字
//        $("#Leave").val("");

//        if ($('.leave-' + count).offset().left > 800) {
//            var h = $('#disc-manage').css("height").substr(0, 4);
//            h = parseInt(h) + 50;
//            $('#disc-manage').css("min-height", h);
//        }

//    });

//    //新增 外出單動態新增事別
//    $('.add_goout').click(function () {
//        var count = $('#goout_div').find('div').data("count");
//        count++;
//        $('#goout_div').find('div').data("count", count);
//        if ($('#GoOut').val().length == 0) {
//            alert("請輸入外出單事別名稱");
//            $('#GoOut').focus();
//            return false;
//        }

//        $('#goout_div').find('div').append('<span class="goout-' + count + '" style="width:145px; margin-right:12px;"><label>' + $('#GoOut').val() + '</label><i class="del-goout fa fa-times-circle" ></i></span>');

//        var temp = $('#GoOut').offset().left;
//        if ($('.goout-' + count).offset().left > 800) {
//            var h = $('#disc-manage').css("min-height").substr(0, 4);
//            h = parseInt(h) + 50;
//            $('#disc-manage').css("min-height", h);
//        }
//    });

//    //修改 leave_div
//    $('#leave_div').on('click', 'span', function () {
//        if ($('.edit_leave').css("display") != "block") {
//            $(this).css("border", "none");
//            $(this).attr("class", "editing");
//            $(this).find('label').css("display", "none");
//            $(this).find('i').css("display", "none");
//            $(this).attr("data-update", "update");
//            $(this).append('<input class="edit_leave" value="' + $(this).find("label").text() + '" maxlength="8" /><i class="check_leave fa fa-check-circle" title="' + t("Modify") + '"></i>');
//        }
//    });

//    //確認修改假別
//    $('#leave_div').on('click', '.fa-check-circle', function () {

//        $('.editing').css("border", "1px solid #ccc");
//        $('.editing').find('label').css("display", "inline");
//        $('.editing').find('.fa-times-circle').css("display", "inline");
//        $('.editing').find('label').text($('.editing').find('input').val());
//        $('.editing').find('input').remove();
//        $('.editing').find('.fa-check-circle').remove();
//        $('.editing').attr("class", "leave-" + $('.editing').data("num"));
//        return false;
//    });

//    //刪除 請假區假別
//    $('#leave_div').on('click', '.del-leave', function () {
//        var num = $(this).parent().data("num");
//        var count = $('.leave_sum').data("count") - 1;
//        $('.leave_sum').data("count", count);
//        Leave.push({ Id: $('.leave-' + num).data("id"), Name: $('.leave-' + num).text(), Action: "delete", IsUse:false });
//        $(this).parent().remove();
//        for(var i = num; i<=count+1; i++){
//            $('.leave-' + i).data("num", (i - 1));
//            $('.leave-' + i).attr("class", "leave-" + (i-1));
//        }
//    });

//    //刪除 外出單事別
//    $('#goout_div').on('click', '.del-goout', function (){
//        var num = $(this).parent().data("num");
//        var count = $('#goout_div').find('div').data("count") - 1;
//        $('#goout_div').find('div').data("count", count);
//        $(this).parent().remove();
//        for (var i = num; i <= count + 1; i++) {
//            $('.goout-' + i).data("num", (i - 1));
//            $('.goout-' + i).attr("class", "goout-" + (i - 1));
//        }
//    });

//    //採購計畫滑入與滑出
//    $(".purchs").hover(function () {
//        $(this).children(".sub-admin-title").css('color', '#4d4d4d');
//        $(this).children(".sub-admin-content").css('color', '#808080');
//        $(this).children(".sub-admin-more").css('color', '#808080');
//        $(this).children(".purchs-icon").css('background-position-x', '-1470px');
//        $(this).children(".purchs-icon").css('background-position-y', '-5px');
//    },
//    function () {
//        $(this).children(".sub-admin-title").css('color', '#333333');
//        $(this).children(".sub-admin-content").css('color', '#666666');
//        $(this).children(".sub-admin-more").css('color', '#666666');
//        $(this).children(".purchs-icon").css('background-position-x', '-30px');
//        $(this).children(".purchs-icon").css('background-position-y', '-2px');
//    });

//    //款項請領滑入與滑出
//    $(".applyMoney").hover(function () {
//        $(this).children(".sub-admin-title").css('color', '#4d4d4d');
//        $(this).children(".sub-admin-content").css('color', '#808080');
//        $(this).children(".sub-admin-more").css('color', '#808080');
//        $(this).children(".applyMoney-icon").css('background-position-x', '-1656px');
//        $(this).children(".applyMoney-icon").css('background-position-y', '0px');
//    },
//        function () {
//            $(this).children(".sub-admin-title").css('color', '#333333');
//            $(this).children(".sub-admin-content").css('color', '#666666');
//            $(this).children(".sub-admin-more").css('color', '#666666');
//            $(this).children(".applyMoney-icon").css('background-position-x', '-215px');
//            $(this).children(".applyMoney-icon").css('background-position-y', '3px');
//        });

//    //請假區滑入與滑出
//    $(".personLeave").hover(function () {
//        $(this).children(".sub-admin-title").css('color', '#4d4d4d');
//        $(this).children(".sub-admin-content").css('color', '#808080');
//        $(this).children(".sub-admin-more").css('color', '#808080');
//        $(this).children(".personLeave-icon").css('background-position-x', '-1835px');
//        $(this).children(".personLeave-icon").css('background-position-y', '-9px');
//    },
//        function () {
//            $(this).children(".sub-admin-title").css('color', '#333333');
//            $(this).children(".sub-admin-content").css('color', '#666666');
//            $(this).children(".sub-admin-more").css('color', '#666666');
//            $(this).children(".personLeave-icon").css('background-position-x', '-395px');
//            $(this).children(".personLeave-icon").css('background-position-y', '-6px');
//        });

//    //加班區滑入與滑出
//    $(".overTime").hover(function () {
//        $(this).children(".sub-admin-title").css('color', '#4d4d4d');
//        $(this).children(".sub-admin-content").css('color', '#808080');
//        $(this).children(".sub-admin-more").css('color', '#808080');
//        $(this).children(".overTime-icon").css('background-position-x', '-2010px');
//        $(this).children(".overTime-icon").css('background-position-y', '-8px');
//    },
//        function () {
//            $(this).children(".sub-admin-title").css('color', '#333333');
//            $(this).children(".sub-admin-content").css('color', '#666666');
//            $(this).children(".sub-admin-more").css('color', '#666666');
//            $(this).children(".overTime-icon").css('background-position-x', '-570px');
//            $(this).children(".overTime-icon").css('background-position-y', '-8px');
//        });

//    //外出單滑入與滑出
//    $(".goOut").hover(function () {
//        $(this).children(".sub-admin-title").css('color', '#4d4d4d');
//        $(this).children(".sub-admin-content").css('color', '#808080');
//        $(this).children(".sub-admin-more").css('color', '#808080');
//        $(this).children(".goOut-icon").css('background-position-x', '-2183px');
//        $(this).children(".goOut-icon").css('background-position-y', '-9px');
//    },
//        function () {
//            $(this).children(".sub-admin-title").css('color', '#333333');
//            $(this).children(".sub-admin-content").css('color', '#666666');
//            $(this).children(".sub-admin-more").css('color', '#666666');
//            $(this).children(".goOut-icon").css('background-position-x', '-743px');
//            $(this).children(".goOut-icon").css('background-position-y', '-6px');
//        });

//    //回收區按鈕
//    $('.trash').find('.panel').click(function () {
//        $('#set').css("display", "none");
//        $('#recycle').css("display", "block");

//        //讀取回收區資料 及建立Grid
//        $("#recycleContent").jqGrid({
//            url: 'Backend/RecycleDisc/?CompanyID=' + $("#CurrentCompID").val(),
//            datatype: 'json',
//            colNames: ["討論組ID","類別", "討論組名稱", "建立時間", "刪除時間","動作"],
//            colModel: [
//                { name:'DiscID', hidden:true, hidedlg:true},
//                { name: 'DiscType', sortable:false,stype:'text', align:'center' },
//                { name: 'DiscName', sortable: false, width: '200px', align: 'center' },
//                { name: 'CreatTime', sortable: false, width: 100, align: 'center' },
//                { name: 'DeleteTime', sortable: false, width: 100, align: 'center' },
//                { name: 'DiscID', width: 120, search: false, editable: false, viewable: false, formatter: recycleBtn, align: 'center' }
//            ],
//            rowNum: 10,
//            ntype: 'Get',
//            loadonce: true,
//            rowList: [10, 20],
//            pager: '#pager',
//            sortorder: 'desc',
//            shrinkToFit: false,
//            width:672,
//            height: '100%',
//            scrollOffset:0
//        });

//        jQuery("html,body").animate({
//            scrollTop: 200
//        }, 1);
//    });

//    //jqGrid自定義按鈕
//    function recycleBtn(cellvalue, options, rowObject) {
//        return "<button id='recoverDisc' class='redisc btn btn-success btn-sm' data-value=" + cellvalue + ">還原</button>"
//    }

//    //jqGrid還原按鈕事件
//    $("#recycleContent").delegate("#recoverDisc", "click", function () {
//        var DiscID = $(this).attr('data-value');
//        //還原回收區討論組
//        var para = ({
//            DiscID: $(this).data("value")
//        });
//        $.ajax({
//            url: "/Backend/ReDisc",
//            async: false,
//            type: "POST",
//            data: para,
//            success: function (msg) {
//                if (msg == "null") {
//                    alert(msg);
//                } else {
//                    //$("#recycleContent").setGridParam({ datatype: 'json' }).trigger('reloadGrid');
//                    document.location.reload();
//                }
//            },
//            error: function (xhr, ajaxOptions, thrownError) {
//                alert("error");
//            }
//        });
//    });

//    //刪除回收區討論組(完全刪除)
//    $('.delete_redisc').click(function () {
//        alert($(this).data("value"));
//        if (confirm(t("DeleteDisc")) == true) {
//            var para = ({
//                DiscID: $(this).data("value")
//            });
//            $.ajax({
//                url: "/Backend/DeleteReDisc",
//                async: false,
//                type: "POST",
//                data: para,
//                success: function (msg) {
//                    if (msg == "null") {
//                        alert(msg);
//                    } else {
//                        alert("success");
//                    }
//                },
//                error: function (xhr, ajaxOptions, thrownError) {
//                    alert("error");
//                }
//            });
//        }
//    });



//    //回收區排序(建立時間)
//    $('.sort_create').click(function () {
//        $('#partialview').load('/Backend/DiscManage?sort=create');
//        $('.disc_manage_div').css("height", $('#recycle').css("height"));
//    });

//    //回收區排序(刪除時間)
//    $('.sort_delete').click(function () {
//        $('#partialview').load('/Backend/DiscManage?sort=delete');
//        $('.disc_manage_div').css("height", $('#recycle').css("height"));
//    });

//    //回收區高度調整
//    if ($('#recycle').css("display") == "block") {
//        $('.disc_manage_div').css("height", $('#recycle').css("height"));
//    }



//    //頁面載入完成(設定不可移除的成員)
//    authority();
//    });
//});




