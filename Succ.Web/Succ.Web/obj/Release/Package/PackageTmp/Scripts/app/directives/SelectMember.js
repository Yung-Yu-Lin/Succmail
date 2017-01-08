SuccApp.directive('selectMember', [function () {
    var linker = function (scope, element, attr)
    {
        scope.$watch('DispatchMemberList', function ()
        {
            element.trigger('liszt:updated');
            element.trigger('chosen:updated');
        });

        scope.$watch('selectmodel', function ()
        {
            element.trigger('liszt:updated');
            element.trigger('chosen:updated');
        })

        //element.chosen();
    };
    return {
        restrict: 'A',
        link: linker,
        scope: { selectmodel: '=selectmodel' }
    }
}]); 
 
