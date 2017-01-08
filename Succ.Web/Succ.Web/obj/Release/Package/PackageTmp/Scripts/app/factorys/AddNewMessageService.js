SuccApp.factory('AddNewMessageService', ['$http', '$q', '$filter', function ($http, $q, $filter) {
    // service Singleton Object
    var AddNewMessageSrv = {};
    // #region 可呼叫的方法
    // 確定儲存
    AddNewMessageSrv.save = function (NewMessage)
    {
        // 送到後端
        return $http.post('/Subject/CreateSubmit', NewMessage)    
    };
    //拿取主題標籤
    AddNewMessageSrv.GetEventTag = function (CompanyID)
    {
        return $http.get('/Subject/GetEventTagList?CompanyID=' + CompanyID);
    }
    //拿取對象標籤
    AddNewMessageSrv.GetCusTag = function (CompanyID)
    {
        return $http.get('/Subject/GetCusTagList?CompanyID=' + CompanyID);
    }
    // #endregion
    return AddNewMessageSrv;
}]);