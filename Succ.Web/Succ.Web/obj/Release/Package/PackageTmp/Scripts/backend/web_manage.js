//網站管理 點擊取消的按鈕
function GoHome() {
    //導回我的信箱
    window.location.href = "/mybox";
}

//公司上傳圖片
//function UploadCompImg(obj)
//{
//    var Formdata = new FormData();
//    var file = document.getElementById("CompImg").files[0];
//    Formdata.append("file", file);
//    Formdata.append("CompanyID", $("#CurrentCompID").val());
//    $.ajax({
//        url: 'Backend/UploadCompImg',
//        type:'POST',
//        data: Formdata,
//        contentType: false,
//        processData: false,
//        success: function (data) {
//            if(data == 0)
//            {
//                var d = new Date();
//                $(".companyimg").attr("src", "/Backend/getCompImg?t=" + d.getTime());
//            }
//        },
//        error: function (xhr, ajaxOptions, thrownError) {
//        }
//    });
//}

//網站管理 點擊確定的按鈕
$('.submit').click(function () {

    if ($('#CompanyName').val().length == 0) {
        alert(t("EnterCompName"));
        $('#CompanyName').focus();
        return false;
    }
        //else if($('#Url').val().length ==0){
        //    alert(t("EnterCompUrl"));
        //    $('#CompanyName').focus();
        //    return false;
        //}
    else {
        // 送出
        var fm = new FormData();
        fm.append('CompanyName', $('#CompanyName').val());
        fm.append('Url', $('#Url').val().length > 0 ? $('#Url').val():" ");
        fm.append('TimeZone', $('select[name=Timezone]').val());
        fm.append('SuperMember', $('select[name=SuperMember]').val());
        fm.append('CompanyID', $("#CurrentCompID").val());

        $.ajax({
            url: "/Backend/UpdateCompany",
            type: "POST",
            data: fm,
            contentType: false, //必須
            processData: false, //必須
            success: function (msg) {
                if (msg == "compname") {
                    alert(t("EnterCompName"));
                }
                else if (msg == "url") {
                    alert(t("EnterCompUrl"));
                }
                else {
                    //有可能有修改網站管理者，因此完成設定後，應要導往我的信箱
                    window.location.href = "/mybox";
                    window.scrollTo(0, 0);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert('error');
            }
        });
    }
});