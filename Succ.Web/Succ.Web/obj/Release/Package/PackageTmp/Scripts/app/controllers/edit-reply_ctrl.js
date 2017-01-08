SuccApp.controller('EditReplyCtrl', ['$scope', 'FileUploader', '$log', 'AttatchService', 'ImageService', 'filterFilter', '$filter', '$rootScope', 'DiscType', 'SubjectColor', '$timeout', 'SubjectEvent', 'Draft', '$interval', 'ReplyService', '$sce', 'EditFinish', 'ReceiptsService', 'EditorPara', function ($scope, FileUploader, $log, AttatchService, ImageService, filterFilter, $filter, $rootScope, DiscType, SubjectColor, $timeout, SubjectEvent, Draft, $interval, ReplyService, $sce, EditFinish, ReceiptsService, EditorPara)
{
    // #region 收件人初始值設定
    $scope.EditReceiver = {};
    $scope.tReceipts = null;
    $scope.tDepartments = null;
    $scope.EditReceiver.tSelectedReceipts = [];
    // #endregion
    // #region 從何種主題列表點及進入主題詳細頁
    var Source = $scope.data.Source;
    // #endregion
    // #region 撈出要編輯的回覆資料
    var CurrentReplyToEdit = filterFilter($scope.ReplyList, { ID: $scope.replyEdit })[0];
    // #endregion
    // 判斷是否使用詳細頁封閉區間
    InitCurrentDetail();
    // #region 編輯器的物件viewmodel
    $scope.EditorObj = {
        CompanyID: $scope.$parent.CurrentDetail.CompID,
        DiscussionID: $scope.$parent.CurrentDetail.DiscID,
        UserID: $scope.$parent.CurrentDetail.UserID,
        UserName: $scope.$parent.CurrentDetail.UserName,
        PlanCloseOn: 0,
        editorType: 'EditReply',
        tTitle: '',
        tContent: $sce.trustAsHtml(CurrentReplyToEdit.Content),
        attatchs: CurrentReplyToEdit.Attatchs,
        receipts: CurrentReplyToEdit.Receipts,
        isDraft: 0
    };
    // #endregion
    // #region 編輯回復viewmodel
    $scope.EditReply = {
        SubjId: CurrentReplyToEdit.SubjectID,
        DiscID: $scope.$parent.CurrentDetail.DiscID,
        Receipts: CurrentReplyToEdit.Receipts,
        Content: CurrentReplyToEdit.Content,
        Attatchs: $scope.EditorObj.attatchs,
        DiscName: $scope.$parent.CurrentDiscussion.discName,
        CreatedBy: CurrentReplyToEdit.CreateBy,
        CreatedName: CurrentReplyToEdit.CreatorName,
        CurrentUserId: $scope.$parent.CurrentDetail.UserID,
        CurrentUserName: $scope.$parent.CurrentDetail.UserName,
        CompanyID: $scope.$parent.CurrentDetail.CompID,
        CreateOn: CurrentReplyToEdit.CreateOn,
        IsAdmin: false,
        IsBoss: false,
        ReplyID: $scope.replyEdit,
        UpdatedOn: '',
        isDraft:0
    };
    // #endregion
    // #region 編輯回覆是從草稿進入的
    var ReEditDraftObj = $scope.$parent.$parent.$parent.$parent.$parent['ReEditReplyDraft'];
    if (Object.getOwnPropertyNames(ReEditDraftObj).length > 0)
    {
        //清空物件
        $scope.$parent.$parent.$parent.$parent.$parent['ReEditReplyDraft'] = {};
        $scope.EditorObj['tContent'] = ReEditDraftObj['sContent'];
        $scope.EditorObj['attatchs'] = ReEditDraftObj['Attatchs']; 
    }
    // #endregion
    // #region 讀取收件人資料
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
        angular.forEach(CurrentReplyToEdit.Receipts, function (value, key) {
            subjReadIDArr.push(value.UserID);
        });
        var unSelectReceipts = filterFilter($scope.tReceipts, { selected: false });
        // 如果編輯回覆是從草稿開啟，收件人的塞入方式
        if (Object.getOwnPropertyNames(ReEditDraftObj).length > 0)
        {
            //開啟回覆如果是從草稿進入，不去考慮到主題的原始收件人
            subjReadIDArr = [];
            angular.forEach(ReEditDraftObj['Receipts'], function (value, key) {
                subjReadIDArr.push(value);
            });
        }
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
    var tEditReplySaveDraft = function () {
        var now = new Date();
        $scope.tDraftMessage = $filter('translate')('On') + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + $filter('translate')('Save_Draft');

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
                UserReadStatus: $scope.EditReply.CreatedBy == value.UserId ? 1 : 0,
                UserReadTime: ''
            });
        });
        // 草稿訊息物件viewmodel
        $scope.EditReply.Receipts = receiptsForSend;
        $scope.EditReply.Content = $scope.EditorObj.tContent;
        $scope.EditReply.Attatchs = $scope.EditorObj.attatchs;
        $scope.EditReply.isDraft = 1;
        console.log($scope.EditorObj);
        ReplyService.update($scope.EditReply)
        .success(function (response)
        {

        });
    };
    // 定時儲存
    //var tIntervalPromise = $interval(tSaveDraft, Draft.Timeout);
    // #endregion
    // #region 偵測到儲存回覆的事件
    $scope.$on('saveEditor', function (event, data) {
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
                UserReadStatus: $scope.EditReply.CurrentUserId == value.UserId ? 1 : 0,
                UserReadTime: ''
            });
        });

        $scope.EditReply.Receipts = receiptsForSend;
        $scope.EditReply.Content = $scope.EditorObj.tContent;
        $scope.EditReply.Attatchs = $scope.EditorObj.attatchs;
        $scope.EditReply.isDraft = 0;
        var edotPromise = ReplyService.update($scope.EditReply);
        edotPromise.success(function (payload) {
            if (payload.IsSuccessful == true) {
                // 廣播關閉編輯器事件由SubjectDetailCtrl監聽
                $scope.$emit('closeEditor', { editorType: $scope.EditorObj.editorType });
                $scope.EditReply.Attatchs.length = 0;
                // 接收回傳的物件並顯示在頁面上 
                if (payload.DataObj.Attatchs != null)
                {
                    angular.forEach(payload.DataObj.Attatchs, function (value, key)
                    {
                        $scope.EditReply.Attatchs.push({
                            AttID: value.AttID,
                            FileID: value.AttID,
                            FileName: value.FileName,
                            FileType: value.FileType,
                            FileSize: value.Size,
                            FilePath: '',
                            FileTypeIconPath: '',
                            Okey: value.AttID,
                            Skey: value.Skey,
                            Mkey: value.Mkey,
                            CreatedOn: value.CreatedOn,
                            isEmbed: value.isEmbed,
                            isDel: value.isDel,
                            ReplyID: value.ReplyID
                        });
                    });
                    $scope.EditReply.Attatchs = filterFilter($scope.EditReply.Attatchs, { isDel: false });
                }
                $scope.EditReply.Receipts = receiptsForBack;
                $scope.EditReply.UpdatedOn = Math.floor(new Date().getTime() / 1000);
                // 廣播回覆新增成功事件
                $scope.$emit(SubjectEvent.ReplyUpdated, $scope.EditReply);
                //廣播修改成功事件給各主題列表監聽
                EditFinish.EditSubj(Source,
                    {
                        Type: 1,
                        DiscID: $scope.EditReply.DiscID,
                        SubjID: $scope.EditReply.SubjId,
                        ModifiedBy: $scope.$parent.CurrentDetail.UserID,
                        ModifierName: $scope.$parent.CurrentDetail.UserName,
                        ModifiedOn: Math.floor(new Date().getTime() / 1000)
                    });
                // 給草稿列表通知
                if (Object.getOwnPropertyNames(ReEditDraftObj).length > 0)
                {
                    $rootScope.$broadcast('DraftToCreate', ReEditDraftObj);
                };
            }
        })
        .error(function (error) {
            //alert('server Error');
        });
    });
    // #endregion
    // #region 偵測到儲存編輯回覆草稿的事件
    $scope.$on('tSaveReplyDraft', function () {
        tEditReplySaveDraft();
    });
    // #endregion
    // #region 因為建立起開啟主題詳細頁需要封閉空間，但是如果對方是直接開啟獨立詳細頁，區間並沒有建立，這種情況下，直接拿取CurrentUser的資料
    function InitCurrentDetail() {
        if (Object.getOwnPropertyNames($scope.$parent.CurrentDetail).length === 0) {
            $scope.$parent.CurrentDetail.SubjID = "";
            $scope.$parent.CurrentDetail.CompID = $scope.$parent.IndexData.CurrentUser.CompID;
            $scope.$parent.CurrentDetail.UserID = $scope.$parent.IndexData.CurrentUser.UserID;
            $scope.$parent.CurrentDetail.DiscID = $scope.$parent.CurrentDiscussion.discID;
            $scope.$parent.CurrentDetail.UserName = $scope.$parent.IndexData.CurrentUser.UserName;
        }
    };
    // #endregion
}]);;