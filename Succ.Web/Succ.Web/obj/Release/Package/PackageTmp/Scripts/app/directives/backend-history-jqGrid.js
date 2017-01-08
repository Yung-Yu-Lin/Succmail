SuccApp.directive("historyJqGrid", ['$rootScope', function ($rootScope) {

    return {
        restrict: 'E',
        scope: {
            config: '='
        },
        link: function (scope, element, attrs) {
            var table;
            scope.$watch('config', function (newValue, oldValue) {
                element.children().empty();
                table = angular.element('<table id="HistoryGrid"></table>');
                pager = angular.element('<div id="pager"></div>');
                element.append(table);
                element.append(pager);
                $(table).jqGrid(newValue);
            });
        }
    }

}]);