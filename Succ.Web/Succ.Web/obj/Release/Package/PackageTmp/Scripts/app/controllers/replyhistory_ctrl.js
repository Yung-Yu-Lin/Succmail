SuccApp.controller('ReplyHistory_ctrl', ['$scope', '$sce', '$http', 'ReplyHistory', '$filter', function ($scope, $sce, $http, ReplyHistory, $filter)
{
    ReplyHistory.onOpenReplyHistory($scope, function (para)
    {
        $http({
            method: 'GET',
            url: "/Subject/GetReplyHistoryList/?SubjID=" + para.SubjID + "&ReplyID=" + para.ReplyID
        })
        .success(function (data)
        {
            var HistoryResult = [];
            var HistoryHidden = [];
            //初始不顯示出其他紀錄
            $scope.isOpenResult = false;
            if (data.length <= 2) {
                //未超過兩筆主題紀錄，不出現更多紀錄的按鈕 
                $scope.isOpen = false;
                $scope.ReplyHistoryData = data;
            }
            else {
                //超過兩筆主題紀錄，才出現更多紀錄的按鈕
                $scope.isOpen = true;
                HistoryResult.push(data[0]);
                HistoryResult.push(data[1]);
                //歷史紀錄超過兩筆，只顯示兩筆，其他的比數先進行隱藏
                $scope.ReplyHistoryData = HistoryResult;
                for (var i = 2; i < data.length; i++)
                {
                    HistoryHidden.push(data[i]);
                    $scope.subOtherHis = HistoryHidden;
                }
            }

        })
        .error(function () {
            alert('Reply History Error');
        })
    });

    //轉換回覆紀錄的內容
    $scope.ConvertContent = function (Content)
    {
        return $sce.trustAsHtml(Content);
    }
    //開啟其他回覆紀錄
    $scope.ToggleOpen = function(para)
    {
        $filter('filter')($scope.subOtherHis, { ID: para }, true)[0].isOpen = true;
    }

}]);