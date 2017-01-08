//各列表更新Color
SuccApp.factory('ColorFactory', ['$rootScope', function ($rootScope) {

    var factory = {};

    //未讀訊息
    function NoRead(DiscID, SubjectID, Color) {
        //NoReadColor
        BroadCastAndHandle(DiscID, SubjectID, 'NoReadColor', Color);
    }
    //我的信箱
    function MyBox(DiscID, SubjectID, Color) {
        //MyBoxColor
        BroadCastAndHandle(DiscID, SubjectID, 'MyBoxColor', Color);
    }
    //收藏夾
    function MyFav(DiscID, SubjectID, Color) {
        //OriginalColor
        BroadCastAndHandle(DiscID, SubjectID, 'OriginalColor', Color);
    }
    //討論組主題列表
    function DiscList(DiscID, SubjectID, Color) {
        //DiscListColor
        BroadCastAndHandle(DiscID, SubjectID, 'DiscListColor', Color);
    }
    //已讀主題列表
    function ReadList(DiscID, SubjectID, Color) {
        //ReadListColor
        BroadCastAndHandle(DiscID, SubjectID, 'ReadListColor', Color);
    }
    //申請歸檔主題列表
    function ApplyList(DiscID, SubjectID, Color) {
        //ApplyListColor
        BroadCastAndHandle(DiscID, SubjectID, 'ApplyListColor', Color);
    }
    //完成區主題列表
    function FinishList(DiscID, SubjectID, Color)
    {
        //FinishListColor
        BroadCastAndHandle(DiscID, SubjectID, 'FinishListColor', Color);
    }
    //搜尋主題列表
    function SearchList(DiscID, SubjectID, Color)
    {
        //SearchListColor
        BroadCastAndHandle(DiscID, SubjectID, 'SearchListColor', Color);
    }
    //完成處理廣播及接受廣播
    function BroadCastAndHandle(DiscID, SubjectID, Target, Color) {
        //廣播
        $rootScope.$broadcast(Target, {
            DiscID: DiscID,
            SubjID: SubjectID,
            Color: Color
        });
    }

    factory.UpdateColor = function (DiscID, SubjectID, Source, Color)
    {
        //Source 0:未讀訊息廣播 1:我的信箱廣播 2:收藏夾廣播 3:主題列表廣播 4:已讀廣播 5:申請歸檔廣播 6:完成區廣播 7:搜尋列表廣播 8:Email(不廣播)
        switch(Source)
        {
            case 0:
                NoRead(DiscID, SubjectID, Color);
                break;
            case 1:
                MyBox(DiscID, SubjectID, Color);
                break;
            case 2:
                MyFav(DiscID, SubjectID, Color);
                break;
            case 3:
                DiscList(DiscID, SubjectID, Color);
                break;
            case 4:
                ReadList(DiscID, SubjectID, Color);
                break;
            case 5:
                ApplyList(DiscID, SubjectID, Color);
                break;
            case 6:
                break;
            case 7:
                SearchList(DiscID, SubjectID, Color);
                break;
        }
    }

    factory.onUpdateColor = function ($scope, Source, process) {
        //Source 0:未讀訊息廣播 1:我的信箱廣播 2:收藏夾廣播 3:主題列表廣播 4:已讀廣播 5:申請歸檔廣播 6:完成區廣播 7:搜尋列表廣播 8:Email(不廣播)
        switch (Source) {
            case 0:
                $scope.$on('NoReadColor', function (event, Data) {
                    process(Data);
                });
                break;
            case 1:
                $scope.$on('MyBoxColor', function (event, Data) {
                    process(Data);
                });
                break;
            case 2:
                $scope.$on('OriginalColor', function (event, Data) {
                    process(Data);
                });
                break;
            case 3:
                $scope.$on('DiscListColor', function (event, Data) {
                    process(Data);
                });
                break;
            case 4:
                $scope.$on('ReadListColor', function (event, Data) {
                    process(Data);
                });
                break;
            case 5:
                $scope.$on('ApplyListColor', function (event, Data) {
                    process(Data);
                });
                break;
            case 6:
                break;
            case 7:
                $scope.$on('SearchListColor', function (event,Data) {
                    process(Data);
                });
                break;
        }
    }

    //完成區顏色廣播獨立
    factory.FinishUpdateColor = function (DiscID, SubjectID, Color)
    {
        FinishList(DiscID, SubjectID, Color);
    }
    //完成區顏色接受廣播
    factory.onFinishUpdateColor = function ($scope, process)
    {
        $scope.$on('FinishListColor', function (event, Data) {
            process(Data);
        });
    }


    return factory;

}])