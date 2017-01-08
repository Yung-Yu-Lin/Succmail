//各列表更新Fav
SuccApp.factory('FavFactory', ['$rootScope', function ($rootScope) {

    var factory = {};

    //未讀訊息
    function NoRead(DiscID, SubjectID, flag)
    {
        //NoReadFav
        BroadCastAndHandle(DiscID, SubjectID, 'NoReadFav', flag);
    }
    //我的信箱
    function MyBox(DiscID, SubjectID, flag)
    {
        //MyBoxFav
        BroadCastAndHandle(DiscID, SubjectID, 'MyBoxFav', flag);
    }
    //收藏夾
    function MyFav(DiscID, SubjectID, flag)
    {
        //OriginalFav
        BroadCastAndHandle(DiscID, SubjectID, 'OriginalFav', flag);
    }
    //討論組主題列表
    function DiscList(DiscID, SubjectID, flag)
    {
        //DiscListFav
        BroadCastAndHandle(DiscID, SubjectID, 'DiscListFav', flag);
    }
    //已讀主題列表
    function ReadList(DiscID, SubjectID, flag)
    {
        //ReadListFav
        BroadCastAndHandle(DiscID, SubjectID, 'ReadListFav', flag);
    }
    //申請歸檔主題列表
    function ApplyList(DiscID, SubjectID, flag)
    {
        //ApplyListFav
        BroadCastAndHandle(DiscID, SubjectID, 'ApplyListFav', flag);
    }
    //完成區主題列表
    function FinishList(DiscID , SubjectID , flag)
    {
        //FinishListFav
        BroadCastAndHandle(DiscID, SubjectID, 'FinishListFav', flag);
    }
    //搜尋主題列表
    function SearchList(DiscID , SubjectID , flag)
    {
        //SearchListFav
        BroadCastAndHandle(DiscID, SubjectID, 'SearchListFav', flag);
    }
    //完成處理廣播及接受廣播
    function BroadCastAndHandle(DiscID, SubjectID, Target, flag)
    {
        //廣播
        $rootScope.$broadcast(Target, {
            DiscID: DiscID,
            SubjID: SubjectID,
            Flag: flag
        });
    }

    factory.UpdateFav = function (DiscID, SubjectID, Source, flag)
    {
        //Source 0:未讀訊息廣播 1:我的信箱廣播 2:收藏夾廣播 3:主題列表廣播 4:已讀廣播 5:申請歸檔廣播 6:完成區廣播 7:搜尋列表廣播 8:Email(不廣播)
        //flag true:設定 , false:解除
        switch (Source)
        {
            case 0:
                NoRead(DiscID, SubjectID, flag);
                break;
            case 1:
                MyBox(DiscID, SubjectID, flag);
                break;
            case 2:
                MyFav(DiscID, SubjectID, flag);
                break;
            case 3:
                DiscList(DiscID, SubjectID, flag);
                break;
            case 4:
                ReadList(DiscID, SubjectID, flag);
                break;
            case 5:
                ApplyList(DiscID, SubjectID, flag);
                break;
            case 6:
                break;
            case 7:
                SearchList(DiscID, SubjectID, flag);
                break;
        }

    }

    factory.onUpdateFav = function ($scope, Source, process)
    {
        //Source 0:未讀訊息廣播 1:我的信箱廣播 2:收藏夾廣播 3:主題列表廣播 4:已讀廣播 5:申請歸檔廣播 6:完成區廣播 7:搜尋列表廣播 8:Email(不廣播)
        switch (Source) {
            case 0:
                $scope.$on('NoReadFav', function (event,Data) {
                    process(Data);
                });
                break;
            case 1:
                $scope.$on('MyBoxFav', function (event, Data) {
                    process(Data);
                });
                break;
            case 2:
                $scope.$on('OriginalFav', function (event, Data) {
                    process(Data);
                });
                break;
            case 3:
                $scope.$on('DiscListFav', function (event, Data) {
                    process(Data);
                });
                break;
            case 4:
                $scope.$on('ReadListFav', function (event, Data) {
                    process(Data);
                });
                break;
            case 5:
                $scope.$on('ApplyListFav', function (event, Data) {
                    process(Data);
                });
                break;
            case 6:
                break;
            case 7:
                $scope.$on('SearchListFav', function (event, Data) {
                    process(Data);
                });
                break;
        }
    }
    //完成區更新收藏夾獨立廣播
    factory.FinishUpdateFav = function(DiscID, SubjectID , flag)
    {
        FinishList(DiscID, SubjectID, flag);
    }
    //完成區更新收藏夾獨立收取廣播
    factory.onFinishUpdateFav = function($scope, process)
    {
        $rootScope.$on('FinishListFav', function (event, Data) {
            process(Data);
        });
    }

    return factory;

}]);