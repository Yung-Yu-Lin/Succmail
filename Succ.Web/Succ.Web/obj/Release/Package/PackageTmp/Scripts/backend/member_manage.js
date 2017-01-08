var Lang = window.navigator.language;

//時間亂數
var d = new Date();

$(document).ready(function () {
    //解除讀取畫面
    $.unblockUI();
    GetMember('', '','' , 0, 0);
    i18n.init({ lng: Lang, resGetPath: '/Statics/locales/__ns__-__lng__.txt', ns: 'resource' });
    i18n.init(function (t) {

    // #region 顯示新增部門
    $('.adddepart').click(function () {
        $('.new-team').css("display", "block");
        $('.new-team-info').find('input').val("");
        $('.new-team-info').find('select').val("");
        $(".chosen-select").trigger("chosen:updated");
    });
    // #endregion
    // #region 新增部門
    $('.creatdepart').click(function () {
        $.blockUI();
        if ($('.creat_departname').val().length == 0) {
            alert(t("DepartName"));
            $('.creat_departname').focus();
            $.unblockUI();
            return false;
        }        
        else {
            var para = ({
                CompID: $("#CurrentCompID").val(),
                DepartName: $('.creat_departname').val(),
                MemberID: $('.chosen-select').val()
            });
            $.ajax({
                url: "/Backend/CreatDepart",
                async:false,
                type: "POST",
                data: para,
                success: function (msg) {
                    if (msg == "departname") {
                        alert(t("DepartName"));
                        $.unblockUI();
                    }
                    else {
                        $.unblockUI();
                        location.reload();
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert('error');
                }
            });
        }
    });
    // #endregion
    // #region 頁碼
    $('.allmemberdot').find('a').click(function () {
        var index_page;
        var DepartID = $('.allmemberdot').data("id");
        var DepartName = $('.allmemberdot').data("name");
        if (DepartID == "" || DepartName == "") {
            DepartID = "0"
            DepartName = t("AllMember");
        };
        $(this).attr("href", "#");
        //Next
        if ($(this).attr("class") == "page_next"){
            index_page = parseInt($('.allmemberdot').find('.active').text()) + 1;
            $('#partialview').load('../BackEnd/MemberManage?pageindex=' + index_page + '&DepartID=' + DepartID + '&DepartName=' + DepartName);
        }
        //Previous
        else if ($(this).attr("class") == "page_prev"){
            index_page = parseInt($('.allmemberdot').find('.active').text()) - 1;
            $('#partialview').load('../BackEnd/MemberManage?pageindex=' + index_page + '&DepartID=' + DepartID + '&DepartName=' + DepartName);
        }
        else if ($(this).attr("class") == "page_last") {
            index_page = $(this).data("last");
            $('#partialview').load('../BackEnd/MemberManage?pageindex=' + index_page + '&DepartID=' + DepartID + '&DepartName=' + DepartName);
        }
        else {
            index_page = $(this).text();
            $('#partialview').load('../BackEnd/MemberManage?pageindex=' + index_page + '&DepartID=' + DepartID + '&DepartName=' + DepartName, function (response,status,xhr) {
                $('#partialview').empty();
                $('#partialview').html(response);
            });
        }

    });
    // #endregion
    // #region 選擇左側部門底下成員
    $('.group_collapse').click(function () {
        $('.group_title').attr("class", "group_title");
        $('.group_collapse').attr("class", "group_collapse panel-collapse collapse in");
        $(this).attr("class", "group_collapse panel-collapse collapse in active");
    });
    // #endregion
    // #region 圖片滑入滑出
    $('.basicphoto').mouseover(function () {
        $('.deletephoto').css("visibility", "visible");
    });
    $('.deletephoto').mouseover(function () {
        $('.deletephoto').css("visibility", "visible");
    });
    $('.basicphoto').mouseout(function () {
        $('.deletephoto').css("visibility", "hidden");
    });
    $('.deletephoto').mouseout(function () {
        $('.deletephoto').css("visibility", "hidden");
    });
    // #endregion
    // #region 上傳個人圖片
    $('.deletephoto').click(function () {
        $('.file').trigger("click");
    });
    // #endregion
    // #region 選取討論組input box
    $('.teamtable').find('input').click(function () {
        if ($(this).attr("checked")) {
            $(this).attr("checked", false);
        }
        else {
            $(this).attr("checked", true);
        }
    });
    // #endregion
    // #region 在職/離職
    $('.use_on').click(function () {
        $(this).attr("class", "btn btn-sm active use_on");
        $('.use_off').attr("class", "btn btn-sm use_off");
    });
    $('.use_off').click(function () {
        $(this).attr("class", "btn btn-sm active use_off");
        $('.use_on').attr("class", "btn btn-sm use_on");
    });
    // #endregion
    // #region userdetail 頁籤
    $('.user_detail').click(function () {
        $('#home').attr("class", "tab-pane");
        $('#basic').attr("class", "tab-pane active");
    });
        // #endregion
    // #region 點擊不綁定Email
    $("#isSettingEmail").change(function () {
        if(this.checked)
        {
            $("#Email").prop('disabled', true);
            $("#Password").prop('disabled', true);
        }
        else
        {
            $("#Email").prop('disabled', false);
            $("#Password").prop('disabled', false);
        }
    });
        // #endregion
    // #region 判斷使用者帳號是否已經使用過
    $('#Email').change(function () {
        var Email = $('#Email').val();
        $.ajax({
            url: '/Backend/CheckEmail/?Email=' + Email,
            type:'get',
            cache: false,
            success: function (data) {
                if(data != "Null")
                {
                    $('#Password').val(data);
                    $('#Password').attr('disabled', true);
                    $("#TipForRegiste").css("display", "block");
                }
                else
                {
                    $('#Password').val();
                    $('#Password').attr('disabled', false);
                    $("#TipForRegiste").css("display", "none");
                }
            }
        });
    });
    // #endregion
    //新增/修改人員資料&驗證
    $('.submit').click(function () {
        $.blockUI();
        if ($('.user_detail').text() == "新成員" || $('.user_detail').text() == "New Member")
            var Url = "/Backend/CreatMember";
        else
            var Url = "/Backend/UpdateMember";

        if ($('#LastName').val().length == 0) {
            alert(t("EnterLastName"));
            $('select[name=LastName]').focus();
            $.unblockUI();
            return false;
        }
        else if ($('#FirstName').val().length == 0) {
            alert(t("EnterFirstName"));
            $('select[name=FirstName]').focus();
            $.unblockUI();
            return false;
        }
        else if ($('#Email').val().length == 0 && !$("#isSettingEmail:checked").length) {
            alert(t("EnterEmail"));
            $('select[name=Email]').focus();
            $.unblockUI();
            return false;
        }
        else if ($('#Password').val().length == 0 && !$("#isSettingEmail:checked").length) {
            alert(t("EnterPwd"));
            $('select[name=Password]').focus();
            $.unblockUI();
            return false;
        }
        else {// 送出
            //英文姓名處理(加入空白)
            if ($('#LastName').val().search(/[a-zA-Z]/g) != -1) {
                if ($('#LastName').val().search(/\s.$/) == -1) {
                    var temp = $('#LastName').val() + " ";
                    $('#LastName').val(temp);
                }
            }

            //選取討論組資料
            var DiscId = [];
            for (var i = 1; i <= $('.input_count').data("count") ; i++) {
                if ($('.disc_input_' + i).attr("checked") == "checked") {
                    DiscId.push($('.disc_input_' + i).val());
                }
            }

            //設定在職/離職
            var work;
            if ($('.use_on').attr("class") == "btn btn-sm active use_on")
                work = true;
            else
                work = false;
            var fm = new FormData();
            fm.append('file', $('input[type=file]')[0].files[0]);
            fm.append('CompID', $("#CurrentCompID").val());
            fm.append('MemberID', $('#MemberID').text());
            fm.append('LastName', $('#LastName').val());
            fm.append('FirstName', $('#FirstName').val());
            fm.append('Email', $('#Email').val());
            fm.append('Password', $('#Password').val());
            fm.append('DepartID', $('select[name=Depart]').val());
            fm.append('Discussions', DiscId);
            fm.append('Work', work);
            fm.append('ImgColor', $('.user_img').data("color"));
            fm.append('ImgName', $('.img_name').text());
            fm.append('IsSettingEmail', $("#isSettingEmail:checked").length > 0);

            $.ajax({
                url: Url,
                type: "POST",
                data: fm,
                contentType: false,
                processData: false,
                success: function (msg) {
                    if(msg == "lastname"){
                        alert(t("EnterLastName"));
                    }
                    else if (msg == "firstname") {
                        alert(t("EnterFirstName"));
                    }
                    else if (msg == "email") {
                        alert(t("EnterEmail"));
                    }
                    else if (msg == "password") {
                        alert(t("EnterPwd"));
                    }
                    else if(msg == "ReUseEmail")
                    {
                        alert(t("ReUseEmail"));
                    }
                    else{
                        location.reload();
                        window.scrollTo(0, 0);
                    }
                    $.unblockUI();
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert("error");
                }
            });
        }
    });

    //取消按鈕
    $(".check .btn-cancel").click(function () {
        $('#home').attr("class", "tab-pane active");
        $('#basic').attr("class", "tab-pane");
        $('.user_detail').css("display", "none");
        $('.alluser_list').attr("class", "alluser_list active");
    });

    //刪除部門(按鈕)
    $('.group_title').mouseover(function () {
        $('.delete').css("display", "block");
        $('.delete').css("top", $(this).position().top);
        $('.delete').data("value", $(this).data("value"));
        
    });
    $('.delete').mouseover(function () {
        $(this).css("display", "block");
        $(this).css("top", $(this).position().top);
    });

    $('.group_title').mouseout(function () {
        $('.delete').css("display", "none");
    });
    $('.delete').mouseout(function () {
        $(this).css("display", "none");
    });

    //刪除部門
    $('.delete').click(function () {
        if (confirm(t("DeleteDepart")) == true) {
            var para = ({
                CompanyID: $("#CurrentCompID").val(),
                DepartID: $(this).data("value")
            });
            $.ajax({
                url: "/Backend/DeleteDepart",
                async: false,
                type: "POST",
                data: para,
                success: function (msg) {
                    if (msg.IsSuccessful == false) {
                        alert(msg.Message);
                    } else {
                        location.reload();
                        window.scrollTo(0, 0);
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert("error");
                }
            });
        }
    });

    //搜尋
    $('.seach_button').click(function ()
    {
        var departID = $(".alluser_list").children("a").attr("departID");
        var SearchString = $('.search_input').val();
        var type = $(".alluser_list").children("a").attr("typeID");
        GetMember(departID, '', SearchString, type, 1);
    });

    //設定圖像顏色&名字
    $('#LastName').change(function () {

            //中文
            if ($('#LastName').val().search(/[a-zA-Z]/g) == -1) {
                $('.img_name').text($(this).val().substr(0, 1).toUpperCase());
            }
            //英文
            else if ($('#LastName').val().search(/[a-zA-Z]/g) != -1 && $('#FirstName').val().search(/[a-zA-Z]/g) != -1) {
                $('.img_name').text($('#LastName').val().substr(0, 1).toUpperCase() + $('#FirstName').val().substr(0, 1).toUpperCase());
            }
            //英中
            else if ($('#LastName').val().search(/[a-zA-Z]/g) != -1 && $('#FirstName').val().search(/[a-zA-Z]/g) == -1) {
                $('.img_name').text($('#LastName').val().substr(0, 2).toUpperCase());
            }
            if ($('.user_img').data("color") == null) {
                random_color();
                $('.user_img').attr("src", "");
                $('.img_name').css("display", "block");
            }

    });
    //設定圖像顏色&名字
    $('#FirstName').change(function () {
        if ($('#LastName').val().search(/[a-zA-Z]/g) != -1 && $('#FirstName').val().search(/[a-zA-Z]/g) != -1) {
            $('.img_name').text($('#LastName').val().substr(0, 1).toUpperCase() + $(this).val().substr(0, 1).toUpperCase());
        }
        else {
            if($('#LastName').val() != ""){
                $('.img_name').text($('#LastName').val().substr(0, 2).toUpperCase());
            }
            else{
                $('.img_name').text($('#FirstName').val().substr(0, 1).toUpperCase());                
            }
        }
        if ($('.user_img').data("color") == null) {
            random_color();
            $('.user_img').attr("src", "");
            $('.img_name').css("display", "block");
        }
    });
    //依語系更改last,first
    if (Lang == "en-US") {
        $('.last_name').text("FirstName");
        $('.first_name').text("LastName");
    }
    });

    //選擇左側部門(移動scroll)
    if ($('.depart_active').data("count") != null) {
        var top = $('.depart_active').data("count") * 40;
        $('.user-group').animate({ scrollTop: top }, 1);
    }

    //個人資料頁顯示人員圖像
    if ($('.user_img').data("img") == "") {
        $('.user_img').css("background-color", $('.user_img').data("color"));
        $('.img_name').text($('.img_name').data("name"));
    }
    else {
        if ($('#LastName').val() != "" && $('.basicinfo').find('#MemberID').text() != "")
        {
            //取照片
            GetImg($('.basicinfo').find('#MemberID').text(), 0);
        }
    }

});

// 點擊解說 不綁定Email
function HowSetEmail()
{
    $('#myModal').modal('toggle')
}

//人員管理--左側onclick
function changeDept(departID, departName,type) {
    if (Lang == "en-US") {
        if (departID == 0) {
            departName = "All_Employees";
        }
        else if(departID == 9){
            departName = "Resigned_Employees"
        }
    }
    departName = departName.replace(/\s+/g, '_');
    //原狀態:開啟
    if ($('#' + departID).attr("class") == "group_title depart_active active")
    {
        $('.group_title').attr("class", "group_title");
        $("#userGroup" + departID).children().remove();
    }
    //原狀態:關閉
    else
    {
        //先還原全部討論組li狀態
        $('.group_title').attr("class", "group_title");
        //當下選擇討論組css更動
        $('#' + departID).attr("class", "group_title depart_active active");
        //改變tab標籤
        $(".alluser_list").children("a").attr('onclick', "tab_changeDept('" + departID + "','" + departName + "')");
        $(".alluser_list").children("a").text(departName);
        $(".alluser_list").children("a").attr("typeID", type);
        $(".alluser_list").children("a").attr("departID", departID);
        GetMember(departID, departName, '', type, 1);
    }
}

//所有人員tab
function tab_changeDept(departID, departName)
{
    var result = $(".user_detail").css("display");
    if (result == "block")
    {
        $('#home').attr("class", "tab-pane active");
        $('#basic').attr("class", "tab-pane");
        return;
    }
    else
    {
        //部門ID
        var para = departID == null ? null : departID;
        //判斷討論組或全部人員
        var TypePara = departID == null ? 0 : 1;
        GetMember(para, departName, '', TypePara, 1);
    }   
}

//載入個人資料頁
function userdetail(userid, name , deptid) {
    $('.user_detail').css("display", "block");
    $('.alluser_list').attr("class", "alluser_list");
    $('.user_detail').attr("class", "user_detail active");
    $('#home').attr("class", "tab-pane");
    $('#basic').attr("class", "tab-pane active");
    //load partial
    $('#basic').load('/Backend/UserDetail/?CompanyID=' + $("#CurrentCompID").val() + '&MemberID=' + userid + "&count=" + $('.alluser').find('label').text() + "&departID=" + deptid + "&t=" + d.getTime());
    $('.user_detail').find('a').text(name);

}

//新增人員(載入頁面)
function adduser() {
    i18n.init(function (t) {

    //改tab
    $('.alluser_list').attr("class", "alluser_list");
    $('.user_detail').attr("class", "user_detail active");
    $('.user_detail').css("display", "block");
    $('#home').attr("class", "tab-pane");
    $('#basic').attr("class", "tab-pane active");

    $('.user_detail').find('a').text(t("NewMember"));
    //載入partial頁
    $('#basic').load('/Backend/UserDetail/?CompanyID=' + $("#CurrentCompID").val() + '&departID=' + $('.alluser_list').find('a').data("id") + "&t=" + d.getTime());
    });
}

//新增部門(載入頁面)
function adddepart() {
    i18n.init({ lng: Lang, resGetPath: '/Statics/locales/__ns__-__lng__.txt', ns: 'resource' });
    i18n.init(function (t) {
        $('.alluser_list').attr("class", "alluser_list");
        $('.user_detail').attr("class", "user_detail active");
        $('.user_detail').css("display", "block");
        $('#home').attr("class", "tab-pane");
        $('#basic').attr("class", "tab-pane active");
        $('.user_detail').find('a').text(t("NewDepart"));
        $('#basic').load('/Backend/UserDetail/?CompanyID=' + $("#CurrentCompID").val() + '&departID=newdepart&count=' + $('.alluser').find('label').text() + "&t=" + d.getTime());
    });
}

//亂數產生顏色
function random_color() {
    var n = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
    switch (n) {
        case 1:
            $('.user_img').css("background-color", "#ca7497");
            $('.user_img').attr("data-color", "#ca7497");
            break;
        case 2:
            $('.user_img').css("background-color", "#60b4d0");
            $('.user_img').attr("data-color", "#60b4d0");
            break;
        case 3:
            $('.user_img').css("background-color", "#8fcbcc");
            $('.user_img').attr("data-color", "#8fcbcc");
            break;
        case 4:
            $('.user_img').css("background-color", "#f17b60");
            $('.user_img').attr("data-color", "#f17b60");
            break;
        case 5:
            $('.user_img').css("background-color", "#7594b3");
            $('.user_img').attr("data-color", "#7594b3");
            break;
        case 6:
            $('.user_img').css("background-color", "#f2a5a7");
            $('.user_img').attr("data-color", "#f2a5a7");
            break;
        case 7:
            $('.user_img').css("background-color", "#e29e4b");
            $('.user_img').attr("data-color", "#e29e4b");
            break;
        case 8:
            $('.user_img').css("background-color", "#b7d28d");
            $('.user_img').attr("data-color", "#b7d28d");
            break;
        case 9:
            $('.user_img').css("background-color", "#d9b9f1");
            $('.user_img').attr("data-color", "#d9b9f1");
            break;
        case 10:
            $('.user_img').css("background-color", "#fed049");
            $('.user_img').attr("data-color", "#fed049");
            break;
    };
};

//上傳照片
function UploadSubmit(obj) {
    var formData = new FormData();
    var file = document.getElementById("personImg").files[0];
    var param =
        {
            UserID: $('.basicinfo').find('#MemberID').text()
        };
    formData.append("file", file);
    formData.append("UserID", $('.basicinfo').find('#MemberID').text());
    formData.append("CompId", $("#CurrentCompID").val());
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/Backend/UploadPersonalImg", true);
    xhr.send(formData);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            //取照片
            var d = new Date();
            $(".user_img").attr("src", "/Backend/getUserImg/?UserID=" + document.getElementById("userid").value + "&t=" + d.getTime());
            //取完照片後，清除大頭貼姓名
            $(".img_name").css("display", "none");
        }
    }
}

