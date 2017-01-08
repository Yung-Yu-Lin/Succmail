SuccApp.factory('getdraft', ['$rootScope','$http', function ($rootScope,$http) {

    var factory = {};

    // #region 廣播拿取草稿列表
    factory.GetDraftList = function () {
        $rootScope.$broadcast('getdraft',
        {
        });
    }
    // #endregion
    // #region 接收廣播拿取草稿列表
    factory.onGetDraftList = function ($scope, process) {
        $scope.$on('getdraft', function (event, Data) {
            process();
        });
    }
    // #endregion
    // #region succmail_Ctrl 呼叫，草稿取得後 調整Css
    factory.UpdateStyle = function () {
        //清空原Style
        $(".subject").attr("style", "");
        //Scroll To Top
        $("html, body").animate({ scrollTop: 0 }, 1000, 'swing', function () {

        });
        $("#panel_draft").css({ "background-color": "#fefbf8", "z-index": "50", "border-radius": "0px", "border-right": "0px" });
    }
    // #endregion
    // #region 自草稿列表開啟草稿，繼續編輯
    factory.ReEditDraft = function (DraftID)
    {
        return $http.get("/Subject/GetDraftObj/?DraftID=" + DraftID);
    };
    // #endregion
    // #region 刪除草稿
    factory.DelDraft = function (DraftID) {
        return $http.get("/Subject/DelDraft/?DraftID=" + DraftID);
    };
    // #endregion
    return factory;

}]);