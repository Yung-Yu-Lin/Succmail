SuccApp.factory('TimeZoneService', ['$cookies', function ($cookies) {
    var TimezoneSrv = {};
    // 取cookie資料
    var getTimeZone = function () {
        if ($cookies.timezone != null) {
            return $cookies.timezone;
        } else {
            // 如果沒有設定就給他+8時區0
            return '8';
        }
    };

    TimezoneSrv.currentUtCOffset = getTimeZone;

    // 寫入到cookie
    TimezoneSrv.setTimezone = function (offset) {
        $cookies.timezone = offset;
    };
    return TimezoneSrv;
}]);