//取照片
function GetImg(userid, num) {
    $(".user_img").attr("src", "/Backend/getUserImg/?UserID=" + userid);
}

//取得全部成員列表
function GetMember(DepartID, DepartName,SearchString,type,notFirst)
{
    var d = new Date();
    $.ajax({
        url: 'Backend/MemberManageList/?CompanyID=' + $("#CurrentCompID").val() + '&DepartID=' + DepartID + '&DepartName=' + DepartName + '&SearchString=' + SearchString + '&TypeID=' + type + "&t=" + d.getTime(),
        dataType: 'json',
        type: 'get',
        cache:false,
        success: function (data)
        {
            if (notFirst == 0)
            {
                InitMemberList(data);
            }
            else
            {
                reloadGrid(data,DepartID,type);
            }
        }
    });
}

//初始化Grid
function InitMemberList(data)
{
    $("#memberSetting").jqGrid({
        data: data,
        datatype: 'local',
        colNames: ["使用者ID","姓名", "電子郵件", "電話","部門ID" , "部門"],
        colModel: [
            { name: 'MemberID', hidden: true, hidedlg: true },
            { name: 'FullName', sortable: false, stype: 'text', align: 'center', width: 200 },
            { name: 'Email', sortable: false, align: 'center', width: 216 },
            { name: 'Phone', sortable: false, align: 'center', width: 120 },
            { name: 'DeptID', hidden: true, hidedlg: true },
            { name: 'DepName', sortable: false, align: 'center', width: 200 }
        ],
        rowNum: 10,
        ntype: 'Get',
        loadonce: true,
        rowList: [10, 20],
        pager: '#pager',
        sortorder: 'desc',
        shrinkToFit: false,
        width: 758,
        height: '100%',
        scrollOffset: 0,
        onSelectRow: function (rowid, status, a, e) {
            var MemberID = $("#memberSetting").jqGrid('getCell', rowid, 'MemberID');
            var DeptID = $("#memberSetting").jqGrid('getCell', rowid, 'DeptID');
            var Name = $("#memberSetting").jqGrid('getCell', rowid, 'FullName');
            userdetail(MemberID, Name, DeptID);
        }
    });
}

