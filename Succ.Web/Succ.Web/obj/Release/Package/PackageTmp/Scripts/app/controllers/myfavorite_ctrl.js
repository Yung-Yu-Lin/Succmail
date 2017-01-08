SuccApp.controller('MyFavoriteCtrl', ['$scope', '$http', '$filter', 'MyFavCT', 'MyBoxCT', 'SubDetail', 'FavFactory', 'IsInsFactory', 'ColorFactory', 'getfav', 'SubjectProgress', 'GetListFinish', 'EditFinish', '$rootScope', 'SubjectEvent', 'getmybox', 'RightSide', '$q', 'DelSubjFactory', 'DiscSeq', function ($scope, $http, $filter, MyFavCT, MyBoxCT, SubDetail, FavFactory, IsInsFactory, ColorFactory, getfav, SubjectProgress, GetListFinish, EditFinish, $rootScope, SubjectEvent, getmybox, RightSide, $q, DelSubjFactory, DiscSeq)
{
    // #region  參數
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
        $scope.userid = UserID;
        CompID = $scope.IndexData.CurrentUser.CompID;
        $scope.compid = CompID;
        UserName = $scope.IndexData.CurrentUser.UserName;
    };
    // #endregion 
    UpdateGlobalParam();
    // #region 呼叫拿取收藏夾列表資料
    GetFavList();
    // #endregion
    // #region  接收讀取收藏夾資料
    getfav.onGetFavList($scope, function ()
    {
        GetFavList();
    });
    // #endregion
    // #region 拿取收藏夾列表資料
    function GetFavList()
    {
        getfav.GetMyFavorList(UserID, CompID)
        .then(function (result) {
            $scope.FavData = result.data;
            //完成拿取資料後進行通知
            GetListFinish.GetFinish();
        });
    }
    // #endregion
    // #region 新視窗
    //angular.element('#tab_content_body').on('mouseover', '.data-table-tr', function () {
    //    $(this).find('.glyphicon-new-window').css('visibility', 'visible');
    //});
    //angular.element('#tab_content_body').on('mouseout', '.data-table-tr', function () {
    //    $(this).find('.glyphicon-new-window').css('visibility', 'hidden');
    //});
    // #endregion
    // #region 加入我的訊息
    $scope.AddMyMsg = function(DiscID,SubjectID)
    {
        var Disc = $filter('filter')($scope.FavData, { DiscID: DiscID }, true)[0];
        $filter('filter')(Disc.SubjectList, { SubjectID: SubjectID }, true)[0].IsIns = true;
        SettingIsIns(CompID, UserID, SubjectID, true);
    }
    // #endregion
    // #region 移除我的訊息
    $scope.RemoveMyMsg = function(DiscID,SubjectID)
    {
        var Disc = $filter('filter')($scope.FavData, { DiscID: DiscID }, true)[0];
        $filter('filter')(Disc.SubjectList, { SubjectID: SubjectID }, true)[0].IsIns = false;
        SettingIsIns(CompID, UserID, SubjectID, false);
    }
    // #endregion
    // #region 加入收藏
    $scope.AddFav = function (DiscID, SubjectID) {
        var Disc = $filter('filter')($scope.FavData, { DiscID: DiscID }, true)[0];
        $filter('filter')(Disc.SubjectList, { SubjectID: SubjectID }, true)[0].IsFav = true;
        SettingFav(CompID, UserID, SubjectID, true);
    }
    // #endregion
    // #region 移除收藏
    $scope.RemoveFav = function (DiscID, SubjectID) {
        var Disc = $filter('filter')($scope.FavData, { DiscID: DiscID }, true)[0];
        $filter('filter')(Disc.SubjectList, { SubjectID: SubjectID }, true)[0].IsFav = false;
        SettingFav(CompID, UserID, SubjectID, false);
    }
    // #endregion
    // #region 設定我的收藏
    function SettingFav(compid, userid, subjid, flag)
    {
        getfav.SettingFav(compid, userid, subjid, flag)
        .then(function (result) {
            MyFavCT.UpdateFavCT(result.data);
        });
    }
    // #endregion
    // #region 按鈕主題展開右側內容
    $scope.ShowSubject = function (DiscID, CompanyID, UserID, SubjectID)
    {
        UpdateGlobalParam();
        var ShowSubjTemplate = function () {
            var q = $q.defer();
            q.resolve(SubDetail.OpenSubDetail(DiscID, CompanyID, UserID, SubjectID, UserName, 2));
            return q.promise;
        }
        // 設定目前所在的討論組
        $scope.$parent.$parent.CurrentDiscussion = { discID: DiscID, discName: '' };
        if ($scope.$parent.$parent.detailMsgUrl == '') {
            $scope.$parent.$parent.detailMsgUrl = '/Subject/SubDetailTemplate';
        }
        $scope.promise = ShowSubjTemplate();
        $scope.promise
        .then(function () {
            //傳送參數至SubDetail Factory
            return RightSide.ShowSubject();
        });
    }
    // #endregion
    // #region 主題詳細頁更新Fav 同步更新scope Data List
    FavFactory.onUpdateFav($scope, 2, function (Item)
    {
        var DiscID = Item.DiscID;
        var SubjID = Item.SubjID;
        var Flag = Item.Flag;
        var DiscData = $filter('filter')($scope.FavData, { DiscID: DiscID }, true)[0];
        $filter('filter')(DiscData.SubjectList, { SubjectID: SubjID }, true)[0].IsFav = Flag;
    });
    // #endregion
    // #region 設定我的信箱
    function SettingIsIns(compid, userid, subjid, flag)
    {
        getmybox.SettingIsIns(compid, userid, subjid, flag)
        .then(function (result) {
            MyBoxCT.UpdateBoxCT(result.data);
        });
    };
    // #endregion
    // #region 主題詳細頁更新IsIns 同步更新scope Data List
    IsInsFactory.onUpdateIsIns($scope, 2, function (Item)
    {
        var DiscID = Item.DiscID;
        var SubjID = Item.SubjID;
        var Flag = Item.Flag;
        var DiscData = $filter('filter')($scope.FavData, { DiscID: DiscID }, true)[0];
        $filter('filter')(DiscData.SubjectList, { SubjectID: SubjID }, true)[0].IsIns = Flag;
    });
    // #endregion
    // #region 主題詳細頁更新Color 同步更新scope Data List
    ColorFactory.onUpdateColor($scope, 2, function (Item) {
        var DiscID = Item.DiscID;
        var SubjID = Item.SubjID;
        var Color = Item.Color;
        var DiscData = $filter('filter')($scope.FavData, { DiscID: DiscID }, true)[0];
        $filter('filter')(DiscData.SubjectList, { SubjectID: SubjID }, true)[0].SubjectColor = Color;
    });
    // #endregion
    // #region  主題詳細頁刪除主題，同步更新scope Data List
    DelSubjFactory.onAfterDelSubj($scope, 2, function (Item) {
        var DiscID = Item.DiscID;
        var SubjID = Item.SubjID;
        var DiscData = $filter('filter')($scope.FavData, { DiscID: DiscID }, true)[0];
        var subjItem = $filter('filter')(DiscData.SubjectList, { SubjectID: SubjID }, true);
        var subjIndex = DiscData.SubjectList.indexOf(subjItem[0]);
        if(subjIndex > -1)
        {
            DiscData.SubjectList.splice(subjIndex, 1);
        }
        RightSide.DeleteSubjDetailBlock($scope.$parent.$parent);
    });
    // #endregion
    // #region 主題詳細頁監聽==更新已讀取==的事件
    SubDetail.onUpdateReadState(function (Item) {
        var SubjID = Item.SubjID;
        var DiscID = Item.DiscID;
        var discItem = $filter('filter')($scope.FavData, { DiscID: DiscID }, true)[0];
        if (typeof discItem !== 'undefined') {
            var subItem = $filter('filter')(discItem.SubjectList, { SubjectID: SubjID }, true)[0];
            if (typeof subjItem !== 'undefined') {
                subItem.IsRead = true;
            }
        };
    });
    // #endregion
    // #region 主題詳細頁監聽==更新主題狀態的事件
    SubDetail.onUpdateSubjectProgress(2,function (Item)
    {
        var subjID = Item.SubjId;
        var state = Item.State;
        var DiscID = Item.DiscID;
        var discItem = $filter('filter')($scope.FavData, { DiscID: DiscID }, true)[0];
        //完成主題 state = 9
        if (state == SubjectProgress.Closed)
        {
            var subjItem = $filter('filter')(discItem.SubjectList, { SubjectID: subjID }, true);
            $scope.FavCloseData = { "DiscID": DiscID };
            subjItem[0].Progress = state;
        }
        //一般申請 state = 2
        else if (state == SubjectProgress.ApplyClose)
        {
            var subjItem = $filter('filter')(discItem.SubjectList, { SubjectID: subjID }, true);
            subjItem[0].Progress = state;
        }
        //完成主題退回 state = 5
        else if (state == SubjectProgress.Reject)
        {
            //一次頁面中，執行歸檔在執行退回
            if (Object.getOwnPropertyNames($scope.FavCloseData).length > 0)
            {
                //回去完成主題的當下討論組
                var CloseDiscItem = $filter('filter')($scope.FavData, { DiscID: DiscID }, true)[0];
                var CloseSubjItem = $filter('filter')(CloseDiscItem.SubjectList, { SubjectID: subjID }, true);
                CloseSubjItem[0].Progress = state;
            }
            //直接退回主題
            else
            {
                var DiscItem = $filter('filter')($scope.FavData, { DiscID: DiscID }, true)[0];
                var subjItem = $filter('filter')(DiscItem.SubjectList, { SubjectID: subjID }, true);
                subjItem[0].Progress = state;
            }
        }
        //一般申請退回 state = 1
        else if (state == SubjectProgress.InProgress)
        {
            var subjItem = $filter('filter')(discItem.SubjectList, { SubjectID: subjID }, true);
            subjItem[0].Progress = state;
        }
    });
    // #endregion
    // #region 監聽到編輯完成，更新主題列表
    EditFinish.onEditSubj($scope, 2, function (Data) 
    {
        var Disc = $filter('filter')($scope.FavData, { DiscID: Data.DiscID }, true)[0];

        if (Data.Type == 0)
        {
            //更新主題列表主題
            $filter('filter')(Disc.SubjectList, { SubjectID: Data.SubjID }, true)[0].SubjectTitle = Data.Title;
            //更新主題列表收件人
            $filter('filter')(Disc.SubjectList, { SubjectID: Data.SubjID }, true)[0].Receiver = Data.Receiver;
            //更新主題列表預定完成日期時間
            $filter('filter')(Disc.SubjectList, { SubjectID: Data.SubjID }, true)[0].PlanDiff = CalculatePlanDiff(Data.PlanDate);
        }
        //更新主題列表最後回覆人
        $filter('filter')(Disc.SubjectList, { SubjectID: Data.SubjID }, true)[0].ModifiedBy = Data.ModifiedBy;
        //更新主題列表最後回覆人名稱
        $filter('filter')(Disc.SubjectList, { SubjectID: Data.SubjID }, true)[0].ModifierName = Data.ModifierName;
        //更新主題列表最後回覆人時間
        $filter('filter')(Disc.SubjectList, { SubjectID: Data.SubjID }, true)[0].ModifiedOn = Data.ModifiedOn;
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
    // #region 監聽由ReplyCtrl ReplyInserted廣播來的事件
    $rootScope.$on(SubjectEvent.ReplyInserted, function (event, data) {
        var SubjID = data.SubjId;
        var DiscID = data.DiscID;
        var discItem = $filter('filter')($scope.FavData, { DiscID: DiscID }, true)[0];
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
    // #region 監聽討論組的排序變動
    DiscSeq.onUpdateDiscSeq(2, function (Data)
    {
        var DiscArray = Data['DiscArray'];
        for (var i = 0; i < DiscArray.length; i++)
        {
            var DiscList = $filter('filter')($scope.FavData, { DiscID: DiscArray[i].DiscId }, true)[0];
            if (DiscList != undefined) {
                $filter('filter')($scope.FavData, { DiscID: DiscArray[i].DiscId }, true)[0]['Sequence'] = DiscArray[i]['Sequence'];
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