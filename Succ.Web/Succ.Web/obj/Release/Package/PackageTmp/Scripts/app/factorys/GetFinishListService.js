SuccApp.factory('getFinish', ['$rootScope','$http',function ($rootScope,$http) {

    var factory = {};

    factory.GetSlectFilterDate = function (CreateStartDate, CreateEndDate, CloseStartDate, CloseEndDate) {
        //廣播目前輸入的日期
        $rootScope.$broadcast('GetSlectDate',
        {
            createstartdate: Date.parse(CreateStartDate),
            createenddate: Date.parse(CreateEndDate),
            closestartdate: Date.parse(CloseStartDate),
            closeenddate: Date.parse(CloseEndDate)
        });
    }

    factory.onGetSlectFilterDate = function ($scope, process) {
        //接收目前輸入的日期
        $scope.$on('GetSlectDate', function (event, Data) {
            process(Data);
        });
    }

    factory.GetFinish = function ()
    {
        $rootScope.$broadcast('GetFinish',
        {
        });
    }

    factory.onGetFinish = function ($scope, process)
    {
        $scope.$on('GetFinish', function (event, Data) {
            process();
        });
    }

    factory.GetFinishList = function (UserID, CompID, DiscID, SDate, EDate, CloseSDate, CloseEDate)
    {
        return $http.get("/Subject/GetFinishList/?UserID=" + UserID + "&CompanyID=" + CompID + "&DiscussionID=" + DiscID + "&SDate=" + SDate + "&EDate=" + EDate + "&CloseSDate=" + CloseSDate + "&CloseEDate=" + CloseEDate);
    }

    return factory;

}]);
//取得更多時間容量的完成區列表
SuccApp.factory('getMoreFinish', ['$rootScope', function ($rootScope)
{
    var factory = {};

    factory.GetMore = function (StartDate,EndDate,ShowSDate,ShowEDate)
    {
        $rootScope.$broadcast('GetMoreList',
            {
                SDate : Date.parse(StartDate.getFullYear() + '/' + (StartDate.getMonth() + 1) + '/' + (StartDate.getDate() +1)) / 1000,
                EDate: Date.parse(EndDate.getFullYear() + '/' + (EndDate.getMonth() + 1) + '/' + EndDate.getDate()) / 1000,
                ShowSDate: ShowSDate,
                ShowEDate: ShowEDate
            });
    }

    factory.onGetMore = function ($scope,process)
    {
        $scope.$on('GetMoreList', function (event, Data)
        {
            process(Data);
        });
    }

    return factory;

}]);