//屬於ng-controller : forgetpassword
app.controller('forgetpassword', ['$scope', 'forgetpwd', '$filter', function ($scope, forgetpwd, $filter) {
    //輸入完email submit後處理的function
    $scope.emailsubmit = function () {
        $.blockUI();
        //使用者輸入的email
        var txtemail = $scope.txtEmail;
        //呼叫factory function
        forgetpwd.sendemil(txtemail)
         //回傳htttp get data
        .then(function (result) {
            $.unblockUI();
            //如果回傳的data為0顯示提示信件已寄出
            if (result.data.IsSuccessful)
            {
                var _msg = result.data.Message;
                alert(_msg);
            }
            location.href = '/Home/Login';
        });
        //清空email欄位
        $scope.txtEmail = '';        
    };
}]);