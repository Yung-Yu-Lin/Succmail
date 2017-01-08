//屬於compuserjqgrid directive
SuccApp.directive("compuserjqgrid", ['$rootScope', function ($rootScope) {
    return {
        //以element方式宣告
        restrict: 'E',
        scope: {
            config: '='
        },
        link: function (scope, element, attrs) {
            var table;
            //監看事件
            scope.$watch('config', function (newValue, oldValue) {
                //先清空元素
                element.children().empty();
                //把table元素指定給變數table
                table = angular.element('<table id="compuserlist"></table>');
                //把div元素指定給變數pager
                pager = angular.element('<div id="compuserpager"></div>');
                //把table元素加進去
                element.append(table);
                //把pager元素加進去
                element.append(pager);
                //把整個table加到jqgrid裡面
                angular.element(table).jqGrid(newValue);
            });
        }
    }
}]);