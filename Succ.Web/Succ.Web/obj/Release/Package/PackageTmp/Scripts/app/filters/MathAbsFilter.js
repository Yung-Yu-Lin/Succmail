SuccApp.filter('convertabs', function () {
    return function (val)
    {
        return Math.abs(val);
    }
});