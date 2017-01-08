SuccApp.controller('PersonalCtrl', ['$scope', '$location', '$http', '$filter', function ($scope, $location, $http, $filter)
{
    // #region參數
    //單獨開啟後台 不顯示Left Menu
    $scope.$parent.$parent.ShowLeftMenu = true;
    //使用者首頁資料
    var IndexData = $scope.$parent.$parent.IndexData;
    //指定使用者入帳號
    $scope.LoginEmail = IndexData.CurrentUser.UserEmail;
    //指定FirstName
    $scope.Firstname = $scope.$parent.$parent.IndexData.CurrentUser.FirstName;
    //指定LastName
    $scope.Lastname = $scope.$parent.$parent.IndexData.CurrentUser.LastName;
    //指定userID
    $scope.UserID = IndexData.CurrentUser.UserID;
    //存放個人設置物件
    $scope.Person = {};
    $scope.Person.PersonImg = "";
    $scope.Person.PersonEmailRemind = IndexData.CurrentUser.IsMail;
    //取照片的亂數參數
    var DateString = new Date().getMilliseconds();
    //初始載入就去要要看有沒有個人照片
    if (IndexData.CurrentUser.UserPhoto != null)
    {
        $scope.Person.PersonImg = "/Backend/getUserImg/?UserID=" + $scope.UserID + "&t=" + DateString;
    }
    else
    {
        $scope.Person.PersonImg = "";
    }

    //確認修改個人設定
    $scope.SettingConfirm = function()
    {
        //新密碼
        var newPassword = $scope.newpwd;
        //確認密碼
        var checkpwd = $scope.checkpwd;
        //密碼欄位有變動
        if(newPassword != undefined || checkpwd != undefined)
        {
            if (newPassword.length < 3)
            {
                alert($filter('translate')('PwtooShort'));
                return false;
            }
            if(newPassword != checkpwd)
            {
                alert($filter('translate')('PwNotSame'));
                return false;
            }
        }
        //FistName
        var Firstname = $scope.Firstname;
        //LastName
        var Lastname = $scope.Lastname;
        var PersonalData =
            {
                UserID: $scope.UserID,
                FirstName: Firstname,
                LastName: Lastname,
                NewPassWord: newPassword,
                CompId: IndexData.CurrentUser.CompID,
                IsMail: $scope.Person.PersonEmailRemind
            }
        //儲存個人帳戶設定
        return $http.post('/Backend/PersonalSettingSave', PersonalData).success(function (data)
        {
            if (data.IsSuccess)
            {
                $scope.$parent.$parent.IndexData.CurrentUser.FirstName = data.FirstName;
                $scope.$parent.$parent.IndexData.CurrentUser.LastName = data.LastName;
                $scope.$parent.$parent.IndexData.CurrentUser.UserName = data.LastName + data.FirstName;
                $scope.$parent.$parent.IndexData.CurrentUser.IsMail = $scope.Person.PersonEmailRemind;
                $location.path('/mybox');
            }
        });
    }

    //個人設定 點擊取消
    $scope.SettingCancel = function () {
        $location.path('/mybox');
    }

    //滑過圖像顯示上傳文字
    $(".image-div").hover(function ()
    {
        $(".upload-img").css("display", "block");
    }, function ()
    {
        $(".upload-img").css("display", "none");
    });

}]);