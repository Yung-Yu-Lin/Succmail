SuccApp.controller('MyDraftCtrl', ['$scope', '$http', 'getdraft', 'RightSide', 'DiscType', '$filter', '$q', 'SubDetail', function ($scope, $http, getdraft, RightSide, DiscType, $filter, $q, SubDetail) {
    // #region 參數
    //預設左邊選單會顯示
    $scope.$parent.$parent.ShowLeftMenu = true;
    //UserID
    var userID = $scope.IndexData.CurrentUser.UserID;
    //CompanyID
    var CompID = $scope.IndexData.CurrentUser.CompID;
    //UserName
    var UserName = $scope.IndexData.CurrentUser.UserName;
    // #endregion
    //呼叫拿取草稿訊息主題列表
    GetDraftList();

    getdraft.onGetDraftList($scope, function () {
        GetDraftList();
    });

    // #region 拿取草稿訊息主題列表
    function GetDraftList() {
        $http({
            method: 'get',
            url: '/Subject/GetMyDraft/?UserID=' + userID + '&CompanyID=' + CompID
        })
        .success(function (data) {
            $scope.draftdata = data;
        })
        .error(function () {
            alert("Draft Data Error");
        });
    };
    // #endregion
    // #region 開啟草稿繼續編輯
    $scope.ShowSubject = function (DraftId, SubjState) {
        switch(SubjState)
        {
            case 0:
                //新增主題
                OpenNewSubjDraft(DraftId);
                break;
            case 1:
                //主題編輯
                ShowDraftSubj(DraftId);
                break;
            case 2:
                //新增回覆
                ShowNewReplyDraft(DraftId);
                break;
            case 3:
                //回覆編輯
                ShowEditReplyDraft(DraftId);
                break;
        }
    };
    // #endregion
    // #region 主題草稿屬於新增主題的部分
    function OpenNewSubjDraft(DraftID)
    {
        //利用DraftID拿取DraftObj
        getdraft.ReEditDraft(DraftID)
        .then(function (result)
        {
            var DraftData = result.data;
            //設定CurrentDiscussion
            $scope.$parent.$parent.CurrentDiscussion['discID'] = DraftData.DiscID;
            $scope.$parent.$parent.CurrentDiscussion['discName'] = DraftData.DiscName;
            //設定nowCreateMsgDiscID
            $scope.$parent.$parent.nowCreateMsgDiscId = DraftData.DiscID;
            //設定nowCreateMsgDiscType
            $scope.$parent.$parent.nowCreateMsgDiscType = DraftData.DiscType;
            //設定新訊息的URL
            // 為了讓angular 快取失效所以弄了一個隨機數讓網址不同
            var ranNum = new Date().getMilliseconds();
            switch (DraftData.DiscType)
            {
                case DiscType.Normal:
                    $scope.$parent.$parent.createMsgUrl = '/subject/create?i=' + ranNum;
                    break;
                case DiscType.ApplyMoney:
                    //款項請領
                    $scope.$parent.$parent.createMsgUrl = '/applymoney/create?i=' + ranNum;
                    break;
                case DiscType.Purchasing:
                    //採購
                    $scope.$parent.$parent.createMsgUrl = '/purchase/create?i=' + ranNum;
                    break;
                case DiscType.PersonLeave:
                    //請假
                    $scope.$parent.$parent.createMsgUrl = '/personleave/create?i=' + ranNum;
                    break;
                case DiscType.GoOut:
                    //外出
                    $scope.$parent.$parent.createMsgUrl = '/goout/create?i=' + ranNum;
                    break;
                case DiscType.Overtime:
                    //加班
                    $scope.$parent.$parent.createMsgUrl = '/overtime/create?i=' + ranNum;
                    break;
            }
            $scope.$parent.$parent.ReEditNewSubjDraft = DraftData;
            //開啟新訊息的Template
            RightSide.OpenNewMsg();
        });
    }
    // #endregion
    // #region 刪除草稿
    $scope.DeleteDraft = function (DraftID, DiscID)
    {
        getdraft.DelDraft(DraftID)
        .then(function (result) {
            if (result.data == "0")
            {
                var DiscItem = $filter('filter')($scope.draftdata, { DiscID: DiscID }, true)[0];
                var DraftItem = $filter('filter')(DiscItem.SubjectList, { DraftId: DraftID }, true)[0];
                var DraftIndex = DiscItem.SubjectList.indexOf(DraftItem);
                if (DraftIndex > -1)
                {
                    DiscItem.SubjectList.splice(DraftIndex, 1);
                };
            };
        });
    };
    // #endregion
    // #region 主題草稿屬於編輯主題的部分
    function ShowDraftSubj(DraftID)
    {
        getdraft.ReEditDraft(DraftID)
        .then(function (result) {
            var DraftData = result.data;
            $scope.$parent.$parent.ReEditNewSubjDraft = DraftData;
            var ShowSubjTemplate = function () {
                var q = $q.defer();
                q.resolve(SubDetail.OpenSubDetail(DraftData['DiscID'], DraftData['CompID'], userID, DraftData['SubjId'], UserName, 8));
                return q.promise;
            };
            // 設定目前所在的討論組
            $scope.$parent.$parent.CurrentDiscussion['discID'] = DraftData.DiscID;
            $scope.$parent.$parent.CurrentDiscussion['discName'] = DraftData.DiscName;
            if ($scope.$parent.$parent.detailMsgUrl == '')
            {
                $scope.$parent.$parent.detailMsgUrl = '/Subject/SubDetailTemplate';
            }
            else
            {
                RightSide.ShowSubject();
            }
            $scope.promise = ShowSubjTemplate();
            $scope.promise
            .then(function () {
                //傳送參數至SubDetail Factory
                return RightSide.ShowSubject();
            });
        });

    };
    // #endregion
    // #region 主題草稿屬於新增回覆的部分
    function ShowNewReplyDraft(DraftID)
    {
        getdraft.ReEditDraft(DraftID)
        .then(function (result) {
            var DraftData = result.data;
            $scope.$parent.$parent.ReEditReplyDraft = DraftData;
            var ShowSubjTemplate = function () {
                var q = $q.defer();
                q.resolve(SubDetail.OpenSubDetail(DraftData['DiscID'], DraftData['CompID'], userID, DraftData['SubjId'], UserName, 8));
                return q.promise;
            };
            // 設定目前所在的討論組
            $scope.$parent.$parent.CurrentDiscussion['discID'] = DraftData.DiscID;
            $scope.$parent.$parent.CurrentDiscussion['discName'] = DraftData.DiscName;
            if ($scope.$parent.$parent.detailMsgUrl == '')
            {
                $scope.$parent.$parent.detailMsgUrl = '/Subject/SubDetailTemplate';
            }
            else
            {
                RightSide.ShowSubject();
            }
            $scope.promise = ShowSubjTemplate();
            $scope.promise
            .then(function () {
                //傳送參數至SubDetail Factory
                return RightSide.ShowSubject();
            });
        });
    };
    // #endregion
    // #region 主題屬於編輯回覆的部分
    function ShowEditReplyDraft(DraftID)
    {
        getdraft.ReEditDraft(DraftID)
        .then(function (result) {
            var DraftData = result.data;
            $scope.$parent.$parent.ReEditReplyDraft = DraftData;
            var ShowSubjTemplate = function () {
                var q = $q.defer();
                q.resolve(SubDetail.OpenSubDetail(DraftData['DiscID'], DraftData['CompID'], userID, DraftData['SubjId'], UserName, 8));
                return q.promise;
            };
            // 設定目前所在的討論組
            $scope.$parent.$parent.CurrentDiscussion['discID'] = DraftData.DiscID;
            $scope.$parent.$parent.CurrentDiscussion['discName'] = DraftData.DiscName;
            if ($scope.$parent.$parent.detailMsgUrl == '') {
                $scope.$parent.$parent.detailMsgUrl = '/Subject/SubDetailTemplate';
            }
            else {
                RightSide.ShowSubject();
            }
            $scope.promise = ShowSubjTemplate();
            $scope.promise
            .then(function () {
                //傳送參數至SubDetail Factory
                return RightSide.ShowSubject();
            });
        });
    }
    // #endregion
    // #region 新增完從草稿開啟的主題或回覆之後的事件
    $scope.$on('DraftToCreate', function (event, args) {
        var DiscID = args['DiscID'];
        var DraftID = args['DraftId'];
        var DraftDisc = $filter('filter')($scope.draftdata, { DiscID: DiscID }, true)[0];
        var DraftItem = $filter('filter')(DraftDisc.SubjectList, { DraftId: DraftID }, true);
        var DraftIndex = DraftDisc.SubjectList.indexOf(DraftItem[0]);
        if(DraftIndex > -1)
        {
            DraftDisc.SubjectList.splice(DraftIndex, 1);
        }
    });
    // #endregion
}]);
