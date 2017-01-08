SuccApp.factory('IndexDataService', ['$http', function ($http) {
    // IndexDataService Singleton Object
    var IndexService = {};
    // IndexData ViewModel
    var IndexDataInfo = {};

    // Get Data
    IndexService.GetIndexDataInfo = function (CompID)
    {
        var d = new Date();
        return $http.get('/Succ/GetIndexData?CompanyID=' + CompID + '&t=' + d.getTime());
    };

    //取得未讀數字
    IndexService.GetNoReadNumber = function (CompID,UserID)
    {
        var d = new Date();
        return $http.get('/Subject/GetNoReadCount?CompID=' + CompID + '&UserID=' + UserID);
    };

    //取得所有公司的未讀數字
    IndexService.GetAllNoReadNumber = function (CompObj)
    {
        var d = new Date();
        return $http.post("/Subject/GetAllCompNoReadCount", CompObj);
    };

    //重新讀取IndexData資料(切換公司)
    IndexService.UpdateIndexData = function (CompID,UserID,UserName)
    {
        var d = new Date();
        return $http.get("/Succ/UpdateIndexData/?CompID=" + CompID + "&UserID=" + UserID + "&t=" + d.getTime());
    };
    
    //更新DiscUser_Sequence
    IndexService.UpdateDiscSeq = function (CompObj)
    {
        //return CompObj;
        return $http.post("/Succ/UpdateDiscSeq", CompObj);
    };

    //拿取線上人員數量
    IndexService.GetOnlineMember = function () {
        return $http.get("/Succ/GetOnlineUserCount");
    };

    //取得線上人員IP列表
    IndexService.GetOnlineIPList = function (Para) {
        return $http.post("/Succ/GetOnlineIPList", Para);
    };

    return IndexService;

}]);