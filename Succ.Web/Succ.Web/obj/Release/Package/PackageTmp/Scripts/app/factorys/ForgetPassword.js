app.factory('forgetpwd', ['$http', function ($http) {
    var factory = {};
    //接收使用者輸入的email
    factory.sendemil = function (txtemail) {
        //C#Controller路徑
        return $http.get("/Home/SendPwd?txtemail=" + txtemail);
    };
    return factory;
}]);