//登入
var Login = function () {
    LoginPara = ({
        Email: $("#account").val(),
        PassWord: $.trim($("#password").val())
    });

    var d = new Date();

    var paraUrl = "/Home/Login?t=" + d.getTime();

    $.ajax({
        url: paraUrl,
        data: LoginPara,
        type: 'POST',
        traditional: true,
        async: false,
        error: function (response) {
            alert(response);
        },
        success: function (response) {
            LoginCallBack(response);
        }
    });

};

var LoginCallBack = function (isSuccess) {
    var SubjectID = $("#subjectID").val();
    var IsEmail = $("#isEmail").val();
    if (IsEmail == "True") {
        //前往主題詳細頁(單頁式)
        window.location.href = "/sPage/?subjectID=" + SubjectID;
    }
    else {
        if (isSuccess.IsSuccess)
            window.location.href = "/Succ/Index";

        else
            alert(isSuccess.Message);
    }
};

$(document).ready(function () {
    if(navigator.userAgent.match(/Android|iPhone|iPad/i) != null)
    {
        $("#account").attr("type", "text");
    }

    var $animation_elements = $('.animation-element');
    var $window = $(window);
    $window.on('scroll', check_if_in_view);
    $window.on('scroll resize', check_if_in_view);
    $window.trigger('scroll');

    function check_if_in_view() {
        var window_height = $window.height();
        var window_top_position = $window.scrollTop();
        var window_bottom_position = (window_top_position + window_height);

        $.each($animation_elements, function () {
            var $element = $(this);
            var element_height = $element.outerHeight();
            var element_top_position = $element.offset().top;
            var element_bottom_position = (element_top_position + element_height);

            // check to see if this current container is within viewport
            if ((element_bottom_position >= window_top_position) && (element_top_position <= window_bottom_position)) {
                $element.addClass('in-view');
            }
            else {
                $element.removeClass('in-view');
            }
        });
    };

});