SuccApp.controller('WebManage', ['$scope', 'GetBackendData', '$filter', '$timeout', 'BackendGuide','$rootScope', function ($scope, GetBackendData, $filter, $timeout, BackendGuide, $rootScope)
{
    // #region 初始化參數
    var CompID = $scope.$parent.$parent.$parent.$parent.CurrentCompany['CompanyID'];
    var UserID = $scope.$parent.$parent.$parent.$parent.IndexData.CurrentUser['UserID'];
    $scope.WebManage = {};
    $scope.OriginalData = {};

    // 是否有異動公司名稱
    $scope.WebManage.ChangedCompName = false;
    // 是否成功更新公司名稱
    $scope.WebManage.SaveCompName = false;
    // 是否有異動公司網址
    $scope.WebManage.ChangedCompWeb = false;
    // 是否成功更新公司網址
    $scope.WebManage.SaveCompWeb = false;
    // 是否有異動公司時區
    $scope.WebManage.ChangedCompTimeZone = false;
    // 是否成功更新公司時區
    $scope.WebManage.SaveTimeZone = false;
    // 是否有異動公司時區
    $scope.WebManage.ChangedSuperUser = false;
    // 是否成功更新公司時區
    $scope.WebManage.SaveSuperUser = false;

    // 是否展開公司圖片選擇區域
    $scope.WebManage.IsChooseImg = false;
    // 公司圖片展開區域樣式
    $scope.WebManage.ChooseImgStyle = { 'display': 'none' };
    var _result = {};
    // #endregion
    // #region 取得公司管理資料
    GetBackendData.getWebManageData(CompID, UserID)
     .then(function (result)
     {
         console.log(result.data);
         // 配合逐步更新，因而保存原始的資料，以利使用者點擊取消時回覆資料。
         CreateOriginalData(result.data);
         // 顯示使用的資料
         $scope.WebManage.ManageData = result.data;
         $scope.WebManage.ManageData.DefaultPath = "/Statics/img/backend/Default_Company0.jpg";
         $scope.WebManage.ManageData.CurrentPath = "/Backend/getCompImg?CompID=" + $scope.WebManage.ManageData.CompanyID;
         // 目前設定的時區
         var CurrentTimezone = $filter('filter')($scope.WebManage.ManageData.TimeZoneList, { ZoneKey: $scope.WebManage.ManageData.Timezone }, true)[0];
         $scope.WebManage.ManageData.CurrentTimeZone = CurrentTimezone;
         // 目前設定的網站管理者
         var CurrentManager = $filter('filter')($scope.WebManage.ManageData.Members, { MemberID: $scope.WebManage.ManageData.SuperMember }, true)[0];
         $scope.WebManage.ManageData.CurrentManager = CurrentManager;
     });
    // #endregion
    // #region 建立原始資料物件
    function CreateOriginalData(Data) {
        $scope.OriginalData.CompID = Data.CompanyID;
        $scope.OriginalData.CompName = Data.CompanyName;
        $scope.OriginalData.SuperUser = $filter('filter')(Data.Members, { MemberID: Data.SuperMember }, true)[0];
        $scope.OriginalData._CurrentTimeZone = $filter('filter')(Data.TimeZoneList, { ZoneKey: Data.Timezone }, true)[0];
        $scope.OriginalData._TimeZone = Data.Timezone;
        $scope.OriginalData.UID = Data.UserID;
        $scope.OriginalData.WebURL = Data.Url;
    };
    // #endregion
    // #region 點擊選擇照片照片
    $scope.ChooseImg = function () {
        $scope.WebManage.ChooseImgStyle = { 'display': 'block','text-align':'center','margin-top':'30px' };
        $scope.WebManage.IsChooseImg = true;
    };
    // #endregion
    // #region 點擊上傳照片
    $scope.UploadImg = function () {
        $('.file').trigger("click");
    };
    // #endregion
    // #region 點擊取得預設照片
    $scope.DefaultImg = function () {
    };
    // #endregion
    // #region 呼叫上傳圖片
    $scope.UploadCompImg = function (data) {
        var fm = new FormData();
        var file = document.getElementById("CompImg").files[0];
        fm.append("file", file);
        fm.append("CompanyID", CompID);
        GetBackendData.uploadCompImg(fm)
          .then(function (result)
          {
              console.log("Upload Img");
              console.log(result);
              if (result.data == "0")
              {
                  // 上傳成功
                  var d = new Date();
                  $scope.WebManage.ManageData.CurrentPath = "/Backend/getCompImg?CompID=" + $scope.WebManage.ManageData.CompanyID + "&t=" + d.getTime();
                  $scope.WebManage.ManageData.PhotoPath = "";
                  // 更新前台的圖片timer
                  var _date = new Date;
                  $scope.$parent.$parent.$parent.$parent.timer = _date.getMilliseconds();
                  ChangeValue();
              }
              else if(result.data == "2")
              {
                  var _Msg = $filter('translate')('LogoSizeFail');
                  alert(_Msg);
              }
              else
              {
                  var _Msg = $filter('translate')('FileUploadFail');
                  alert(_Msg);
              }
          });
    };
    // #endregion
    // #region 監視後臺管理值有變動
    $scope.ChangeManage = function (Type)
    {
        ChangeValue(Type);
        // 廣播封鎖前往下一步的按鈕
        $rootScope.$emit(BackendGuide.EmitModify, true);
    };
    // #endregion
    // #region 有值改變
    function ChangeValue(Type)
    {
        switch(Type)
        {
            case 0:
                $scope.WebManage.ChangedCompName = true;
                break;
            case 1:
                $scope.WebManage.ChangedCompWeb = true;
                break;
            case 2:
                $scope.WebManage.ChangedCompTimeZone = true;
                break;
            case 3:
                $scope.WebManage.ChangedSuperUser = true;
                break;
            default:
                break;
        }
    };
    // #endregion
    // #region 取消，回到我的信箱
    $scope.Cancel = function ()
    {
        window.location.href = "/mybox";
    };
    // #endregion
    // #region 確定，送出資料
    $scope.OK = function ()
    {
        $.blockUI();
        var CompanyName = $scope.WebManage.ManageData.CompanyName;
        var CompURL = $scope.WebManage.ManageData.Url;
        var TomeZone = $scope.WebManage.ManageData.CurrentTimeZone['ZoneKey'];
        var SuperMember = $scope.WebManage.ManageData.CurrentManager['MemberID'];
        //CompID
        var Obj = {};
        Obj['CompanyID'] = CompID;
        Obj['CompanyName'] = CompanyName;
        Obj['Url'] = CompURL;
        Obj['TimeZone'] = TomeZone;
        Obj['SuperMember'] = SuperMember;
        Obj['UserID'] = UserID;
        GetBackendData.UpdateCompany(Obj)
          .then(function (result) {
              $.unblockUI();
              // 公司圖片ID
              // 設置提醒
              $scope.WebManage.IsSuccess = true;
              // 關閉按鈕區域
              $scope.WebManage.IsChanged = false;
              var mytimeout = $timeout(function () {
                  $scope.WebManage.IsSuccess = false;
                  $timeout.cancel(mytimeout);
              }, 3000);
          });
    };
    // #endregion
    // #region 確定選擇公司預設圖片
    $scope.CheckDefaultImg = function () {

    };
    // #endregion
    // #region 獨立更新公司名稱
    $scope.SaveCompName = function () {
        $.blockUI();
        var CompanyName = $scope.WebManage.ManageData.CompanyName;
        var Obj = {};
        Obj['CompanyID'] = CompID;
        Obj['CompanyName'] = CompanyName;
        Obj['UserID'] = UserID;
        GetBackendData.UpdateCompName(Obj)
            .success(function (result) {
                $.unblockUI();
                if(result.IsSuccessful)
                {
                    // 廣播恢復前往下一步的按鈕
                    $rootScope.$emit(BackendGuide.EmitModify, false);
                    // 回復更新前的按鈕狀態
                    $scope.WebManage.ChangedCompName = false;
                    $scope.WebManage.SaveCompName = true;
                    // 更新Original的資料
                    $scope.OriginalData.CompName = $scope.WebManage.ManageData.CompanyName;
                    var _successTimeout = $timeout(function () {
                        $scope.WebManage.SaveCompName = false;
                        $timeout.cancel(_successTimeout);
                    }, 2000);
                }
            });
    };
    // #endregion
    // #region 獨立更新公司網址
    $scope.SaveWebSite = function () {
        $.blockUI();
        var CompURL = $scope.WebManage.ManageData.Url;
        var Obj = {};
        Obj['CompanyID'] = CompID;
        Obj['UserID'] = UserID;
        Obj['Url'] = CompURL;
        GetBackendData.UpdateCompURL(Obj)
            .success(function (result) {
                $.unblockUI();
                if (result.IsSuccessful)
                {
                    // 廣播恢復前往下一步的按鈕
                    $rootScope.$emit(BackendGuide.EmitModify, false);
                    // 回復更新前的按鈕狀態
                    $scope.WebManage.ChangedCompWeb = false;
                    $scope.WebManage.SaveCompWeb = true;
                    // 更新Original的資料
                    $scope.OriginalData.WebURL = $scope.WebManage.ManageData.Url;
                    var _successTimeout = $timeout(function () {
                        $scope.WebManage.SaveCompWeb = false;
                        $timeout.cancel(_successTimeout);
                    }, 2000);
                }
            });
    };
    // #endregion
    // #region 獨立更新公司時區
    $scope.SaveTimeZone = function () {
        $.blockUI();
        var TomeZone = $scope.WebManage.ManageData.CurrentTimeZone['ZoneKey'];
        var Obj = {};
        Obj['CompanyID'] = CompID;
        Obj['UserID'] = UserID;
        Obj['TimeZone'] = TomeZone;
        GetBackendData.UpdateCompTimeZone(Obj)
            .success(function (result) {
                $.unblockUI();
                if (result.IsSuccessful) {
                    // 廣播恢復前往下一步的按鈕
                    $rootScope.$emit(BackendGuide.EmitModify, false);
                    // 回復更新前的按鈕狀態
                    $scope.WebManage.ChangedCompTimeZone = false;
                    $scope.WebManage.SaveTimeZone = true;
                    // 更新Original的資料
                    $scope.OriginalData._CurrentTimeZone = $scope.WebManage.ManageData.CurrentTimeZone;
                    $scope.OriginalData._TimeZone = $scope.WebManage.ManageData.Timezone;
                    var _successTimeout = $timeout(function () {
                        $scope.WebManage.SaveTimeZone = false;
                        $timeout.cancel(_successTimeout);
                    }, 2000);
                }
            });
    };
    // #endregion
    // #region 獨立更新網站管理者
    $scope.SaveSuperUser = function () {
        $.blockUI();
        var SuperMember = $scope.WebManage.ManageData.CurrentManager['MemberID'];
        var Obj = {};
        Obj['CompanyID'] = CompID;
        Obj['UserID'] = UserID;
        Obj['SuperMember'] = SuperMember;
        GetBackendData.UpdateSuperUser(Obj)
            .success(function (result) {
                $.unblockUI();
                if (result.IsSuccessful) {
                    // 廣播恢復前往下一步的按鈕
                    $rootScope.$emit(BackendGuide.EmitModify, false);
                    // 回復更新前的按鈕狀態
                    $scope.WebManage.ChangedSuperUser = false;
                    $scope.WebManage.SaveSuperUser = true;
                    // 更新Original的資料
                    $scope.OriginalData.SuperUser = $scope.WebManage.ManageData.CurrentManager;
                    var _successTimeout = $timeout(function () {
                        $scope.WebManage.SaveSuperUser = false;
                        $timeout.cancel(_successTimeout);
                    }, 2000);
                    window.location.href = "/mybox";
                }
            });
    };
    // #endregion
    // #region 取消更新資料
    $scope.OmitModify = function (Type)
    {
        // 廣播恢復前往下一步的按鈕
        $rootScope.$emit(BackendGuide.EmitModify, false);
        switch (Type) {
            case 0:
                $scope.WebManage.ChangedCompName = false;
                $scope.WebManage.ManageData.CompanyName = $scope.OriginalData.CompName;
                break;
            case 1:
                $scope.WebManage.ChangedCompWeb = false;
                $scope.WebManage.ManageData.Url = $scope.OriginalData.WebURL;
                break;
            case 2:
                $scope.WebManage.ChangedCompTimeZone = false;
                $scope.WebManage.ManageData.CurrentTimeZone = $scope.OriginalData._CurrentTimeZone;
                $scope.WebManage.ManageData.Timezone = $scope.OriginalData._TimeZone;
                break;
            case 3:
                $scope.WebManage.ChangedSuperUser = false;
                $scope.WebManage.ManageData.CurrentManager = $scope.OriginalData.SuperUser;
            default:
                break;
        }
    };
    // #endregion
}]);