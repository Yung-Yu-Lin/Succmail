$(function () {
    // #region 綁定事件
    // 綁定事件 -- 當滑鼠 focus 在最後一個輸入欄位時觸發
    $(document).on('focus', '.inputWidth:last', checkShowNewInput);
    // 綁定事件 -- 當輸入的值改變時觸發檢查email格式
    $(document).on('change', '.inputWidth', checkValidEmail);
    // 綁定事件 -- 下一步按鈕click觸發
    $(document).on('click', '.nextButton', { userid: $('.nextButton').data('userid') }, submit);
    //#endregion

    // #region 自動生成Input

    // 要不要插入新欄位的flag
    var isInsertNewInput = false;
    
    // 檢查是不是要插入新的輸入欄位
    function checkShowNewInput() {
        var total = $('.inputWidth').length;
        $('.inputWidth').each(function (index) {
            // 檢查除了最後一個之外的有沒有值
            if ((index + 1) < total) {
                if ($(this).val() != '') {
                    // 有值
                    isInsertNewInput = true;
                } else {
                    // 沒有值就跳出
                    isInsertNewInput = false;
                    return false;
                }
            }
        });

        // 經過檢查都有值就插入新的欄位
        if (isInsertNewInput)
            InsertNewInput($('.inputWidth:last').parent().parent());
    }

    // 插入新的欄位
    function InsertNewInput(element) {
        var htmlStr = '<tr>\n<td><input class="inputWidth" placeholder="Email address" type="text" /></td>\n<td><label style="display:none;color:crimson;">格式有誤</label></td>\n</tr>';
        element.after(htmlStr);
    }
    // #endregion

    // #region Email格式驗證

    // 顯示隱藏email錯誤訊息
    function checkValidEmail(event) {
        if (validateEmail(event.target.value) == true) {
            // 如果是正確的email格式就隱藏錯誤訊息
            $(this).parent().parent().find('label').hide();
            $('.nextButton').removeAttr('disabled');
        } else {
            // 如果不是正確的email格式就顯示錯誤訊息
            $(this).parent().parent().find('label').show();
            $('.nextButton').attr('disabled', 'disabled');
        }
    }

    // 前端驗證Email
    function validateEmail(email) {
        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailReg.test(email);
    }

    // #endregion

    // #region 送出邀請
    function submit(event) {
        var userID = event.data.userid;
        var isInviteMember = false;
        var EmailIsValid = false;
        var CompID = $("#companyID").val();  //抓Hidden欄位的CompanyID
        // #region 取得邀請的Email並驗證
        var MailArr = [];

        // 送出之前再次驗證Email格式
        $(".inputWidth").each(function () {
            if ($(this).val() != '') {
                isInviteMember = true;
                // 有沒有通過email驗證
                if (validateEmail($(this).val())) {
                    MailArr.push($(this).val());
                    EmailIsValid = true;
                } else {
                    EmailIsValid = false;
                }
            }
        });

        // #endregion

        // 如果沒有輸入Email就直接去新增討論組
        if (MailArr.length == 0 && isInviteMember == false) {
            window.location.href = '/User/CreateDisc/?UserID=' + userID + "&CompanyID=" + CompID;;
        } else {
            // #region 有通過E-Mail 驗證才送出
            if (EmailIsValid) {
                // #region 先定義 Ajax 結果
                var success = function (data, textStatus, xhr) {
                    if (data.IsSuccessful) {
                        window.location.href = '/User/CreateDisc/?UserID=' + userID + "&CompanyID=" + CompID;
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
                    MemberEmail: MailArr
                });
                jsonAuthAjax("/User/InvitedMail", para, success, "POST");
            }
            // #endregion
        }
    }
    // #endregion
});
