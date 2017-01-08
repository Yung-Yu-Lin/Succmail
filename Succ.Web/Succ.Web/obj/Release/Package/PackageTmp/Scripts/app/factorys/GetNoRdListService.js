SuccApp.factory('getnord', ['$rootScope', '$http', function ($rootScope, $http) {

    var factory = {};

    factory.GetnoRdList = function ()
    {
        $rootScope.$broadcast('GetnordList',
        {

        });
    };

    factory.onGetnoRdList = function ($scope, process) {
        $scope.$on('GetnordList', function (event, Data) {
            process();
        });
    };

    //拿取未讀訊息列表資料
    factory.GetNoReadList = function (UserID, CompID) {
        return $http.get("/Subject/GetNoReadList/?UserID=" + UserID + "&Compid=" + CompID)
    };

    return factory;

}]);