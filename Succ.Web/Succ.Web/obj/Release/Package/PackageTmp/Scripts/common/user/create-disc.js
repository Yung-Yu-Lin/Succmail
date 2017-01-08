$(function () {
    // #region 綁定事件
    // 綁定事件 -- 按下建立按鈕時觸發
    $(document).on('click', '.build-disc', changDiscStyle);
    // 綁定事件 -- 按下已建立按鈕時觸發
    $(document).on('click', '.built-disc', changDiscStyle);
    // 綁定事件 -- 按下新增討論組按鈕時觸發
    $(document).on('click', '#add-disc', addDisc);
    // 綁定事件 -- 按下送出按鈕時觸發
    $(document).on('click', '.nextButton', { userid: $('.nextButton').data('userid') }, submit);
    // #endregion

    // 最多幾個討論組
    var maxDiscNum = 6;

    // #region 討論組區塊樣式
    function changDiscStyle(event) {
        var currentClass = $(this).attr('class');
        
        if ($(this).hasClass('build-disc')) {
            // 達到最多6個就不理他
            if ($('#discCount').text() == maxDiscNum) {
                return;
            }

            $(this)
                .removeClass('build-disc')
                .removeClass('build')
                .addClass('built-disc')
                .addClass('built');

            $(this).html('<span><b style="color:white;">ｖ</b> 已建立</span>');
            $(this).parent().addClass('selectedDiv');
            $(this).parent().children('span').css({ 'color': 'black' });
            $('#discCount').text(parseInt($('#discCount').text()) + 1);
        } else {
            $(this)
                .removeClass('built-disc')
                .removeClass('built')
                .addClass('build-disc')
                .addClass('build');

            $(this).html('<span style="color:white;">＋建立</span>');
            $(this).parent().removeClass('selectedDiv');
            $(this).parent().children('span').css({ 'color': '#666' });
            $('#discCount').text(parseInt($('#discCount').text()) - 1);
        }

    }
    // #endregion

    // #region 插入討論組區塊
    function addDisc() {
        // 沒有輸入或達到最多6個就不理他
        if ($('#discname').val() == '' || $('#discCount').text() == maxDiscNum) {
            return;
        }
        var newDiscName = $('#discname').val();
        var htmlStr = '<div class="discussDiv selectedDiv"><span class="discussName selectedDiscussName">' + newDiscName + '</span><span class="built built-disc"><b style="color:#FFF;">ｖ</b> 已建立</span>';
        var nextTD;
        nextTD = $("#NewDiscArea");
        // 塞入html
        nextTD.append(htmlStr);

        // 討論組數加1
        $('#discCount').text(parseInt($('#discCount').text()) + 1);
        
    }
    // #endregion

    // #region 送出新增
    function submit(event) {
        var userID = event.data.userid;
        var DiscussionNameArr = [];
        var CompID = $("#companyID").val();   //抓Hidden欄位的CompanyID
        var UserName = $("#UserName").val();  //抓取使用者名稱，以建立第一次的登入cookie

        // 把討論組名稱取出來存進陣列
        $('.built').closest('div').children('.discussName').each(function () {
            DiscussionNameArr.push($(this).text().replace(/\s/g,''));
        });

        // #region 先定義 Ajax 結果
        var success = function (data, textStatus, xhr) {
            if (data.IsSuccessful) {
                var register = ({
                    UserID : userID,
                    UserName : UserName,
                    CompanyID : CompID
                });
                jsonAuthAjax("/Succ/AfterRegister", register, function (data)
                {
                    if (data.IsSuccessful)
                    {
                        window.location.href = "/mybox/true";
                    }
                }, "POST");
            } else {
                alert(data.Message);
                return;
            }
        }
        // #endregion

        // 送出的參數
        var para = ({
            UserID: userID,
            CompanyID: CompID,
            DiscussionName: DiscussionNameArr
        });
        jsonAuthAjax("/User/RegCreateDisc", para, success, "POST");
    }
    // #endregion
});