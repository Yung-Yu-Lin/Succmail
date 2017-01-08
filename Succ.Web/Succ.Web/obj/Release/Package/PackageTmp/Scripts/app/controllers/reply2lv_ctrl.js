SuccApp.controller('Reply2lvCtrl', ['$scope', 'FileUploader', '$log', 'AttatchService', 'ImageService', 'filterFilter', '$filter', '$rootScope', 'DiscType', 'SubjectColor', '$timeout', 'SubjectEvent', 'Draft', '$interval', 'ReplyService', 'ReceiptsService', 'EditorPara', 'AddNewDraftService', function ($scope, FileUploader, $log, AttatchService, ImageService, filterFilter, $filter, $rootScope, DiscType, SubjectColor, $timeout, SubjectEvent, Draft, $interval, ReplyService, ReceiptsService, EditorPara, AddNewDraftService) {
    // #region IndexData 所屬Scope
    var ThisScope = $scope.$parent.$parent.$parent.$parent.$parent;
    // #endregion
    // #region 收件人物件初始化
    $scope.EditReceiver = {};
    $scope.tReceipts = null;
    $scope.tDepartments = null;
    $scope.EditReceiver.tSelectedReceipts = [];
    // 放置儲存二級回覆的物件
    $scope.ReplyLv2DraftObj = {};
    // #endregion
    // 判斷是否使用詳細頁封閉區間
    InitCurrentDetail();
    // #region 編輯器的物件viewmodel
    $scope.EditorObj = {
        CompanyID: ThisScope.CurrentDetail.CompID,
        DiscussionID: ThisScope.CurrentDetail.DiscID,
        UserID: ThisScope.CurrentDetail.UserID,
        UserName: ThisScope.CurrentDetail.UserName,
        PlanCloseOn: 0,
        editorType: 'Reply2lv',
        tContent: '',
        attatchs: [],
        receipts: [],
        loading: false,
        loadingText: ''
    };
    // #endregion
    // #region 送出回覆的viewmodel
    $scope.ReplyMessage = {
        SubjId: $scope.data.ID,
        DiscID: $scope.CurrentDetail.DiscID,
        Receipts: [],
        Content: '',
        Attatchs: [],
        DiscName: $scope.CurrentDiscussion.discName,
        CreatedBy: $scope.CurrentDetail.UserID,
        CreatedName: $scope.CurrentDetail.UserName,
        CompanyID: $scope.CurrentDetail.CompID,
        CreateOn: '',
        //回覆該篇主題的時間
        ReplyCreateOn: '',
        //回覆該篇主題創立者
        ReplyCreator: '',
        IsAdmin: false,
        IsBoss: false,
        ID: '',
        ReplyTo: $scope.reply2lv,
        ReplyToName: $scope.reply2lv,
        isDraft: 0,
        CurrentUser: $scope.CurrentDetail.UserID,
        ReplyID: null
    };
    // #endregion
    // #region 收件人
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
        var CurrentReplyTo = filterFilter($scope.ReplyList, { ID: $scope.$parent.reply2lv })[0];
        angular.forEach(CurrentReplyTo.Receipts, function (value, key) {
            subjReadIDArr.push(value.UserID);
        });
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
    // #region 草稿
    var tSaveDraft = function ()
    {
        // 送出的收件人陣列
        var receiptsForSend = [];
        // 顯示用的收件人陣列
        var receiptsForBack = [];
        // 收件人viewmodel
        var receiptObj = {
            UserID: "",
            UserName: "",
            UserReadStatus: 0,
            UserReadTime: ""
        };
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
        $scope.ReplyMessage.isDraft = 1;
        $scope.ReplyMessage.ReplyID = Object.getOwnPropertyNames($scope.ReplyLv2DraftObj).length > 0 ? $scope.ReplyLv2DraftObj['ReplyID'] : null;
        var now = new Date();
        $scope.tDraftMessage = $filter('translate')('On') + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + $filter('translate')('Save_Draft');

        AddNewDraftService.saveReply($scope.ReplyMessage)
        .success(function (response) {
            if (response.IsSuccessful == true)
            {
                $scope.ReplyLv2DraftObj = response.DataObj;
            }
        });

    };
    // #endregion
    // #region 偵測到儲存回覆的事件
    $scope.$on('saveEditor', function (event, data)
    {
        // 送出的收件人陣列
        var receiptsForSend = [];
        // 顯示用的收件人陣列
        var receiptsForBack = [];
        // 收件人viewmodel
        var receiptObj = {
            UserID: "",
            UserName: "",
            UserReadStatus: 0,
            UserReadTime: ""
        };
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
        $scope.ReplyMessage.ReplyID = Object.getOwnPropertyNames($scope.ReplyLv2DraftObj).length > 0 ? $scope.ReplyLv2DraftObj['ReplyID'] : null;
        var replyPromise = ReplyService.create($scope.ReplyMessage);
        replyPromise.success(function (payload) {
            if (payload.IsSuccessful == true) {
                //用新增主題回覆的ReplyTO等於主題的ReplyID濾出該篇的回覆
                var FilterReplyLevel2 = $filter('filter')($scope.ReplyList, { ID: payload.DataObj.ReplyTO });
                //把該篇回覆創立者的值塞給ReplyCreator
                FilterReplyLevel2[0].ReplyCreator = FilterReplyLevel2[0].CreatorName;
                //把該篇回覆時間的值塞給ReplyCreateOn
                FilterReplyLevel2[0].ReplyCreateOn = FilterReplyLevel2[0].CreateOn;
                $scope.EditorObj.loadingText = $filter('translate')('CreateMsgOk');
                // 廣播關閉編輯器事件由SubjectDetailCtrl監聽
                $scope.$emit('closeEditor', { editorType: $scope.EditorObj.editorType });
                // 接收回傳的物件並顯示在頁面上
                $scope.ReplyMessage.Attatchs = filterFilter($scope.EditorObj.attatchs, { isDel: false, isEmbed: false });
                $scope.ReplyMessage.CreateOn = payload.DataObj.CreateOn;
                $scope.ReplyMessage.CreatorName = payload.DataObj.CreatorName;
                $scope.ReplyMessage.ReplyCreateOn = FilterReplyLevel2[0].ReplyCreateOn;
                $scope.ReplyMessage.ReplyCreator = FilterReplyLevel2[0].ReplyCreator;
                $scope.ReplyMessage.IsAdmin = payload.DataObj.IsAdmin;
                $scope.ReplyMessage.IsBoss = payload.DataObj.IsBoss;
                $scope.ReplyMessage.ID = payload.DataObj.ReplyID;
                $scope.ReplyMessage.Receipts = receiptsForBack;
                // 廣播回覆新增成功事件`
                $scope.$emit(SubjectEvent.ReplyInserted, $scope.ReplyMessage);
                $scope.loading = $scope.EditorObj.loading = false;
            } else {
                $scope.EditorObj.loadingText = $filter('translate')('CreateMsgFail');
                $scope.EditorObj.loading = false;
            }
        })
        .error(function (error) {
            //alert('server Error');
        });
    });
    // #endregion
    // #region 偵測到儲存草稿的事件
    $scope.$on('tSaveReplyDraft', function ()
    {
        tSaveDraft();
    });
    // #endregion
    // #region 因為建立起開啟主題詳細頁需要封閉空間，但是如果對方是直接開啟獨立詳細頁，區間並沒有建立，這種情況下，直接拿取CurrentUser的資料
    function InitCurrentDetail() {
        if (Object.getOwnPropertyNames($scope.CurrentDetail).length === 0) {
            $scope.$parent.$parent.$parent.$parent.$parent.CurrentDetail.SubjID = $scope.CurrentSpage.SubjID;
            $scope.$parent.$parent.$parent.$parent.$parent.CurrentDetail.CompID = $scope.CurrentSpage.CompID;
            $scope.$parent.$parent.$parent.$parent.$parent.CurrentDetail.UserID = $scope.IndexData.CurrentUser.UserID;
            $scope.$parent.$parent.$parent.$parent.$parent.CurrentDetail.DiscID = $scope.CurrentDiscussion.discID;
            $scope.$parent.$parent.$parent.$parent.$parent.CurrentDetail.UserName = $scope.IndexData.CurrentUser.UserName
        }
        console.log($scope.$parent.$parent.$parent.$parent.$parent.CurrentDetail);
    };
    // #endregion
}]);