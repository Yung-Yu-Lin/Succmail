SuccApp.directive('Calendar', [function () {
    var linker = function (scope, element, attr) {
        element.calendar({
            tmpl_path: "/package/calendar/tmpls/",
            events_source: function () { return []; }
        });
    };
    return {
        restrict: 'A',
        link: linker,
        template: '<div id="calendar"></div>'
    }


}]);