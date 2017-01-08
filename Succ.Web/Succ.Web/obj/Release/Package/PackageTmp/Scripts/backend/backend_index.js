$(document).ready(function () {    

    $('#img_mail').hover(
        function () {
            $(this).attr("src", "/Statics/img/envelope_white.png");
        },
        function () {
            $(this).attr("src", "/Statics/img/envelope.png");
        }
    );

    //使用記錄-下拉選單
    $('.record').click(function ()
    {
        isDevlop();
        isSubjTag();
        $('.record-drop').toggle();
    });
    //開發人員-下拉選單
    $('.devoloper').click(function ()
    {
        isRecord();
        isSubjTag();
        $('.devoloper-drop').toggle();
    });
    //主題標籤-下拉選單
    $(".subjTag").click(function ()
    {
        isDevlop();
        isRecord();
        $('.subjTag-drop').toggle();
    });

    //判斷下拉選單是否應該收回
    function  isDevlop()
    {
        if ($('.devoloper-drop').css("display") == "block")
        {
            $('.devoloper-drop').css("display", "none");
        }
    }

    function isRecord()
    {
        if ($('.record-drop').css("display") == "block")
        {
            $('.record-drop').css("display", "none");
        }
    }

    function isSubjTag()
    {
        if($('.subjTag-drop').css("display") == "block")
        {
            $('.subjTag-drop').css("display", "none");
        }
    }

});

//時間亂數
var d = new Date();
//頁籤
$('.tag').click(function () {
    switch ($(this).data("tagname")) {
        case 'web_manage':
            $.blockUI();
            $('#partialview').load('/Backend/WebManage/?CompanyID=' + $("#CurrentCompID").val() + '&t=' + d.getTime());
            break;
        case 'member_manage':
            $.blockUI();//11
            $('#partialview').load('/Backend/MemberManage/?CompanyID=' + $("#CurrentCompID").val() + '&t=' + d.getTime());
            break;
        case 'subject':
            $.blockUI();
            $('#partialview').load('/Backend/DiscManage/?CompanyID=' + $("#CurrentCompID").val() + '&t=' + d.getTime());
            break;
        case 'chathistory':
            $.blockUI();
            $('#partialview').load('/Backend/ChatHistory/?t=' + d.getTime());
            $('.record-drop').css("display", "none");
            $('.viewtab').find('li').attr("class", "");
            $('#record_li').attr("class", "record_li active")
            break;
        case 'EventTag':
            $.blockUI();
            $("#partialview").load('/Backend/EventTag/?t=' + d.getTime());
            $(".subjTag-drop").css("display", "none");
            $('.viewtab').find('li').attr("class", "");
            $("#SubjTag_li").attr("class", "SubjTag_li active");
            break;
        case 'CusTag':
            $.blockUI();
            $("#partialview").load('/Backend/CusTag/?t=' + d.getTime());
            $(".subjTag-drop").css("display", "none");
            $('.viewtab').find('li').attr("class", "");
            $("#SubjTag_li").attr("class", "SubjTag_li active");
            break;
        case 'operation':
            $.blockUI();
            $('#partialview').load('/Backend/Operation/?CompanyID=' + $("#CurrentCompID").val() + '&t=' + d.getTime());
            $('.record-drop').css("display", "none");
            $('.viewtab').find('li').attr("class", "");
            $('#record_li').attr("class", "record_li active")
            break;
        case 'login':
            $.blockUI();
            $('#partialview').load('/Backend/LogingHistory/?CompanyID=' + $("#CurrentCompID").val() + '&t=' + d.getTime());
            $('.record-drop').css("display", "none");
            $('.viewtab').find('li').attr("class", "");
            $('#record_li').attr("class", "record_li active")
            break;
    }
    if ($(this).data("tagname") == 'web_manage')
        $('.version').css("display", "block");
    else {
        $('.version').css("display", "none");
    }

});