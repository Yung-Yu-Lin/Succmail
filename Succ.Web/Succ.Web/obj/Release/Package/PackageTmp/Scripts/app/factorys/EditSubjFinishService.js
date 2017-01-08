SuccApp.factory('EditFinish', ['$rootScope', function ($rootScope)
{
    var factory = {};

    // #region接收參數進行廣播
    function BroadCastAndHandle(Target,Data)
    {
        //填充收件人UserID
        if (Data.Type == 0)
        {
            var Receiver = [];
            for (var i = 0; i < Data.Receiver.length; i++)
            {
                Receiver.push(Data.Receiver[i].UserID);
            }
        }
        //進行廣播
        //Type: 0主題 1回覆
        $rootScope.$broadcast(Target,
            {
                Type: Data.Type,
                DiscID: Data.DiscID,
                SubjID: Data.SubjID,
                Title: Data.Title,
                ModifiedBy: Data.ModifiedBy,
                ModifierName: Data.ModifierName,
                ModifiedOn: Data.ModifiedOn,
                PlanDate: Data.PlanDate,
                Receiver: Receiver
            });
    }
    // #endregion
    // #regionEditController完成編輯後進行廣播
    factory.EditSubj = function(Source,SubjData)
    {
        //Source 0:未讀 1:我的信箱 2:收藏夾 3:主題列表 4:已讀 5:申請歸檔 6:完成區(不可編輯，不進行廣播) 7:搜尋
        switch(Source)
        {
            case 0:
                BroadCastAndHandle('NoReadEdit', SubjData);
                break;
            case 1:
                BroadCastAndHandle('MyBoxEdit', SubjData);
                break;
            case 2:
                BroadCastAndHandle('MyFavEdit', SubjData);
                break;
            case 3:
                BroadCastAndHandle('SubjListEdit', SubjData);
                break;
            case 4:
                BroadCastAndHandle('IsReadEdit', SubjData);
                break;
            case 5:
                BroadCastAndHandle('ApplyListEdit', SubjData);
                break;
            case 7:
                BroadCastAndHandle('SearchListEdit', SubjData);
                break;
        }
    }
    // #endregion
    // #region各列表承接廣播後結果
    factory.onEditSubj = function ($scope, Source, process)
    {
        //Source 0:未讀 1:我的信箱 2:收藏夾 3:主題列表 4:已讀 5:申請歸檔 6:完成區(不可編輯，不進行廣播) 7:搜尋
        switch (Source)
        {
            case 0:
                $scope.$on('NoReadEdit', function (event, Data) {
                    process(Data);
                });
                break;
            case 1:
                $scope.$on('MyBoxEdit', function (event, Data) {
                    process(Data);
                });
                break;
            case 2:
                $scope.$on('MyFavEdit', function (event, Data) {
                    process(Data);
                });
                break;
            case 3:
                $scope.$on('SubjListEdit', function (event, Data) {
                    process(Data);
                });
                break;
            case 4:
                $scope.$on('IsReadEdit', function (event, Data) {
                    process(Data);
                });
                break;
            case 5:
                $scope.$on('ApplyListEdit', function (event, Data) {
                    process(Data);
                });
                break;
            case 7:
                $scope.$on('SearchListEdit', function (event, Data) {
                    process(Data);
                });
                break;
        }
    };
    // #endregion
    return factory;
}]);