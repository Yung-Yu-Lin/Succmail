SuccApp.factory('AddNewOverTimeService', ['$http', '$q', function ($http, $q)
{
    var factory = {};

    factory.save = function (NewMessage) {
        //送到後端
        return $http.post('/Overtime/CreateSubmit', NewMessage)
    };

    return factory;

}]);