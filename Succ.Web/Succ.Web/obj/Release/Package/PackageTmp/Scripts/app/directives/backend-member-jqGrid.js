SuccApp.directive("memberJqGrid", ['$rootScope', 'GetBackendData', function ($rootScope, GetBackendData) {

    return {
        restrict: 'E',
        scope: {
            config: '=',
            compid: '=',
            userid: '='
        },
        link: function (scope, element, attrs) {
            var table;
            scope.$watch('config', function (newValue)
            {
                element.children().empty();
                table = angular.element('<table id="AllmemberGrid"></table>');
                pager = angular.element('<div id="pager"></div>');
                element.append(table);
                element.append(pager);
                $(table).jqGrid(newValue);
            });
        }
    }

}]);