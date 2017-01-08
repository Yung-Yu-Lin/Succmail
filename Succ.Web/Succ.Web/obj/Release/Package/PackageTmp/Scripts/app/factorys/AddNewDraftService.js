SuccApp.factory('AddNewDraftService', ['$http', function ($http)
{
    //service Object
    var AddNewDraftSrv = {};

    // #region 新增主題草稿
    AddNewDraftSrv.save = function (NewMessage) {
        //送到後端
        return $http.post("/Subject/CreateSubmit", NewMessage)
    };
    // #endregion

    // #region 新增回覆草稿
    AddNewDraftSrv.saveReply = function (ReplyMessage) {
        //送到後端
        return $http.post("/Subject/CreateReply", ReplyMessage);
    };
    // #endregion

    return AddNewDraftSrv;

}]);