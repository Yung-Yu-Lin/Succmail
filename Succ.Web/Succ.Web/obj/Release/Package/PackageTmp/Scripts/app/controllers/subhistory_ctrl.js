SuccApp.controller('SubHistory_ctrl', ['$scope', '$sce', '$http', 'SubHistory', '$filter', function ($scope, $sce, $http, SubHistory, $filter)
{
    SubHistory.onOpenSubHistory($scope, function (para)
    {
        $http({
            method: 'GET',
            url: "/Subject/GetHistoryList/?SubjectID=" + para.SubID
        })
        .success(function (data)
        {
            var HistoryResult = [];
            var HistoryHidden = [];
            //重置Scope的資料
            $scope.SubHistoryData = [];
            $scope.subOtherHis = [];
            if (data.length <= 2)
            {
                $scope.SubHistoryData = data;
            }

            else
            {
                HistoryResult.push(data[0]);
                HistoryResult.push(data[1]);
                //歷史紀錄超過兩筆，只顯示兩筆，其他的比數先進行隱藏
                $scope.SubHistoryData = HistoryResult;
                for(var i = 2;i<data.length;i++)
                {
                    HistoryHidden.push(data[i]);
                    $scope.subOtherHis = HistoryHidden;
                }
            }
        })
        .error(function () {
            alert("Sub History Fail");
        })
    });

    //轉換主題紀錄的內容
    $scope.ConvertContent = function (Content)
    {
        return $sce.trustAsHtml(Content);
    }

}]);