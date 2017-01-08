//檔案分享區 建立資料夾
SuccApp.factory('FileFolder', ['$rootScope', function ($rootScope)
{
    var factory = {};

    factory.AddFileFolder = function()
    {
        $rootScope.$broadcast('AddFileFolder', {});
    }

    factory.onAddFileFolder = function($scope, process)
    {
        $scope.$on('AddFileFolder', function (event, Data)
        {
            process(Data);
        });
    }

    return factory;

}]);
//檔案分享區 點選資料夾
SuccApp.factory('ClickFolder', ['$rootScope', function ($rootScope)
{
    var factory = {};

    factory.ClickFolder = function (DirID)
    {
        $rootScope.$broadcast('ClickFolder',
        {
            DirID:DirID
        });
    }

    factory.onClickFolder = function ($scope, process)
    {
        $scope.$on('ClickFolder', function (event, Data)
        {
            process(Data);
        });
    }

    return factory;

}]);
//檔案分享區 上傳檔案
SuccApp.factory('UploadFile', ['$rootScope', function ($rootScope)
{
    var factory = {};

    factory.UploadFile = function ()
    {
        $rootScope.$broadcast('UploadFile', {});
    }

    factory.onUploadFile = function ($scope, process)
    {
        $scope.$on('UploadFile', function (event, Data) {
            process(Data);
        });
    }

    return factory;
}]);
//上傳檔案 上傳中
SuccApp.factory('UploadFinish', ['$rootScope', function ($rootScope)
{

    var factory = {};

    factory.FinishUpload = function (item)
    {
        $rootScope.$broadcast('FinishUpload',
            {
                FileItem: item
            });
    }
    factory.onFinishUpload = function($scope, process)
    {
        $scope.$on('FinishUpload', function (event,Data) {
            process(Data);
        });
    }

    return factory;
}]);
//上傳檔案 完成上傳
SuccApp.factory('UploadOk', ['$rootScope', function ($rootScope)
{
    var factory = {};

    factory.UploadComplete = function (item, FileID) {
        $rootScope.$broadcast('UploadOk',
            {
                FileItem: item,
                FileID:FileID
            });
    }
    factory.onUploadComplete = function ($scope, process) {
        $scope.$on('UploadOk', function (event, Data) {
            process(Data);
        });
    }

    return factory;

}]);