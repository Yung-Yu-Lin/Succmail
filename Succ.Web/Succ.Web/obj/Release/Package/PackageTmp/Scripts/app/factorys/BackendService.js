SuccApp.factory('GetBackendData', ['$http', function ($http)
{
    var factory = {};
    // 取得公司使用狀況資料
    factory.getCompData = function (CompID, UserID) {
        return $http.get('/Backend/GetCompanyData?CompID=' + CompID + "&UserID=" + UserID);
    };
    // 取得網站管理資料
    factory.getWebManageData = function (CompID, UserID) {
        return $http.get('/Backend/GetWebManageData?CompID=' + CompID + "&UserID=" + UserID);
    };
    // 上傳公司圖片
    factory.uploadCompImg = function (Data) {
        return $http.post('/Backend/UploadCompImg', Data, {
            headers: { 'Content-Type': undefined },
            transformRequest: angular.identity
        });
    };
    // 上傳個人照片
    factory.uploadMemberImg = function (Data) {
        return $http.post("/Backend/UploadPersonalImg", Data, {
            headers: { 'Content-Type': undefined },
            transformRequest: angular.identity
        });
    };
    // 獨立更新網站管理當中的公司名稱
    factory.UpdateCompName = function (Data) {
        return $http.post("/Backend/UpdateCompName", Data);
    };
    // 獨立更新網站管理當中的公司網址
    factory.UpdateCompURL = function (Data) {
        return $http.post("/Backend/UpdateCompWeb", Data);
    };
    // 獨立更新網站管理當中的時區
    factory.UpdateCompTimeZone = function (Data) {
        return $http.post("/Backend/UpdateCompTimeZone", Data);
    };
    // 獨立更新網站管理當中的管理者
    factory.UpdateSuperUser = function (Data) {
        return $http.post("/Backend/UpdateSuperUser", Data);
    };
    // 取得各別網站討論組管理資料
    factory.GetDiscManageData = function (CompID, UserID, DiscID, DiscType) {
        return $http.get("/Backend/GetDiscData?CompID=" + CompID + "&UserID=" + UserID + "&DiscID=" + DiscID + "&DiscType=" + DiscType);
    };
    //取得討論組列表資料
    factory.GetDiscListData = function (CompID, UserID) {
        return $http.get("/Backend/GetDiscListData?CompID=" + CompID + "&UserID=" + UserID);
    };
    //更新討論組詳細資料
    factory.UpdateDiscData = function (data) {
        return $http.post("/Backend/UpdateDisc", data);
    };
    //刪除討論組
    factory.DeleteDisc = function (data) {
        return $http.post("/Backend/DeleteDisc", data);
    };
    //恢復討論組
    factory.RecoverDisc = function (data) {
        return $http.post("/Backend/ReDisc", data);
    };
    //建立討論組 
    factory.CreateDisc = function (data) {
        return $http.post("/Backend/CreatDisc", data);
    };
    //取得人員管理 人員清單
    factory.GetmemberList = function (data) {
        return $http.post("/Backend/MemberManageList", data);
    };
    //建立人員
    factory.CreateMember = function (data) {
        return $http.post('/Backend/CreatMember', data, {
            headers: { 'Content-Type': undefined },
            transformRequest: angular.identity
        });
    };
    //更新人員
    factory.UpdateDiscMember = function (data) {
        return $http.post('/Backend/UpdateMember', data, {
            headers: { 'Content-Type': undefined },
            transformRequest: angular.identity
        });
    };
    //新增部門
    factory.CreateDept = function (data) {
        return $http.post('/Backend/CreatDepart', data);
    };
    //刪除部門
    factory.DelDept = function (data) {
        return $http.post('/Backend/DeleteDepart', data);
    };
    //確認Email是否已經註冊過
    factory.CheckIsRegist = function (data) {
        return $http.get('/Backend/CheckEmail/?Email=' + data);
    };
    //設定標籤啟用與停用狀態
    factory.SettingTagAble = function (data) {
        return $http.post('/Backend/SubjTagSetIsable', data);
    };
    //新增主題標簽
    factory.CreateEventTag = function (data) {
        return $http.post('/Backend/CreateSubjTag', data);
    };
    //及時新增主題標簽
    factory.AddNewTag = function(data) {
        return $http.post('/Backend/AddNewSubjTag', data);
    };
    //編輯主題標簽
    factory.EditEventTag = function (data) {
        return $http.post('/Backend/EditSubjTag', data);
    };
    //登入紀錄過濾人員清單
    factory.GetFilterMember = function (CompID) {
        return $http.get('/Backend/LoginHistoryData/?CompID=' + CompID);
    };
    //取得操作紀錄資料
    factory.GetOperateData = function (data) {
        return $http.post('/Backend/GetOperateData', data);
    };
    //部門管理初始列表資料
    factory.GetDeptListData = function (CompID) {
        return $http.get('/Backend/GetDeptList/?CompID=' + CompID);
    };

    //所有公司列表
    factory.GetUseRecord = function () {
        return $http.get("/Backend/complist");
    };
    //公司使用狀況資料
    factory.GetUsageStatus = function (CompID) {
        return $http.get("/Backend/GetUsageStatus?Compid=" + CompID);
    };
    //前10間有主題異動的公司
    factory.GetRecentlyModifyComp = function () {
        return $http.get("/Backend/GetRecentlyModifyComp");
    };
    // 退出公司
    factory.DropoutComp = function (data) {
        return $http.post('/Backend/DropoutComp', data);
    };
    // 目前使用者註冊填寫的資料進行到哪一個步驟
    factory.GetRegistStep = function (CompID, UserID) {
        return $http.get("/User/GetUserRegistStep/?CompID=" + CompID + "&UserID=" + UserID);
    };
    // 更新使用者註冊填寫的資料進行到哪一個步驟
    factory.UpdateRegistStep = function (CompID, UserID, Step) {
        return $http.get("/User/UpdateUserRegistStep/?CompID=" + CompID + "&UserID=" + UserID + "&NextStep=" + Step);
    };
    return factory;

}]);