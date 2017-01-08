angular.module('multiselect-chosen', ['ng'])

.directive('chosen', ['$filter', function ($filter) {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            template: '=template',
            datasource: '=datasource'
        },
        link: function (scope, element, attrs, ngModel) {
            widthString = attrs['viewWidth'] === null ? '88%' : attrs['viewWidth'];

            var options = { custom_template: scope.template, data_source: scope.datasource, width: widthString };
             
            scope.$watch('datasource', function (newValue, oldValue, scope) {
                if (newValue !== null && (oldValue === null || !angular.isDefined(oldValue))) {
                    options.data_source = scope.datasource;
                    // 如果是第一次載入datasource就要套用
                    element.chosen(options);
                } else if (newValue !== null && oldValue !== null) {
                    element.chosen(options);
                }
                element.chosen(options);
                element.trigger("chosen:updated");
            }, true);

            // 監看model並更新下拉選單
            scope.$watch(function () {
                return ngModel.$modelValue;
            }, function (newVal) {
                element.trigger("chosen:updated");
            });
            
        }
    };
}]);