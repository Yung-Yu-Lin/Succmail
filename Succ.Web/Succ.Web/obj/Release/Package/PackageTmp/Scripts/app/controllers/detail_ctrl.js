SuccApp.controller('DetailCtrl', ['$scope', 'SubDetail', '$http', '$sce', 'SubHistory', 'ReplyHistory', '$filter', 'MyFavCT', 'MyBoxCT', 'FavFactory', 'IsInsFactory', 'SubjectEvent', '$parse', 'ReplyService', 'ColorFactory', 'SubjectProgress', 'SubjectProgressBtn', '$rootScope', 'DiscType', '$routeParams', 'CopySubjUrl', 'DelSubjFactory', 'getfav', 'AdminService', 'AuditClass', 'getmybox', 'DelReplyFactory', 'ReplyTo', function ($scope, SubDetail, $http, $sce, SubHistory, ReplyHistory, $filter, MyFavCT, MyBoxCT, FavFactory, IsInsFactory, SubjectEvent, $parse, ReplyService, ColorFactory, SubjectProgress, SubjectProgressBtn, $rootScope, DiscType, $routeParams, CopySubjUrl, DelSubjFactory, getfav, AdminService, AuditClass, getmybox, DelReplyFactory, ReplyTo) {
    //獨立詳細頁 
    // #region 參數
    $scope.canAudit = false;
    $scope.isbackAndReApproval = false;
    $scope.Total = 0;
    var isNeedUpdateReplyReadState = false;
    var isUpdateSubjectReadState = false;
    // 是不是要繼續簽核假資料
    $scope.AdminFlowContinue = false;
    $scope.IsChangeFlow = false;
    //判斷是否有權利開啟獨立詳細頁
    $scope.IsRightToVisit = false;
    $scope.IsLoadingFinish = false;
    for (var i = 0; i < $scope.$parent.$parent.IndexData.Companies.length; i++)
    {
        if(!$scope.IsRightToVisit)
        {
            SubDetail.GetRightToAccess({ CompID: $scope.$parent.$parent.IndexData.Companies[i].CompanyID, UserID: $scope.$parent.$parent.userid, SubjID: $routeParams.SubID })
            .success(function (result) {
                if (result > 0) {
                    $scope.IsRightToVisit = true;
                }
            });
        }
    }
    //單獨開啟主題詳細頁 不顯示Left Menu
    $scope.$parent.ShowLeftMenu = false;
    //CompanyID
    var CompanyID = $routeParams.CompID;
    $scope.$parent.$parent.CurrentSpage.CompID = CompanyID;
    //UserID
    var UserID = $scope.$parent.$parent.IndexData.CurrentUser['UserID'];
    //SubjectID
    var SubjectID = $routeParams.SubID;
    $scope.$parent.$parent.CurrentSpage.SubjID = SubjectID;
    //DiscID
    var DiscID = "";
    //Time Random
    var d = new Date();
    $scope.Disc = {};
    //取得主題後，將自己的收件人資料放入
    var meInReceipts = [];
    //Source 判斷主題詳細頁來源從何開啟 0:來自未讀訊息,1:來自我的信箱,2:來自我的收藏,3:來自討論組列表,4:來自以讀訊息列表,5:來自申請歸檔
    var Source = $routeParams.Source;
    //預設主題紀錄的URL
    $scope.SubHistoryUrl = '/Subject/HistoryList';
    //預設回覆紀錄的URL
    $scope.ReplyHistoryUrl = '/Subject/ReplyHistoryList';
    //預設不顯示主題紀錄區
    $scope.ShowSubHis = false;
    //主題詳細頁，有關標籤的物件集合
    $scope.SubjTag = {};
    // #endregion
    // #region 行政區審核流程Viewmodel
    var FlowAudit = function (flowAudit) {
        if (!flowAudit) flowAudit = {};
        var FlowAudit = {
            FlowID: flowAudit.FlowID || null,
            Name: flowAudit.Name || null,
            AuditID: flowAudit.AuditID || null,
            State: flowAudit.State || null,
            Serise: flowAudit.Serise || null,
            CheckClass: flowAudit.State === null ? AuditClass.UnCheck : flowAudit.State === true ? AuditClass.OkCheck : AuditClass.NoCheck,
            CanAudit: (flowAudit.State === null && UserID === flowAudit.AuditID && ($scope.lastFlowSerise + 1) === flowAudit.Serise && $scope.data.Progress < SubjectProgress.Closed && $scope.AdminFlowContinue === true && $scope.IsChangeFlow === false) ? true : false,
            ReCheckClass: flowAudit.ReCheckClass || AuditClass.UnCheck,
            ReSignCheckClass: flowAudit.Serise <= $scope.lastFlowSerise ? AuditClass.UnCheck : AuditClass.UnCheckGray,
            ReSign: null
        };
        return FlowAudit;
    };
    // #endregion
    // #region 行政區款項請領Viewmodel
    var ApplyMoney = function (applyMoney) {
        if (!applyMoney) applyMoney = {};
        var ApplyMoney = {
            ApplyMoneyID: applyMoney.ApplyMoneyID || null,
            pDate: applyMoney.pDate || null,
            pName: applyMoney.pName || null,
            pPrice: applyMoney.pPrice || null,
            pQty: applyMoney.pQty || null,
            pTotal: applyMoney.pTotal || null,
            pMemo: applyMoney.pMemo || null,
        };
        return ApplyMoney;
    };
    // #endregion
    // #region 行政區採購計畫Viewmodel
    var Purchase = function (purchase) {
        if (!purchase) purchase = {};
        var Purchase =
            {
                PurchasID: purchase.PurchasID || null,
                pName: purchase.pName || null,
                pPrice: purchase.pPrice || null,
                pQty: purchase.pQty || null,
                pTotal: purchase.pTotal || null,
                pMemo: purchase.pMemo || null
            };
        return Purchase;
    }
    // #endregion
    // #region 送出審核 ViewModel
    var UpdateAudit = function (updateAudit)
    {
        if (!updateAudit) updateAudit = {};
        var UpdateAudit = {
            SubjID: updateAudit.SubjID || null,
            State: updateAudit.State || null,
            Serise: updateAudit.Serise || null,
            UserID: updateAudit.UserID || null,
            DiscID: updateAudit.DiscID || null
        };
        return UpdateAudit;
    };
    // #endregion
    // #region 呼叫Factory拿取主題詳細頁資料
    SubDetail.GetSubjDetail({ SubjectID: SubjectID, UserID: UserID })
    .then(function (result)
    {
        var data = result.data;
        var date = new Date(data['CreateOn'] * 1000);
        $scope.SubjTag.EventTagName = data['SubjTagName'] == null ? "" : data['SubjTagName'] + " - ";
        $scope.SubjTag.EventTagID = data['SubjTagId'];
        $scope.SubjTag.CusTagName = data['CusTagName'] == null ? "" : data['CusTagName'] + " - ";
        $scope.SubjTag.CusTagID = data['CusTagId'];
        $scope.SubjTag.timeString = " - " + date.getFullYear() + "/" + (('0' + (date.getMonth() + 1)).slice(-2)) + "/" + ('0' + date.getDate()).slice(-2);
        // 過濾掉內嵌圖
        data.AttatchList = $filter('filter')(data.AttatchList, { isEmbed: false });
        //指定scopeData(主題詳細頁)
        $scope.data = data;
        // 是不是要繼續簽核
        $scope.AdminFlowContinue = $scope.data.AdminFlowContinue;
        // 流程簽核是否有異動
        $scope.IsChangeFlow = $scope.data.IsChangeFlow;
        //設定討論組名稱
        $scope.Disc.discName = $scope.data.DiscName;
        //設定當下拜訪討論組
        $scope.$parent.$parent.CurrentDiscussion['discID'] = data.DiscussionID;
        DiscID = data.DiscussionID;
        $scope.$parent.$parent.CurrentDiscussion['discName'] = data.DiscName;
        //做為收件人為自己時，刷新的假閱讀時間
        var FakeReadTime = Math.round(new Date().getTime() / 1000.0);
        //轉換主題詳細頁 內容html 
        //內簽圖格式修正
        $scope.data.Content = $sce.trustAsHtml($scope.data.Content.replace(new RegExp('onclick="window.parent.showImg\\(this\\)"', 'g'), '').replace(new RegExp('src="/Attatch/getImg/', 'g'), 'onclick="showImg(this)" src="/Attatch/getImg/').replace(new RegExp('src="/Attachment/getImg', 'g'), 'onclick="showImg(this)" src="/Attachment/getImg').replace(new RegExp('src="https://succmail.com/Attachment/getImg', 'g'), 'onclick="showImg(this)" src="/Attachment/getImg').replace(new RegExp('/Subject/SubjectDetail/', 'g'), '/Subject/SubjectDetail/tranfer').replace(new RegExp('<a href="/Attachment/getImg', 'g'), '<a hrefAttr="Attachment/getImg'));
        //ApplyData + RejectData
        $scope.data.ProcessData = $filter('orderBy')($scope.data.ProcessData, 'ProcessTime', false);
        // #region 未讀處理
        meInReceipts = $filter('filter')(data.Receipts, { UserID: UserID });
        if (typeof meInReceipts[0] !== 'undefined')
        {
            // 如果是未讀狀態就呼叫SubDetail Service 送出後端
            if (meInReceipts[0].UserReadStatus === 0)
            {
                //已讀設定
                meInReceipts[0].UserReadStatus = 1;
                //已讀時間設定為現在時間
                meInReceipts[0].UserReadTime = FakeReadTime;
                SubDetail.UpdateReadState(meInReceipts[0], SubjectID, UserID, CompanyID, data.DiscussionID);
                isNeedUpdateReplyReadState = false;
                isUpdateSubjectReadState = true;
            }
        };
        // #endregion
        // #region 行政區審核資料
        if ($scope.data.DiscType === DiscType.Purchasing || $scope.data.DiscType === DiscType.ApplyMoney)
        {
            var FlowDataInData = $scope.data.AdminFlow;
            $scope.FlowData = [];
            // 審核到哪裡
            $scope.lastFlowSerise = 0;
            angular.forEach(FlowDataInData, function (value, key) {
                if (value.State != null) {
                    $scope.lastFlowSerise = value.Serise;
                }
                value.FlowID = key;
                $scope.FlowData.push(new FlowAudit(value));
            });
            $scope.FlowStyle = { 'width': (100 / FlowDataInData.length) + '%' };
            $scope.FlowLineStyle = { 'width': +(100 - (100 / FlowDataInData.length)) + '%' };
        };
        // #endregion
        // #region 行政區表單(款項請領)資料
        if ($scope.data.DiscType === DiscType.ApplyMoney) {
            // 表單陣列
            $scope.ApplyMoney = [];
            //歸零Total
            $scope.Total = 0;

            var ApplyMoneyInData = $scope.data.ApplyMoneyList;

            // 塞到viewmodel
            angular.forEach(ApplyMoneyInData, function (value, key) {
                value.pPrice = parseFloat(value.pPrice);
                value.pQty = parseInt(value.pQty);
                value.pDate = $filter('converdate')(value.pDate, true);
                $scope.ApplyMoney.push(new ApplyMoney(value));
                if (value.pPrice !== null) { $scope.Total += parseFloat(value.pTotal); }
            });

            var IsNegative = $scope.Total < 0 ? true : false;
            if (IsNegative) {
                //負
                var TotalNumber = $scope.Total * -1;
                $scope.data.Money = " －" + $filter('currency')(TotalNumber);
            }
            else {
                //正
                $scope.data.Money = ' ' + $filter('currency')($scope.Total);
            }
        }
        // #endregion
        // #region 行政區表單(採購)資料
        else if ($scope.data.DiscType === DiscType.Purchasing) {
            //表單陣列 
            $scope.PurchaseMoney = [];
            $scope.Total = 0;
            var PurchaseData = $scope.data.PurchasList;

            //塞到Viewmodel
            angular.forEach(PurchaseData, function (value, key) {
                value.pPrice = parseFloat(value.pPrice);
                value.pQty = parseInt(value.pQty);
                $scope.PurchaseMoney.push(new Purchase(value));
                if (value.pPrice != null) { $scope.Total += parseFloat(value.pTotal); }
            });

            $scope.data.Money = ' ' + $filter('currency')($scope.Total);
        }
        // #endregion
        $scope.IsLoadingFinish = true;
    });
    // #endregion
    // #region 呼叫Factory拿取主題詳細頁回覆資料
    SubDetail.GetSubjReply({ SubjectID: SubjectID, UserID: UserID })
    .then(function (result) {
        var data = result.data;
        var isAdmin = $scope.$parent.$parent.IndexData.CurrentUser['isAdmin'];
        //做為收件人為自己時，刷新的假閱讀時間
        var FakeReadTime = Math.round(new Date().getTime() / 1000.0);
        angular.forEach(data, function (value, key)
        {
            //內簽圖格式修正
            value.Content = value.Content.replace(new RegExp('onclick="window.parent.showImg\\(this\\)"', 'g'), '').replace(new RegExp('src="/Attatch/getImg/', 'g'), 'onclick="showImg(this)" src="/Attatch/getImg/').replace(new RegExp('src="/Attachment/getImg', 'g'), 'onclick="showImg(this)" src="/Attachment/getImg').replace(new RegExp('src="https://succmail.com/Attachment/getImg', 'g'), 'onclick="showImg(this)" src="/Attachment/getImg').replace(new RegExp('/Subject/SubjectDetail/', 'g'), '/Subject/SubjectDetail/tranfer').replace(new RegExp('<a href="/Attachment/getImg', 'g'), '<a hrefAttr="Attachment/getImg');
            // 過濾掉內嵌圖
            value.Attatchs = $filter('filter')(value.Attatchs, { isEmbed: false });
            // 過濾出收件人是自己
            meInReceipts = $filter('filter')(value.Receipts, { UserID: UserID });
            if (typeof meInReceipts[0] !== 'undefined') {
                // 如果是未讀狀態就直接設定已讀
                if (meInReceipts[0].UserReadStatus === 0) {
                    meInReceipts[0].UserReadStatus = 1;
                    meInReceipts[0].UserReadTime = FakeReadTime;
                    isNeedUpdateReplyReadState = true;
                    SubDetail.UpdateReadState(meInReceipts[0], SubjectID, UserID, CompanyID, $scope.$parent.$parent.CurrentDiscussion.discID);
                }
            }
            //設定是否為老闆
            value.IsBoss = isAdmin;
        });
        //指定回復資料
        $scope.ReplyList = data;
        //迴圈跑每筆回覆
        angular.forEach(data, function (value, key) {
            //如果ReplyTo不等於空
            if (value.ReplyTo != ReplyTo.Empty) {
                //用主題回覆的ReplyTo等於主題的ReplyID濾出該篇的回覆
                var FilterReplyLevel2 = $filter('filter')(data, { ID: value.ReplyTo });
                value.ReplyToName = true;
                //把該篇回覆創立者的值塞給ReplyCreator
                value.ReplyCreator = FilterReplyLevel2[0].CreatorName;
                //把該篇回覆時間的值塞給ReplyCreateOn
                value.ReplyCreateOn = FilterReplyLevel2[0].CreateOn;
            }
            else
            {
                value.ReplyToName = false;
            }
        });
    });
    // #endregion
    // #region 是否顯示完成時間軸
    $scope.showTimeLine = function (progress, discType)
    {
        if (progress >= SubjectProgress.Closed && discType == DiscType.Normal)
        {
            return true;
        }
        return false;
    };
    // #endregion
    // #region 設定ProcessData Width
    $scope.setWidth = function (DataLength) {
        var AllWidth = $scope.data.PlanCloseOn != 0 ? 54 : 75;
        var DataWidth = AllWidth / DataLength;
        var result = { 'width': '' + DataWidth + '%' };
        return result
    };
    // #endregion
    // #region 設定主題如果含有PlanCloseOn 需判斷是否改變時間軸顏色
    $scope.setRed = function () {
        var IsRed = ($scope.data.PlanCloseOn != 0 && $scope.data.ClosedOn > $scope.data.PlanCloseOn) ? true : false;
        if (IsRed) {
            return {
                'background': 'linear-gradient(to right, gray 78%,red 22%)'
            }
        }
        else {
            return {};
        }

    };
    // #endregion
    // #region 移出或加入我的排程 
    $scope.ChangeMyBox = function (flag) {
        $scope.data.IsMyIns = !$scope.data.IsMyIns;
        SettingIsIns(DiscID, CompanyID, UserID, SubjectID, flag);
    };
    // #endregion
    // #region 移出或加入我的收藏 
    $scope.ChangeMyFav = function (flag) {
        $scope.data.IsFav = !$scope.data.IsFav;
        SettingFav(DiscID, CompanyID, UserID, SubjectID, flag);
    };
    // #endregion
    // #region 更改紅綠燈顏色
    $scope.ChangeColor = function (color) {
        $scope.data.SubjectColor = color;
        SettingColor(DiscID, SubjectID, color);
    };
    // #endregion
    // #region 匯出成文件 
    $scope.export = function () {
        $("#frameSetting").attr("src", encodeURI("/Subject/GetSubjPDF/?UserID=" + UserID + "&SubjID=" + SubjectID + "&t=" + d.getTime()));
    };
    // #endregion
    // #region 複製url
    $scope.copyUrl = function () {
        return CopySubjUrl.OnlineString + CompanyID + "/" + UserID + "/" + SubjectID + "/" + 0;
    };
    // #endregion
    // #region 刪除主題
    $scope.DeleteSubject = function ()
    {
        var CheckString = $filter('translate')('AreYouSure');
        var result = confirm(CheckString);
        if (result)
        {
             DelSubjFactory.DelSubject(SubjectID, DiscID, UserID)
            .then(function (result) {
                if (result.data.IsSuccessful == true) {
                    DelSubjFactory.AfterDelSubj(DiscID, SubjectID, Source);
                }
            });
        }
    };
    // #endregion
    // #region 編輯主題 
    $scope.EditSubject = editSubject;
    function editSubject(data)
    {
        //外出單轉換
        if ($scope.data.DiscType === DiscType.GoOut) {
            GoOutTrans();
        }
        //請假單轉換
        else if ($scope.data.DiscType === DiscType.PersonLeave) {
            LeaveTrans();
        }
        //加班單轉換
        else if ($scope.data.DiscType === DiscType.Overtime) {
            OverTimeTrans();
        }
        //關閉主題紀錄
        $scope.ShowSubHis = false;
        //進入編輯主題狀態
        $scope.isEditSubj = true;
        //隱藏回覆
        $scope.isReply = false;
        $scope.isReply2lv = false;
        $scope.replyEdit = '';
        $scope.data.Source = Source;
        //關閉Scroll
        //$('body').css("overflow", "hidden");
        $scope.EditorTemplate = '/Subject/EditorTemplate';
    };
    // #endregion
    // #region 回覆主題 
    $scope.ReplySubject = function ()
    {
        $scope.isReply = true;
        $scope.isReply2lv = false;
        $scope.replyEdit = '';
        $scope.isEditSubj = false;
        $scope.EditorTemplate = '/Subject/EditorTemplate';
        //Scroll To Reply Block
        var commentHeight = document.getElementById("reply-subj").offsetTop;
        $('.tab_list_body').animate({ scrollTop: commentHeight });
    }
    // #endregion
    // #region 監聽由 EditorCtrl closeEditor廣播來的事件
    $scope.$on('closeEditor', function (event, data) {
        switch (data.editorType) {
            case 'Reply2lv':
                $scope.reply2lv = '';
                break;
            case 'ReplySubj':
                $scope.isReply = false;
                break;
            case 'EditSubj':
                $scope.isEditSubj = false;
                break;
            case 'EditReply':
                $scope.replyEdit = '';
                break;
        }
    });
    // #endregion
    // #region 監聽由ReplyCtrl ReplyInserted廣播來的事件
    $scope.$on(SubjectEvent.ReplyInserted, function (event, data)
    {
        //取代假資料當中的圖片，也能夠點擊放大
        data.Content = data.Content.replace(new RegExp('onclick="window.parent.showImg\\(this\\)"', 'g'), '').replace(new RegExp('src="/Attatch/getImg/', 'g'), 'onclick="showImg(this)" src="/Attatch/getImg/').replace(new RegExp('src="/Attachment/getImg', 'g'), 'onclick="showImg(this)" src="/Attachment/getImg').replace(new RegExp('src="https://succmail.com/Attachment/getImg', 'g'), 'onclick="showImg(this)" src="/Attachment/getImg');
        // viewmodel
        $scope.ReplyObj = {
            SubjectID: data.SubjId,
            ID: data.ID,
            Content: data.Content,
            CreateBy: data.CreatedBy,
            CreatorName: data.CreatedName,
            CreateOn: data.CreateOn,
            IsRead: true,
            IsAdmin: data.IsAdmin,
            ModifiedBy: '',
            ModifiedOn: '',
            ShowBtn: false,
            IsShowHis: false,
            IsBoss: data.IsBoss,
            IsCreator: true,
            Attatchs: $filter('filter')(data.Attatchs, { isEmbed: false }),
            Receipts: data.Receipts,
            ReplyToName: data.ReplyToName,
            ReplyCreateOn: data.ReplyCreateOn,
            ReplyCreator: data.ReplyCreator
        };
        $scope.ReplyList.push($scope.ReplyObj);
        $scope.data.ReplyCount = $scope.data.ReplyCount + 1;
    });
    // #endregion
    // #region 監聽由EditMessageCtrl MessageUpdated廣播來的事件
    $scope.$on(SubjectEvent.MessageUpdated, function (event, data)
    {
        $scope.SubjTag.EventTagName = data['SubjTagID'] == null ? "" : data['SubjTagName'] + " - ";
        $scope.SubjTag.EventTagID = data['SubjTagID'];
        $scope.SubjTag.CusTagName = data['CusTagID'] == null ? "" : data['CusTagName'] + " - ";
        $scope.SubjTag.CusTagID = data['CusTagID'];
        $scope.data.Title = data.Title;
        $scope.data.Content = $sce.trustAsHtml(data.Content.replace(new RegExp('onclick="window.parent.showImg\\(this\\)"', 'g'), '').replace(new RegExp('src="/Attatch/getImg/', 'g'), 'onclick="showImg(this)" src="/Attatch/getImg/').replace(new RegExp('src="/Attachment/getImg', 'g'), 'onclick="showImg(this)" src="/Attachment/getImg').replace(new RegExp('src="https://succmail.com/Attachment/getImg', 'g'), 'onclick="showImg(this)" src="/Attachment/getImg').replace(new RegExp('<a href', 'g'), '<a hrefAttr'));
        $scope.data.Receipts = data.Receipts;
        $scope.data.PlanCloseOn = data.PlanDate;
        //主題詳細頁面，更新Update人及時間
        $scope.data.SubjModifiedById = data.CurrentUserID;
        $scope.data.SubjModifiedBy = data.UpdatorName;
        $scope.data.SubjModifiedOn = data.UpdateOn;
        //款項請領列表更新
        if ($scope.data.DiscType === DiscType.ApplyMoney)
        {
            var ApplyMoneys = data.ApplyMoney;
            if (ApplyMoneys !== undefined) {
                $scope.ApplyMoney.length = 0;
                $scope.Total = 0;
                //塞到Viewmodel
                angular.forEach(ApplyMoneys, function (value, key) {
                    var date = new Date(value.pDate);
                    value.pDate = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
                    value.pPrice = parseFloat(value.pPrice);
                    value.pQty = parseInt(value.pQty);
                    $scope.ApplyMoney.push(new ApplyMoney(value));
                    if (value.pPrice !== null) { $scope.Total += parseFloat(value.pTotal); }
                });
                //Validate Total is Negative?
                var IsNegative = $scope.Total < 0 ? true : false;
                if (IsNegative) {
                    //負
                    var TotalNumber = $scope.Total * -1;
                    $scope.data.Money = " －" + $filter('currency')(TotalNumber);
                }
                else {
                    //正
                    $scope.data.Money = ' ' + $filter('currency')($scope.Total);
                }
            }
        }
        //採購計畫更新
        if ($scope.data.DiscType === DiscType.Purchasing)
        {
            var PurchaseMoney = data.Purchase;
            if (PurchaseMoney !== undefined) {
                $scope.PurchaseMoney.length = 0;
                $scope.Total = 0;
                //塞到Viewmodel
                angular.forEach(PurchaseMoney, function (value, key) {
                    value.pPrice = parseFloat(value.pPrice);
                    value.pQty = parseInt(value.pQty);
                    $scope.PurchaseMoney.push(new Purchase(value));
                    if (value.pPrice !== null) { $scope.Total += parseFloat(value.pTotal); }
                });
                $scope.data.Money = ' ' + $filter('currency')($scope.Total);
            }
        }
        //外出單更新
        var GoOutData = data.GoOut;
        if (GoOutData !== undefined) {
            $scope.data.GoOutItem = GoOutData;
        }
        //請假單更新
        var LeaveData = data.PersonLeave;
        if (LeaveData !== undefined) {
            $scope.data.PersonLeaveItem = LeaveData;
        }
        //加班單更新
        var OverTimeData = data.OverTime
        if (OverTimeData !== undefined) {
            $scope.data.OverTimeItem = OverTimeData;
        }
        // 過濾掉內嵌圖
        $scope.data.AttatchList = $filter('filter')(data.Attatchs, { isEmbed: false });
    });
    // #endregion
    // #region 監聽由EditMessageCtrl ReplyUpdated廣播來的事件
    $scope.$on(SubjectEvent.ReplyUpdated, function (event, data) {
        // 撈出要覆蓋的回覆資料
        var CurrentReplyToUpdate = $filter('filter')($scope.ReplyList, { ID: data.ReplyID })[0];
        //取代假資料當中的圖片，也能夠點擊放大
        data.Content = data.Content.replace(new RegExp('onclick="window.parent.showImg\\(this\\)"', 'g'), '').replace(new RegExp('src="/Attatch/getImg/', 'g'), 'onclick="showImg(this)" src="/Attatch/getImg/').replace(new RegExp('src="/Attachment/getImg', 'g'), 'onclick="showImg(this)" src="/Attachment/getImg').replace(new RegExp('src="https://succmail.com/Attachment/getImg', 'g'), 'onclick="showImg(this)" src="/Attachment/getImg').replace(new RegExp('<a href', 'g'), '<a hrefAttr');
        CurrentReplyToUpdate.Content = data.Content;
        CurrentReplyToUpdate.Receipts = data.Receipts;
        CurrentReplyToUpdate.ModifiedBy = data.CurrentUserName;
        CurrentReplyToUpdate.ModifiedOn = data.UpdatedOn;
        CurrentReplyToUpdate.Attatchs = $filter('filter')(data.Attatchs, { isEmbed: false });
    });
    // #endregion
    // #region 開啟主題紀錄 input:Data.Title(測試)
    $scope.OpenHistory = function (para) {
        $scope.ShowSubHis = !$scope.ShowSubHis;
        if ($scope.ShowSubHis) {
            //Scroll To History List
            var commentHeight = document.getElementById("receiver").offsetTop;
            //$('.tab_list_body').animate({ scrollTop: commentHeight });
            SubHistory.OpenSubHistory(para);
        }
    };
    // #endregion
    // #region 主題狀態  0,1,2,3 進行中 申請歸檔 完成 退回
    $scope.SubjectProgress = function (state) {
        var param = {
            State: state,
            UserID: UserID,
            DiscID: DiscID,
            SubjectID: SubjectID
        };
        var promise = SubDetail.SubjectProgress(param);
        promise
        .success(function (payload) {
            if (payload.IsSuccessful == true) {
                progressComplete(state);
            } else {
                //alert(payload.Message);
            }
        })
        .error(function (error) {
            //alert('error');
        });
    };
    // #endregion
    // #region 快速回覆
    $scope.fastReply = function (insSReply) {
        return;
        // 送出的收件人陣列
        var receiptsForSend = [];
        angular.forEach($scope.data.Receipts, function (value, key) {
            receiptsForSend.push(value.UserID);
        });
        // viewmodel
        var fastReply = {
            SubjId: $scope.data.ID,
            DiscID: $scope.CurrentDiscussion.discID,
            Receipts: receiptsForSend,
            Content: insSReply,
            Attatchs: [],
            DiscName: $scope.CurrentDiscussion.discName,
            CreatedBy: $scope.IndexData.CurrentUser.UserID,
            CreatedName: $scope.IndexData.CurrentUser.UserName,
            CompanyID: $routeParams.CompID,
            CreateOn: '',
            ReplyCreateOn: '',
            ReplyCreator: '',
            ReplyToName: '',
            IsAdmin: false,
            IsBoss: false,
            ID: ''
        };
        var fastReplyPromise = ReplyService.create(fastReply);
        fastReplyPromise.success(function (payload) {
            if (payload.IsSuccessful == true) {
                //用新增主題回覆的ReplyTO等於主題的ReplyID濾出該篇的回覆
                var FilterReplyLevel2 = $filter('filter')($scope.ReplyList, { ID: payload.DataObj.ReplyTO });
                //把該篇回覆創立者的值塞給ReplyCreator
                FilterReplyLevel2[0].ReplyCreator = FilterReplyLevel2[0].CreatorName;
                //把該篇回覆時間的值塞給ReplyCreateOn
                FilterReplyLevel2[0].ReplyCreateOn = FilterReplyLevel2[0].CreateOn;
                // 接收回傳的物件並顯示在頁面上
                fastReply.ReplyCreateOn = FilterReplyLevel2[0].ReplyCreateOn;
                fastReply.ReplyCreator = FilterReplyLevel2[0].ReplyCreator;
                fastReply.CreateOn = payload.DataObj.CreatedOn;
                fastReply.IsAdmin = payload.DataObj.IsAdmin;
                fastReply.IsBoss = payload.DataObj.IsBoss;
                fastReply.ID = payload.DataObj.ReplyID;
                fastReply.Receipts = $scope.data.Receipts;
                //如果ReplyTo不等於空
                if (payload.DataObj.ReplyTO != ReplyTo.Empty)
                {
                    fastReply.ReplyToName = true;
                }
                // 廣播回覆新增成功事件
                $scope.$emit(SubjectEvent.ReplyInserted, fastReply);
            } else {
                //alert("reply error!!");
            }
        })
        .error(function (error) {
            //alert('server Error');
        });
    };
    // #endregion
    // #region 判斷主題預計完成日期顯示方式
    $scope.PlanDate = function (para) {
        var Today = Date.parse(new Date()) / 1000;
        var dayDifference = Math.round((para - Today) / 60 / 60 / 24);
        //超越99 顯示99+
        if (Math.abs(dayDifference) > 99)
            $scope.PlanDiff = "99+";
        else
            $scope.PlanDiff = Math.abs(dayDifference);
        if (dayDifference >= 0)
            return "0";
        else
            return "1";

    };
    // #endregion
    // #region 判斷主題是否顯示刪除按鈕
    $scope.IsDelBtn = function (IsBoss, Progress) {
        if (Progress >= SubjectProgress.Closed)
            return false;
        else if (Progress < SubjectProgress.Closed && IsBoss)
            return true;
        else if (Progress < SubjectProgress.Closed && !IsBoss)
            return false;
    };
    // #endregion
    // #region 判斷主題程序按鈕
    $scope.progressBtn = function (discType, IsBoss, IsAdmin, Progress) {
        if (Progress < SubjectProgress.Closed) {
            // 如果未完成(進行中)
            if (IsBoss || IsAdmin) {
                if (discType === DiscType.Normal) {
                    // 完成按鈕
                    return SubjectProgressBtn.Finish;
                }
                else if ((discType === DiscType.Purchasing || discType === DiscType.ApplyMoney) && $scope.lastFlowSerise > 0 && $scope.AdminFlowContinue === true) {
                    // 重簽按鈕
                    return SubjectProgressBtn.ReAudit;
                }
                    // 行政區已退回但是可以回覆就顯示完成按鈕
                else if (discType !== DiscType.Normal && ($scope.AdminFlowContinue === false || $scope.AdminFlowContinue === null)) {
                    return SubjectProgressBtn.Finish;
                }
            }
            else {
                // 一般討論組就顯示完成按鈕
                if (discType === DiscType.Normal) {
                    switch (Progress) {
                        case SubjectProgress.InProgress:
                            return SubjectProgressBtn.ApplySubject2;
                            break;
                        case SubjectProgress.ApplyClose:
                            return SubjectProgressBtn.ApplyCancel;
                            break;
                        case SubjectProgress.Reject:
                            return SubjectProgressBtn.ApplySubject2;
                            break;
                    }
                }
                    // 行政區已退回但是可以回覆就顯示完成按鈕
                else if (discType !== DiscType.Normal && ($scope.AdminFlowContinue === false || $scope.AdminFlowContinue === null)) {
                    switch (Progress) {
                        case SubjectProgress.InProgress:
                            return SubjectProgressBtn.ApplySubject2;
                            break;
                        case SubjectProgress.ApplyClose:
                            return SubjectProgressBtn.ApplyCancel;
                            break;
                        case SubjectProgress.Reject:
                            return SubjectProgressBtn.ApplySubject2;
                            break;
                    }
                }
                //AdminGoBack
            }

        }
            //已歸檔已完成
        else {
            // 款項請領和採購計畫顯示退回但不重簽的可選退回按鈕
            if (discType === DiscType.Purchasing || discType === DiscType.ApplyMoney) {
                return SubjectProgressBtn.AdminGoBack;
            }
            else {
                return SubjectProgressBtn.GoBack;
            }
        }
    };
    // #endregion
    // #region 上傳的附件是圖片的時候，附帶照片
    $scope.AttFileImg = function (AttID, fileName) {
        var type = fileName.toLowerCase().slice(fileName.lastIndexOf('.') + 1);
        return "/Attatch/getImg/?CompanyId=" + CompanyID + "&FileName=" + AttID + "." + type;
    };
    // #endregion
    // #region 上傳的附件是不是圖片
    $scope.AttIsImg = function (fileName) {
        var type = fileName.toLowerCase().slice(fileName.lastIndexOf('.') + 1);
        if (type == 'png' || type == 'jpg' || type == 'jpeg' || type == 'gif' || type == 'bmp') {
            return false;
        }
        else {
            return true;
        }
    };
    // #endregion
    // #region 決定上傳附件的Icon
    $scope.AttIcon = function (fileName) {
        return $filter('FileTypeFilter')(fileName);
    };
    // #endregion
    // #region 轉換回覆的html Content
    $scope.ConverContent = function (Content) {
        return $sce.trustAsHtml(Content);
    };
    // #endregion
    // #region 完成區不出現DOM物件判斷
    $scope.isFinish = function (progress) {
        return progress < SubjectProgress.Closed;
    };
    // #endregion
    // #region 決定是否出現編輯主題
    $scope.IsEdit = function (IsCreator, IsBoss, progress) {
        return (IsCreator || IsBoss) && progress < SubjectProgress.Closed;
    };
    // #endregion
    // #region 開啟回覆紀錄 input:Data:Title(測試)
    $scope.OpenReplyHistory = function (SubjID, ReplyID)
    {
        //先關閉所有回覆的紀錄
        for (var i = 0; i < $scope.ReplyList.length; i++)
        {
            if ($scope.ReplyList[i].ID != ReplyID)
                $scope.ReplyList[i].IsShowHis = false;
        }
        //過濾開啟哪一篇回覆的紀錄
        $filter('filter')($scope.ReplyList, { ID: ReplyID }, true)[0].IsShowHis = !($filter('filter')($scope.ReplyList, { ID: ReplyID }, true)[0].IsShowHis);
        //Reply IsShowHis
        var ReplyShowHis = $filter('filter')($scope.ReplyList, { ID: ReplyID }, true)[0].IsShowHis;
        if (ReplyShowHis) {
            //factory Function
            ReplyHistory.OpenSubHistory(SubjID, ReplyID);
            var replyHisHeight = document.getElementById(ReplyID).offsetTop;
            $('.tab_list_body').animate({ scrollTop: replyHisHeight });
        }
    };
    // #endregion
    // #region 回覆 By 回覆
    $scope.ReplyByReply = function (replyID) {
        $scope.reply2lv = replyID;
        $scope.isEditSubj = false;
        $scope.isReply = false;
        $scope.EditorTemplate2lv = '/Subject/EditorTemplate';
        $scope.replyEdit = '';
        //Scroll To Reply Block
        var commentHeight = document.getElementById(replyID).offsetTop - 100;
        $('.tab_list_body').animate({ scrollTop: commentHeight }, 1000);
    };
    // #endregion
    // #region 編輯 By 回覆
    $scope.EditByReply = function (para)
    {
        $scope.reply2lv = '';
        $scope.isEditSubj = false;
        $scope.isReply = false;
        $scope.replyEdit = para;
        $scope.EditorTemplate = '/Subject/EditorTemplate';
        //Scroll To Reply Block
        var commentHeight = document.getElementById(para).offsetTop - 100;
        $('.tab_list_body').animate({ scrollTop: commentHeight }, 1000);
    };
    // #endregion
    // #region 刪除 By 回覆
    $scope.DelByReply = function (ReplyID)
    {
        var CheckString = $filter('translate')('AreYouSure');
        var result = confirm(CheckString);
        if (result)
        {
            DelReplyFactory.DelReply(ReplyID, SubjectID, DiscID, UserID)
            .then(function (result) {
                if (result.data.IsSuccessful == true) {
                    var ReplyItem = $filter('filter')($scope.ReplyList, { ID: ReplyID }, true)[0];
                    var ReplyIndex = $scope.ReplyList.indexOf(ReplyItem);
                    if (ReplyIndex > -1) {
                        $scope.ReplyList.splice(ReplyIndex, 1);
                    };
                    $scope.data.ReplyCount = $scope.data.ReplyCount - 1;
                    DelReplyFactory.AfterDeleteReply(DiscID, SubjectID, Source);
                };
            });
        }
    };
    // #endregion
    // #region 下載檔案
    $scope.DownLoadFile = function (para)
    {
        $("#frameSetting").attr("src", encodeURI("/FileShare/downloadFileByAttID/?AttID=" + para + "&t=" + new Date().getTime()));
    };
    // #endregion
    // #region GoogleDoc
    $scope.GoogleDoc = function (para) {
        $http({
            method: 'get',
            url: '/Attachment/GetFileType/?AttID=' + para
        })
        .success(function (result) {
            var CurrentType = $filter('FileTypeFilter')(result['FileType']);
            switch (CurrentType) {
                case 'excel':
                case 'word':
                case 'ppt':
                    OpenWebOffice(para);
                    break;
                case 'pdf':
                case 'text':
                    OpenGoogleDocView(para);
                    break;
                default:
                    NotToGoogleDoc(para);
                    break;
            }
        });
    };
    // #endregion
    // #region 判定為可以開啟Google Doc的檔案型態
    function OpenGoogleDocView(AttID) {
        //前往Angular config.js 的對應controller
        window.open('/GoogleDoc/' + AttID);
    };
    // #endregion
    // #region 判定為可以利用Web Office開啟的檔案
    function OpenWebOffice(AttID) {
        //前往Angular config.js 的對應controller
        window.open('/WebOffice/' + AttID);
    };
    // #endregion
    // #region 無法開啟Google Doc的檔案類型，直接下載
    function NotToGoogleDoc(AttID)
    {
        $("#frameSetting").attr("src", encodeURI("/FileShare/downloadFileByAttID/?AttID=" + AttID + "&t=" + new Date().getTime()));
    };
    // #endregion
    // #region 行政區審核流程及表單顯示判斷
    $scope.showAdminAuditAndForm = function (discType) {
        // 是款項請領或採購計畫才顯示
        switch (discType) {
            case DiscType.ApplyMoney:
            case DiscType.Purchasing:
                return true;
                break;
            default:
                return false;
                break;
        }
    };
    // #endregion
    // #region 行政區請假 外出 加班顯示判斷
    $scope.showAdminOther = function (discType) {
        switch (discType) {
            case DiscType.GoOut:
            case DiscType.PersonLeave:
            case DiscType.Overtime:
                return true;
                break;
            default:
                return false;
                break;
        }
    };
    // #endregion
    // #region 行政區款項請領表單顯示
    $scope.isApplyMoney = function (discType) {
        return discType == DiscType.ApplyMoney;
    };
    // #endregion
    // #region 行政區採購計畫表單顯示
    $scope.isPurchasing = function (discType) {
        return discType == DiscType.Purchasing;
    };
    // #endregion
    // #region 行政區加班表格顯示
    $scope.isPersonLeave = function (discType) {
        return discType == DiscType.PersonLeave;
    };
    // #endregion
    // #region 行政區外出表格顯示
    $scope.isGoOut = function (discType) {
        return discType == DiscType.GoOut;
    };
    // #endregion
    // #region 行政區請假表格顯示
    $scope.isOvertime = function (discType) {
        return discType == DiscType.Overtime;
    };
    // #endregion
    // #region 行政區審核確認行為,這邊把要審核的關卡、狀態丟到$scope
    $scope.AuditCheck = function (subjId, state, flowItem) {
        if (state != null) {

            // 把要審核的關卡、狀態丟到$scope
            $scope.UpdateAudit = new UpdateAudit({
                SubjID: subjId || null,
                State: state,
                Serise: flowItem.Serise || null,
                UserID: UserID || null,
                DiscID: DiscID || null
            });
        }
    };
    // #endregion
    // #region 行政區送出審核,按下確認後送出簽核
    $scope.AuditSubmit = function () {
        var flowItem = $filter('filter')($scope.FlowData, { Serise: $scope.UpdateAudit['Serise'] })[0];
        // 設為不能再審核,並更新最後審核關卡然後把這關的重新審核啟用
        flowItem.CanAudit = false;
        $scope.lastFlowSerise = flowItem.Serise;
        flowItem.ReSignCheckClass = AuditClass.UnCheck;
        // 塞進viewmodel
        // 傳給serivce
        var promise = AdminService.AuditSubmit($scope.UpdateAudit);
        promise.success(function (payload) {
            if (payload.IsSuccessful === true) {

                // #region  如果是最後一關或不予準就結束這一筆主題狀態設為完成
                if ($scope.lastFlowSerise === $scope.FlowData.length || $scope.UpdateAudit['State'] === 'no') {
                    // #region  設為完成
                    progressComplete(2);
                    //SettingProgress(subjId);
                    // #endregion

                }
                // #endregion

                // #region  修改樣式勾勾或叉叉
                switch ($scope.UpdateAudit['State']) {
                    case 'ok':
                        flowItem.CheckClass = AuditClass.OkCheck;

                        break;
                    case 'no':
                        flowItem.CheckClass = AuditClass.NoCheck;
                        break;
                }
                // #endregion

                $scope.UpdateAudit = null;
                angular.element('.modal-backdrop').remove();
            }
        });
        promise.error(function (error) {
            alert('error');
            $scope.UpdateAudit = null;
        });

    };
    // #endregion
    // #region 取消審核
    $scope.CancelAudit = function () {
        $scope.UpdateAudit = null;
        angular.element('.modal-backdrop').remove();
    };
    // #endregion
    // #region 行政區送出重新審核,把從起點開始的簽核狀態全部還原成初始值
    $scope.ReSignSubmit = function (subjId) {
        var ResignItems = $filter('filter')($scope.FlowData, { ReSign: true });
        if (ResignItems.length == 1) {
            var promise = AdminService.ReSign(new UpdateAudit({
                SubjID: subjId || null,
                State: null,
                Serise: ResignItems[0].Serise || null,
                UserID: UserID || null,
                DiscID: DiscID || null
            }));

            promise.success(function (payload) {
                if (payload.IsSuccessful === true) {
                    $scope.lastFlowSerise = ResignItems[0].Serise - 1;
                    angular.element('#ResignModal').modal('hide');
                    // 還原從起點開始之後的所有簽核狀態
                    reSetFlowAudit();
                }
            });
            promise.error(function (error) {
                alert('Resign error');
            });
        } else {
            alert($filter('translate')('ReSignNoCheck'));
        }

    };
    // #endregion
    // #region 行政區退回並重新審核，把主題從已完成改成進行中，再把從起點開始的簽核狀態全部還原成初始值
    $scope.AdminBack = function (subjId) {
        //所有流程皆從第一關開始執行
        $filter('filter')($scope.FlowData, { Serise: 1 })[0].ReSign = true;
        $filter('filter')($scope.FlowData, { Serise: 1 })[0].ReSignCheckClass = AuditClass.ReSignCheck;
        var reSignItems = $filter('filter')($scope.FlowData, { ReSign: true });

        if (reSignItems.length > 0) {
            var promise = AdminService.AdminBack(new UpdateAudit({
                SubjID: subjId,
                State: null,
                Serise: reSignItems[0].Serise,
                UserID: UserID || null,
                DiscID: DiscID || null
            }));
            promise.success(function (payload) {
                if (payload.IsSuccessful === true)
                {
                    $scope.lastFlowSerise = 0;
                    progressComplete(3);
                    angular.element('#AdminGobackModal').modal('hide');
                    // 重新取得簽核資料
                    SubDetail.GetSubjFlow($scope.CurrentSubjID)
                        .then(function (result) {
                            var FlowDataInData = result.data.AdminFlow;
                            $scope.FlowData = [];
                            // 審核到哪裡
                            $scope.lastFlowSerise = 0;
                            angular.forEach(FlowDataInData, function (value, key) {
                                if (value.State != null) {
                                    $scope.lastFlowSerise = value.Serise;
                                }
                                value.FlowID = key;
                                $scope.FlowData.push(new FlowAudit(value));
                            });
                        });
                } else {
                }
            });
            promise.error(function () {
            });
        } else {
        }
    };
    // #endregion
    // #region 是否顯示完成時間軸
    $scope.showTimeLine = function (progress, discType) {
        if (progress >= SubjectProgress.Closed && discType == DiscType.Normal) {
            return true;
        }
        return false;
    };
    // #endregion
    // #region 顯示退回並重新簽核
    $scope.showBackAndReApproval = function () {
        $scope.isbackAndReApproval = !$scope.isbackAndReApproval;
    };
    // #endregion
    // #region 設定我的收藏
    function SettingFav(discid, compid, userid, subjid, flag)
    {
        getfav.SettingFav(compid, userid, subjid, flag)
        .then(function (result) {
            var isFinish = $scope.data.Progress >= 9 ? true : false;
            MyFavCT.UpdateFavCT(result.data);
            if (isFinish) {
                FavFactory.FinishUpdateFav(discid, subjid, flag);
            }
            else {
                FavFactory.UpdateFav(discid, SubjectID, Source, flag);
            }
        });
    };
    // #endregion
    // #region 設定顏色
    function SettingColor(discid, subjid, color) {
        $http({
            method: 'get',
            url: '/Subject/SetColor?UserID=' + UserID + '&SubjID=' + SubjectID + '&color=' + color
        })
        .success(function (data) {
            var isFinish = $scope.data.Progress >= 9 ? true : false;
            if (isFinish) {
                ColorFactory.FinishUpdateColor(discid, subjid, color);
            }
            else {
                ColorFactory.UpdateColor(discid, subjid, Source, color);
            }
        })
        .error(function () {

        });
    }
    // #endregion
    // #region 設定我的信箱
    function SettingIsIns(discid, compid, userid, subjid, flag) {
        getmybox.SettingIsIns(compid, userid, subjid, flag)
        .then(function (result) {
            MyBoxCT.UpdateBoxCT(result.data);
            IsInsFactory.UpdateIsIns(discid, subjid, Source, flag);
        });
    };
    // #endregion
    // #region 完成主題程序
    function progressComplete(state) {
        //主題狀態  0,1,2,3 申請歸檔 申請歸檔退回(變成進行中) 完成 退回
        switch (state) {
            case 0:
                $scope.data.Progress = SubjectProgress.ApplyClose;
                SubDetail.UpdateSubjectProgress({ SubjId: SubjectID, State: SubjectProgress.ApplyClose, DiscID: DiscID, Source: Source });
                break;
            case 1:
                $scope.data.Progress = SubjectProgress.InProgress;
                SubDetail.UpdateSubjectProgress({ SubjId: SubjectID, State: SubjectProgress.InProgress, DiscID: DiscID, Source: Source });
                break;
            case 2:
                $scope.data.Progress = SubjectProgress.Closed;
                $scope.data.ClosedOn = Math.floor((new Date().getTime() / 1000));
                // 完成之後進行中要移除選單的SubjCount要再要一次
                SubDetail.UpdateSubjectProgress({ SubjId: SubjectID, State: SubjectProgress.Closed, DiscID: DiscID, Source: Source });
                //Single page 完成時刷新詳細頁的Progress Data
                SubDetail.GetProcessData(SubjectID).success(function (data) {
                    $scope.data.ProcessData = data;
                });
                break;
            case 3:
                $scope.data.Progress = SubjectProgress.InProgress;
                // 退後之後完成區要移除選單的SubjCount要再要一次
                SubDetail.UpdateSubjectProgress({ SubjId: SubjectID, State: SubjectProgress.Reject, DiscID: DiscID, Source: Source });
                angular.element('#AdminGobackModal').modal('hide');
                break;
        }
    };
    // #endregion
    // #region 還原從起點開始之後的所有簽核狀態
    function reSetFlowAudit() {
        angular.forEach($scope.FlowData, function (value, key) {
            if (value.Serise > $scope.lastFlowSerise) {
                $scope.FlowData[key] = new FlowAudit({ Name: value.Name, AuditID: value.AuditID, State: null, Serise: value.Serise, ReSign: null });
            }
        });
    };
    // #endregion
    // #region 外出清單轉換型態
    function GoOutTrans() {
        $scope.data.GoOutItem.sYear = parseInt($scope.data.GoOutItem.sYear);
        $scope.data.GoOutItem.sMonth = parseInt($scope.data.GoOutItem.sMonth);
        $scope.data.GoOutItem.sDay = parseInt($scope.data.GoOutItem.sDay);
        $scope.data.GoOutItem.sHour = parseInt($scope.data.GoOutItem.sHour.length < 2 ? ('0' + $scope.data.GoOutItem.sHour) : $scope.data.GoOutItem.sHour);
        $scope.data.GoOutItem.sMinute = parseInt($scope.data.GoOutItem.sMinute.length < 2 ? ('0' + $scope.data.GoOutItem.sMinute) : $scope.data.GoOutItem.sMinute);
        $scope.data.GoOutItem.eYear = parseInt($scope.data.GoOutItem.eYear);
        $scope.data.GoOutItem.eMonth = parseInt($scope.data.GoOutItem.eMonth);
        $scope.data.GoOutItem.eDay = parseInt($scope.data.GoOutItem.eDay);
        $scope.data.GoOutItem.eHour = parseInt($scope.data.GoOutItem.eHour.length < 2 ? ('0' + $scope.data.GoOutItem.eHour) : $scope.data.GoOutItem.eHour);
        $scope.data.GoOutItem.eMinute = parseInt($scope.data.GoOutItem.eMinute.length < 2 ? ('0' + $scope.data.GoOutItem.eMinute) : $scope.data.GoOutItem.eMinute);
        $scope.data.GoOutItem.TotalDays = parseInt($scope.data.GoOutItem.TotalDays);
        $scope.data.GoOutItem.TotalHours = parseInt($scope.data.GoOutItem.TotalHours);
    };
    // #endregion
    // #region 請假清單轉換型態
    function LeaveTrans() {
        $scope.data.PersonLeaveItem.sYear = parseInt($scope.data.PersonLeaveItem.sYear);
        $scope.data.PersonLeaveItem.sMonth = parseInt($scope.data.PersonLeaveItem.sMonth);
        $scope.data.PersonLeaveItem.sDay = parseInt($scope.data.PersonLeaveItem.sDay);
        $scope.data.PersonLeaveItem.sHour = parseInt($scope.data.PersonLeaveItem.sHour.length < 2 ? ('0' + $scope.data.PersonLeaveItem.sHour) : $scope.data.PersonLeaveItem.sHour);
        $scope.data.PersonLeaveItem.sMinute = parseInt($scope.data.PersonLeaveItem.sMinute.length < 2 ? ('0' + $scope.data.PersonLeaveItem.sMinute) : $scope.data.PersonLeaveItem.sMinute);
        $scope.data.PersonLeaveItem.eYear = parseInt($scope.data.PersonLeaveItem.eYear);
        $scope.data.PersonLeaveItem.eMonth = parseInt($scope.data.PersonLeaveItem.eMonth);
        $scope.data.PersonLeaveItem.eDay = parseInt($scope.data.PersonLeaveItem.eDay);
        $scope.data.PersonLeaveItem.eHour = parseInt($scope.data.PersonLeaveItem.eHour.length < 2 ? ('0' + $scope.data.PersonLeaveItem.eHour) : $scope.data.PersonLeaveItem.eHour);
        $scope.data.PersonLeaveItem.eMinute = parseInt($scope.data.PersonLeaveItem.eMinute.length < 2 ? ('0' + $scope.data.PersonLeaveItem.eMinute) : $scope.data.PersonLeaveItem.eMinute);
        $scope.data.PersonLeaveItem.TotalDays = parseInt($scope.data.PersonLeaveItem.TotalDays);
        $scope.data.PersonLeaveItem.TotalHours = parseInt($scope.data.PersonLeaveItem.TotalHours);
    };
    // #endregion
    // #region 加班清單轉換型態
    function OverTimeTrans() {
        $scope.data.OverTimeItem.sYear = parseInt($scope.data.OverTimeItem.sYear);
        $scope.data.OverTimeItem.sMonth = parseInt($scope.data.OverTimeItem.sMonth);
        $scope.data.OverTimeItem.sDay = parseInt($scope.data.OverTimeItem.sDay);
        $scope.data.OverTimeItem.sHour = parseInt($scope.data.OverTimeItem.sHour.length < 2 ? ('0' + $scope.data.OverTimeItem.sHour) : $scope.data.OverTimeItem.sHour);
        $scope.data.OverTimeItem.sMinute = parseInt($scope.data.OverTimeItem.sMinute.length < 2 ? ('0' + $scope.data.OverTimeItem.sMinute) : $scope.data.OverTimeItem.sMinute);
        $scope.data.OverTimeItem.eYear = parseInt($scope.data.OverTimeItem.eYear);
        $scope.data.OverTimeItem.eMonth = parseInt($scope.data.OverTimeItem.eMonth);
        $scope.data.OverTimeItem.eDay = parseInt($scope.data.OverTimeItem.eDay);
        $scope.data.OverTimeItem.eHour = parseInt($scope.data.OverTimeItem.eHour.length < 2 ? ('0' + $scope.data.OverTimeItem.eHour) : $scope.data.OverTimeItem.eHour);
        $scope.data.OverTimeItem.eMinute = parseInt($scope.data.OverTimeItem.eMinute.length < 2 ? ('0' + $scope.data.OverTimeItem.eMinute) : $scope.data.OverTimeItem.eMinute);
        $scope.data.OverTimeItem.TotalDays = parseInt($scope.data.OverTimeItem.TotalDays);
        $scope.data.OverTimeItem.TotalHours = parseInt($scope.data.OverTimeItem.TotalHours);
    };
    // #endregion
    // #region 我的信箱PDF圖式轉換
    function MyBoxPDF(url) {
        if ($scope.data.IsMyIns && $scope.data.Progress < 9) {
            return "<div style='display:inline-block;width:24px;height:24px;background-image:url(\"" + url + "/Statics/img/GeneratePDF/RealMybox.png\")'></div>";
        }
        else {
            return "<div style='display:inline-block;width:24px;height:24px;background-image:url(\"" + url + "/Statics/img/GeneratePDF/EmptyMybox.png\")'></div>";
        }
    };
    // #endregion
    // #region 收藏夾PDF圖式轉換
    function StarPDF(url) {
        if ($scope.data.IsFav) {
            return "<div style='width:24px;height:24px;background-image:url(\"" + url + "/Statics/img/GeneratePDF/RealStar.png\")'></div>";
        }
        else {
            return "<div style='width:24px;height:24px;background-image:url(\"" + url + "/Statics/img/GeneratePDF/EmptyStar.png\")'></div>";
        }
    };
    // #endregion
    // #region 顏色PDF圖式轉換
    function ColorPDF(url) {
        switch ($scope.data.SubjectColor.toString()) {
            case '0':
                return "<div style='display:inline:block;width:15px;height:15px;background-color:white'></div>";
                break;
            case '1':
                return "<div style='display:inline:block;width:15px;height:15px;background-color:rgb(102, 204, 51)'></div>";
                break;
            case '2':
                return "<div style='display:inline:block;width:15px;height:15px;background-color:rgb(255, 153, 51)'></div>";
                break;
            case '3':
                return "<div style='display:inline:block;width:15px;height:15px;background-color:rgb(255, 102, 102)'></div>";
                break;
        }
    };
    // #endregion
    // #region 匯出成文件 
    $scope.export = function () {
        var WebSiteURL = "https://succmail.com";
        var borderString = "border-top-width:1px;border-top-color:rgb(196, 196, 196);border-top-style:solid;border-right-width:1px;border-right-color:rgb(196, 196, 196);border-right-style:solid;border-bottom-width:1px;border-bottom-color:rgb(196, 196, 196);border-bottom-style:solid;border-left-width:1px;border-left-color:rgb(196, 196, 196);border-left-style:solid;";
        var borderbottomString = "border-bottom-width:1px;border-bottom-color:rgb(196, 196, 196);border-bottom-style:solid;";

        var source = "<div style='background-color:rgb(238,238,238);'>";
        //ToolBar
        var ToolBarEntity = $("#toolbar");
        //MyBox
        var MyBoxEntity = $(ToolBarEntity).children("button")[0];
        //Star
        var StarEntity = $(ToolBarEntity.children("button"))[1];
        //Color
        var ColorEntity = $(ToolBarEntity).children("div")[0];
        //回覆
        var ReplyEntity = $("div[ng-repeat*='ReplyList']");
        // #region 內容斷行取代
        if ($("#main_content").children("#main_content").length < 1) {
            $("#main_content").find("br").replaceWith("<br>");
        }
        else {
            $("#main_content").find("#main_content").last().find("br").replaceWith("<br>");
        }
        // #endregion
        // #region 內容圖片取代
        var ImgList = $("#main_content").find("img");
        for (var i = 0; i < $(ImgList).length; i++) {
            var ImgSrc = $("#main_content").find("img:eq(" + i + ")").attr("src");
            var ImgSrcString = "";
            if (ImgSrc.toLowerCase().indexOf("getimg") >= 0) {
                //系統內部圖片
                ImgSrcString = "<img style='' src=" + WebSiteURL + ImgSrc + " imgtag>";
            }
            else {
                //系統外部圖片
                ImgSrcString = "<img style='' src=" + ImgSrc + " imgtag>";
            }
            $("#main_content").find("img:eq(" + i + ")").replaceWith(ImgSrcString);
        }
        // #endregion
        // #region 內容Col Tag取代
        var ColList = $("#main_content").find("col");
        for (var i = 0; i < $(ColList).length; i++) {
            var ColStyle = $("#main_content").find("col:eq(" + i + ")").attr("style");
            var ColStyleString = '<col style="' + ColStyle + '" coltag>';
            $("#main_content").find("col:eq(" + i + ")").replaceWith(ColStyleString);
        }
        // #endregion
        //主題收件人
        var SubjReceiver = $("#receiver").children("span");

        // #region 表格資訊
        source += "<table style='width:100%;' cellpadding='4' cellspacing='4'>";
        source += "<tr style='" + borderString + "'>";
        source += "<td width='100%'>";
        //Content
        // #region toolbar
        source += "<table cellpadding='0' cellspacing='0' width='100%'>";
        source += "<tr>";
        source += "<td width='3%' style='" + borderbottomString + "'>";
        source += MyBoxPDF(WebSiteURL);
        source += "</td>";
        source += "<td width='7%' style='" + borderbottomString + "'>";
        source += "<span>" + $(MyBoxEntity).text() + "</span>";
        source += "</td>";
        source += "<td width='3%' style='" + borderbottomString + "'>";
        source += StarPDF(WebSiteURL);
        source += "</td>";
        source += "<td width='7%' style='" + borderbottomString + "'>";
        source += "<span>" + $(StarEntity).text() + "</span>";
        source += "</td>";
        source += "<td width='3%' style='" + borderbottomString + "'>";
        source += ColorPDF(WebSiteURL);
        source += "</td>";
        source += "<td width='7%' style='" + borderbottomString + "'>";
        source += "<span>" + $(ColorEntity).children("button").children("span").text() + "</span>";
        source += "</td>";
        source += "<td width='40%' style='" + borderbottomString + "'>";
        source += "</td>";
        source += "</tr>";
        source += "</table>";
        // #endregion
        //End Content
        source += "</td>";
        source += "</tr>";
        // DiscName
        source += "<tr style='padding-top:50px;padding-bottom:50px;'>";
        source += "<td width='100%'>";
        source += "<table cellpadding='0' cellspacing='0' width='100%'>";
        source += "<tr>";
        source += "<td width='90%'>";
        source += "<span>" + $scope.Disc.discName + "</span>";
        source += "</td>";
        source += "</tr>";
        source += "</table>";
        source += "</td>";
        source += "</tr>";
        // End DiscName
        source += "</table>";
        // #endregion
        source += "<div style='background-color:white;margin-top:81px;margin-left:25px;margin-right:40px;'>";
        // #region 主題標題
        source += "<div class='TitleArea' style='width:600px;text-overflow:ellipsis;display:inline-block;font-size:2em;'>";
        source += "<strong>" + $(".TitleArea").children("strong").text() + "</strong>";
        source += "</div>";
        // #endregion 
        // #region 主題資訊
        source += "<div id='infobar'>";
        source += "<span style='color:rgb(51,133,204);font-weight:700;font-size:0.98em;'>" + $scope.data.Creator + "  </span>";
        source += "<label style='color:rgb(153,153,153);font-weight:normal;'>" + $("#infobar").children("label").text() + "</label>";
        source += "</div>";
        // #endregion
        source += "<hr />"
        // #region 主題編輯狀況
        if ($scope.data.SubjModifiedById != '') {
            var Modify = $("#content").children("div:eq(3)").children("a").text();
            var ModifyInfo = $("#content").children("div:eq(3)").children("label").text();
            source += "<div class='detail_infobar_hr' style='float:right;'>";
            source += "<label style='color:rgb(153,153,153)'>" + ModifyInfo + "</label>"
            source += "<span style='color:rgb(153,153,153)'>" + Modify + "</span>";
            source += "</div>";
        }
        // #region 空格用
        source += "<div style='height:20px;'></div>";
        // #endregion
        // #endregion
        source += "</div>";
        // #region 主題內容
        source += "<div style='clear:left;margin-left:20px;font-size:12pt;background-color:white;'>";
        if ($("#main_content").children("#main_content").length < 1) {
            source += $("#main_content").html();
        }
        else {
            source += $("#main_content").find("#main_content").last().html();
        }
        // #region 空格用
        source += "<div style='height:20px;'></div>";
        // #endregion
        source += "</div>";
        // #endregion
        // #region 主題收件人
        source += "<div id='receiver' style='font-size:0.98em;'>";
        source += "<div style='height:3px;'></div>";
        for (var i = 0; i < $(SubjReceiver).length; i++) {
            var NotReadEntity = $(SubjReceiver).children("label[class*='read-false']")[i];
            var ReaderEntity = $(SubjReceiver).children("label")[i];
            if ($(NotReadEntity).length > 0) {
                //未讀
                source += "<label style='color:red;'>" + $(ReaderEntity).text() + " </label>";
            }
            else {
                //已讀
                source += "<label style='color:black;'>" + $(ReaderEntity).text() + " </label>";
            }
        }
        source += "<div style='height:3px;'></div>";
        source += "<div style='background-color:white;'><hr /></div>";
        source += "</div>";
        // #endregion
        // #region 回覆數量
        if ($scope.data.ReplyCount > 0) {
            source += "<div class='replyInfo' style='font-size:1.3em;color:gray;background-color:white;text-align:center;'>" + $("#respond-panel").text() + "</div>"
        }
        // #endregion
        // #region 空格用
        source += "<div style='background-color:white;height:20px;'></div>";
        // #endregion
        // #region 主題回覆
        var ReplyLength = $(ReplyEntity).length;
        for (var i = 0; i < ReplyLength; i++) {
            var ReplyInfo = $(ReplyEntity).find("#respond-infobar")[i];
            var ReplyContent = $(ReplyEntity).find("#respond-content")[i];
            var ReplyReceiver = $(ReplyEntity).find("#receiver")[i];
            var Receiver = $(ReplyReceiver).find("span");

            source += "<div class='response_Area' style='background-color:white;min-height:200px;'>";
            // #region 回覆資訊
            source += "<div class='reply_info' style='font-size:1.15em;font-weight:700;'>";
            source += "<span style='color:rgb(51,133,204)'>" + $(ReplyInfo).children("span").text() + "  </span>";
            source += "<label style='color:rgb(136,136,136);font-weight:bold;'>" + $(ReplyInfo).children("label").text() + "</label>";
            source += "</div>";
            // #endregion
            source += "<div style='background-color:rgb(238,238,238);height:1px;'></div>";
            // #region 回覆內容
            source += "<div class='reply_content' style='font-size:12pt;overflow-x:auto;'>";
            source += "<div style='height:15px;'></div>";
            // #region 回覆內容斷行取代
            $(ReplyContent).find("br").replaceWith("<br>");
            // #endregion
            // #region 內容圖片取代
            var ReplyImgList = $(ReplyContent).find("img");
            for (var j = 0; j < $(ReplyImgList).length; j++) {
                var ImgSrc = $(ReplyContent).find("img:eq(" + j + ")").attr("src");
                var ImgSrcString = "";
                if (ImgSrc.toLowerCase().indexOf("getimg") >= 0) {
                    //系統內部圖片
                    ImgSrcString = "<img style='' src=" + WebSiteURL + ImgSrc + " imgtag>";
                }
                else {
                    //系統外部圖片
                    ImgSrcString = "<img style='' src=" + ImgSrc + " imgtag>";
                }
                $(ReplyContent).find("img:eq(" + j + ")").replaceWith(ImgSrcString);
            }
            // #endregion
            // #region 內容Col Tag取代
            var ReplyColList = $(ReplyContent).find("col");
            for (var j = 0; j < $(ReplyColList).length; j++) {
                var ColStyle = $(ReplyContent).find("col:eq(" + j + ")").attr("style");
                var ColStyleString = '<col style="' + ColStyle + '"coltag>';
                $(ReplyContent).find("col:eq(" + j + ")").replaceWith(ColStyleString);
            }
            // #endregion
            source += $(ReplyContent).html();
            source += "<div style='height:15px;'></div>";
            source += "</div>";
            // #endregion
            // #region 回覆收件人
            source += "<div class='receiver' style='color:gray;font-size:0.98em;clear:left;'>"
            source += "<div style='height:3px;'></div>";
            for (var j = 0; j < $(Receiver).length; j++) {
                var Reader = $(Receiver).children("label")[j];
                var NotReadEntity = $(Receiver).children("label[class*='read-false']")[j];
                if ($(NotReadEntity).length > 0) {
                    //未讀
                    source += "<label style='color:red;'>" + $(Reader).text() + " </label>";
                }
                else {
                    //已讀
                    source += "<label style='color:black;'>" + $(Reader).text() + " </label>";
                }
            }
            source += "<div style='height:3px;'></div>";
            source += "</div>";
            // #endregion

            source += "</div>";
            source += "<div style='background-color:white;'><hr /></div>";
        }
        // #endregion
        //End
        source += "</div>";
        // Send Parameters to Controller
        var form = $("<form></form>").attr('method', 'post').attr("name", "PostPDF").attr("target", "iframe").attr("action", "/Subject/GetSubjPDF");
        form.append($("<input></input>").attr('type', 'hidden').attr('name', 'HtmlContent').attr('value', source.replace(/br/g, 'br /').replace(/imgtag/g, '/').replace(/coltag/g, '/').replace(/</g, '%26')));
        form.append($("<input></input>").attr('type', 'hidden').attr('name', 'Title').attr('value', $(".TitleArea").children("strong").text()));
        form.appendTo('body').submit();


    };
    // #endregion
}]);


