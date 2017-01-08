SuccApp.controller('BackendCtrl', ['$scope', '$location', 'GetBackendData', '$filter', 'HistoryComp', '$rootScope', 'BackendGuide', function ($scope, $location, GetBackendData, $filter, HistoryComp, $rootScope, BackendGuide)
{
    // #region 參數設定
    // 初始化Obj
    $scope.Backend = {};
    // 初始化預設後台第一個畫面
    $scope.Backend.BackendDetailUrl = "/Backend/WebManage";
    // 確認是否為可觀看所有公司歷史的權限
    $scope.Backend.IsCheckHistory = false;
    // #endregion
    // #region 多公司 公司ID設定及使用者ID設定
    var CompID = $scope.$parent.$parent.CurrentCompany['CompanyID'];
    var UserID = $scope.$parent.$parent.IndexData.CurrentUser['UserID'];
    $("#CurrentCompID").val(CompID);
    $("#CurrentUserID").val(UserID);
    // #endregion
    // #region 決定是否可觀看各公司歷史資料
    if (HistoryComp.CompID == CompID)
    {
        $scope.Backend.IsCheckHistory = true;
    }
    // #endregion
    // #region 取得公司註冊資訊
    GetBackendData.getCompData(CompID, UserID)
    .then(function (result)
    {
        if (result.data.IsSuccessful)
        {
            $scope.Backend.VersionInfo = result.data.DataObj;
            // 呼叫轉換版本名稱
            TransVersionType();
            // 是否為試用版
            $scope.Backend.IsTrial = $scope.Backend.VersionInfo['PdType'] == 100 ? true : false;
        }
        else
        {
            //不是老闆
            window.location.href = "/mybox";
        }
    });
    // #endregion
    // #region 轉換版本名稱
    function TransVersionType()
    {
        var VersionName = $scope.Backend.VersionInfo['VersionType'] == null ? $filter('translate')('Proversion') : $scope.Backend.VersionInfo['VersionType'];
        $scope.Backend.VersionInfo['VersionType'] = VersionName;
    };
    // #endregion
    // #region 設定日期寬度
    $scope.SetDateWidth = function () {
        if (angular.isDefined($scope.Backend.VersionInfo))
        {
            var DateWidth = ($scope.Backend.VersionInfo['ExpireLeft'] * 100) / 90;
            return {
                'width': DateWidth + '%'
            }
        }
    };
    // #endregion
    // #region 設定日期寬度
    $scope.SetMemberWidth = function () {
        if (angular.isDefined($scope.Backend.VersionInfo))
        {
            var MemberWidth = ($scope.Backend.VersionInfo['MemberCount'] * 100) / $scope.Backend.VersionInfo['MaxMember'];
            return {
                'width': MemberWidth + '%'
            }
        }
    };
    // #endregion
    // #region 設定上傳寬度
    $scope.SetUploadWidth = function () {
        if (angular.isDefined($scope.Backend.VersionInfo))
        {
            var UploadWidth = ($scope.Backend.VersionInfo['Uploaded'] * 100) / $scope.Backend.VersionInfo['MaxUpload'];
            return {
                'width': UploadWidth + '%'
            }
        }
    };
    // #endregion
    // #region 設定討論組寬度
    $scope.SetDiscWidth = function () {
        if (angular.isDefined($scope.Backend.VersionInfo))
        {
            var DiscWidth = ($scope.Backend.VersionInfo['DiscussionCount'] * 100) / $scope.Backend.VersionInfo['MaxDiscussion'];
            return {
                'width': DiscWidth + '%'
            }
        }
    };
    // #endregion
    // #region 呼叫TabView 方法
    $scope.TabView = function (source)
    {
        DirectPage(source);
    };
    // #endregion
    // #region TabView 方法
    function DirectPage(source) {
        switch (source) {
            case 'website':
                //前往網站管理
                $scope.Backend.BackendDetailUrl = "/Backend/WebManage";
                break;
            case 'disc':
                //前往討論組管理
                $scope.Backend.BackendDetailUrl = "/Backend/DiscManage";
                break;
            case 'dept':
                //前往部門管理
                $scope.Backend.BackendDetailUrl = "/Backend/DeptManage";
                break;
            case 'member':
                //前往人員管理
                $scope.Backend.BackendDetailUrl = "/Backend/MemberManage";
                break;
            case 'eventtag':
                //前往事件標籤
                $scope.Backend.BackendDetailUrl = "/Backend/EventTag";
                $('.subjTag-drop').toggle();
                break;
            case 'custag':
                //前往對象標籤
                $scope.Backend.BackendDetailUrl = "/Backend/CusTag";
                $('.subjTag-drop').toggle();
                break;
            case 'operate':
                //前往各公司操作紀錄
                $scope.Backend.BackendDetailUrl = "/Backend/OperateRecord";
                $('.record-drop').toggle();
                break;
            case 'login':
                //前往各公司操作紀錄
                $scope.Backend.BackendDetailUrl = "/Backend/LogingHistory";
                $('.record-drop').toggle();
                break;
            case 'history':
                //前往記錄管理
                $scope.Backend.BackendDetailUrl = "/Backend/Operation";
                $('.record-drop').toggle();
                break;
        }
    };
    // #endregion
    // #region DropDown Function 標籤管理
    $scope.DropDownTag = function () {
        $('.subjTag-drop').toggle();
        $('.record-drop').hide();
    };
    // #endregion
    // #region DropDown Function 後台紀錄
    $scope.DropDownRecord = function () {
        $('.record-drop').toggle();
        $('.subjTag-drop').hide();
    };
    // #endregion
    // #region 配合後台引導的接收廣播進行導頁
    $rootScope.$on(BackendGuide.EmitDirectPage, function (event, data)
    {
        DirectPage(data);
        ActiveTabClass(data);
    });
    // #endregion
    // #region 因應導引的導頁，需自動更換Tab的Class成為Active的狀態
    function ActiveTabClass(_Type) {
        var TabClassArray = [".WebManageTab", ".DiscManageTab", ".DeptManageTab", ".MemberManageTab", ".TagManageTab", ".RecordManageTab"];
        angular.forEach(TabClassArray, function (val, key) {
            angular.element(val).removeClass("active");
        });
        switch(_Type)
        {
            case 'website':
                //前往網站管理
                console.log("1");
                angular.element(".WebManageTab").addClass("active");
                break;
            case 'disc':
                //前往討論組管理
                console.log("2");
                angular.element(".DiscManageTab").addClass("active");
                break;
            case 'dept':
                //前往部門管理
                console.log("3");
                angular.element(".DeptManageTab").addClass("active");
                break;
            case 'member':
                //前往人員管理
                console.log("4");
                angular.element(".MemberManageTab").addClass("active");
                break;
            case 'eventtag':
                //前往事件標籤
                console.log("5");
                angular.element(".TagManageTab").addClass("active");
                break;
            case 'custag':
                //前往對象標籤
                console.log("6");
                angular.element(".TagManageTab").addClass("active");
                break;
            case 'operate':
                //前往各公司操作紀錄
                console.log("7");
                angular.element(".RecordManageTab").addClass("active");
                break;
            case 'login':
                //前往各公司操作紀錄
                console.log("8");
                angular.element(".RecordManageTab").addClass("active");
                break;
        }
    };
    // #endregion
}]);