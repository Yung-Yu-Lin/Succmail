SuccApp.factory('AddNewApplyMoneyService', ['$http', '$q', function ($http, $q) {
    // service Singleton Object
    var AddNewApplyMoneySrv = {};
    // 儲存草稿

    // 確定儲存
    AddNewApplyMoneySrv.save = function (NewMessage) {
        // 送到後端
        return $http.post('/ApplyMoney/CreateSubmit', NewMessage)
    };

    return AddNewApplyMoneySrv;
}]);