
//屬於usagestatusjqgrid這個directive
SuccApp.directive("usagestatusjqgrid", ['$rootScope', function ($rootScope) {
    return {
        //以element方式宣告
        restrict:'E',
        scope:{
            config: '='

        },
        link: function (scope, element, attrs) {
            var table;
            //監聽事件
            scope.$watch('config', function (newValue, oldValue) {
                //先清空元素
                element.children().empty();
                //把table元素定義給變數table
                table = angular.element('<table id="usagestatuslist"></table>');
                //把pager的div元素定義給變數pager
                pager = angular.element('<div id="pager"></div>');
                //把table元素加進去
                element.append(table);
                //把pager的元素加進去
                element.append(pager);
                //把table放進jqgrid
                angular.element(table).jqGrid(newValue);
            });
        }
    }
}]);