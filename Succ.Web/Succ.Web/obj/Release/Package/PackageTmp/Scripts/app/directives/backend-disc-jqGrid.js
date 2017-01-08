SuccApp.directive("discJqGrid", ['$rootScope', 'GetBackendData', function ($rootScope, GetBackendData) {

    return {
        restrict: 'E',
        scope: {
            config: '=',
            data: '=',
            compid: '=',
            userid: '='
        },
        link: function (scope, element, attrs) {
            var table;
            scope.$watch('config', function (newValue) {
                element.children().empty();
                table = angular.element('<table id="recycleContent"></table>');
                pager = angular.element('<div id="pager"></div>');
                element.append(table);
                element.append(pager);
                $(table).jqGrid(newValue);
                // 自定義按鈕事件 
                $(table).delegate("#recoverDisc", "click", function () {
                    var _DiscID = $(this).attr('data-value');
                    var _DiscType = $(this).attr('data-disctype');
                    var para = ({
                        DiscID: _DiscID,
                        CompID: scope.compid,
                        UserID: scope.userid,
                        DiscType: _DiscType
                    });
                    GetBackendData.RecoverDisc(para)
                        .then(function (result) {
                            // Grid reload
                            $(table).setGridParam({ datatype: 'json' }).trigger('reloadGrid');
                            //更新左方討論組列表
                            $rootScope.$broadcast('UpdateBackendDisc', { DiscList: result.data.DataObj, DiscType: _DiscType });
                        });
                });
            });
        }
    }

}]);