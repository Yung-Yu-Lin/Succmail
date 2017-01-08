//我的信箱數字
SuccApp.factory('MyBoxCT', ['$rootScope', function ($rootScope) {

    var factory = {};

    factory.UpdateBoxCT = function (BoxNum)
    {
        $rootScope.$broadcast('Update', {
            BoxCT: BoxNum
        });
    }

    factory.onUpdateBoxCT = function ($scope, process)
    {
        $scope.$on('Update', function (event, BoxCT)
        {
            process(BoxCT);
        });
    }

    return factory;

}]);
//我的收藏數字
SuccApp.factory('MyFavCT', ['$rootScope', function ($rootScope) {

    var factory = {};

    factory.UpdateFavCT = function (FavNum)
    {
        $rootScope.$broadcast('UpdateFav', {
            FavCT: FavNum
        });
    }

    factory.onUpdateFavCT = function($scope, process)
    {
        $scope.$on('UpdateFav', function (event, FavCT)
        {
            process(FavCT);
        });
    }

    return factory;

}]);
