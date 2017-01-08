//進階搜尋 時間選擇
SuccApp.factory('SearchDate', ['$rootScope', function ($rootScope) {

    var factory = {};

    factory.UpdateDate = function(para)
    {
        $rootScope.$broadcast('startDate',
        {
            Date: para
        });
    }

    factory.onUpdateDate = function($scope, process)
    {
        $scope.$on('startDate', function (event, Data)
        {
            process(Data);
        });
    }

    return factory;

}]);
//進階搜尋 結束時間選擇
SuccApp.factory('SearchEndDate', ['$rootScope', function ($rootScope) {

    var factory = {};

    factory.UpdateDate = function(para)
    {
        $rootScope.$broadcast('EndDate',
        {
            Date: para
        });
    }

    factory.onUpdateDate = function($scope,process)
    {
        $scope.$on('EndDate', function (event, Data)
        {
            process(Data);
        });
    }

    return factory;

}]);
//進階搜尋 開始搜尋進行廣播
SuccApp.factory('SearchStart', ['$rootScope', function ($rootScope)
{
    var factory = {};

    factory.SearchBegin = function (keyWord,StartDate,EndDate,Member,Disc,FileState,SubState)
    {
        $rootScope.$broadcast('SearchBegin',
            {
                KeyWord: keyWord,
                StartDate: StartDate,
                EndDate: EndDate,
                Member: Member,
                Disc:Disc,
                FileState: FileState,
                SubState: SubState
            });
    }

    factory.onSearchBegin = function ($scope, process)
    {
        $scope.$on('SearchBegin', function (event, Data)
        {
            process(Data);
        });
    }

    return factory;

}]);
//進階搜尋 拿取公司的所有成員列表
SuccApp.factory('SearchMember', ['$http', function ($http)
{
    var factory = {};

    factory.GetCompUser = function (CompID)
    {
        return $http.get('/Search/GetUserData/?CompanyID=' + CompID);
    }

    return factory;
}]);

//進階搜尋 拿取搜尋列表資料
SuccApp.factory('SearchDataList', ['$http', function ($http)
{
    var factory = {};

    factory.GetSearchList = function (data)
    {
        return $http.post("/Search/GetSearchList", data);
    }

    return factory;
}]);