$(function () {
    // #region 綁定事件
    // 綁定事件 -- 開始使用按鈕click觸發
    $(document).on('click', '.nextButton', { userid: $('.nextButton').data('userid') }, submit);
    // 綁定事件 -- 輸入欄位改變時觸發change
    $(document).on('change', '.inputWidth', validateOnChange);
    // 綁定事件 -- 輸入欄位取得焦點時觸發focus
    $(document).on('focus', '.inputWidth', enableButton);
    // #endregion
   
    // #region 送出註冊
    function submit(event) {
        var userID = event.data.userid;
        var firstname = $("#firstname").val();
        var lastname = $("#lastname").val();
        var pwd = $("#pwd").val();
        var CompID = $("#companyID").val();   //抓Hidden欄位的CompanyID
        var DiscID = $("#DiscID").val();   //抓Hidden欄位的DiscID

        if (validate()) {
            // 送出的參數
            var para = ({
                UserID: userID,
                FirstName: firstname,
                LastName: lastname,
                Password: pwd,
                CompanyID: CompID,
                DiscId: DiscID
            });

            // #region 先定義 Ajax 結果
            var success = function (data, textStatus, xhr) {
                if (data.IsSuccessful)
                {
                    jsonAuthAjax("/Succ/AfterRegister",
                        {
                            UserID: userID,
                            UserName: lastname + firstname,
                            CompanyID: CompID
                        }, function (data)
                        {
                            if(data.IsSuccessful)
                            {
                                window.location.href = "/mybox/true";
                            }
                        },"POST");
                }
                else {
                    alert(data.Message)
                    return;
                }
            }
            // #endregion
            jsonAuthAjax("/User/EmpRegister", para, success, "POST");
        }
    }
    // #endregion

    // #region 驗證
    function validate() {
        var isValid = true;
        var firstname = $("#firstname").val();
        var lastname = $("#lastname").val();
        var pwd = $("#pwd").val();

        // 姓 不能為空
        if ($.trim(firstname) == '') {
            $('#firstname').css({ 'border-color': 'crimson' });
            $('#lab0').show();
            $('.nextButton').attr('disabled', 'disabled'); // 封鎖按鈕
            isValid = false;
        } else {
            $('#firstname').css({ 'border-color': '' });
            $('#lab0').hide();
            $('.nextButton').removeAttr('disabled');
        }

        // 名字 不能為空
        if ($.trim(lastname) == '') {
            $('#lastname').css({ 'border-color': 'crimson' });
            $('#lab0').show();
            $('.nextButton').attr('disabled', 'disabled'); // 封鎖按鈕
            isValid = false;
        } else {
            $('#lastname').css({ 'border-color': '' });
            $('#lab0').hide();
            $('.nextButton').removeAttr('disabled');
        }

        // 密碼 不能為空
        if ($.trim(pwd) == '') {
            $('#pwd').css({ 'border-color': 'crimson' });
            $('#lab2').show();
            $('.nextButton').attr('disabled', 'disabled'); // 封鎖按鈕
            isValid = false;
        } else {
            $('#pwd').css({ 'border-color': '' });
            $('#lab2').hide();
            $('.nextButton').removeAttr('disabled');
        }

        return isValid;
    }
    // #endregion

    // #region 輸入欄位值改變時驗證
    function validateOnChange() {
        if ($.trim($(this).val()) == '') {
            $(this).css({ 'border-color': 'crimson' });
            if ($(this).attr('name') == 0 || $(this).attr('name') == 1) {
                $('#lab0').show();
            }
            else {
                $('#lab1').show();
            }
            $('.nextButton').attr('disabled', 'disabled'); // 封鎖按鈕
        } else {
            $(this).css({ 'border-color': '' });
            if ($(this).attr('name') == 0 || $(this).attr('name') == 1) {
                $('#lab0').hide();
            }
            else {
                $('#lab1').hide();
            }
            $('.nextButton').removeAttr('disabled');
        }
    }
    // #endregion

    // #region 恢復按鈕
    function enableButton() {
        $('.nextButton').removeAttr('disabled');
    }
    // #endregion
});