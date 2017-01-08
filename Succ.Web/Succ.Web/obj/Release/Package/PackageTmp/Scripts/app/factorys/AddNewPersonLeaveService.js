SuccApp.factory('AddNewPersonLeaveService', ['$http', '$q', function ($http, $q) {
    // service Singleton Object
    var AddNewPersonLeaveSrv = {};
    // 儲存草稿
    // #region基本ViewModel
    var LeaveType = function (leaveType) {
        if (!leaveType) leaveType = {};
        var LeaveType = {
            TypeID: leaveType.TypeID || null,
            TypeName: leaveType.TypeName || null,
        };
        return LeaveType;
    };
    // #endregion
    // #regionAddNewPersonLeaveSrv.LeaveType = [];
    AddNewPersonLeaveSrv.LeaveType = function (DiscID) {
        var deferred = $q.defer();
        $http({
            method: 'get',
            url: '/PersonLeave/GetType/?DiscID=' + DiscID
        })
        .success(function (data) {
            deferred.resolve(data);
        })
        .error(function () 
        {
            deferred.reject("error get LeaveType");
        });
        return deferred.promise;
    }
    // #endregion
    // #region確定儲存
    AddNewPersonLeaveSrv.save = function (NewMessage) {
        // 送到後端
        return $http.post('/PersonLeave/CreateSubmit', NewMessage)
    };
    // #endregion
    return AddNewPersonLeaveSrv;
}]);