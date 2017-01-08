SuccApp.controller('userecord', ['$scope', 'GetBackendData', function ($scope, GetBackendData) {
    $scope.UseRecord = {};
    //預設顯示公司名稱列表
    $scope.UseRecord.CompNameListView = false;
    //預設隱藏公司細節
    $scope.UseRecord.CompDetailView = true;
    //取得factory:GetBackendData http get的資料
       GetBackendData.GetUseRecord()
        .then(function (result) {
            $scope.CompList = result.data;
        });
       $scope.ShowCompDetail = function (CompID) {
           $scope.UseRecord.CompNameListClass = "";
            //隱藏公司名稱
           $scope.UseRecord.CompNameListView = true;
            //顯示公司細節
           $scope.UseRecord.CompDetailView = false;
            $scope.UseRecord.CompDetailClass = "w3-animate-zoom";
            //灌configdiscgrid的值
            $scope.configdiscgrid = {
                //c#controller的路徑
                url: '/Backend/GetDiscCount/?CompID=' + CompID,
                //資料灌的型態採用json
                datatype: "json",
                //欄位名稱
                colNames: ["公司名稱", "討論組數量"],
                //欄位內容
                colModel: [
                    { name: 'Compname', sortable: false, width: '150px', align: 'center' },
                    { name: 'DiscCount', sortable: false, width: '150px', align: 'center' }

                ],
                ntype: 'Get',
                loadonce: true,
                height: 50
            }
            //灌configsubjgrid的值
            $scope.configsubjgrid = {
                //資料型態為json
                datatype: "json",
                //c#controller路徑
                url: '/Backend/GetSubjCount/?CompID=' + CompID,
                //欄位名稱
                colNames: ["近一個月主題數量", "主題總量"],
                //欄位內容
                colModel: [
                    { name: 'Last30SubjCount', width: '150px', align: 'center' },
                    { name: 'SubjCount', width: '150px', align: 'center' }
                ],
                //取資料的方式
                ntype: 'Get',
                loadonce: true,
                height: 50
            }
            //灌configcompusergrid的值
            $scope.configcompusergrid = {
                //資料型態為json
                datatype: "json",
                //c#controller路徑
                url: '/Backend/GetCompUserCount/?CompID=' + CompID,
                //欄位名稱
                colNames: ["近一個月登入成員", "成員總量"],
                //欄位內容
                colModel: [
                      { name: 'Last30CompuserCount', width: '150px', align: 'center' },
                    { name: 'UserCount', width: '150px', align: 'center' }
                ],
                //取資料的方式
                ntype: 'Get',
                loadonce: true,
                height: 50
            }
            //灌configattachgrid的值
            $scope.configattachgrid = {
                //資料型態為json
                datatype: "json",
                //c#controller的路徑
                url: '/Backend/GetAttachCount/?CompID=' + CompID,
                //欄位名稱
                colNames: ["近一個月上傳量(M)", "總上傳量(M)"],
                //欄位內容
                colModel: [
                     { name: 'Last30Att', width: '150px', align: 'center' },
                    { name: 'TotalAttachCount', width: '120px', align: 'center' }
                ],
                //取資料的方式
                ntype: 'Get',
                loadonce: true,
                height: 50
            }
           //灌configattachgrid的值
            $scope.configlast30compusergrid = {
                //資料型態為json
                datatype: "json",
                //c#controller的路徑
                url: '/Backend/GetLast30CompUser/?CompID=' + CompID,
                //欄位名稱
                colNames: ["近一個月登入成員", "最後登入時間","照片"],
                //欄位內容
                colModel: [
                     { name: 'Last30CompUser', width: '150px', align: 'center' },
                    { name: 'LastLoginTime', width: '120px', align: 'center' },
                     { name: 'Last30CompUserPhoto', width: '120px', align: 'center' }
                ],
                //取資料的方式
                ntype: 'Get',
                loadonce: true
            }
        };
       $scope.PrevCompName = function () {
            //顯示公司名稱列表
            $scope.UseRecord.CompNameListView = false;
            //隱藏公司細節
            $scope.UseRecord.CompDetailView = true;
            $scope.UseRecord.CompNameListClass = "w3-animate-zoom";
        };
}]);