SuccApp.factory('GetListFinish',[ '$rootScope' ,function ($rootScope)
{
    var factory = {};

    factory.GetFinish = function ()
    {
        $rootScope.$broadcast('FinishGetList', {});
    }

    factory.onGetFinish = function ($scope, process) {
        $scope.$on('FinishGetList', function (event, Data)
        {
            process(Data);
        });
    }

    return factory;

}]);