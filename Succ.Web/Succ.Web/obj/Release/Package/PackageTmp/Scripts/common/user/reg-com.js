function validateCom() {
    var userid = $("#userid").val();
    var firstname = $("#firstname").val();
    var lastname = $("#lastname").val();
    var pwd = $("#pwd").val();
    var repwd = $("#repwd").val();
    var comp = $("#comp").val();
    var comid = $('#companyID').val();
    var serial = $('#Serial').val();

    if (lastname.length < 1) {
        return;
    }
    else if (firstname.length < 1) {
        alert("請填入您的名字")
        return;
    }
    else if (pwd.length < 1) {
        alert("請填入密碼")
        return;
    }
    else if (comp.length < 1) {
        alert("請填入公司名")
        return;
    }

    var para = ({
        UserID: userid,
        FirstName: firstname,
        LastName: lastname,
        Password: pwd,
        CompanyName: comp,
        CompanyID: comid,
        Serial: serial
    });
    var success = function (data, textStatus, xhr) {
        if (data.IsSuccessful) {
            var DiscussionNameArr = [];
            var _CompID = $("#companyID").val();   //抓Hidden欄位的CompanyID
            var _UserID = $("#userid").val();
            var _UserName = $("#lastname").val() + $("#firstname").val();

            DiscussionNameArr.push("公司公告");
            var _DiscPara = ({
                UserID: _UserID,
                CompanyID: _CompID,
                DiscussionName: DiscussionNameArr
            });
            jsonAuthAjax("/User/RegCreateDisc", _DiscPara, function (data) {
                if (data.IsSuccessful) {
                    AfterRegist(_CompID, _UserID, _UserName);
                }
            }, "POST")
        }
        else {
            alert(data.Message)
            return;
        }
    }
    jsonAuthAjax("/User/RegSaveUserInfo", para, success, "POST");
};
function AfterRegist(_CompID, _UserID, _UserName) {
    var _RegistPara = ({
        UserID: _UserID,
        UserName: _UserName,
        CompanyID: _CompID
    });
    jsonAuthAjax("/Succ/AfterRegister", _RegistPara, function (data) {
        if (data.IsSuccessful) {
            window.location.href = "/manager";
        }
    }, "POST");
};
