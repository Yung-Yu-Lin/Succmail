SuccApp.factory('AddNewGoOutService', ['$http', '$q', function ($http, $q) {
    // service Singleton Object
    var AddNewGoOutSrv = {};
    // 儲存草稿

    // 基本ViewModel
    var OutType = function (outType) {
        if (!outType) outType = {};
        var OutType = {
            TypeID: outType.TypeID || null,
            TypeName: outType.TypeName || null,
        };
        return OutType;
    };

    // 取資料
    AddNewGoOutSrv.OutType = function (DiscID)
    {
        $http({
            method: 'get',
            url: '/GoOut/GetLeaveType/?DiscID=' + DiscID
        })
        .success(function (data) {
        })
        .error(function () {

        });
    }

    // 確定儲存
    AddNewGoOutSrv.save = function (NewMessage) {
        // 送到後端
        return $http.post('/GoOut/CreateSubmit', NewMessage)
    };

    return AddNewGoOutSrv;
}]);