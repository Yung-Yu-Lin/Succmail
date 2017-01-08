$(document).ready(function ()
{    
    //假別與事別滑入與滑出刪除圖事
    $(".leaveReasonArea").hover(function () {
        $(this).children(".leaveReasonDel").removeClass("hideObj");
    }, function () {
        $(this).children(".leaveReasonDel").addClass("hideObj");
    });


    $('body').click(function (event)
    {        
        if (event.target.className.substr(0, 13) == "cal-month-day" ||
            event.target.className.substr(0, 16) == "new-subject-list" ||
            event.target.className.substr(0, 12) == "side-by-side" ||
            event.target.className.substr(0, 6) == "chosen" ||
            event.target.className.substr(0, 6) == "option" ||
            event.target.className == "search-field" ||
            event.target.className.substr(0, 15) == "result-selected" ||
            event.target.className.substr(0, 11) == "add-subject"
           )
        {}
        else if (event.target.className.substr(0, 6) == "option")
        {
            $('.chosen-drop').css("display", "block");
            $('.chosen-results').css("display", "block");
        }
        else
        {
            $('.new-subject-list').css("display", "none");
        }
    });

    //--------獨立詳細頁-----------------------------------------------
    //PopOver
    $('#pop').mouseover(function () {
        $('#pop').popover('show');
    });
    $('#pop').mouseout(function () {
        $('#pop').popover('hide');
    });

    //寫回覆
    $('.respond-btn').click(function () {
        $('#write-area').animate({ height: '400px' });
        $('#write-area').css("visibility", "visible");
        $('#comment').css("visibility", "hidden");
    });

    // #region 左邊選單點擊只秀一個
    $('#left-side').on('click', '.a_type', function (e) {
        var item = $(this).parent().parent().siblings('.panel-group').find('.panel-collapse');
        if (item.hasClass('in')) {
            item.removeClass('in');
        }
    });
    // #endregion
});

//-------新增討論組----------------------------------------------
// Class DiscSetting
var DiscSetting = (function () {
    // ctor
    function DiscSetting() { };

    //重新點新增討論組,顯示一般討論組設定並隱藏行政區設定
    DiscSetting.prototype.initdiscussionsetting = function () {
        $(".modal-body").css('display', 'block');
        $(".modal-Detail").css('display', 'none');
        this.settingGeneral();
    };

    //討論組與簽核行討論組交換(討論組)
    DiscSetting.prototype.settingGeneral = function () {
        $("#subAdmin").addClass("sub-admin-off").removeClass("sub-admin-on");
        $("#subGeneral").removeClass("sub-general-off").addClass("sub-general-on");
        $("#admin_sandwich").addClass("admin_sandwich_general").removeClass("admin_sandwich_admin");
        $("#subAdminSet").addClass("hideObj");
        $("#subGeneralSet").removeClass("hideObj");
        $(".modal-footer").removeClass("hideObj");
        $(".sub-type").addClass("sub-type-general").removeClass("sub-type-admin");
    };

    //討論組與簽核行討論組交換(簽核型討論組)
    DiscSetting.prototype.settingAdmin = function () {
        $("#subAdmin").removeClass("sub-admin-off").addClass("sub-admin-on");
        $("#subGeneral").addClass("sub-general-off").removeClass("sub-general-on");
        $("#admin_sandwich").addClass("admin_sandwich_admin").removeClass("admin_sandwich_general");
        $("#subAdminSet").removeClass("hideObj");
        $("#subGeneralSet").addClass("hideObj");
        $(".modal-footer").addClass("hideObj");
        $(".sub-type").addClass("sub-type-admin").removeClass("sub-type-general");
    };

    //簽核行討論組設定返回按鈕
    DiscSetting.prototype.returnAdminSet = function () {
        $(".modal-body").css('display', 'block');
        $(".modal-Detail").css('display', 'none');
    };

    //簽核行討論組設定版面
    DiscSetting.prototype.templateSettingAdmin = function (type) {
        $(".modal-body").css('display', 'none');
        $(".modal-Detail").css('display', 'block');
        $("#optionsLevel li:eq(1) div").tab('show');
        $(".optionsMore").removeClass("active").removeClass("optionsMoreOn").addClass("optionsMoreOff");
        $(".optionsSet").addClass("active").removeClass("optionsSetOff").addClass("optionsSetOn");
        $("#detailOptionsSet").addClass("active");
        $("#detailOptionsMore").removeClass("active");
    };

    //詳細說明
    DiscSetting.prototype.templateMore = function (type) {
        // 第一頁選單隱藏
        $(".modal-body").css('display', 'none');
        // 說明和設定的內容
        $(".modal-Detail").css('display', 'block');
        $("#optionsLevel li:eq(0) div").tab('show');
        $(".optionsMore").removeClass("active").removeClass("optionsMoreOff").addClass("optionsMoreOn");
        $(".optionsSet").addClass("active").removeClass("optionsSetOn").addClass("optionsSetOff");
    };

    //簽核行討論組設定與說明切換(說明)
    DiscSetting.prototype.optionsMore = function () {
        $(".optionsMoreOff").addClass("optionsMoreOn").removeClass("optionsMoreOff");
        $(".optionsSetOn").addClass("optionsSetOff").removeClass("optionsSetOn");
        $("#optionsMore").addClass("active");
        $("#optionsSet").removeClass("active");
        $("#detailOptionsMore").addClass("active");
        $("#detailOptionsSet").removeClass("active");
    };

    //簽核行討論組設定與說明切換(設定)
    DiscSetting.prototype.optionsSet = function () {
        $(".optionsSetOff").addClass("optionsSetOn").removeClass("optionsSetOff");
        $(".optionsMoreOn").addClass("optionsMoreOff").removeClass("optionsMoreOn");
        $("#optionsSet").addClass("active");
        $("#optionsMore").removeClass("active");
        $("#detailOptionsSet").addClass("active");
        $("#detailOptionsMore").removeClass("active");
    };

    // 顯示隱藏刪除識別假別圖片
    DiscSetting.prototype.toggleDelBtn = function () {
        $('.personLeaveReason').on('mouseover', '.leaveReason', function (e) {
            $(this).next().removeClass("hideObj");
        });
        $('.personLeaveReason').on('mouseover', '.leaveReasonDel', function (e) {
            $(this).removeClass("hideObj");
        });
        $('.personLeaveReason').on('mouseout', '.leaveReason', function (e) {
            $(this).next().addClass("hideObj");
        });
        $('.personLeaveReason').on('mouseout', '.leaveReasonDel', function (e) {
            $(this).addClass("hideObj");
        });
    };

    // 收件人定位在跳出來頁面的右方
    DiscSetting.prototype.setReceiptPosition = function () {
        //Gary
        //$('.chosen-container').eq(1).css('z-index', 0);
        var modalItem = $('#NewDiscussionModal').find('.modal-content');

        $('.receipt-wrap').css({ 'left': modalItem.offset().left + modalItem.width() + 2 + 'px', 'top': (($(window).height() / 2) - ($('.receipt-wrap').height() / 2)) + 'px' });
    };
    
    return DiscSetting;
})();
