//各列表更新回覆刪除後
SuccApp.factory('DelReplyFactory', ['$rootScope', '$http', function ($rootScope, $http)
{
    var factory = {};

    //呼叫刪除主題Service
    factory.DelReply = function (ReplyID, SubjectID, DiscID, UserID)
    {
        return $http.get("/Subject/DelReply/?ReplyID=" + ReplyID + "&SubjectID=" + SubjectID + "&DiscID=" + DiscID + "&UserID=" + UserID);
    };

    //未讀訊息
    function NoRead(DiscID, SubjectID) {
        //NoReadDelete
        BroadCastAndHandle(DiscID, SubjectID, 'NoReadReplyDelete');
    }
    //我的信箱
    function MyBox(DiscID, SubjectID) {
        //MyBoxDelete
        BroadCastAndHandle(DiscID, SubjectID, 'MyBoxReplyDelete');
    }
    //收藏夾
    function MyFav(DiscID, SubjectID) {
        //OriginalDelete
        BroadCastAndHandle(DiscID, SubjectID, 'OriginalReplyDelete');
    }
    //討論組主題列表
    function DiscList(DiscID, SubjectID) {
        //DiscListDelete
        BroadCastAndHandle(DiscID, SubjectID, 'DiscListReplyDelete');
    }
    //已讀主題列表
    function ReadList(DiscID, SubjectID) {
        //ReadListDelete
        BroadCastAndHandle(DiscID, SubjectID, 'ReadListReplyDelete');
    }
    //申請歸檔主題列表
    function ApplyList(DiscID, SubjectID) {
        //ApplyListDelete
        BroadCastAndHandle(DiscID, SubjectID, 'ApplyListReplyDelete');
    }
    //完成區主題列表
    function FinishList(DiscID, SubjectID) {
        //FinishListDelete
        BroadCastAndHandle(DiscID, SubjectID, 'FinishListReplyDelete');
    }
    //搜尋主題列表
    function SearchList(DiscID, SubjectID) {
        //SearchListDelete
        BroadCastAndHandle(DiscID, SubjectID, 'SearchListReplyDelete');
    }

    //完成處理廣播及接受廣播
    function BroadCastAndHandle(DiscID, SubjectID, Target) {
        //廣播
        $rootScope.$broadcast(Target, {
            DiscID: DiscID,
            SubjID: SubjectID
        });
    }

    //刪除回覆後進行廣播
    factory.AfterDeleteReply = function (DiscID,SubjectID,Source)
    {
        //Source 0:未讀訊息廣播 1:我的信箱廣播 2:收藏夾廣播 3:主題列表廣播 4:已讀廣播 5:申請歸檔廣播 6:完成區廣播 7:搜尋列表廣播 8:Email(不廣播)
        switch (Source) {
            case 0:
                NoRead(DiscID, SubjectID);
                break;
            case 1:
                MyBox(DiscID, SubjectID);
                break;
            case 2:
                MyFav(DiscID, SubjectID);
                break;
            case 3:
                DiscList(DiscID, SubjectID);
                break;
            case 4:
                ReadList(DiscID, SubjectID);
                break;
            case 5:
                ApplyList(DiscID, SubjectID);
                break;
            case 6:
                break;
            case 7:
                SearchList(DiscID, SubjectID);
                break;
        }
    };

    //接收刪除回覆後的廣播
    factory.onAfterDelReply = function ($scope, Source, process) {
        //Source 0:未讀訊息廣播 1:我的信箱廣播 2:收藏夾廣播 3:主題列表廣播 4:已讀廣播 5:申請歸檔廣播 6:完成區廣播 7:搜尋列表廣播 8:Email(不廣播)
        switch (Source) {
            case 0:
                $scope.$on('NoReadReplyDelete', function (event, Data) {
                    process(Data);
                });
                break;
            case 1:
                $scope.$on('MyBoxReplyDelete', function (event, Data) {
                    process(Data);
                });
                break;
            case 2:
                $scope.$on('OriginalReplyDelete', function (event, Data) {
                    process(Data);
                });
                break;
            case 3:
                $scope.$on('DiscListReplyDelete', function (event, Data) {
                    process(Data);
                });
                break;
            case 4:
                $scope.$on('ReadListReplyDelete', function (event, Data) {
                    process(Data);
                });
                break;
            case 5:
                $scope.$on('ApplyListReplyDelete', function (event, Data) {
                    process(Data);
                });
                break;
            case 6:
                break;
            case 7:
                $scope.$on('SearchListReplyDelete', function (event, Data) {
                    process(Data);
                });
                break;
        }
    };

    return factory;
}]);