SuccApp.factory('AddNewPurchasService', ['$http', '$q', function ($http, $q) {
    // service Singleton Object
    var AddNewPurchasSrv = {};
    // 儲存草稿

    // 確定儲存
    AddNewPurchasSrv.save = function (NewMessage) {
        // 送到後端
        return $http.post('/Purchase/CreateSubmit', NewMessage)

    };

    return AddNewPurchasSrv;
}]);