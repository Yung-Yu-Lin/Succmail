SuccApp.controller('WebOfficeCtrl', ['$scope', '$routeParams', '$http', function ($scope, $routeParams, $http)
{
    var AttID = $routeParams.AttID;

    $http({
        method: 'get',
        url: '/Attachment/GetWebOfficePath/?AttID=' + AttID
    })
    .success(function (data) {
        var result = data['Url'];
        $("#WebOffice_Container").append("<iframe por='123' id='googleFrame' src='" + result + "' name='iframe_googleDoc' style='width:100%;height:100%;'></iframe>");
    })
    .error(function () {

    });
}]);




//顯示地圖位置
function GetLoginIP(LoginIP) {
    //用ip取得所在國家、經緯度資訊
    $.ajax({
        url: "https://ipinfo.io/" + LoginIP,
        type: 'get',
        success: function (data) {
            var noread = "此IP位置無效";
            //預設讀取不到顯示此IP位置無效
            if (data.city == undefined || data.country == undefined || data.loc == undefined) {
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
            else {
                //顯示國家名稱
                $scope.country = "目前所在國家:" + data.country;
                //經緯度的值
                var temp = data.loc;
                //分割出緯度
                var getlat = temp.split(',')[0];
                //分割成經度
                var getlan = temp.split(',')[1];
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
        }
    });
    //彈出model view
    $("#InfoModal").modal('show');
}