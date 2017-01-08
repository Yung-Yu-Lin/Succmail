SuccApp.factory('getmybox', ['$rootScope','$http', function ($rootScope,$http) {
    var factory = {};

    factory.GetMyBoxList = function ()
    {
        $rootScope.$broadcast('getmybox',
        {
        });
    }

    factory.onGetMyBoxList = function ($scope, process)
    {
        $scope.$on('getmybox', function (event, Data)
        {
            process();
        });
    }

    factory.UpdateStyle = function ()
    {
        //清空原Style
        $(".subject").attr("style", "");
        //Scroll To Top
        $("html, body").animate({ scrollTop: 0 }, 1000, 'swing', function () {});
        $("#panel_msg").css({ "background-color": "#fefbf8", "z-index": "50", "border-radius":"0px","border-right":"0px"});
    }

    //拿取我的信箱資料
    factory.GetMyBoxData = function (UserID,CompID)
    {
        return $http.get("/Subject/GetMyBox/?UserID=" + UserID + "&CompanyID=" + CompID);
    }

    //設定我的信箱 IsIns
    factory.SettingIsIns = function(CompID, UserID, SubjID, Flag)
    {
        return $http.get("/Subject/SetIsIns?CompID=" + CompID + '&UserID=' + UserID + '&SubjectID=' + SubjID + '&Flag=' + Flag);
    }

    return factory;

}]);