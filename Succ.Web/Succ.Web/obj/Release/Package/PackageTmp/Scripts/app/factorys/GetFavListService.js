SuccApp.factory('getfav', ['$rootScope', '$http', function ($rootScope, $http)
{
    var factory = {};

    factory.GetFavList = function ()
    {
        $rootScope.$broadcast('getfav',
        {
        });
    }

    factory.onGetFavList = function ($scope,process) {
        $scope.$on('getfav', function (event,Data) {
            process();
        });
    }

    factory.UpdateStyle = function () {
        //清空原Style
        $(".subject").attr("style", "");
        //Scroll To Top
        $("html, body").animate({ scrollTop: 0 }, 1000, 'swing', function () {

        });
        $("#panel_fav").css({ "background-color": "#fefbf8", "z-index": "50", "border-radius": "0px", "border-right": "0px" });
    }

    //設定我的收藏
    factory.SettingFav = function (CompID,UserID,SubjID,Flag)
    {
        return $http.get("/Subject/SetFav/?CompID=" + CompID + '&UserID=' + UserID + '&SubjID=' + SubjID + '&Flag=' + Flag);
    }

    //拿取收藏夾列表資料
    factory.GetMyFavorList = function (UserID,CompID)
    {
        return $http.get("/Subject/GetMyFavor/?UserID=" + UserID + "&CompID=" + CompID);
    }

    return factory;

}]);