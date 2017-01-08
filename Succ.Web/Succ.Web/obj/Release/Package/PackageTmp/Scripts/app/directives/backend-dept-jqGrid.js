SuccApp.directive("deptJqGrid", ['$rootScope', 'GetBackendData', function ($rootScope, GetBackendData) {
    return {
        restrict: 'E',
        scope: {
            config: '='
        },
        link: function (scope, element, attrs) {
            var table;
            scope.$watch('config', function (newValue) {
                element.children().empty();
                table = angular.element('<table id="DeptGrid"></table>');
                pager = angular.element('<div id="pager"></div>');
                element.append(table);
                element.append(pager);
                $(table).jqGrid(newValue);
            });
        }
    }

}]);