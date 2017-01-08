SuccApp.controller('OperateRecord', ['$scope', '$filter', 'GetBackendData', '$http', function ($scope, $filter, GetBackendData, $http) {
    // #region
    // #endregion
    // #region 參數區域
    var _CompID = $scope.$parent.$parent.$parent.$parent.CurrentCompany['CompanyID'];
    var _UserID = $scope.$parent.$parent.$parent.$parent.IndexData.CurrentUser['UserID'];
    $scope.OperateManage = {};
    $scope.OperateManage.CompID = _CompID;
    $scope.OperateManage.UserID = _UserID;
    $scope.OperateManage.FilterUser = {};
    $scope.OperateManage.OperationList = [];
    $scope.OperateManage.DiscList = [];
    $scope.OperateManage.UserList = [];
    // 預設不開啟過濾條件
    $scope.OperateManage.IsClickFilter = false;
    // 顯示過濾人員的輔助樣式
    $scope.OperateManage.FilterStyle = { 'display': 'none' };
    // 預設不顯示過濾的下拉選單
    $scope.OperateManage.IsShowFilter = false;
    // 預設過濾的開始日期
    $scope.OperateManage.StartDate = "";
    // 預設過濾的結束日期
    $scope.OperateManage.EndDate = "";
    // 預設過濾的人員
    $scope.OperateManage.FilterUser = {};
    // 預設過濾的討論組
    $scope.OperateManage.FilterDisc = {};
    // #endregion
    GetOperateData();
    // #region 拿取操作紀錄資料
    function GetOperateData() {
        var _Para = ({
            CompID: _CompID,
            UserID: null,
            DiscID: null,
            sDate: null,
            eDate: null
        });
        GetBackendData.GetOperateData(_Para)
            .then(function (result) {
                $scope.OperateManage.DiscList = result.data.DiscList;
                $scope.OperateManage.OperationList = result.data.OperationList;
                $scope.OperateManage.UserList = result.data.UserList;
            });
    };
    // #endregion
    // #region 人頭顏色轉換
    $scope.PhotoStyle = function (color) {
        return { 'background-color': color };
    };
    // #endregion
    // #region 人的名字轉換
    $scope.NameConvert = function (LName, FName) {
        return LName + FName;
    };
    // #endregion
    // #region 檔案類型轉換類別
    $scope.ConvertFileType = function (FileType) {
        var _FileType = FileType.toLowerCase();
        var result = "";
        switch(_FileType)
        {
            case "pdf":
                result = "IconSetting pdf";
                break;
            case "xlsx":
            case "xls":
                result = "IconSetting excel";
                break;
            case "doc":
            case "docx":
                result = "IconSetting word";
                break;
            case "ppt":
            case "pptx":
                result = "IconSetting ppt";
                break;
            case "zip":
            case "rar":
            case "7z":
            case "gzip":
                result = "IconSetting rar";
                break;
            case "png":
            case "jpg":
            case "gif":
            case "bmp":
                result = "IconSetting jpg";
                break;
            case "txt":
                result = "IconSetting text";
                break;
            case "html":
            case "cs":
            case "vb":
            case "js":
            case "css":
                result = "IconSetting file";
                break;
            case "mp3":
            case "wav":
                result = "IconSetting mp3";
                break;
            case "avi":
            case "mpeg":
            case "rmvb":
            case "mp4":
                result = "IconSetting mp4";
                break;
            default:
                result = "IconSetting other";
                break;
        }
        return result;
    };
    // #endregion
    // #region GoogleDocument
    $scope.GoogleDoc = function (AttID) {
        CheckIsGoogle(AttID);
    };
    // #endregion
    // #region 檔案大小轉換
    $scope.FileSizeConvert = function (AttSize) {
        var _Size = Math.round(AttSize / 1024);
        return _Size + "KB";
    };
    // #endregion
    // #region 直接下載檔案
    $scope.RecordDataDownload = function (AttID) {
        NotToGoogleDoc(AttID);
    };
    // #endregion
    // #region 打開更多詳細頁
    $scope.OpenDetail = function (logID) {
        $filter('filter')($scope.OperateManage.OperationList, { SysLogId: logID }, true)[0].IsShowDetail = !$filter('filter')($scope.OperateManage.OperationList, { SysLogId: logID }, true)[0].IsShowDetail;
    };
    // #endregion
    // #region 判定為可以開啟Google Doc的檔案型態
    function OpenGoogleDocView(AttID) {
        //前往Angular config.js 的對應controller
        window.open('/GoogleDoc/' + AttID);
    };
    // #endregion
    // #region 判定為可以利用Web Office開啟的檔案
    function OpenWebOffice(AttID) {
        //前往Angular config.js 的對應controller
        window.open('/WebOffice/' + AttID);
    };
    // #endregion
    // #region 無法開啟Google Doc的檔案類型，直接下載
    function NotToGoogleDoc(AttID) {
        $("#frameSetting").attr("src", encodeURI("../../FileShare/downloadFileByAttID/?AttID=" + AttID + "&t=" + new Date().getTime()));
    };
    // #endregion
    // #region Google 方法判斷
    function CheckIsGoogle(para) {
        $http({
            method: 'get',
            url: '/Attachment/GetFileType/?AttID=' + para
        })
        .success(function (result) {
            var CurrentType = $filter('FileTypeFilter')(result['FileType']);
            switch (CurrentType) {
                case 'excel':
                case 'word':
                case 'ppt':
                    OpenWebOffice(para);
                    break;
                case 'pdf':
                case 'text':
                    OpenGoogleDocView(para);
                    break;
                default:
                    NotToGoogleDoc(para);
                    break;
            }
        });
    };
    // #endregion
    // #region DropDopwn 類別的決定
    $scope.DropDownClass = function () {
        if ($scope.OperateManage.IsClickFilter) {
            return "w3-btn w3-padding w3-light-grey dropup";
        }
        else {
            return "w3-btn w3-padding w3-light-grey";
        }
    };
    // #endregion
    // #region 觸發下拉過濾選單
    $scope.DropDownFilter = function () {
        $scope.OperateManage.IsClickFilter = !$scope.OperateManage.IsClickFilter;
        $scope.OperateManage.IsShowFilter = !$scope.OperateManage.IsShowFilter;
        if ($scope.OperateManage.IsShowFilter) {
            $scope.OperateManage.FilterStyle = { 'display': 'block' };
        }
        else {
            $scope.OperateManage.FilterStyle = { 'display': 'none' };
        }
    };
    // #endregion
    // #region 無任何過濾條件下，控制Label
    $scope.NoFilter = function () {
        var _SDate = $scope.OperateManage.StartDate.length <= 0;
        var _EDate = $scope.OperateManage.EndDate.length <= 0;
        var _FilterUser = $scope.OperateManage.FilterUser.hasOwnProperty('UserName') == true ? false : true;
        var _FilterDisc = $scope.OperateManage.FilterDisc.hasOwnProperty('DiscName') == true ? false : true;
        if (_SDate && _EDate && _FilterUser && _FilterDisc) {
            return true;
        }
        else {
            return false;
        }
    };
    // #endregion
    // #region 有過濾開始日期，控制Label
    $scope.SDateFilter = function () {
        var _SDate = $scope.OperateManage.StartDate.length > 0;
        if (_SDate) {
            return true;
        }
        else {
            return false;
        }
    };
    // #endregion
    // #region 有過濾結束日期，控制Label
    $scope.EDateFilter = function () {
        var _EDate = $scope.OperateManage.EndDate.length > 0;
        if (_EDate) {
            return true;
        }
        else {
            return false;
        }
    };
    // #endregion
    // #region 有過濾人員，控制Label(考RD08)
    $scope.UserFilter = function () {
        var _FilterUser = $scope.OperateManage.FilterUser.hasOwnProperty('UserName') == true ? true : false;
        if (_FilterUser) {
            return true;
        }
        else {
            return false;
        }
    };
    // #endregion
    // #region 有過濾討論組，控制Label
    $scope.DiscFilter = function () {
        var _FilterDisc = $scope.OperateManage.FilterDisc.hasOwnProperty('DiscName') == true ? true : false;
        if (_FilterDisc) {
            return true;
        }
        else {
            return false;
        }
    };
    // #endregion
    // #region 過濾開始日期有變動
    $scope.$watch('OperateManage.StartDate', function (newValue, oldValue) {
        if (newValue.length > 0) {
            ReloadData();
        }
    });
    // #endregion
    // #region 過濾結束日期有變動
    $scope.$watch('OperateManage.EndDate', function (newValue, oldValue) {
        if (newValue.length > 0) {
            ReloadData();
        }
    });
    // #endregion
    // #region 過濾人員有變動
    $scope.$watch('OperateManage.FilterUser', function (newValue, oldValue) {
        var _IsChooseUser = newValue.hasOwnProperty('UserName') == true ? true : false;
        if (_IsChooseUser) {
            ReloadData();
        }
    });
    // #endregion
    // #region 過濾討論組有變動
    $scope.$watch('OperateManage.FilterDisc', function (newValue, oldValue) {
        var _IsChooseDisc = newValue.hasOwnProperty('DiscName') == true ? true : false;
        if (_IsChooseDisc) {
            ReloadData();
        }
    });
    // #endregion
    // #region 重新刷取資料
    function ReloadData() {
        var _Para = ({
            CompID: _CompID,
            UserID: $scope.OperateManage.FilterUser.UserId,
            DiscID: $scope.OperateManage.FilterDisc.DiscId,
            sDate: $scope.OperateManage.StartDate,
            eDate: $scope.OperateManage.EndDate
        });
        GetBackendData.GetOperateData(_Para)
            .then(function (result) {
                $scope.OperateManage.OperationList = result.data.OperationList;
            });
    };
    // #endregion
    // #region 移除開始日期過濾
    $scope.RemoveSDate = function () {
        $scope.OperateManage.StartDate = "";
        ReloadData();
    };
    // #endregion
    // #region 移除結束日期過濾
    $scope.RemoveEDate = function () {
        $scope.OperateManage.EndDate = "";
        ReloadData();
    };
    // #endregion
    // #region 移除人員過濾
    $scope.RemoveUser = function () {
        $scope.OperateManage.FilterUser = {};
        ReloadData();
    };
    // #endregion 
    // #region 移除人員過濾
    $scope.RemoveDisc = function () {
        $scope.OperateManage.FilterDisc = {};
        ReloadData();
    };
    // #endregion
}]);