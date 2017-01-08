//主題列表建立時間(開始)過濾
SuccApp.factory('Filter_Create_Start', ['$rootScope', function ($rootScope)
{
    
    var factory = {};

    factory.FilterDate = function (para,para2)
    {
        $rootScope.$broadcast('Filter_Create_Start', {
            StartDate: para,
            EndDate: para2
        });
    }

    factory.onFilterDate = function($scope, process)
    {
        $scope.$on('Filter_Create_Start', function (event, Data)
        {
            process(Data);
        });
    }

    return factory;

}]);
//主題列表建立時間(結束)過濾
SuccApp.factory('Filter_Create_End', ['$rootScope', function ($rootScope) {

    var factory = {};

    factory.FilterDate = function (para,para2) {
        $rootScope.$broadcast('Filter_Create_End',{
            StartDate: para,
            EndDate: para2
        });
    }

    factory.onFilterDate = function ($scope, process) {
        $scope.$on('Filter_Create_End', function (event, Data) {
            process(Data);
        });
    }

    return factory;

}]);
//主題列表最後回覆時間(開始)過濾
SuccApp.factory('Filter_Modifyed_Start', ['$rootScope', function ($rootScope) {

    var factory = {};

    factory.FilterDate = function (para, para2) {
        $rootScope.$broadcast('Filter_Modifyed_Start', {
            StartDate: para,
            EndDate: para2
        });
    }

    factory.onFilterDate = function ($scope, process) {
        $scope.$on('Filter_Modifyed_Start', function (event,Data) {
            process(Data);
        });
    }

    return factory;

}]);
//主題列表最後回覆時間(結束)過濾
SuccApp.factory('Filter_Modifyed_End', ['$rootScope', function ($rootScope) {

    var factory = {};

    factory.FilterDate = function (para, para2) {
        $rootScope.$broadcast('Filter_Modifyed_End', {
            StartDate: para,
            EndDate: para2
        });
    }

    factory.onFilterDate = function ($scope, process) {
        $scope.$on('Filter_Modifyed_End', function (event, Data) {
            process(Data);
        });
    }

    return factory;

}]);
//檔案分享區上傳時間(開始)過濾
SuccApp.factory('Filter_Upload_Start', ['$rootScope', function ($rootScope)
{
    var factory = {};

    factory.FilterDate = function (para, para2) {
        $rootScope.$broadcast('Filter_Upload_Start', {
            StartDate: para,
            EndDate: para2
        });
    }

    factory.onFilterDate = function ($scope, process) {
        $scope.$on('Filter_Upload_Start', function (event, Data) {
            process(Data);
        });
    }

    return factory;

}]);
//檔案分享區上傳時間(結束)過濾
SuccApp.factory('Filter_Upload_End', ['$rootScope', function ($rootScope)
{
    var factory = {};

    factory.FilterDate = function (para, para2) {
        $rootScope.$broadcast('Filter_Upload_End', {
            StartDate: para,
            EndDate: para2
        });
    }

    factory.onFilterDate = function ($scope, process) {
        $scope.$on('Filter_Upload_End', function (event, Data) {
            process(Data);
        });
    }

    return factory;
}]);