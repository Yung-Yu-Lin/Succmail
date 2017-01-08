// #region 一般主題進行編輯
SuccApp.factory('EditMessageService', ['$http', '$q', function ($http, $q) {
    // service Singleton Object
    var EditMessageSrv = {};

    // 確定儲存
    EditMessageSrv.save = function (Message) {
        // 送到後端
        return $http.post('/Subject/UpdateSubmit', Message);
    };

    return EditMessageSrv;
}]);
// #endregion
// #region 款項請領進行編輯
SuccApp.factory('EditApplyMoneyService', ['$http', '$q', function ($http, $q)
{
    // service Singleton Object
    var EditMessageSrv = {};

    // 確定儲存
    EditMessageSrv.save = function (Message) {
        // 送到後端
        return $http.post('/ApplyMoney/UpdateSubmit', Message);
    };

    return EditMessageSrv;
}]);
// #endregion
// #region 採購計畫進行編輯
SuccApp.factory('EditPurchaseMoneyService', ['$http', '$q', function ($http, $q)
{
    var EditMessageSrv = {};

    //確定進行儲存
    EditMessageSrv.save = function (Message)
    {
        //送到後端
        return $http.post('/Purchase/UpdateSubmit', Message);
    }
    
    return EditMessageSrv;
}]);
// #endregion
// #region 外出單進行編輯
SuccApp.factory('EditGoOut', ['$http', '$q', function ($http, $q)
{
    var EditMessageSrv = {};

    //確定進行儲存
    EditMessageSrv.save = function (Message)
    {
        //送到後端
        return $http.post('/GoOut/UpdateSubmit', Message);
    }

    return EditMessageSrv;

}]);
// #endregion
// #region 請假單進行編輯
SuccApp.factory('EditLeave', ['$http', '$q', function ($http, $q)
{
    var EditMessageSrv = {};

    //確定進行儲存
    EditMessageSrv.save = function (Message) {
        //送到後端
        return $http.post('/PersonLeave/UpdateSubmit', Message);
    }

    return EditMessageSrv;
}]);
// #endregion
// #region 加班單進行編輯
SuccApp.factory('EditOverTime', ['$http', '$q', function ($http, $q)
{
    var EditMessageSrv = {};

    //確定進行儲存
    EditMessageSrv.save = function (Message) {
        //送到後端
        return $http.post('/Overtime/UpdateSubmit', Message);
    }

    return EditMessageSrv;
}]);
// #endregion