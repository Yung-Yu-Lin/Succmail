SuccApp.controller('GoogleDocCtrl', ['$scope','$routeParams','$http', function ($scope,$routeParams,$http)
{
    var AttID = $routeParams.AttID;

    $http({
        method: 'get',
        url: '/Attachment/GetGoogleDocPath/?AttID=' + AttID
    })
    .success(function (data) 
    {
        var result = data['Url'] + "&embedded=true";
        $("#GoogleDoc_Container").append("<iframe por='123' id='googleFrame' src='javascript:;' name='iframe_googleDoc' style='width:100%;height:100%;'></iframe>");
        window.open(result, 'iframe_googleDoc');
    })
    .error(function () 
    {

    });

}]);