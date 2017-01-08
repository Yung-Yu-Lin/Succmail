SuccApp.directive("loadingIndicator", function () {
    return {
        restrict: "A",
        template: "<div class='loadingDiv'>" +
                    "<img class='loadingImg' src='/Statics/img/ClockLoading.gif'/>" +
                  "</div>",
        //template: "<img src='/Statics/img/ClockLoading.gif' style='position:absolute;z-index:9999;'/>",
        link: function (scope, element, attrs) {
            scope.$on("loading-start", function (e)
            {
                $("body").css("overflow-y", "hidden");
                //用來隱藏Loading 頁面的DOM
                scope.IsLoadingFinish = false;
                //控制Loading Icon
                element.css({ "display": "" });
            });

            scope.$on("loading-complete", function (e)
            {
                $("body").css("overflow-y", "auto");
                //用來隱藏Loading 頁面的DOM
                scope.IsLoadingFinish = true;
                //控制Loading Icon
                element.css({ "display": "none" });
            });
        }
    };
});