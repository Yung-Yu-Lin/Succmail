//各列表更新IsIns
SuccApp.factory('IsInsFactory', ['$rootScope', function ($rootScope)
{
    var factory = {};

    //未讀訊息
    function NoRead(DiscID, SubjectID, flag) {
        //NoReadIsIns
        BroadCastAndHandle(DiscID, SubjectID, 'NoReadIsIns', flag);
    }
    //我的信箱
    function MyBox(DiscID, SubjectID, flag) {
        //MyBoxIsIns
        BroadCastAndHandle(DiscID, SubjectID, 'MyBoxIsIns', flag);
    }
    //收藏夾
    function MyFav(DiscID, SubjectID, flag) {
        //OriginalIsIns
        BroadCastAndHandle(DiscID, SubjectID, 'OriginalIsIns', flag);
    }
    //討論組主題列表
    function DiscList(DiscID, SubjectID, flag) {
        //DiscListIsIns
        BroadCastAndHandle(DiscID, SubjectID, 'DiscListIsIns', flag);
    }
    //已讀主題列表
    function ReadList(DiscID, SubjectID, flag) {
        //ReadListIsIns
        BroadCastAndHandle(DiscID, SubjectID, 'ReadListIsIns', flag);
    }
    //申請歸檔主題列表
    function ApplyList(DiscID, SubjectID, flag) {
        //ApplyListIsIns
        BroadCastAndHandle(DiscID, SubjectID, 'ApplyListIsIns', flag);
    }
    //搜尋主題列表
    function SearchList(DiscID, SubjectID, flag)
    {
        //SearchListIsIns
        BroadCastAndHandle(DiscID, SubjectID, 'SearchListIsIns', flag);
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

    factory.UpdateIsIns = function (DiscID, SubjectID, Source, flag)
    {
        //Source 0:未讀訊息廣播 1:我的信箱廣播 2:收藏夾廣播 3:主題列表廣播 4:已讀廣播 5:申請歸檔廣播 6:完成區廣播 7:搜尋列表廣播 8:Email(不廣播)
        //flag true:設定，false:解除
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

    factory.onUpdateIsIns = function ($scope, Source, process)
    {
        //Source 0:未讀訊息廣播 1:我的信箱廣播 2:收藏夾廣播 3:主題列表廣播 4:已讀廣播 5:申請歸檔廣播 6:完成區廣播 7:搜尋列表廣播 8:Email(不廣播)
        switch (Source) {
            case 0:
                $scope.$on('NoReadIsIns', function (event, Data) {
                    process(Data);
                });
                break;
            case 1:
                $scope.$on('MyBoxIsIns', function (event, Data) {
                    process(Data);
                });
                break;
            case 2:
                $scope.$on('OriginalIsIns', function (event, Data) {
                    process(Data);
                });
                break;
            case 3:
                $scope.$on('DiscListIsIns', function (event, Data) {
                    process(Data);
                });
                break;
            case 4:
                $scope.$on('ReadListIsIns', function (event, Data) {
                    process(Data);
                });
                break;
            case 5:
                $scope.$on('ApplyListIsIns', function (event, Data) {
                    process(Data);
                });
                break;
            case 6:
                break;
            case 7:
                $scope.$on('SearchListIsIns', function (event, Data) {
                    process(Data);
                });
                break;
        }
    }

    return factory;

}]);