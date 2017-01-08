SuccApp.directive('fileSort', ['$rootScope', '$filter', function ($rootScope, $filter)
{
    //關閉排序空間
    function CloseFilterArea(scope) {
        $('.condition').css("height", "50px");
        scope.FilterVisible = "false";
        scope.SortVisible = "false";
    }
    //更新排序的文字
    function ChangeOrderInfo(scope, para)
    {
        //文字
        switch(para)
        {
            case 'CreateOn':
                scope.OrderText = $filter('translate')('UploadTime');
                break;
            case 'Name':
                scope.OrderText = $filter('translate')('File') + $filter('translate')('Name');
                break;
            case 'Type':
                scope.OrderText = $filter('translate')('File') + $filter('translate')('Type');
                break;
            case 'Size':
                scope.OrderText = $filter('translate')('File') + $filter('translate')('Size');
                break;
            default:
                scope.OrderText = $filter('translate')('UploadTime');
                break;
        }
    }
    //更新排序的圖案
    function ChangeOrderImg(scope) {
        if (scope.OrderImage == "glyphicon glyphicon-arrow-up")
            scope.OrderImage = "glyphicon glyphicon-arrow-down";

        else
            scope.OrderImage = "glyphicon glyphicon-arrow-up";
    }

    return {
        restrict: "A",
        template:"<button class='condition-btn-sort btn btn-sm' ng-click='OpenSort(this)'>" +
                        $filter('translate')('Sort') +
                       "<span class='caret'></span>" +
                  "</button>" +
                  "<ul class='dropdown-menu drop-sort' style='display:block;' ng-show='SortVisible'>" +
                      "<li>" +
                            "<a ng-click='SortImplement(" + '"CreateOn"' + ")' class='a_type'>" + $filter('translate')('UploadTime') + "</a>" +
                      "</li>" +
                      "<li>" +
                            "<a ng-click='SortImplement(" + '"Name"' + ")' class='a_type'>" + $filter('translate')('File') + $filter('translate')('Name') + "</a>" +
                      "</li>" +
                      "<li>" +
                            "<a ng-click='SortImplement(" + '"Type"' + ")' class='a_type'>" + $filter('translate')('File') + $filter('translate')('Type') + "</a>" +
                      "</li>" +
                      "<li>" +
                            "<a ng-click='SortImplement(" + '"Size"' + ")' class='a_type'>" + $filter('translate')('File') + $filter('translate')('Size') + "</a>" +
                      "</li>" +
                  "</ul>" +
                  "<a class='order' ng-class='OrderImage' ng-bind='OrderText' ng-click='OrderReverse()'>",
        link: function (scope, element, attrs)
        {
            //預設排序選單ShowState
            scope.SortVisible = "false";
            //預設排序為上傳時間
            scope.predicate = "CreateOn";
            scope.reverse = true;
            scope.OrderText = $filter('translate')('UploadTime');
            scope.OrderImage = "glyphicon glyphicon-arrow-up";
            //選單出現方法
            scope.OpenSort = function (para)
            {
                if (scope.SortVisible == "false")
                {
                    $('.condition').css("height", "300px");
                    scope.FilterVisible = "false";
                    scope.SortVisible = "true";
                }
                else
                {
                    CloseFilterArea(scope);
                }
            }
            //排序事件
            scope.SortImplement = function (para)
            {
                //排序時更新排序文字
                ChangeOrderInfo(scope, para);
                //非首次點擊排序&&非相同排序選項
                if (scope.predicate != para && scope.predicate != "undefined")
                    scope.OrderImage = "glyphicon glyphicon-arrow-up";
                    //非首次點擊排序&&相同排序選項
                else if (scope.predicate == para) {
                    ChangeOrderImg(scope);
                }
                //更新排序的$scope Object
                scope.predicate = para;
                scope.reverse = !scope.reverse;
            }
            //單獨更新Order Reverse
            scope.OrderReverse = function () {
                scope.reverse = !scope.reverse;
                ChangeOrderImg(scope);
            }
        }
    }

}]);