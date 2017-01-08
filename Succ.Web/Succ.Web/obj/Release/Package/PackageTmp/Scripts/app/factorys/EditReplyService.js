SuccApp.factory('EditReplyService', ['$http', '$q', function ($http, $q) {
    // service Singleton Object
    var EditReplySrv = {};

    // 確定儲存
    EditReplySrv.save = function (Message) {
        // 送到後端
        return $http.post('/Subject/UpdateSubmit', Message);
    };

    return EditReplySrv;
}]);