//重新讀取Grid
function reloadGrid(data,DepartID,type)
{
    //清除所有資料
    $("#memberSetting").jqGrid("clearGridData");
    $("#memberSetting").jqGrid('setGridParam',
        {
            data: data,
            datatype:'local'
        }).trigger('reloadGrid');
    //不是全部人員的時候，需製作各討論組中成員li
    if(type != 0)
    {
        if ($("#userGroup" + DepartID).children().length >= data.length)
        {
            return;
        }
        for (var i = 0 ; i < data.length; i++)
        {
            var imgSrc = '';
            var labelName = '';
            var ImgColor = '';
            var j = i + 1;
            if (data[i].Photo != null)
            {
                imgSrc = 'Backend/getUserImg?UserID=' + data[i].MemberID;
            }
            else
            {
                ImgColor = data[i].ImgColor;
                labelName = data[i].ImgName;
            }
            $("#userGroup" + DepartID).append(
                "<li id='" + DepartID + "' class='group_collapse panel-collapse collapse in' onclick='userdetail(&quot;" + data[i].MemberID + "&quot;,&quot;" + data[i].FullName + "&quot;)' >"
                    + "<table>"
                        + "<tr>"
                            + "<td class='table_img' rowspan='2'>"
                                + "<div>"
                                    + "<img class='imgcolor_" + j + "' src='" + imgSrc + "' data-img='" + data[i].Photo + "' style='background-color:" + ImgColor + "' data-userid='" + data[i].MemberID + "' >"
                                    + "<label class='imgname imgname_" + j + "' data-name='" + data[i].ImgName + "'>" + labelName + "</label>"
                                + "</div>"
                            + "</td>"
                            + "<td>"
                                +"<label class='name_label' title='"+ data[i].FullName +"'>"+ data[i].FullName +"</label>"
                            + "</td>"
                        + "</tr>"
                        + "<tr>"
                            +"<td><label class='email_label' title='"+ data[i].Email +"'>"+ data[i].Email +"</label></td>"
                        +"</tr>"
                    + "</table>"
                + "</li>")
        }
    }
}
