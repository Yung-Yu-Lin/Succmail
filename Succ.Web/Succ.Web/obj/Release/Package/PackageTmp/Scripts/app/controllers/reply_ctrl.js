SuccApp.controller('ReplyCtrl', ['$scope', 'FileUploader', '$log', 'AttatchService', 'ImageService', 'filterFilter', '$filter', '$rootScope', 'DiscType', 'SubjectColor', '$timeout', 'SubjectEvent', 'Draft', '$interval', 'ReplyService', 'ReceiptsService', 'EditorPara', 'AddNewDraftService', '$sce', function ($scope, FileUploader, $log, AttatchService, ImageService, filterFilter, $filter, $rootScope, DiscType, SubjectColor, $timeout, SubjectEvent, Draft, $interval, ReplyService, ReceiptsService, EditorPara, AddNewDraftService,$sce)
{
    // #region 設定自動儲存回覆
    //SettingDraft();
    // #endregion
    // #region 參數設定
    $scope.EditReceiver = {};
    $scope.tReceipts = null;
    $scope.tDepartments = null;
    $scope.EditReceiver.tSelectedReceipts = [];
    //抵達$scope.data的$scope 
    var ThisScope = $scope.$parent.$parent.$parent;
    if (ThisScope.data == undefined)
    {
        ThisScope = $scope.$parent.$parent;
    }
    // 放置儲存一級回覆的物件
    $scope.ReplyDraftObj = {};
    // #endregion
    // 判斷是否使用詳細頁封閉區間
    InitCurrentDetail();
    // #region 編輯器的物件viewmodel
    $scope.EditorObj = {
        CompanyID: $scope.CurrentDetail.CompID,
        DiscussionID: $scope.CurrentDetail.DiscID,
        UserID: $scope.CurrentDetail.UserID,
        UserName: $scope.CurrentDetail.UserName,
        PlanCloseOn: 0,
        editorType: 'ReplySubj',
        tContent: $sce.getTrustedHtml('<p><br></p>'),
        attatchs: [],
        receipts: [],
        loading: false,
        loadingText: ''
    };
    // #endregion
    // #region 回覆的ViewModel
    $scope.ReplyMessage = {
        SubjId: ThisScope.CurrentDetail.SubjID,
        DiscID: ThisScope.$parent.CurrentDetail.DiscID,
        Receipts: [],
        Content: '',
        Attatchs: [],
        DiscName: ThisScope.$parent.CurrentDiscussion.discName,
        CreatedBy: ThisScope.$parent.CurrentDetail.UserID,
        CreatedName: ThisScope.$parent.CurrentDetail.UserName,
        CompanyID: ThisScope.$parent.CurrentDetail.CompID,
        CreateOn: '',
        ReplyCreateOn: '',
        ReplyCreator: '',
        IsAdmin: false,
        IsBoss: false,
        ID: '',
        isDraft: 0,
        ReplyID: null
    };
    // #endregion
    // #region 新增回覆是從草稿進入的
    var ReEditDraftObj = $scope.$parent.$parent.$parent.$parent['ReEditReplyDraft'];
    console.log(ReEditDraftObj);
    if (Object.getOwnPropertyNames(ReEditDraftObj).length > 0)
    {
        //清空物件
        $scope.$parent.$parent.$parent.$parent['ReEditReplyDraft'] = {};
        $scope.EditorObj['tContent'] = ReEditDraftObj['sContent'];
        $scope.EditorObj['attatchs'] = ReEditDraftObj['Attatchs'];
        $scope.EditorObj['isDraft'] = 1;
        $scope.ReplyDraftObj['ReplyID'] = ReEditDraftObj['ReplyId'];
    }
    // #endregion
    // #region 收件人Data
    ReceiptsService.callReceipts($scope.EditorObj.DiscussionID, $scope.EditorObj.UserID)
    .then(function (data) {
        // 部門
        $scope.tDepartments = data.departments;
        // 收件人
        $scope.tReceipts = data.receipts;
        // 已選擇的收件人
        $scope.EditReceiver.tSelectedReceipts = data.selectReceipts;
        // 先拉主題收件人的ID出來製成陣列
        var subjReadIDArr = [];
        angular.forEach($scope.data.Receipts, function (value, key) {
            subjReadIDArr.push(value.UserID);
        });
        //如果回覆是從草稿過來的
        if (Object.getOwnPropertyNames(ReEditDraftObj).length > 0)
        {
            //開啟回覆如果是從草稿進入，不去考慮到主題的原始收件人
            subjReadIDArr = [];
            angular.forEach(ReEditDraftObj['Receipts'], function (value, key) {
                var DraftIndex = subjReadIDArr.indexOf(value);
                if(DraftIndex == -1)
                {
                    subjReadIDArr.push(value);
                }
            });
        }
        var unSelectReceipts = filterFilter($scope.tReceipts, { selected: false });
        // 跑未選取的收件人迴圈
        angular.forEach(unSelectReceipts, function (value, key) {
            // 如果未選取的收件人ID在主題收件人的ID陣列裡面則插入到已選擇的收件人陣列
            var index = subjReadIDArr.indexOf(value.UserId);
            if (index > -1) {
                value.selected = true;
                $scope.EditReceiver.tSelectedReceipts.push(value);
            }
        });
    }, function (data) {
    });
    // #endregion
    // #region 下拉選單收件人的樣板
    $scope.tTemplates = EditorPara.ReceiptHtml;
    // #endregion
    // #region 選擇的收件人發生變化時同步更新
    $scope.$watch('tReceipts', function (newValue, oldValue, scope) {
        if (!angular.equals(newValue, oldValue)) {
            $scope.EditReceiver.tSelectedReceipts = filterFilter($scope.tReceipts, { selected: true });
        }
    }, true);
    // #endregion
    // #region 選擇的收件人發生變化時同步更新
    $scope.$watch('EditReceiver.tSelectedReceipts', function (newValue, oldValue, scope) {
        angular.forEach(scope.tReceipts, function (item) {
            item.selected = false;
        });
        angular.forEach(newValue, function (item) {
            item.selected = true;
        });
    });
    // #endregion
    // #region 接收儲存草稿的廣播
    $scope.$on('tSaveReplyDraft', function (event, data)
    {
        //如果需要限制討論組類型的回覆，可使用。 By Gary
        var CurrentDiscType = ThisScope.data['DiscType'];
        tSaveDraft();
    });
    // #endregion
    // #region 草稿
    var tSaveDraft = function ()
    {
        // 送出的收件人陣列
        var receiptsForSend = [];
        // 顯示用的收件人陣列
        var receiptsForBack = [];
        // 填充收件人
        angular.forEach($scope.EditorObj.receipts, function (value, key) {
            receiptsForSend.push(value.UserId);
            receiptsForBack.push(
            {
                UserID: value.UserId,
                UserName: value.UserName,
                UserReadStatus: $scope.ReplyMessage.CreatedBy == value.UserId ? 1 : 0,
                UserReadTime: ''
            });
        });
        var now = new Date();
        $scope.tDraftMessage = $filter('translate')('On') + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + $filter('translate')('Save_Draft');

        // 草稿訊息物件viewmodel
        $scope.tDraftViewModel = {
            DiscID: $scope.CurrentDiscussion.discID,
            CreatedBy: $scope.CurrentDetail.UserID,
            CreatedName: $scope.CurrentDetail.UserName,
            CompanyID: $scope.CurrentDetail.CompID,
            Receipts: receiptsForSend,
            Content: $scope.EditorObj.tContent,
            Attatchs: $scope.EditorObj.attatchs,
            DiscName: $scope.CurrentDiscussion.discName,
            isDraft: 1,
            SubjId: $scope.$parent.$parent.$parent.CurrentSubjID,
            CurrentUser: $scope.CurrentDetail.UserID,
            ReplyID: Object.getOwnPropertyNames($scope.ReplyDraftObj).length > 0 ? $scope.ReplyDraftObj['ReplyID'] : null
        };
        
        //新增回覆草稿
        AddNewDraftService.saveReply($scope.tDraftViewModel)
        .success(function (response) {
            if(response.IsSuccessful == true)
            {
                $scope.ReplyDraftObj = response.DataObj;
            }
        });

    };
    // #endregion
    // #region 自動儲存回覆
    function SettingDraft()
    {  
        $scope.ReplyIntervalPromise = $interval(function () {
            tSaveDraft();
        }, Draft.Timeout);
    }
    // #endregion
    // #region 儲存回覆
    $scope.$on('saveEditor', function (event, data)
    {
        // 送出的收件人陣列
        var receiptsForSend = [];
        // 顯示用的收件人陣列
        var receiptsForBack = [];
        angular.forEach($scope.EditorObj.receipts, function (value, key) {
            receiptsForSend.push(value.UserId);
            receiptsForBack.push(
            {
                UserID: value.UserId,
                UserName: value.UserName,
                UserReadStatus: $scope.ReplyMessage.CreatedBy == value.UserId ? 1 : 0,
                UserReadTime: ''
            });
        });
        $scope.ReplyMessage.Receipts = receiptsForSend;
        $scope.ReplyMessage.Content = $scope.EditorObj.tContent;
        $scope.ReplyMessage.Attatchs = $scope.EditorObj.attatchs;
        $scope.ReplyMessage.ReplyID = Object.getOwnPropertyNames($scope.ReplyDraftObj).length > 0 ? $scope.ReplyDraftObj['ReplyID'] : null;
        var replyPromise = ReplyService.create($scope.ReplyMessage);
        replyPromise.success(function (payload) {
            if (payload.IsSuccessful == true)
            {
                // 廣播關閉編輯器事件由SubjectDetailCtrl監聽
                $scope.$emit('closeEditor', { editorType: $scope.EditorObj.editorType });
                // 接收回傳的物件並顯示在頁面上
                $scope.ReplyMessage.Attatchs = filterFilter($scope.EditorObj.attatchs, { isDel: false,isEmbed:false });
                $scope.ReplyMessage.CreateOn = payload.DataObj.CreateOn;
                $scope.ReplyMessage.IsAdmin = payload.DataObj.IsAdmin;
                $scope.ReplyMessage.IsBoss = payload.DataObj.IsBoss;
                $scope.ReplyMessage.ID = payload.DataObj.ReplyID;
                $scope.ReplyMessage.Receipts = receiptsForBack;
                // 廣播回覆新增成功事件 由SubjDetailCtrl 及CompanymessageCtrl監聽
                $rootScope.$broadcast(SubjectEvent.ReplyInserted, $scope.ReplyMessage);
                // 給草稿個通知
                if (Object.getOwnPropertyNames(ReEditDraftObj).length > 0)
                {
                    $rootScope.$broadcast('DraftToCreate', ReEditDraftObj);
                };
            }
            else{} 
        })
        .error(function (error) {
            //alert('server Error');
        });
    });
    // #endregion
    // #region 接收關閉回覆視窗廣播
    $scope.$on('closeEditor', function (event, data)
    {
        $interval.cancel($scope.ReplyIntervalPromise);
    });
    // #endregion
    // #region 因為建立起開啟主題詳細頁需要封閉空間，但是如果對方是直接開啟獨立詳細頁，區間並沒有建立，這種情況下，直接拿取CurrentUser的資料
    function InitCurrentDetail() {
        if (Object.getOwnPropertyNames($scope.CurrentDetail).length === 0) {
            $scope.CurrentDetail.SubjID = $scope.CurrentSpage.SubjID;
            $scope.CurrentDetail.CompID = $scope.CurrentSpage.CompID;
            $scope.CurrentDetail.UserID = $scope.IndexData.CurrentUser.UserID;
            $scope.CurrentDetail.DiscID = $scope.CurrentDiscussion.discID;
            $scope.CurrentDetail.UserName = $scope.IndexData.CurrentUser.UserName;
        }
        console.log($scope.CurrentDetail);
    };
    // #endregion
}]);