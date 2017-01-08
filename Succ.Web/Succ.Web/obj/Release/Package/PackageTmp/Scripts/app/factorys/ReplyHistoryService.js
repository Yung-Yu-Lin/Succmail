SuccApp.factory('ReplyHistory', ['$rootScope', function ($rootScope) {

    var factory = {};

    factory.OpenSubHistory = function (SubjID, ReplyID) {
        $rootScope.$broadcast('OpenReplyHistory',
        {
            SubjID: SubjID,
            ReplyID: ReplyID
        });
    }

    factory.onOpenReplyHistory = function ($scope, process) {
        $scope.$on('OpenReplyHistory', function (event, data) {
            process(data);
        });
    }

    return factory;
}]);