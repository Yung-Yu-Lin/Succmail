SuccApp.filter('converdate', ["$filter", "TimeZoneService", function ($filter, TimeZoneService) {
    return function (item, forUpdate) {
        forUpdate = forUpdate || false;
        if (item == 0) {
            return '';
        }
        var today = new Date();

        // 將傳入的日期時間戳記轉成日期格式
        var input = new Date(item * 1000);

        // 先取得今天和input UTC 0 的日期時間
        var UTC0DateTime = new Date(input.getUTCFullYear(), input.getUTCMonth(), input.getUTCDate(), input.getUTCHours(), input.getUTCMinutes(), input.getUTCSeconds());
        var UTC0Today = new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), today.getUTCHours(), today.getUTCMinutes(), today.getUTCSeconds());

        // 加上UTC Offset轉成符合的確切日期時間
        var CompanyUTCDateTime = UTC0DateTime.addHours(parseInt(TimeZoneService.currentUtCOffset()));
        var TodayUTCDateTime = UTC0Today.addHours(parseInt(TimeZoneService.currentUtCOffset()));

        // 取出公司確切的UTC年月日時分
        var CompanyYear = CompanyUTCDateTime.getFullYear();
        var CompanyMonth = CompanyUTCDateTime.getMonth() + 1;// 因為月份從0算 so +1
        var CompanyDate = CompanyUTCDateTime.getDate();
        var CompanyHours = CompanyUTCDateTime.get2nHours();
        var CompanyMinutes = CompanyUTCDateTime.get2nMinutes();

        // 取出當天確切的UTC年月日時分
        var TodayYear = TodayUTCDateTime.getFullYear();
        var TodayMonth = TodayUTCDateTime.getMonth() + 1;// 因為月份從0算 so +1
        var TodayDate = TodayUTCDateTime.getDate();
        var TodayHours = TodayUTCDateTime.get2nHours();
        var TodayMinutes = TodayUTCDateTime.get2nMinutes();

        // 判斷是不是要顯示年
        if (TodayYear == CompanyYear && forUpdate == false) {
            // 如果是今天就只顯示時間
            if (TodayMonth == CompanyMonth && TodayDate == CompanyDate) {
                return CompanyHours + ":" + CompanyMinutes;
            } else {
                return CompanyMonth + "/" + CompanyDate + " " + CompanyHours + ":" + CompanyMinutes;
            }
        } else {
            return CompanyYear + "/" + CompanyMonth + "/" + CompanyDate;
        }
    }
}]);