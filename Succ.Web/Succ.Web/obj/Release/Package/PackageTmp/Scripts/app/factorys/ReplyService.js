SuccApp.factory('ReplyService', ['$http', '$q', function ($http, $q) {
    // service Singleton Object
    var ReplyMessageSrv = {};
    // #region新增
    ReplyMessageSrv.create = function (ReplyMessage)
    {
        // 送到後端
        return $http.post('/Subject/CreateReply', ReplyMessage)
    };
    // #endregion
    // #region修改
    ReplyMessageSrv.update = function (ReplyMessage)
    {
        // 送到後端
        return $http.post('/Subject/UpdateReply', ReplyMessage)
    };
    // #endregion
    // #region刪除
    ReplyMessageSrv.delete = function (ReplyID) {
        // 送到後端
        return $http.post('/Subject/DeleteReply', ReplyID)
    };
    // #endregion
    // #region廣播關閉回覆區事件
    ReplyMessageSrv.CloseEditor = function () {

    };
    // #endregion
    return ReplyMessageSrv;
}]);