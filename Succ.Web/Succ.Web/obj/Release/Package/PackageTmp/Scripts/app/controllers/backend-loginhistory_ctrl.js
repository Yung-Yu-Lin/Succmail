SuccApp.controller('History', ['$scope', '$filter', 'GetBackendData', function ($scope, $filter, GetBackendData) {
    $scope.city = "";
    $scope.country = "";
    // #region 參數區域
    var _CompID = $scope.$parent.$parent.$parent.$parent.CurrentCompany['CompanyID'];
    var _UserID = $scope.$parent.$parent.$parent.$parent.IndexData.CurrentUser['UserID'];
    $scope.HistoryManage = {};
    $scope.HistoryManage.CompID = _CompID;
    $scope.HistoryManage.UserID = _UserID;
    $scope.HistoryManage.HistoryConfig = {};
    // 預設不顯示過濾的下拉選單
    $scope.HistoryManage.IsShowFilter = false;
    // 預設過濾的開始日期
    $scope.HistoryManage.StartDate = "";
    // 預設過濾的結束日期
    $scope.HistoryManage.EndDate = "";
    // 預設過濾的人員
    $scope.HistoryManage.FilterUser = {};
    // 過濾人員的資料集
    $scope.HistoryManage.MemberList = [];
    // 顯示過濾人員的輔助樣式
    $scope.HistoryManage.FilterStyle = { 'display': 'none' };
    // 過濾按鈕樣式
    $scope.HistoryManage.IsClickFilter = false;
    // #endregion
    GetHistoryList();
    GetFilterMember();
    // #region 設定登入紀錄Config
    function GetHistoryList() {
        var ParentWidth = $("#LoginList").width();
        $scope.HistoryManage.HistoryConfig = {
            url: 'Backend/LoginHistoryList/?CompanyID=' + _CompID,
            datatype: 'json',
            colNames: [$filter('translate')('LoginTime'), $filter('translate')('UserName'), $filter('translate')('LoginIP'), $filter('translate')('Browser'), $filter('translate')('Type')],
            colModel: [
                { name: 'LoginTime', width: ParentWidth * 0.19, sortable: false, stype: 'text', align: 'center' },
                { name: 'UserName', width: ParentWidth * 0.19, sortable: false, stype: 'text', align: 'center' },
                { name: 'LoginIP', width: ParentWidth * 0.19, sortable: false, stype: 'text', align: 'center' },
                { name: 'Browser', width: ParentWidth * 0.19, sortable: false, stype: 'text', align: 'center' },
                { name: 'LoginType', width: ParentWidth * 0.19, sortable: false, stype: 'text', align: 'center' }
            ],
            rowNum: 10,
            ntype: 'Get',
            loadonce: true,
            rowList: [10, 20],
            pager: '#pager',
            sortorder: 'desc',
            shrinkToFit: false,
            height: '100%',
            scrollOffset: 0,
            onSelectRow: function(rowid,status,a,e)
            {
                //點選jqgrid欄位時抓LoginIP
                var LoginIP = $("#HistoryGrid").jqGrid('getCell', rowid, 'LoginIP');
                GetLoginIP(LoginIP);
              
            }
        }
    };
    //顯示地圖位置
    function GetLoginIP(LoginIP) {
        //http://ipinfo.io/8.8.8.8
        //https://freegeoip.net/json/
        //http://whatismyipaddress.com/ip/
        //http://www.telize.com/geoip/
        //http://ip-api.com/json/
        //http://www.infobyip.com/ip-14.183.202.235.html
        //http://www.iptrackeronline.com/?ip_address=
        //http://ip-json.rhcloud.com/json/
        //用ip取得所在國家、經緯度資訊
        $.getJSON('https://ip.nf/'+ LoginIP + '.json', function (data) {
            var noread = $filter('translate')('IpAddress');
            //預設讀取不到顯示此IP位置無效
            if (data.ip.latitude == 0)
            {
                $scope.country = noread;
                $scope.$apply();
                //Geolocation API，是透過 navigator.geolocation 物件所發佈
                //判斷地理位置定位 (Geolocation) 物件是否存在
                if (navigator.geolocation) {
                    //呼叫getCurrentPosition() 函式取得使用者目前的位置
                    navigator.geolocation.getCurrentPosition(showPosition);
                }
                function showPosition(position) {
                    //抓現在所在緯度
                    lat = getlat;
                    //抓現在所在經度
                    lon = getlan;
                    //座標
                    latlon = new google.maps.LatLng(lat, lon)
                    //抓id為mapposition的dom
                    mapposition = document.getElementById("mapposition")
                    //設定高度
                    mapposition.style.height = '200px';
                    //設定寬度
                    mapposition.style.width = '380px';
                    var myOptions = {
                        //中心點位置
                        center: latlon,
                        //地圖縮放級別
                        zoom: 14,
                    };
                    //建立地圖，傳入id為mapposition 的 dom 與 options
                    var map = new google.maps.Map(document.getElementById("mapposition"), myOptions);
                    //建立地圖標記
                    var marker = new google.maps.Marker({ position: latlon, map: map });
                }
            }
            else
            {
                //顯示國家名稱
                $scope.country = $filter('translate')('IpCountry') + data.ip.country;
                //經緯度的值
                //var temp = data.loc;
                //分割出緯度
                var getlat = data.ip.latitude;
                //分割成經度
                var getlan = data.ip.longitude;
                $scope.$apply();
                //Geolocation API，是透過 navigator.geolocation 物件所發佈
                //判斷地理位置定位 (Geolocation) 物件是否存在
                if (navigator.geolocation) {
                    //呼叫getCurrentPosition() 函式取得使用者目前的位置
                    navigator.geolocation.getCurrentPosition(showPosition);
                }
                function showPosition(position) {
                    //抓現在所在緯度
                    lat = getlat;
                    //抓現在所在經度
                    lon = getlan;
                    //座標
                    latlon = new google.maps.LatLng(lat, lon)
                    //抓id為mapposition的dom
                    mapposition = document.getElementById("mapposition")
                    //設定高度
                    mapposition.style.height = '200px';
                    //設定寬度
                    mapposition.style.width = '380px';
                    var myOptions = {
                        //中心點位置
                        center: latlon,
                        //地圖縮放級別
                        zoom: 14,
                    };
                    //建立地圖，傳入id為mapposition 的 dom 與 options
                    var map = new google.maps.Map(document.getElementById("mapposition"), myOptions);
                    //建立地圖標記
                    var marker = new google.maps.Marker({ position: latlon, map: map });
                }
            }
        })
        //彈出model view
        $("#InfoModal").modal('show');
    }
    $scope.Close = function () {
        //隱藏model view
        $("#InfoModal").modal('hide');
    };
    // #endregion
    // #region 拿取人員清單
    function GetFilterMember() {
        GetBackendData.GetFilterMember(_CompID)
            .then(function (result) {
                $scope.HistoryManage.MemberList = result.data;
            });
    };
    // #endregion
    // #region 觸發下拉過濾選單
    $scope.DropDownFilter = function () {
        $scope.HistoryManage.IsClickFilter = !$scope.HistoryManage.IsClickFilter;
        $scope.HistoryManage.IsShowFilter = !$scope.HistoryManage.IsShowFilter;
        if($scope.HistoryManage.IsShowFilter)
        {
            $scope.HistoryManage.FilterStyle = { 'display': 'block' };
        }
        else
        {
            $scope.HistoryManage.FilterStyle = { 'display': 'none' };
        }
    };
    // #endregion
    // #region html5日期檢視
    if (!Modernizr.inputtypes.date) {
        $('input[type=date]').datepicker({
            dateFormat: 'yy-mm-dd'
        });
    };
    // #endregion
    // #region 過濾開始日期有變動
    $scope.$watch('HistoryManage.StartDate', function (newValue, oldValue) {
        if(newValue.length > 0)
        {
            ReloadGrid();
        }
    });
    // #endregion
    // #region 過濾結束日期有變動
    $scope.$watch('HistoryManage.EndDate', function (newValue, oldValue) {
        if (newValue.length > 0)
        {
            ReloadGrid();
        }
    });
    // #endregion
    // #region 過濾人員有變動
    $scope.$watch('HistoryManage.FilterUser', function (newValue, oldValue) {
        var _IsChooseUser = newValue.hasOwnProperty('UserName') == true ? true : false;
        if(_IsChooseUser)
        {
            ReloadGrid();
        }
    });
    // #endregion
    // #region 共用Grid重刷方法
    function ReloadGrid() {
        var _FilterUser = $scope.HistoryManage.FilterUser.hasOwnProperty('UserName') == true ? $scope.HistoryManage.FilterUser.UserId : "";
        var allParameters = angular.element("#HistoryGrid").jqGrid("getGridParam");
        var _url = "Backend/LoginHistoryList/?CompanyID=" + _CompID + "&UserID=" + _FilterUser + "&sDate=" + $scope.HistoryManage.StartDate + "&eDate=" + $scope.HistoryManage.EndDate;
        allParameters.datatype = 'json';
        allParameters.url = _url;
        angular.element("#HistoryGrid").setGridParam({ datatype: 'json' }).trigger('reloadGrid');
    };
    // #endregion
    // #region 無任何過濾條件下，控制Label
    $scope.NoFilter = function () {
        var _SDate = $scope.HistoryManage.StartDate.length <= 0;
        var _EDate = $scope.HistoryManage.EndDate.length <= 0;
        var _FilterUser = $scope.HistoryManage.FilterUser.hasOwnProperty('UserName') == true ? false : true;
        if(_SDate && _EDate && _FilterUser)
        {
            return true;
        }
        else
        {
            return false;
        }
    };
    // #endregion
    // #region 有過濾開始日期，控制Label
    $scope.SDateFilter = function () {
        var _SDate = $scope.HistoryManage.StartDate.length > 0;
        if(_SDate)
        {
            return true;
        }
        else
        {
            return false;
        }
    };
    // #endregion
    // #region 有過濾結束日期，控制Label
    $scope.EDateFilter = function () {
        var _EDate = $scope.HistoryManage.EndDate.length > 0;
        if (_EDate) {
            return true;
        }
        else {
            return false;
        }
    };
    // #endregion
    // #region 有過濾人員，控制Label(考RD08)
    $scope.UserFilter = function () {
        var _FilterUser = $scope.HistoryManage.FilterUser.hasOwnProperty('UserName') == true ? true : false;
        if(_FilterUser)
        {
            return true;
        }
        else
        {
            return false;
        }
    };
    // #endregion
    // #region 移除開始日期過濾
    $scope.RemoveSDate = function () {
        $scope.HistoryManage.StartDate = "";
        ReloadGrid();
    };
    // #endregion
    // #region 移除結束日期過濾
    $scope.RemoveEDate = function () {
        $scope.HistoryManage.EndDate = "";
        ReloadGrid();
    };
    // #endregion
    // #region 移除人員過濾
    $scope.RemoveUser = function () {
        $scope.HistoryManage.FilterUser = {};
        ReloadGrid();
    };
    // #endregion
    // #region DropDopwn 類別的決定
    $scope.DropDownClass = function () {
        if($scope.HistoryManage.IsClickFilter)
        {
            return "w3-btn w3-padding w3-light-grey dropup";
        }
        else
        {
            return "w3-btn w3-padding w3-light-grey";
        }
    };
    // #endregion
}]);