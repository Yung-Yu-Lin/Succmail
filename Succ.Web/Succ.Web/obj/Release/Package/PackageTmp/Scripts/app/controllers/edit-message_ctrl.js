SuccApp.controller('EditMessageCtrl', ['$scope', 'FileUploader', '$log', 'AttatchService', 'ImageService', 'filterFilter', '$filter', '$rootScope', 'DiscType', 'SubjectColor', '$timeout', 'SubjectEvent', 'Draft', '$interval', 'EditMessageService', 'EditApplyMoneyService', 'EditPurchaseMoneyService', 'EditGoOut', 'EditLeave', 'EditOverTime', 'EditFinish', 'ReceiptsService', 'EditorPara', function ($scope, FileUploader, $log, AttatchService, ImageService, filterFilter, $filter, $rootScope, DiscType, SubjectColor, $timeout, SubjectEvent, Draft, $interval, EditMessageService, EditApplyMoneyService, EditPurchaseMoneyService, EditGoOut, EditLeave, EditOverTime, EditFinish, ReceiptsService, EditorPara)
{
    // #region 這個控制器範圍Scope
    var ThisScope = $scope.$parent.$parent.$parent.data == undefined ? $scope.$parent.$parent : $scope.$parent.$parent.$parent;
    // #endregion
    // #region 從何種主題列表點及進入主題詳細頁
    var Source = ThisScope.data.Source;
    // #endregion
    // #region 編輯主題所在的討論組類型
    var CurrentDiscType = ThisScope.data.DiscType;
    // #endregion
    // 判斷是否使用詳細頁封閉區間
    InitCurrentDetail();
    // #region 決定此次編輯使用何種ViewModel承接
    switch(CurrentDiscType)
    {
        case DiscType.Normal:
            NormalModel();
            NormalDraftModel();
            break;
        case DiscType.ApplyMoney:
            ApplyModel();
            break;
        case DiscType.Purchasing:
            PurchaseModel();
            break;
        case DiscType.PersonLeave:
            LeaveModel();
            break;
        case DiscType.GoOut:
            GooutModel();
            break;
        case DiscType.Overtime:
            OvertimeModel();
            break;
    }
    // #endregion
    // #region 編輯器的物件viewmodel
    $scope.EditorObj =
    {
        CompanyID: ThisScope.$parent.CurrentDetail.CompID,
        DiscussionID: ThisScope.$parent.CurrentDetail.DiscID,
        UserID: ThisScope.$parent.CurrentDetail.UserID,
        UserName: ThisScope.$parent.CurrentDetail.UserName,
        editorType: 'EditSubj',
        SubjectID: ThisScope.data.ID,
        ReplyID: '',
        tTitle: ThisScope.data.Title,
        tContent: ThisScope.data.Content,
        attatchs: ThisScope.data.AttatchList,
        receipts: ThisScope.data.Receipts,
        PlanCloseOn: ThisScope.data.PlanCloseOn,
        EventTagID: null,
        CusTagID: null,
        EventTagName: '',
        CusTagName : '',
        ProgressData: ThisScope.ApplyMoney,
        PurchaseData: ThisScope.PurchaseMoney,
        GoOutData: ThisScope.data.GoOutItem,
        PersonLeaveData: ThisScope.data.PersonLeaveItem,
        OverTimeData: ThisScope.data.OverTimeItem
    };
    // #endregion
    // #region 編輯主題是從草稿進入
    var ReEditDraftObj = $scope.$parent.$parent.$parent.$parent['ReEditNewSubjDraft'];
    if (Object.getOwnPropertyNames(ReEditDraftObj).length > 0)
    {
        //清空物件
        $scope.$parent.$parent.$parent.$parent['ReEditNewSubjDraft'] = {};
        $scope.EditorObj['SubjectID'] = ReEditDraftObj['SubjId'];
        $scope.EditorObj['tTitle'] = ReEditDraftObj['Title'];
        $scope.EditorObj['tContent'] = ReEditDraftObj['sContent'];
        $scope.EditorObj['attatchs'] = ReEditDraftObj['Attatchs'];
        //$scope.EditorObj['PlanCloseOn'] = ReEditDraftObj['PlanCloseOn'];
        $scope.EditorObj['EventTagID'] = parseInt(ReEditDraftObj['SubjTagID']);
        $scope.EditorObj['CusTagID'] = parseInt(ReEditDraftObj['CusTagID']);
        $scope.EditorObj['EventTagName'] = ReEditDraftObj['SubjTagName'];
        $scope.EditorObj['CusTagName'] = ReEditDraftObj['CusTagName'];
        //填充草稿收件人
        var DraftReceiverArray = [];
        angular.forEach(ReEditDraftObj['Receipts'], function (value, key) {
            var DraftReceiver = {};
            DraftReceiver['UserID'] = value;
            DraftReceiverArray.push(DraftReceiver);
        });
        $scope.EditorObj['receipts'] = DraftReceiverArray;
    }
    // #endregion
    // #region 收件人Init參數
    $scope.EditReceiver = {};
    $scope.tReceipts = null;
    $scope.tDepartments = null;
    $scope.EditReceiver.tSelectedReceipts = [];
    // #endregion
    // #region 選擇的收件人發生變化時同步更新
    $scope.$watch('tReceipts', function (newValue, oldValue, scope) {
        if (!angular.equals(newValue, oldValue)) {
            $scope.EditReceiver.tSelectedReceipts = filterFilter($scope.tReceipts, { selected: true });
        }
    },true);
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
    // #region 拿取收件人資料
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
        angular.forEach($scope.EditorObj['receipts'], function (value, key) {
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
    // #region 存放儲存草稿後，回傳的物件 subjID,DraftID
    $scope.DraftObj = {};
    // #endregion
    // #region 偵測到編輯主題儲存草稿事件
    $scope.$on('tSaveDraft', function (event, data)
    {
        if (ThisScope.data.DiscType == DiscType.Normal)
        {
            tSaveDraft();
        }
    });
    // #endregion
    // #region 草稿儲存事件
    function tSaveDraft()
    {
        // 送出的收件人陣列
        var receiptsForSend = [];
        // 顯示用的收件人陣列
        var receiptsForBack = [];
        // 收件人viewmodel
        var receiptObj =
        {
            UserID: "",
            UserName: "",
            UserReadStatus: 0,
            UserReadTime: ""
        };
        angular.forEach($scope.EditorObj.receipts, function (value, key)
        {
            receiptsForSend.push(value.UserId);
            receiptsForBack.push(
            {
                UserID: value.UserId,
                UserName: value.UserName,
                UserReadStatus: $scope.DraftEditMessage.CurrentUserID == value.UserId ? 1 : 0,
                UserReadTime: ''
            });
        });
        $scope.DraftEditMessage.Title = $scope.EditorObj.tTitle;
        $scope.DraftEditMessage.Receipts = receiptsForSend;
        $scope.DraftEditMessage.Content = $scope.EditorObj.tContent;
        $scope.DraftEditMessage.Attatchs = $scope.EditorObj.attatchs;
        $scope.DraftEditMessage.PlanDate = $scope.EditorObj.PlanCloseOn;
        $scope.DraftEditMessage.SubjTagID = $scope.EditorObj.EventTagID;
        $scope.DraftEditMessage.CusTagID = $scope.EditorObj.CusTagID;
        $scope.DraftEditMessage.SubjTagName = $scope.EditorObj.EventTagName;
        $scope.DraftEditMessage.CusTagName = $scope.EditorObj.CusTagName;
        var editDraftPromise = EditMessageService.save($scope.DraftEditMessage);
        editDraftPromise.success(function (payload)
        {
            if(payload.IsSuccessful == true)
            {
                $scope.DraftObj = payload.DataObj;
            }
        });
    }
    // #endregion
    // #region 偵測到儲存主題的事件
    $scope.$on('saveEditor', function (event, data)
    {
        switch (CurrentDiscType)
        {
            case DiscType.Normal:
                NormaleUpdate();
                break;
            case DiscType.ApplyMoney:
                ApplyMoneyUpdate();
                break;
            case DiscType.Purchasing:
                PurchaseUpdate();
                break;
            case DiscType.PersonLeave:
                LeaveUpdate();
                break;
            case DiscType.GoOut:
                GoOutUpdate();
                break;
            case DiscType.Overtime:
                OvertimeUpdate();
                break;
        }
    });
    // #endregion
    // #region 一般主題編輯
    function NormaleUpdate()
    {
        // 送出的收件人陣列
        var receiptsForSend = [];
        // 顯示用的收件人陣列
        var receiptsForBack = [];
        // 收件人viewmodel
        var receiptObj =
        {
            UserID: "",
            UserName: "",
            UserReadStatus: 0,
            UserReadTime: ""
        };
        angular.forEach($scope.EditorObj.receipts, function (value, key)
        {
            receiptsForSend.push(value.UserId);
            receiptsForBack.push(
            {
                UserID: value.UserId,
                UserName: value.UserName,
                UserReadStatus: $scope.EditMessage.CurrentUserID == value.UserId ? 1 : 0,
                UserReadTime: ''
            });
        });
        $scope.EditMessage.Title = $scope.EditorObj.tTitle;
        $scope.EditMessage.Receipts = receiptsForSend;
        $scope.EditMessage.Content = $scope.EditorObj.tContent;
        $scope.EditMessage.Attatchs = $scope.EditorObj.attatchs;
        $scope.EditMessage.PlanDate = $scope.EditorObj.PlanCloseOn;
        $scope.EditMessage.SubjTagID = $scope.EditorObj.EventTagID;
        $scope.EditMessage.CusTagID = $scope.EditorObj.CusTagID;
        $scope.EditMessage.SubjTagName = $scope.EditorObj.EventTagName;
        $scope.EditMessage.CusTagName = $scope.EditorObj.CusTagName;
        var editPromise = EditMessageService.save($scope.EditMessage);
        editPromise.success(function (payload)
        {
            if (payload.IsSuccessful === true)
            {
                $scope.EditMessage.Attatchs.length = 0;
                // 廣播關閉編輯器事件由SubjectDetailCtrl監聽
                $scope.$emit('closeEditor', { editorType: $scope.EditorObj.editorType });
                // 接收回傳的物件並顯示在頁面上
                if (payload.DataObj.Attatchs !== null)
                {
                    // 有附件才做
                    if (payload.DataObj.Attatchs.length > 0)
                    {
                        angular.forEach(payload.DataObj.Attatchs, function (value, key)
                        {
                            $scope.EditMessage.Attatchs.push({
                                AttID: value.AttID,
                                FileName: value.FileName,
                                FileType: value.FileType,
                                FileSize: value.Size,
                                FilePath: '',
                                FileTypeIconPath: '',
                                Okey: value.Okey,
                                Skey: value.Skey,
                                Mkey: value.Mkey,
                                isCloud: true,
                                CreatedOn: value.CreatedOn,
                                isEmbed: value.isEmbed,
                                isDel: value.isDel
                            });
                        });
                        $scope.EditMessage.Attatchs = filterFilter($scope.EditMessage.Attatchs, { isDel: false });
                    }
                }
                $scope.EditMessage.PlanDate = payload.DataObj.PlanCloseOn;
                $scope.EditMessage.Receipts = receiptsForBack;
                $scope.EditMessage.UpdateOn = Math.floor(new Date().getTime() / 1000);
                // 廣播修改成功事件由主題詳細頁控制器監聽
                $scope.$emit(SubjectEvent.MessageUpdated, $scope.EditMessage);
                //串接主題(判斷事件標籤&對象標籤)
                var d = new Date($scope.EditMessage.CreatedOn * 1000);
                var EventTagName = $scope.EditorObj.EventTagName.length > 0 ? $scope.EditorObj.EventTagName + " - " : "";
                var CusTagName = $scope.EditorObj.CusTagName.length > 0 ? $scope.EditorObj.CusTagName + " - " : "";
                var MonthString = (d.getMonth() + 1).toString().length <= 1 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1);
                var DateString = d.getDate().toString().length <= 1 ? "0" + d.getDate() : d.getDate();
                var CreatedOnString = " - " + d.getFullYear() + "/" + MonthString + "/" + DateString;
                var TitleString = EventTagName + CusTagName + $scope.EditMessage.Title + CreatedOnString;
                // 廣播修改成功事件給各主題列表監聽(主題 type = 0，回覆 type = 1)
                EditFinish.EditSubj(Source,
                    {
                        Type: 0,
                        DiscID: $scope.EditMessage.DiscID,
                        SubjID: $scope.EditMessage.SubjectId,
                        Title: TitleString,
                        ModifiedBy: $scope.$parent.CurrentDetail.UserID,
                        ModifierName: $scope.$parent.CurrentDetail.UserName,
                        ModifiedOn: Math.floor(new Date().getTime() / 1000),
                        Receiver: $scope.EditMessage.Receipts,
                        PlanDate: $scope.EditMessage.PlanDate
                    });
                //給草稿列表通知
                if (Object.getOwnPropertyNames(ReEditDraftObj).length > 0)
                {
                    $rootScope.$broadcast('DraftToCreate', ReEditDraftObj);
                };
            }
        })
        .error(function (error)
        {
            //alert('server Error');
        });
    }
    // #endregion
    // #region 款項請領編輯
    function ApplyMoneyUpdate()
    {
        // 送出的收件人陣列
        var receiptsForSend = [];
        // 顯示用的收件人陣列
        var receiptsForBack = [];
        
        //填充收件人
        angular.forEach($scope.EditorObj.receipts, function (value, key) {
            receiptsForSend.push(value.UserId);
            receiptsForBack.push(
            {
                UserID: value.UserId,
                UserName: value.UserName,
                UserReadStatus: $scope.UpdateApplyMoney.CreatorID == value.UserId ? 1 : 0,
                UserReadTime: ''
            });
        });
        //填充款項請領的ViewModel
        $scope.UpdateApplyMoney.Title = $scope.EditorObj.tTitle;
        $scope.UpdateApplyMoney.Receipts = receiptsForSend;
        $scope.UpdateApplyMoney.Content = $scope.EditorObj.tContent;
        $scope.UpdateApplyMoney.Attatchs = $scope.EditorObj.attatchs;
        //送往後端進行儲存
        var editPromise = EditApplyMoneyService.save($scope.UpdateApplyMoney);
        editPromise.success(function (payload) {
            if (payload.IsSuccessful == true)
            {
                $scope.UpdateApplyMoney.Attatchs.length = 0;
                // 廣播關閉編輯器事件由SubjectDetailCtrl監聽
                $scope.$emit('closeEditor', { editorType: $scope.EditorObj.editorType });
                // 接收回傳的物件並顯示在頁面上
                if (payload.DataObj.Attatchs != null) {
                    //有附件才做
                    if (payload.DataObj.Attatchs.length > 0) {
                        angular.forEach(payload.DataObj.Attatchs, function (value, key) {
                            $scope.UpdateApplyMoney.Attatchs.push({
                                AttID: value.AttID,
                                FileName: value.FileName,
                                FileType: value.FileType,
                                FileSize: value.Size,
                                FilePath: '',
                                FileTypeIconPath: '',
                                Okey: value.Okey,
                                Skey: value.Skey,
                                Mkey: value.Mkey,
                                isCloud: true,
                                isEmbed: value.isEmbed,
                                isDel: value.isDel
                            });
                        });
                        $scope.UpdateApplyMoney.Attatchs = filterFilter($scope.UpdateApplyMoney.Attatchs, { isDel: false });
                    }
                }
                $scope.UpdateApplyMoney.PlanDate = payload.DataObj.PlanCloseOn;
                $scope.UpdateApplyMoney.Receipts = receiptsForBack;
                $scope.UpdateApplyMoney.UpdatorName = $scope.$parent.CurrentDetail.UserName;
                $scope.UpdateApplyMoney.UpdateOn = Math.floor(new Date().getTime() / 1000);
                // 廣播修改成功事件由SubjectDetailCtrl監聽
                $scope.$emit(SubjectEvent.MessageUpdated, $scope.UpdateApplyMoney);
                var MonthString = (d.getMonth() + 1).toString().length <= 1 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1);
                var DateString = d.getDate().toString().length <= 1 ? "0" + d.getDate() : d.getDate();
                var CreatedOnString = " - " + d.getFullYear() + "/" + MonthString + "/" + DateString;
                var TitleString = $scope.UpdateApplyMoney.Title + CreatedOnString;
                //廣播修改成功事件給各主題列表監聽
                EditFinish.EditSubj(Source,
                    {
                        Type: 0,
                        DiscID: $scope.UpdateApplyMoney.DiscID,
                        SubjID: $scope.UpdateApplyMoney.SubjectId,
                        Title: $scope.UpdateApplyMoney.Title,
                        ModifiedBy: $scope.$parent.CurrentDetail.UserID,
                        ModifierName: $scope.$parent.CurrentDetail.UserName,
                        ModifiedOn: Math.floor(new Date().getTime() / 1000),
                        Receiver: $scope.UpdateApplyMoney.Receipts,
                    });
            }
        });

    }
    // #endregion
    // #region 採購編輯
    function PurchaseUpdate()
    {
        // 送出的收件人陣列
        var receiptsForSend = [];
        // 顯示用的收件人陣列
        var receiptsForBack = [];
        //填充收件人
        angular.forEach($scope.EditorObj.receipts, function (value, key) {
            receiptsForSend.push(value.UserId);
            receiptsForBack.push(
            {
                UserID: value.UserId,
                UserName: value.UserName,
                UserReadStatus: $scope.UpdatePurchaseMoney.CreatorID == value.UserId ? 1 : 0,
                UserReadTime: ''
            });
        });
        //填充款項請領的ViewModel
        $scope.UpdatePurchaseMoney.Title = $scope.EditorObj.tTitle;
        $scope.UpdatePurchaseMoney.Receipts = receiptsForSend;
        $scope.UpdatePurchaseMoney.Content = $scope.EditorObj.tContent;
        $scope.UpdatePurchaseMoney.Attatchs = $scope.EditorObj.attatchs;
        
        //送往後端進行儲存
        var editPromise = EditPurchaseMoneyService.save($scope.UpdatePurchaseMoney);
        editPromise.success(function (payload)
        {
            if (payload.IsSuccessful === true)
            {
                $scope.UpdatePurchaseMoney.Attatchs.length = 0;
                // 廣播關閉編輯器事件由SubjectDetailCtrl監聽
                $scope.$emit('closeEditor', { editorType: $scope.EditorObj.editorType });
                // 接收回傳的物件並顯示在頁面上
                if (payload.DataObj.Attatchs !== null) {
                    //有附件才做
                    if (payload.DataObj.Attatchs.length > 0) {
                        angular.forEach(payload.DataObj.Attatchs, function (value, key) {
                            $scope.UpdatePurchaseMoney.Attatchs.push({
                                AttID: value.AttID,
                                FileName: value.FileName,
                                FileType: value.FileType,
                                FileSize: value.Size,
                                FilePath: '',
                                FileTypeIconPath: '',
                                Okey: value.Okey,
                                Skey: value.Skey,
                                Mkey: value.Mkey,
                                isCloud: true,
                                isEmbed: value.isEmbed,
                                isDel: value.isDel
                            });
                        });
                        $scope.UpdatePurchaseMoney.Attatchs = filterFilter($scope.UpdatePurchaseMoney.Attatchs, { isDel: false });
                    }
                }

                $scope.UpdatePurchaseMoney.PlanDate = payload.DataObj.PlanCloseOn;
                $scope.UpdatePurchaseMoney.Receipts = receiptsForBack;
                $scope.UpdatePurchaseMoney.UpdatorName = $scope.$parent.CurrentDetail.UserName;
                $scope.UpdatePurchaseMoney.UpdateOn = Math.floor(new Date().getTime() / 1000);
                // 廣播修改成功事件由SubjectDetailCtrl監聽
                $scope.$emit(SubjectEvent.MessageUpdated, $scope.UpdatePurchaseMoney);
                var MonthString = (d.getMonth() + 1).toString().length <= 1 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1);
                var DateString = d.getDate().toString().length <= 1 ? "0" + d.getDate() : d.getDate();
                var CreatedOnString = " - " + d.getFullYear() + "/" + MonthString + "/" + DateString;
                var TitleString = $scope.UpdatePurchaseMoney.Title + CreatedOnString;
                //廣播修改成功事件給各主題列表監聽
                EditFinish.EditSubj(Source,
                    {
                        Type: 0,
                        DiscID: $scope.UpdatePurchaseMoney.DiscID,
                        SubjID: $scope.UpdatePurchaseMoney.SubjectId,
                        Title: TitleString,
                        ModifiedBy: $scope.$parent.CurrentDetail.UserID,
                        ModifierName: $scope.$parent.CurrentDetail.UserName,
                        ModifiedOn: Math.floor(new Date().getTime() / 1000),
                        Receiver: $scope.UpdatePurchaseMoney.Receipts,
                    });
            }
        });
    }
    // #endregion
    // #region 請假編輯
    function LeaveUpdate()
    {
        // 送出的收件人陣列
        var receiptsForSend = [];
        // 顯示用的收件人陣列
        var receiptsForBack = [];
        //填充收件人
        angular.forEach($scope.EditorObj.receipts, function (value, key) {
            receiptsForSend.push(value.UserId);
            receiptsForBack.push(
            {
                UserID: value.UserId,
                UserName: value.UserName,
                UserReadStatus: $scope.UpdatePersonLeave.CreatorID == value.UserId ? 1 : 0,
                UserReadTime: ''
            });
        });
        //填充外出申請的ViewModel
        $scope.UpdatePersonLeave.Title = $scope.EditorObj.tTitle;
        $scope.UpdatePersonLeave.Receipts = receiptsForSend;
        $scope.UpdatePersonLeave.Content = $scope.EditorObj.tContent;
        $scope.UpdatePersonLeave.Attatchs = $scope.EditorObj.attatchs;
        var AgentID = null;
        var AgentName = null;

        if ($scope.UpdatePersonLeave.PersonLeave['Agent'] !== undefined && $scope.UpdatePersonLeave.PersonLeave['Agent'] !== null) {
            AgentID = $scope.UpdatePersonLeave.PersonLeave['Agent'].UserId;
            AgentName = $scope.UpdatePersonLeave.PersonLeave['Agent'].UserName;
        }
        
        var MemberID = $scope.UpdatePersonLeave.PersonLeave['Member'].UserId;
        var MemberName = $scope.UpdatePersonLeave.PersonLeave['Member'].UserName;
        $scope.UpdatePersonLeave.PersonLeave['Agent'] = AgentID;
        $scope.UpdatePersonLeave.PersonLeave['Member'] = MemberID;
        $scope.UpdatePersonLeave.PersonLeave['AgentName'] = AgentName;
        $scope.UpdatePersonLeave.PersonLeave['MemberName'] = MemberName;
        var editPromise = EditLeave.save($scope.UpdatePersonLeave);
        editPromise.success(function (payload) {
            if (payload.IsSuccessful == true) {
                //更新WorkID
                $scope.UpdatePersonLeave.PersonLeave['WorkId'] = payload.DataObj.WorkID;
                $scope.UpdatePersonLeave.PersonLeave['LeaveType'] = payload.DataObj.OutType;
                $scope.UpdatePersonLeave.Attatchs.length = 0;
                // 廣播關閉編輯器事件由SubjectDetailCtrl監聽
                $scope.$emit('closeEditor', { editorType: $scope.EditorObj.editorType });
                // 接收回傳的物件並顯示在頁面上
                if (payload.DataObj.Attatchs != null) {
                    //有附件才做
                    if (payload.DataObj.Attatchs.length > 0)
                    {
                        angular.forEach(payload.DataObj.Attatchs, function (value, key) {
                            $scope.UpdatePersonLeave.Attatchs.push({
                                AttID: value.AttID,
                                FileName: value.FileName,
                                FileType: value.FileType,
                                FileSize: value.Size,
                                FilePath: '',
                                FileTypeIconPath: '',
                                Okey: value.Okey,
                                Skey: value.Skey,
                                Mkey: value.Mkey,
                                isCloud: true,
                                isEmbed: value.isEmbed,
                                isDel: value.isDel
                            });
                        });
                        $scope.UpdatePersonLeave.Attatchs = filterFilter($scope.UpdatePersonLeave.Attatchs, { isDel: false });
                    }
                }
                $scope.UpdatePersonLeave.PlanDate = payload.DataObj.PlanCloseOn;
                $scope.UpdatePersonLeave.Receipts = receiptsForBack;
                $scope.UpdatePersonLeave.UpdatorName = $scope.$parent.CurrentDetail.UserName;
                $scope.UpdatePersonLeave.UpdateOn = Math.floor(new Date().getTime() / 1000);
                // 廣播修改成功事件由SubjectDetailCtrl監聽
                $scope.$emit(SubjectEvent.MessageUpdated, $scope.UpdatePersonLeave);
                var MonthString = (d.getMonth() + 1).toString().length <= 1 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1);
                var DateString = d.getDate().toString().length <= 1 ? "0" + d.getDate() : d.getDate();
                var CreatedOnString = " - " + d.getFullYear() + "/" + MonthString + "/" + DateString;
                var TitleString = $scope.UpdatePersonLeave.Title + CreatedOnString;
                //廣播修改成功事件給各主題列表監聽
                EditFinish.EditSubj(Source,
                    {
                        Type: 0,
                        DiscID: $scope.UpdatePersonLeave.DiscID,
                        SubjID: $scope.UpdatePersonLeave.SubjectId,
                        Title: TitleString,
                        ModifiedBy: $scope.$parent.CurrentDetail.UserID,
                        ModifierName: $scope.$parent.CurrentDetail.UserName,
                        ModifiedOn: Math.floor(new Date().getTime() / 1000),
                        Receiver: $scope.UpdatePersonLeave.Receipts,
                    });
            }
        });

    }
    // #endregion
    // #region 外出編輯
    function GoOutUpdate()
    {
        // 送出的收件人陣列
        var receiptsForSend = [];
        // 顯示用的收件人陣列
        var receiptsForBack = [];
        //填充收件人
        angular.forEach($scope.EditorObj.receipts, function (value, key) {
            receiptsForSend.push(value.UserId);
            receiptsForBack.push(
            {
                UserID: value.UserId,
                UserName: value.UserName,
                UserReadStatus: $scope.UpdateGoOut.CreatorID == value.UserId ? 1 : 0,
                UserReadTime: ''
            });
        });
        //填充外出申請的ViewModel
        $scope.UpdateGoOut.Title = $scope.EditorObj.tTitle;
        $scope.UpdateGoOut.Receipts = receiptsForSend;
        $scope.UpdateGoOut.Content = $scope.EditorObj.tContent;
        $scope.UpdateGoOut.Attatchs = $scope.EditorObj.attatchs;

        var AgentID = null;
        var AgentName = null;
        if ($scope.UpdateGoOut.GoOut['Agent'] !== undefined && $scope.UpdateGoOut.GoOut['Agent'] !== null) {
            AgentID = $scope.UpdateGoOut.GoOut['Agent'].UserId;
            AgentName = $scope.UpdateGoOut.GoOut['Agent'].UserName;
        }

        var MemberID = $scope.UpdateGoOut.GoOut['Member'].UserId;
        var MemberName = $scope.UpdateGoOut.GoOut['Member'].UserName;
        $scope.UpdateGoOut.GoOut['Agent'] = AgentID;
        $scope.UpdateGoOut.GoOut['Member'] = MemberID;
        $scope.UpdateGoOut.GoOut['AgentName'] = AgentName;
        $scope.UpdateGoOut.GoOut['MemberName'] = MemberName;
        //送往後端進行儲存
        var editPromise = EditGoOut.save($scope.UpdateGoOut);
        editPromise.success(function (payload) {
            if (payload.IsSuccessful == true)
            {
                //更新WorkID
                $scope.UpdateGoOut.GoOut['WorkId'] = payload.DataObj.WorkID;
                $scope.UpdateGoOut.GoOut['OutType'] = payload.DataObj.OutType;
                $scope.UpdateGoOut.Attatchs.length = 0;
                // 廣播關閉編輯器事件由SubjectDetailCtrl監聽
                $scope.$emit('closeEditor', { editorType: $scope.EditorObj.editorType });
                // 接收回傳的物件並顯示在頁面上
                if (payload.DataObj.Attatchs != null) {
                    //有附件才做
                    if (payload.DataObj.Attatchs.length > 0) {
                        angular.forEach(payload.DataObj.Attatchs, function (value, key) {
                            $scope.UpdateGoOut.Attatchs.push({
                                AttID: value.AttID,
                                FileName: value.FileName,
                                FileType: value.FileType,
                                FileSize: value.Size,
                                FilePath: '',
                                FileTypeIconPath: '',
                                Okey: value.Okey,
                                Skey: value.Skey,
                                Mkey: value.Mkey,
                                isCloud: true,
                                isEmbed: value.isEmbed,
                                isDel: value.isDel
                            });
                        });
                        $scope.UpdateGoOut.Attatchs = filterFilter($scope.UpdateGoOut.Attatchs, { isDel: false });
                    }
                }
                $scope.UpdateGoOut.PlanDate = payload.DataObj.PlanCloseOn;
                $scope.UpdateGoOut.Receipts = receiptsForBack;
                $scope.UpdateGoOut.UpdatorName = $scope.$parent.CurrentDetail.UserName;
                $scope.UpdateGoOut.UpdateOn = Math.floor(new Date().getTime() / 1000);
                // 廣播修改成功事件由SubjectDetailCtrl監聽
                $scope.$emit(SubjectEvent.MessageUpdated, $scope.UpdateGoOut);
                var MonthString = (d.getMonth() + 1).toString().length <= 1 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1);
                var DateString = d.getDate().toString().length <= 1 ? "0" + d.getDate() : d.getDate();
                var CreatedOnString = " - " + d.getFullYear() + "/" + MonthString + "/" + DateString;
                var TitleString = $scope.UpdateGoOut.Title + CreatedOnString;
                //廣播修改成功事件給各主題列表監聽
                EditFinish.EditSubj(Source,
                    {
                        Type: 0,
                        DiscID: $scope.UpdateGoOut.DiscID,
                        SubjID: $scope.UpdateGoOut.SubjectId,
                        Title: TitleString,
                        ModifiedBy: $scope.$parent.CurrentDetail.UserID,
                        ModifierName: $scope.$parent.CurrentDetail.UserName,
                        ModifiedOn: Math.floor(new Date().getTime() / 1000),
                        Receiver: $scope.UpdateGoOut.Receipts,
                    });
            }
        });
    }
    // #endregion
    // #region 加班編輯
    function OvertimeUpdate()
    {
        // 送出的收件人陣列
        var receiptsForSend = [];
        // 顯示用的收件人陣列
        var receiptsForBack = [];
        //填充收件人
        angular.forEach($scope.EditorObj.receipts, function (value, key) {
            receiptsForSend.push(value.UserId);
            receiptsForBack.push(
            {
                UserID: value.UserId,
                UserName: value.UserName,
                UserReadStatus: $scope.UpdateOverTime.CreatorID == value.UserId ? 1 : 0,
                UserReadTime: ''
            });
        });
        //填充外出申請的ViewModel
        $scope.UpdateOverTime.Title = $scope.EditorObj.tTitle;
        $scope.UpdateOverTime.Receipts = receiptsForSend;
        $scope.UpdateOverTime.Content = $scope.EditorObj.tContent;
        $scope.UpdateOverTime.Attatchs = $scope.EditorObj.attatchs;
        var MemberID = $scope.UpdateOverTime.OverTime['Member'].UserId;
        var MemberName = $scope.UpdateOverTime.OverTime['Member'].UserName;
        $scope.UpdateOverTime.OverTime['Member'] = MemberID;
        $scope.UpdateOverTime.OverTime['MemberName'] = MemberName;
        //送往後端進行儲存
        var editPromise = EditOverTime.save($scope.UpdateOverTime);
        editPromise.success(function (payload) {
            if (payload.IsSuccessful == true) {
                //更新WorkID
                $scope.UpdateOverTime.OverTime['WorkId'] = payload.DataObj.WorkID;
                $scope.UpdateOverTime.Attatchs.length = 0;
                // 廣播關閉編輯器事件由SubjectDetailCtrl監聽
                $scope.$emit('closeEditor', { editorType: $scope.EditorObj.editorType });
                // 接收回傳的物件並顯示在頁面上
                if (payload.DataObj.Attatchs != null) {
                    //有附件才做
                    if (payload.DataObj.Attatchs.length > 0) {
                        angular.forEach(payload.DataObj.Attatchs, function (value, key) {
                            $scope.UpdateOverTime.Attatchs.push({
                                AttID: value.AttID,
                                FileName: value.FileName,
                                FileType: value.FileType,
                                FileSize: value.Size,
                                FilePath: '',
                                FileTypeIconPath: '',
                                Okey: value.Okey,
                                Skey: value.Skey,
                                Mkey: value.Mkey,
                                isCloud: true,
                                isEmbed: value.isEmbed,
                                isDel: value.isDel
                            });
                        });
                        $scope.UpdateOverTime.Attatchs = filterFilter($scope.UpdateOverTime.Attatchs, { isDel: false });
                    }
                }
                $scope.UpdateOverTime.PlanDate = payload.DataObj.PlanCloseOn;
                $scope.UpdateOverTime.Receipts = receiptsForBack;
                $scope.UpdateOverTime.UpdatorName = $scope.$parent.CurrentDetail.UserName;
                $scope.UpdateOverTime.UpdateOn = Math.floor(new Date().getTime() / 1000);
                // 廣播修改成功事件由SubjectDetailCtrl監聽
                $scope.$emit(SubjectEvent.MessageUpdated, $scope.UpdateOverTime);
                var MonthString = (d.getMonth() + 1).toString().length <= 1 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1);
                var DateString = d.getDate().toString().length <= 1 ? "0" + d.getDate() : d.getDate();
                var CreatedOnString = " - " + d.getFullYear() + "/" + MonthString + "/" + DateString;
                var TitleString = $scope.UpdateOverTime.Title + CreatedOnString;
                //廣播修改成功事件給各主題列表監聽
                EditFinish.EditSubj(Source,
                    {
                        Type: 0,
                        DiscID: $scope.UpdateOverTime.DiscID,
                        SubjID: $scope.UpdateOverTime.SubjectId,
                        Title: TitleString,
                        ModifiedBy: $scope.$parent.CurrentDetail.UserID,
                        ModifierName: $scope.$parent.CurrentDetail.UserName,
                        ModifiedOn: Math.floor(new Date().getTime() / 1000),
                        Receiver: $scope.UpdateOverTime.Receipts,
                    });
            }
        });
    }
    // #endregion
    // #region 一般主題編輯的草稿模型
    function NormalDraftModel()
    {
        $scope.DraftEditMessage =
        {
            SubjectId: $scope.data.ID,
            DiscID: $scope.$parent.CurrentDetail.DiscID,
            CompID: $scope.$parent.CurrentDetail.CompID,
            SubjType: 0,
            Title: $scope.data.Title,
            Receipts: $scope.data.Receipts,
            Content: $scope.data.Content,
            Attatchs: $scope.data.AttatchList,
            SubjectColor: $scope.data.SubjectColor,
            CurrentUserID: $scope.$parent.CurrentDetail.UserID,
            PlanDate: $scope.data.PlanCloseOn == 0 ? "0" : $scope.data.PlanCloseOn,
            DiscType: $scope.data.DiscType,
            DiscName: $scope.data.DiscName,
            ModifiedOn: $scope.data.ModifyOn,
            CreatedOn: $scope.data.CreateOn,
            CreatorID: $scope.data.CreateBy,
            CreatorName: $scope.$parent.CurrentDetail.UserName,
            UpdateOn:'',
            UpdatorName: $scope.$parent.CurrentDetail.UserName,
            SubjTagID:'',
            CusTagID: '',
            SubjTagName: '',
            CusTagName: '',
            isDraft:1
        };
    }
    // #endregion
    // #region 一般主題模型
    function NormalModel()
    {
        $scope.EditMessage =
        {
            SubjectId: $scope.data.ID,
            DiscID: $scope.CurrentDetail.DiscID,
            CompID: $scope.CurrentDetail.CompID,
            SubjType: 0,
            Title: $scope.data.Title,
            Receipts: $scope.data.Receipts,
            Content: $scope.data.Content,
            Attatchs: $scope.data.AttatchList,
            SubjectColor: $scope.data.SubjectColor,
            CurrentUserID: $scope.CurrentDetail.UserID,
            PlanDate: $scope.data.PlanCloseOn == 0 ? "0" : $scope.data.PlanCloseOn,
            DiscType: $scope.data.DiscType,
            DiscName: $scope.data.DiscName,
            ModifiedOn: $scope.data.ModifyOn,
            CreatedOn: $scope.data.CreateOn,
            CreatorID: $scope.data.CreateBy,
            CreatorName: $scope.data.Creator,
            UpdateOn:'',
            UpdatorName: $scope.CurrentDetail.UserName,
            SubjTagID:'',
            CusTagID: '',
            SubjTagName: '',
            CusTagName: '',
            isDraft:0
        };
    }
    // #endregion
    // #region 款項請領模型
    function ApplyModel()
    {
        $scope.UpdateApplyMoney =
        {
            SubjectId: $scope.data.ID,
            CreatorID: $scope.$parent.CurrentDetail.UserID,
            DiscID: $scope.$parent.CurrentDetail.DiscID,
            CompID: $scope.$parent.CurrentDetail.CompID,
            SubjType: 1,
            Title: $scope.data.Title,
            Receipts: $scope.data.Receipts,
            Content: $scope.data.Content,
            Attatchs: $scope.data.AttatchList,
            CreatorName: $scope.$parent.CurrentDetail.UserName,
            DiscName: $scope.data.DiscName,
            DiscType: $scope.data.DiscType,
            ApplyMoney: '',
            UpdateOn: '',
            UpdatorName:''
        };
    }
    // #endregion
    // #region 採購模型
    function PurchaseModel()
    {
        $scope.UpdatePurchaseMoney =
            {
                SubjectId: $scope.data.ID,
                CreatorID: $scope.$parent.CurrentDetail.UserID,
                DiscID: $scope.$parent.CurrentDetail.DiscID,
                CompID: $scope.$parent.CurrentDetail.CompID,
                SubjType: 1,
                Title: $scope.data.Title,
                Receipts: $scope.data.Receipts,
                Content: $scope.data.Content,
                Attatchs: $scope.data.AttatchList,
                CreatorName: $scope.$parent.CurrentDetail.UserName,
                DiscName: $scope.data.DiscName,
                DiscType: $scope.data.DiscType,
                Purchase: [],
                UpdateOn: '',
                UpdatorName: ''
            };
    }
    // #endregion
    // #region 請假模型
    function LeaveModel()
    {
        $scope.UpdatePersonLeave =
            {
                SubjectId: $scope.data.ID,
                CreatorID: $scope.$parent.CurrentDetail.UserID,
                DiscID: $scope.$parent.CurrentDetail.DiscID,
                CompID: $scope.$parent.CurrentDetail.CompID,
                SubjType: 1,
                Title: $scope.data.Title,
                Receipts: $scope.data.Receipts,
                Content: $scope.data.Content,
                Attatchs: $scope.data.AttatchList,
                CreatorName: $scope.$parent.CurrentDetail.UserName,
                DiscName: $scope.data.DiscName,
                DiscType: $scope.data.DiscType,
                PersonLeave: '',
                UpdateOn: '',
                UpdatorName: ''
            }
    }
    // #endregion
    // #region 外出模型
    function GooutModel()
    {
        $scope.UpdateGoOut =
            {
                SubjectId: $scope.data.ID,
                CreatorID: $scope.$parent.CurrentDetail.UserID,
                DiscID: $scope.$parent.CurrentDetail.DiscID,
                CompID: $scope.$parent.CurrentDetail.CompID,
                SubjType: 1,
                Title: $scope.data.Title,
                Receipts: $scope.data.Receipts,
                Content: $scope.data.Content,
                Attatchs: $scope.data.AttatchList,
                CreatorName: $scope.$parent.CurrentDetail.UserName,
                DiscName: $scope.data.DiscName,
                DiscType: $scope.data.DiscType,
                GoOut: '',
                UpdateOn: '',
                UpdatorName: ''
            };
    }
    // #endregion
    // #region 加班模型
    function OvertimeModel()
    {
       $scope.UpdateOverTime =
            {
                SubjectId: $scope.data.ID,
                CreatorID: $scope.$parent.CurrentDetail.UserID,
                DiscID: $scope.$parent.CurrentDetail.DiscID,
                CompID: $scope.$parent.CurrentDetail.CompID,
                SubjType: 1,
                Title: $scope.data.Title,
                Receipts: $scope.data.Receipts,
                Content: $scope.data.Content,
                Attatchs: $scope.data.AttatchList,
                CreatorName: $scope.$parent.CurrentDetail.UserName,
                DiscName: $scope.data.DiscName,
                DiscType: $scope.data.DiscType,
                OverTime: '',
                UpdateOn: '',
                UpdatorName: ''
            };
    }
    // #endregion
    // #region 因為建立起開啟主題詳細頁需要封閉空間，但是如果對方是直接開啟獨立詳細頁，區間並沒有建立，這種情況下，直接拿取CurrentUser的資料
    function InitCurrentDetail() {
        if (Object.getOwnPropertyNames(ThisScope.$parent.CurrentDetail).length === 0) {
            ThisScope.$parent.CurrentDetail.SubjID = ThisScope.$parent.CurrentSpage.SubjID;
            ThisScope.$parent.CurrentDetail.CompID = ThisScope.$parent.CurrentSpage.CompID;
            ThisScope.$parent.CurrentDetail.UserID = ThisScope.$parent.IndexData.CurrentUser.UserID;
            ThisScope.$parent.CurrentDetail.DiscID = ThisScope.$parent.CurrentDiscussion.discID;
            ThisScope.$parent.CurrentDetail.UserName = ThisScope.$parent.IndexData.CurrentUser.UserName;
        }
    };
    // #endregion
}]);