SuccApp.factory('DiscSeq', ['$rootScope', '$http', function ($rootScope, $http) {

    var factory = {};

    // #region 依據不同主題列表來源，進行不同的廣播
    //未讀訊息 0
    function NoRead(data) {
        //NoReadProgress
        BroadCastAndHandle(data, 'NoreadDiscSeq');
    }
    //我的信箱 1
    function MyBox(data) {
        //MyBoxProgress
        BroadCastAndHandle(data, 'MyBoxDiscSeq');
    } 
    //收藏夾 2
    function MyFav(data) {
        //OriginalProgress
        BroadCastAndHandle(data, 'OriginalDiscSeq');
    }
    //搜尋主題列表 7
    function SearchList(data) {
        //SearchListProgress
        BroadCastAndHandle(data, 'SearchListDiscSeq');
    }
    //完成處理廣播及接受廣播
    function BroadCastAndHandle(data, Target) {
        //廣播
        $rootScope.$broadcast(Target, data);
    }
    // #endregion
    // #region 監聽事件===>討論組排序變動
    factory.onUpdateDiscSeq = function (Source, process)
    {
        //Source 0:未讀訊息廣播 1:我的信箱廣播 2:收藏夾廣播 3:主題列表廣播 4:已讀廣播 5:申請歸檔廣播 6:完成區廣播 7:搜尋列表廣播 8:Email(不廣播)
        switch (Source) {
            case 0:
                $rootScope.$on('NoreadDiscSeq', function (event, Data) {
                    process(Data);
                });
                break;
            case 1:
                $rootScope.$on('MyBoxDiscSeq', function (event, Data) {
                    process(Data);
                });
                break;
            case 2:
                $rootScope.$on('OriginalDiscSeq', function (event, Data) {
                    process(Data);
                });
                break;
            case 7:
                $rootScope.$on('SearchListDiscSeq', function (event, Data) {
                    process(Data);
                });
                break;
        }
    };
    // #endregion
    // #region 接收所有討論組排序變動事件
    factory.UpdateDiscSeq = function (data)
    {
        //Source 0:未讀訊息廣播 1:我的信箱廣播 2:收藏夾廣播 3:主題列表廣播 4:已讀廣播 5:申請歸檔廣播 6:完成區廣播 7:搜尋列表廣播 8:Email(不廣播)
        switch (data['Source']) {
            case 0:
                NoRead(data);
                break;
            case 1:
                MyBox(data);
                break;
            case 2:
                MyFav(data);
                break;
            case 7:
                SearchList(data);
                break;
        }
    };
    // #endregion

    return factory;
}]);
