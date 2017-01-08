SuccApp.controller('FastReplyCtrl', ['$scope', 'FastReplyService', 'SubjectEvent', function ($scope, FastReplyService, SubjectEvent) {
    $scope.FastReply = {};
    $scope.sendFastReply = function (FastReply) {
        var Detail = $scope.data;
        // 收件人陣列
        var receiptsForSend = [];
        angular.forEach(Detail.Receipts, function (value, key) {
            // 除了自己以外其他人都是未讀
            value.UserReadStatus = $scope.$parent.CurrentDetail.UserID == value.UserID ? 1 : 0;
            receiptsForSend.push(value.UserID);
        });
         
        // 快速回覆 Viewmodel 
        $scope.FastReply = {
            SubjId: $scope.$parent.CurrentDetail.SubjID,
            DiscID: $scope.$parent.CurrentDetail.DiscID,
            Receipts: receiptsForSend,
            DiscName: Detail.DiscName,
            CreatedBy: $scope.$parent.CurrentDetail.UserID,
            CreatedName: $scope.$parent.CurrentDetail.UserName,
            CompanyID: $scope.$parent.CurrentDetail.CompID,
            Content: $scope.FastReply.Content,
            ReplyCreateOn: '',
            ReplyCreator: '',
            ReplyToName: ''
        };

        FastReplyService.setFastReply($scope.FastReply);
        $scope.FastReply = FastReplyService.getFastReply();
        var fastReplyPromise = FastReplyService.createFastReply($scope.FastReply);
        fastReplyPromise.success(function (payload) {
            if (payload.IsSuccessful == true) {
                //用新增主題回覆的ReplyTO等於主題的ReplyID濾出該篇的回覆
                var FilterReplyLevel2 = $filter('filter')($scope.ReplyList, { ID: payload.DataObj.ReplyTO });
                //把該篇回覆創立者的值塞給ReplyCreator
                FilterReplyLevel2[0].ReplyCreator = FilterReplyLevel2[0].CreatorName;
                //把該篇回覆時間的值塞給ReplyCreateOn
                FilterReplyLevel2[0].ReplyCreateOn = FilterReplyLevel2[0].CreateOn;
                // 接收回傳的物件並顯示在頁面上
                $scope.FastReply.ReplyCreateOn = FilterReplyLevel2[0].ReplyCreateOn;
                $scope.FastReply.ReplyCreator = FilterReplyLevel2[0].ReplyCreator;
                $scope.FastReply.CreateOn = payload.DataObj.CreateOn;
                $scope.FastReply.IsAdmin = payload.DataObj.IsAdmin;
                $scope.FastReply.IsBoss = payload.DataObj.IsBoss;
                $scope.FastReply.ID = payload.DataObj.ReplyID;
                $scope.FastReply.Receipts = Detail.Receipts;
                //如果ReplyTo不等於空
                if (payload.DataObj.ReplyTO != ReplyTo.Empty)
                {
                    FastReply.ReplyToName = true;
                }
                // 廣播回覆新增成功事件
                $scope.$emit(SubjectEvent.ReplyInserted, $scope.FastReply);
            } else {
                alert("reply error!!");
            }
        })
        .error(function (error) {
            //alert('server Error');
        });
    };
}]);