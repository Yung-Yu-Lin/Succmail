SuccApp.factory('getSubjList', ['$rootScope','$http', function ($rootScope,$http)
{
    var factory = {};
    // #region廣播至討論組主題列表，讀取列表資料
    factory.GetSubjList = function (discid)
    {
        $rootScope.$broadcast('GetSubjList',
        {
            DiscID: discid
        });
    };
    // #endregion 
    // #region討論組主題列表接收廣播
    factory.onGetSubjList = function ($scope, process)
    {
        $scope.$on('GetSubjList', function (event, Data)
        {
            process();
        });
    };
    // #endregion
    // #region修改討論組列樣式
    factory.UpdateStyle = function (discid)
    {
        $(".subject").attr("style", "");
        //Scroll To Top
        $("html, body").animate({ scrollTop: 0 }, 1000, 'swing', function () {

        });
        $("#" + discid).css({ "background-color": "#fefbf8", "z-index": "50", "width": "230px" });
    }
    // #endregion
    // #region拿取討論組主題列表
    factory.GetSubjectList = function (UserID, DiscID)
    {
        return $http.get("/Subject/GetSubjectList/?UserID=" + UserID + "&DiscussionID=" + DiscID);
    }
    // #endregion
    return factory;

}]);