SuccApp.controller('NoreadMsgCtrl', ['$scope', '$http', '$filter', 'MyFavCT', 'MyBoxCT', 'SubDetail', 'FavFactory', 'IsInsFactory', 'ColorFactory', 'getnord', 'GetListFinish', 'EditFinish', '$rootScope', 'SubjectEvent', 'getfav', 'RightSide', '$q', 'getmybox', 'DelSubjFactory', function ($scope, $http, $filter, MyFavCT, MyBoxCT, SubDetail, FavFactory, IsInsFactory, ColorFactory, getnord, GetListFinish, EditFinish, $rootScope, SubjectEvent, getfav, RightSide, $q, getmybox, DelSubjFactory)
{
    // #region 參數
    // click target
    var clickTarget = '';
    //預設左邊選單會顯示
    $scope.$parent.$parent.ShowLeftMenu = true;
    //UserID
    var UserID = "";
    //CompanyID
    var CompID = "";
    //UserName
    var UserName = "";
    // #endregion
    // #region 更新全域參數
    function UpdateGlobalParam() {
        UserID = $scope.IndexData.CurrentUser.UserID;
        //指定給Filter Directive
        $scope.userid = UserID;
        CompID = $scope.IndexData.CurrentUser.CompID;
        //指定給Filter Directive
        $scope.compid = CompID;
        UserName = $scope.IndexData.CurrentUser.UserName;
    };
    // #endregion 
    UpdateGlobalParam();
    // #region 呼叫拿取未讀訊息主題列表
    GetNoReadList();
    // #endregion
    // #region 接收到重新讀取未讀訊息列表
    getnord.onGetnoRdList($scope, function () {
        GetNoReadList();
    });
    // #endregion
    // #region 拿取未讀訊息列表資料
    function GetNoReadList()
    {
        getnord.GetNoReadList($scope.IndexData.CurrentUser.UserID, $scope.CurrentCompany.CompanyID)
        .then(function (result) {
            $scope.AllNordData = result.data;
                for (var i = 0; i < result.data.length; i++) {
                    switch (result.data[i].NoReadState) {
                        //未讀訊息主題列表
                        case 0:
                            $scope.noReadData = result.data[i].Disc;
                            if (result.data[i].Disc.length <= 0)
                                $scope.MsgNum = 0;
                            else
                                $scope.MsgNum = $scope.IndexData.NoReadCount;

                            break;
                            //已讀訊息主題列表
                        case 1:
                            $scope.ReadData = result.data[i].Disc;
                            break;
                            //申請歸檔訊息主題列表
                        case 2:
                            $scope.ApplyData = result.data[i].Disc;
                            if (result.data[i].Disc.length <= 0)
                                $scope.ApplyNum = 0;
                            else {
                                $scope.ApplyNum = result.data[i].Disc[0].SubjNum;
                                $scope.MsgNum = $scope.IndexData.NoReadCount;
                            }
                            break;
                    }
                }
            //拿到主題列表後通知
            GetListFinish.GetFinish();
        });
    }
    // #endregion
    // #region 未讀新視窗
    angular.element('.tab-content').on('mouseover', '.data-table-tr-noRead', function () {
        $(this).find('.glyphicon-new-window').css('visibility', 'visible');
    });
    angular.element('.tab-content').on('mouseout', '.data-table-tr-noRead', function () {
        $(this).find('.glyphicon-new-window').css('visibility', 'hidden');
    });
    // #endregion
    // #region 加入我的訊息
    $scope.AddMyMsg = function (DiscID, SubjectID, type) {
        var Disc = [];
        //type 0:未讀 1:已讀 2:申請歸檔
        switch (type) {
            case 0:
                Disc = $filter('filter')($scope.noReadData, { DiscID: DiscID }, true)[0];
                break;
            case 1:
                Disc = $filter('filter')($scope.ReadData, { DiscID: DiscID }, true)[0];
                break;
            case 2:
                Disc = $filter('filter')($scope.ApplyData, { DiscID: DiscID }, true)[0];
                break;
        }
        $filter('filter')(Disc.SubjectList, { SubjectID: SubjectID }, true)[0].IsIns = true;
        SettingIsIns(CompID, UserID, SubjectID, true);
    }
    // #endregion
    // #region 移除我的訊息
    $scope.RemoveMyMsg = function (DiscID, SubjectID, type) {
        var Disc = [];
        //type 0:未讀 1:已讀 2:申請歸檔
        switch (type) {
            case 0:
                Disc = $filter('filter')($scope.noReadData, { DiscID: DiscID }, true)[0];
                break;
            case 1:
                Disc = $filter('filter')($scope.ReadData, { DiscID: DiscID }, true)[0];
                break;
            case 2:
                Disc = $filter('filter')($scope.ApplyData, { DiscID: DiscID }, true)[0];
                break;
        }
        $filter('filter')(Disc.SubjectList, { SubjectID: SubjectID }, true)[0].IsIns = false;
        SettingIsIns(CompID, UserID, SubjectID, false);
    }
    // #endregion
    // #region 加入收藏
    $scope.AddFav = function (DiscID, SubjectID, type) {
        var Disc = [];
        //type 0:未讀 1:已讀 2:申請歸檔
        switch (type) {
            case 0:
                Disc = $filter('filter')($scope.noReadData, { DiscID: DiscID }, true)[0];
                break;
            case 1:
                Disc = $filter('filter')($scope.ReadData, { DiscID: DiscID }, true)[0];
                break;
            case 2:
                Disc = $filter('filter')($scope.ApplyData, { DiscID: DiscID }, true)[0];
                break;
        }
        $filter('filter')(Disc.SubjectList, { SubjectID: SubjectID }, true)[0].IsFav = true;
        SettingFav(CompID, UserID, SubjectID, true);
    }
    // #endregion
    // #region 移除收藏
    $scope.RemoveFav = function (DiscID, SubjectID, type) {
        var Disc = [];
        //type 0:未讀 1:已讀 2:申請歸檔
        switch (type) {
            case 0:
                Disc = $filter('filter')($scope.noReadData, { DiscID: DiscID }, true)[0];
                break;
            case 1:
                Disc = $filter('filter')($scope.ReadData, { DiscID: DiscID }, true)[0];
                break;
            case 2:
                Disc = $filter('filter')($scope.ApplyData, { DiscID: DiscID }, true)[0];
                break;
        }
        $filter('filter')(Disc.SubjectList, { SubjectID: SubjectID }, true)[0].IsFav = false;
        SettingFav(CompID, UserID, SubjectID, false);
    }
    // #endregion
    // #region 設定我的收藏
    function SettingFav(compid, userid, subjid, flag)
    {
        getfav.SettingFav(compid, userid, subjid, flag)
        .then(function (result)
        {
            MyFavCT.UpdateFavCT(result.data);
        });
    }
    // #endregion
    // #region 按鈕主題展開右側內容
    $scope.ShowSubject = function (Type, DiscID, CompanyID, UserID, SubjectID)
    {
        UpdateGlobalParam();
        var ShowSubjTemplate = function () {
            var q = $q.defer();
            q.resolve(SubDetail.OpenSubDetail(DiscID, CompanyID, UserID, SubjectID, UserName, Type));
            return q.promise;
        }
        clickTarget = 'detail';
        // 設定目前所在的討論組
        $scope.$parent.$parent.CurrentDiscussion = { discID: DiscID, discName: '' };
        if ($scope.$parent.$parent.detailMsgUrl == '') {
            $scope.$parent.$parent.detailMsgUrl = '/Subject/SubDetailTemplate';
        }
        //else
        //{
        //    clickTarget = '';
        //    subjectOpen.OpenSubjectDetailBlock();
        //}
        $scope.promise = ShowSubjTemplate();
        $scope.promise
        .then(function () {
            //傳送參數至SubDetail Factory
            return RightSide.ShowSubject();
        });
    }
    // #endregion
    // #region ngInclude load complete
    $rootScope.$on('$includeContentLoaded', function (event) {
        if (clickTarget === 'create')
        {
            RightSide.OpenNewMsg();
        }
        else if (clickTarget === 'detail')
        {
            RightSide.ShowSubject();
        }
        clickTarget = '';
    });
    // #endregion
    // #region 設定我的信箱
    function SettingIsIns(compid, userid, subjid, flag)
    {
        getmybox.SettingIsIns(compid, userid, subjid, flag)
        .then(function (result)
        {
            MyBoxCT.UpdateBoxCT(result.data);
        });
    }
    // #endregion
    // #region 主題詳細頁更新Fav 同步更新未讀訊息列表
    FavFactory.onUpdateFav($scope, 0, function (Item) {
        var DiscID = Item.DiscID;
        var SubjID = Item.SubjID;
        var Flag = Item.Flag;
        var DiscData = $filter('filter')($scope.noReadData, { DiscID: DiscID }, true)[0];
        $filter('filter')(DiscData.SubjectList, { SubjectID: SubjID }, true)[0].IsFav = Flag;
    });
    // #endregion
    // #region 主題詳細頁更新Fav 同步更新已讀訊息列表
    FavFactory.onUpdateFav($scope, 4, function (Item) {
        var DiscID = Item.DiscID;
        var SubjID = Item.SubjID;
        var Flag = Item.Flag;
        var DiscData = $filter('filter')($scope.ReadData, { DiscID: DiscID }, true)[0];
        $filter('filter')(DiscData.SubjectList, { SubjectID: SubjID }, true)[0].IsFav = Flag;
    });
    // #endregion
    // #region 主題詳細頁更新Fav 同步更新申請歸檔訊息列表
    FavFactory.onUpdateFav($scope, 5, function (Item) {
        var DiscID = Item.DiscID;
        var SubjID = Item.SubjID;
        var Flag = Item.Flag;
        var DiscData = $filter('filter')($scope.ApplyData, { DiscID: DiscID }, true)[0];
        $filter('filter')(DiscData.SubjectList, { SubjectID: SubjID }, true)[0].IsFav = Flag;
    });
    // #endregion
    // #region 主題詳細頁更新IsIns 同步更新未讀訊息列表
    IsInsFactory.onUpdateIsIns($scope, 0, function (Item) {
        var DiscID = Item.DiscID;
        var SubjID = Item.SubjID;
        var Flag = Item.Flag;
        var DiscData = $filter('filter')($scope.noReadData, { DiscID: DiscID }, true)[0];
        $filter('filter')(DiscData.SubjectList, { SubjectID: SubjID }, true)[0].IsIns = Flag;
    });
    // #endregion
    // #region 主題詳細頁更新IsIns 同步更新已讀訊息列表
    IsInsFactory.onUpdateIsIns($scope, 4, function (Item) {
        var DiscID = Item.DiscID;
        var SubjID = Item.SubjID;
        var Flag = Item.Flag;
        var DiscData = $filter('filter')($scope.ReadData, { DiscID: DiscID }, true)[0];
        $filter('filter')(DiscData.SubjectList, { SubjectID: SubjID }, true)[0].IsIns = Flag;
    });
    // #endregion
    // #region 主題詳細頁更新IsIns 同步更新申請歸檔訊息列表
    IsInsFactory.onUpdateIsIns($scope, 5, function (Item) {
        var DiscID = Item.DiscID;
        var SubjID = Item.SubjID;
        var Flag = Item.Flag;
        var DiscData = $filter('filter')($scope.ApplyData, { DiscID: DiscID }, true)[0];
        $filter('filter')(DiscData.SubjectList, { SubjectID: SubjID }, true)[0].IsIns = Flag;
    });
    // #endregion
    // #region 主題詳細頁更新Color 同步更新未讀訊息列表
    ColorFactory.onUpdateColor($scope, 0, function (Item) {
        var DiscID = Item.DiscID;
        var SubjID = Item.SubjID;
        var Color = Item.Color;
        var DiscData = $filter('filter')($scope.noReadData, { DiscID: DiscID }, true)[0];
        $filter('filter')(DiscData.SubjectList, { SubjectID: SubjID }, true)[0].SubjectColor = Color;
    });
    // #endregion
    // #region 主題詳細頁更新Color 同步更新已讀訊息列表
    ColorFactory.onUpdateColor($scope, 4, function (Item) {
        var DiscID = Item.DiscID;
        var SubjID = Item.SubjID;
        var Color = Item.Color;
        var DiscData = $filter('filter')($scope.ReadData, { DiscID: DiscID }, true)[0];
        $filter('filter')(DiscData.SubjectList, { SubjectID: SubjID }, true)[0].SubjectColor = Color;
    });
    // #endregion
    // #region 主題詳細頁更新Color 同步更新申請歸檔訊息列表
    ColorFactory.onUpdateColor($scope, 5, function (Item) {
        var DiscID = Item.DiscID;
        var SubjID = Item.SubjID;
        var Color = Item.Color;
        var DiscData = $filter('filter')($scope.ApplyData, { DiscID: DiscID }, true)[0];
        $filter('filter')(DiscData.SubjectList, { SubjectID: SubjID }, true)[0].SubjectColor = Color;
    });
    // #endregion
    // #region  主題詳細頁刪除主題，同步更新未讀訊息列表
    DelSubjFactory.onAfterDelSubj($scope, 0, function (Item)
    {
        var DiscID = Item.DiscID;
        var SubjID = Item.SubjID;
        var DiscData = $filter('filter')($scope.noReadData, { DiscID: DiscID }, true)[0];
        var subjItem = $filter('filter')(DiscData.SubjectList, { SubjectID: SubjID }, true);
        var subjIndex = DiscData.SubjectList.indexOf(subjItem[0]);
        if(subjIndex > -1)
        {
            DiscData.SubjectList.splice(subjIndex, 1);
        }
        RightSide.DeleteSubjDetailBlock($scope.$parent.$parent);
    });
    // #endregion
    // #region  主題詳細頁刪除主題，同步更新已讀訊息列表
    DelSubjFactory.onAfterDelSubj($scope, 4, function (Item) {
        var DiscID = Item.DiscID;
        var SubjID = Item.SubjID;
        var DiscData = $filter('filter')($scope.ReadData, { DiscID: DiscID }, true)[0];
        var subjItem = $filter('filter')(DiscData.SubjectList, { SubjectID: SubjID }, true);
        var subjIndex = DiscData.SubjectList.indexOf(subjItem[0]);
        if (subjIndex > -1) {
            DiscData.SubjectList.splice(subjIndex, 1);
        }
        RightSide.DeleteSubjDetailBlock($scope.$parent.$parent);
    });
    // #endregion
    // #region  主題詳細頁刪除主題，同步更新申請歸檔訊息列表
    DelSubjFactory.onAfterDelSubj($scope, 5, function (Item) {
        var DiscID = Item.DiscID;
        var SubjID = Item.SubjID;
        var DiscData = $filter('filter')($scope.ApplyData, { DiscID: DiscID }, true)[0];
        var subjItem = $filter('filter')(DiscData.SubjectList, { SubjectID: SubjID }, true);
        var subjIndex = DiscData.SubjectList.indexOf(subjItem[0]);
        if (subjIndex > -1) {
            DiscData.SubjectList.splice(subjIndex, 1);
        }
        RightSide.DeleteSubjDetailBlock($scope.$parent.$parent);
    });
    // #endregion
    // #region 監聽到編輯完成，更新未讀訊息列表
    EditFinish.onEditSubj($scope, 0, function (Data)
    {
        var DiscData = $filter('filter')($scope.noReadData, { DiscID: Data.DiscID }, true)[0];

        if (Data.Type == 0)
        {
            //更新主題列表主題
            $filter('filter')(DiscData.SubjectList, { SubjectID: Data.SubjID }, true)[0].SubjectTitle = Data.Title;
            //更新主題列表收件人
            $filter('filter')(DiscData.SubjectList, { SubjectID: Data.SubjID }, true)[0].Receiver = Data.Receiver;
            //更新主題列表預定完成日期時間
            $filter('filter')(DiscData.SubjectList, { SubjectID: Data.SubjID }, true)[0].PlanDiff = CalculatePlanDiff(Data.PlanDate);
        }
        //更新主題列表最後回覆人
        $filter('filter')(DiscData.SubjectList, { SubjectID: Data.SubjID }, true)[0].ModifiedBy = Data.ModifiedBy;
        //更新主題列表最後回覆人名稱
        $filter('filter')(DiscData.SubjectList, { SubjectID: Data.SubjID }, true)[0].ModifierName = Data.ModifierName;
        //更新主題列表最後回覆人時間
        $filter('filter')(DiscData.SubjectList, { SubjectID: Data.SubjID }, true)[0].ModifiedOn = Data.ModifiedOn;
    });
    // #endregion
    // #region 監聽到編輯完成，更新已讀訊息列表
    EditFinish.onEditSubj($scope, 4, function (Data)
    {    
        var DiscData = $filter('filter')($scope.ReadData, { DiscID: Data.DiscID }, true)[0];

        if (Data.Type == 0)
        {
            //更新主題列表主題
            $filter('filter')(DiscData.SubjectList, { SubjectID: Data.SubjID }, true)[0].SubjectTitle = Data.Title;
            //更新主題列表收件人
            $filter('filter')(DiscData.SubjectList, { SubjectID: Data.SubjID }, true)[0].Receiver = Data.Receiver;
            //更新主題列表預定完成日期時間
            $filter('filter')(DiscData.SubjectList, { SubjectID: Data.SubjID }, true)[0].PlanDiff = CalculatePlanDiff(Data.PlanDate);
        }
        //更新主題列表最後回覆人
        $filter('filter')(DiscData.SubjectList, { SubjectID: Data.SubjID }, true)[0].ModifiedBy = Data.ModifiedBy;
        //更新主題列表最後回覆人名稱
        $filter('filter')(DiscData.SubjectList, { SubjectID: Data.SubjID }, true)[0].ModifierName = Data.ModifierName;
        //更新主題列表最後回覆人時間
        $filter('filter')(DiscData.SubjectList, { SubjectID: Data.SubjID }, true)[0].ModifiedOn = Data.ModifiedOn;
    });
    // #endregion
    // #region 監聽到編輯完成，更新申請歸檔訊息列表
    EditFinish.onEditSubj($scope, 5, function (Data)
    {
        var DiscData = $filter('filter')($scope.ApplyData, { DiscID: Data.DiscID }, true)[0];

        if (Data.Type)
        {
            //更新主題列表主題
            $filter('filter')(DiscData.SubjectList, { SubjectID: Data.SubjID }, true)[0].SubjectTitle = Data.Title;
            //更新主題列表收件人
            $filter('filter')(DiscData.SubjectList, { SubjectID: Data.SubjID }, true)[0].Receiver = Data.Receiver;
            //更新主題列表預定完成日期時間
            $filter('filter')(DiscData.SubjectList, { SubjectID: Data.SubjID }, true)[0].PlanDiff = CalculatePlanDiff(Data.PlanDate);
        }
        //更新主題列表最後回覆人
        $filter('filter')(DiscData.SubjectList, { SubjectID: Data.SubjID }, true)[0].ModifiedBy = Data.ModifiedBy;
        //更新主題列表最後回覆人名稱
        $filter('filter')(DiscData.SubjectList, { SubjectID: Data.SubjID }, true)[0].ModifierName = Data.ModifierName;
        //更新主題列表最後回覆人時間
        $filter('filter')(DiscData.SubjectList, { SubjectID: Data.SubjID }, true)[0].ModifiedOn = Data.ModifiedOn;
    });
    // #endregion
    // #region 計算完成日期差距
    function CalculatePlanDiff(para) {

        var Today = Date.parse(new Date()) / 1000;
        var dayDifference = Math.round((para - Today) / 60 / 60 / 24);
        //超越99 顯示99+
        if (Math.abs(dayDifference) > 99)
            return "99+";
        else
            return Math.abs(dayDifference);
    };
    // #endregion
    // #region 主題詳細頁狀態更新，同步更新未讀訊息列表
    SubDetail.onUpdateSubjectProgress(0, function (Item)
    {
        var DiscID = Item.DiscID;
        var SubjID = Item.SubjId;
        var State = Item.State;
        var DiscData = $filter('filter')($scope.noReadData, { DiscID: DiscID }, true)[0];
        $filter('filter')(DiscData.SubjectList, { SubjectID: SubjID }, true)[0].Progress = State;
    });
    // #endregion
    // #region 主題詳細頁狀態更新，同步更新已讀訊息列表
    SubDetail.onUpdateSubjectProgress(4, function (Item) {
        var DiscID = Item.DiscID;
        var SubjID = Item.SubjId;
        var State = Item.State;
        var DiscData = $filter('filter')($scope.ReadData, { DiscID: DiscID }, true)[0];
        $filter('filter')(DiscData.SubjectList, { SubjectID: SubjID }, true)[0].Progress = State;
    });
    // #endregion
    // #region 主題詳細頁狀態更新，同步更新申請歸檔訊息列表
    SubDetail.onUpdateSubjectProgress(5, function (Item) {
        var DiscID = Item.DiscID;
        var SubjID = Item.SubjId;
        var State = Item.State;
        var DiscData = $filter('filter')($scope.ApplyData, { DiscID: DiscID }, true)[0];
        $filter('filter')(DiscData.SubjectList, { SubjectID: SubjID }, true)[0].Progress = State;
    });
    // #endregion
    // #region 主題詳細頁監聽==更新已讀取==的事件
    SubDetail.onUpdateReadState(function (Item)
    {
        var SubjID = Item.SubjID;
        var DiscID = Item.DiscID;
        // #region  設為已讀
        var discItem = $filter('filter')($scope.noReadData, { DiscID: DiscID }, true)[0];
        if (typeof discItem !== 'undefined')
        {
            var subItem = $filter('filter')(discItem.SubjectList, { SubjectID: SubjID })[0];
            if (typeof subItem !== 'undefined')
            {
                subItem.IsRead = true;
            }
        }
        // #endregion
        // #region  更新上方數字
        $scope.MsgNum = $scope.IndexData.NoReadCount;
        // #endregion
    });
    // #endregion
    // #region 監聽由ReplyCtrl ReplyInserted廣播來的事件
    $rootScope.$on(SubjectEvent.ReplyInserted, function (event, data) {
        var SubjID = data.SubjId;
        var DiscID = data.DiscID;
        // 從今日以讀取先找,沒有再去申請歸檔找
        var discItem = $filter('filter')($scope.ReadData, { DiscID: DiscID }, true)[0];
        if (typeof discItem === 'undefined') {
            discItem = $filter('filter')($scope.ApplyData, { DiscID: DiscID }, true)[0];
        }
        if (typeof discItem !== 'undefined') {
            var CurrentSubject = $filter('filter')(discItem.SubjectList, { SubjectID: SubjID }, true)[0];
            if (typeof CurrentSubject !== 'undefined') {
                CurrentSubject.ModifiedOn = data.CreateOn;
                CurrentSubject.ModifierName = data.CreatedName;
                CurrentSubject.ReplyCount = CurrentSubject.ReplyCount + 1;
            }
        }
    });
    // #endregion
    // #region 轉換預計完成日期
    $scope.ConvertPlanDiff = function (_PlanCloseOn, _Progress, _Type) {
        // Type 0: 已超過期限, 1:尚未超過期限
        if (_PlanCloseOn == 0) {
            return "";
        }
        else {
            var _result = ListCalculatePlanDiff(_PlanCloseOn, _Progress, _Type);
            return _result;
        }
    };
    // #endregion
    // #region 列表計算日期差距
    function ListCalculatePlanDiff(para1, para2, para3) {
        var Today = Date.parse(new Date()) / 1000;
        var dayDifference = 0;
        if (para2 >= 9) {
            dayDifference = 0;
        }
        else {
            dayDifference = Math.round((para1 - Today) / 60 / 60 / 24);
        }
        //超越99 顯示99+
        if (Math.abs(dayDifference) > 99)
            return "99+";
        else {
            var _result = para3 == 1 ? Math.abs(dayDifference) : dayDifference;
            return _result;
        }

    }
    // #endregion
}]);