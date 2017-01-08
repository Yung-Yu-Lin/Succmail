SuccApp.factory('SubHistory', ['$rootScope', function ($rootScope) {

    var factory = {};

    factory.OpenSubHistory = function (para)
    {
        $rootScope.$broadcast('OpenSubHistory',
        {
            SubID: para
        });
    }

    factory.onOpenSubHistory = function($scope,process)
    {
        $scope.$on('OpenSubHistory', function (event, data)
        {
            process(data);
        });
    }

    return factory;
}]);