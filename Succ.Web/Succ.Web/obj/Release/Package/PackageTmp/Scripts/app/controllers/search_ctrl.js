SuccApp.controller('SearchCtrl', ['$scope', '$http', '$filter', 'MyBoxCT', 'MyFavCT', 'FavFactory', 'SubDetail', 'IsInsFactory', 'ColorFactory', 'SearchStart', 'GetListFinish', 'EditFinish', 'RightSide', '$q', 'SearchDataList', 'getmybox', 'getfav', 'DelSubjFactory', 'DiscSeq', function ($scope, $http, $filter, MyBoxCT, MyFavCT, FavFactory, SubDetail, IsInsFactory, ColorFactory, SearchStart, GetListFinish, EditFinish, RightSide, $q, SearchDataList, getmybox, getfav, DelSubjFactory, DiscSeq)
{
    // #region 參數
    $scope.$parent.$parent.ShowAdvanced = false;
    //預設左邊選單會顯示
    $scope.$parent.$parent.ShowLeftMenu = true;
    //UserID
    var UserID = $scope.IndexData.CurrentUser.UserID;
    //CompanyID
    var CompanyID = $scope.IndexData.CurrentUser.CompID;
    //UserName
    var UserName = $scope.IndexData.CurrentUser.UserName;
    //設定參數給Filter
    $scope.compid = CompanyID;
    $scope.userid = UserID;
    //參數
    var Keyword = $scope.$parent.$parent.search.SearchKeyWord;
    var StartDate = $scope.$parent.$parent.search.SearchStartPara;
    var EndDate = $scope.$parent.$parent.search.SearchEndPara;
    var Member = $scope.$parent.$parent.search.SelectSearchMember;
    var Disc = $scope.$parent.$parent.search.SelectSearchDisc;
    //Sp裡面的SearchType
    var FileState = $scope.$parent.$parent.search.SearchFile;
    var SubState = $scope.$parent.$parent.search.SubState;
    //搜尋檔案結果建立人初始化空陣列
    $scope.FileSearchMember = [];
    // #endregion
    // #region 呼叫拿取搜尋列表資料
    GetSearchList(Keyword, StartDate, EndDate, Member, Disc, UserID, CompanyID, FileState, SubState);
    // #endregion
    // #region 拿取搜尋列表資料
    function GetSearchList(key,start,end,mem,disc,uid,compid,type,state)
    {
        //初始化搜尋參與者&討論組的空陣列
        var MemberUser = [];
        var DiscList = [];
        //填充收件人UserID
        if (mem != undefined)
        {
            for(var i = 0;i<mem.length;i++)
            {
                MemberUser.push(mem[i].UserId);
            }
        }
        //填充討論組DiscID
        if (disc != undefined)
        {
            for(var i = 0;i<disc.length;i++)
            {
                DiscList.push(disc[i].DiscID);
            }
        }

        var data = {
            Keywords: key,
            StartTime: start,
            EndTime: end,
            Members: MemberUser,
            Discussions: DiscList,
            UserId: uid,
            CompId: compid,
            SearchType: type,
            SubState: state
        }

        SearchDataList.GetSearchList(data)
        .then(function(result)
        {
            //表示有搜尋到資料
            if(result.data.length > 0)
            {
                $scope.HaveSearchData = true;
                //主題的搜尋
                if (result.data[0].SearchType == undefined)
                {
                    $scope.IsSearchFile = false;
                    $scope.SearchData = result.data;
                }
                    //檔案的搜尋
                else if(result.data[0].SearchType == 2)
                {
                    $scope.IsSearchFile = true;
                    $scope.SearchFileData = result.data[0].UploaderFileList;
                }
            }
            else
            {
                $scope.HaveSearchData = false;
            }
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
    $scope.AddMyMsg = function (DiscID, SubjectID) {
        var Disc = $filter('filter')($scope.SearchData, { DiscID: DiscID }, true)[0];
        $filter('filter')(Disc.SubjectList, { SubjectID: SubjectID }, true)[0].IsIns = true;
        SettingIsIns(CompanyID, UserID, SubjectID, true);
    }
    // #endregion
    // #region 移除我的訊息
    $scope.RemoveMyMsg = function (DiscID, SubjectID) {
        var Disc = $filter('filter')($scope.SearchData, { DiscID: DiscID }, true)[0];
        $filter('filter')(Disc.SubjectList, { SubjectID: SubjectID }, true)[0].IsIns = false;
        SettingIsIns(CompanyID, UserID, SubjectID, false);
    }
    // #endregion
    // #region 加入收藏
    $scope.AddFav = function (DiscID, SubjectID) {
        var Disc = $filter('filter')($scope.SearchData, { DiscID: DiscID }, true)[0];
        $filter('filter')(Disc.SubjectList, { SubjectID: SubjectID }, true)[0].IsFav = true;
        SettingFav(CompanyID, UserID, SubjectID, true);
    }
    // #endregion
    // #region 移除收藏
    $scope.RemoveFav = function (DiscID, SubjectID) {
        var Disc = $filter('filter')($scope.SearchData, { DiscID: DiscID }, true)[0];
        $filter('filter')(Disc.SubjectList, { SubjectID: SubjectID }, true)[0].IsFav = false;
        SettingFav(CompanyID, UserID, SubjectID, false);
    }
    // #endregion
    // #region 設定我的信箱
    function SettingIsIns(compid, userid, subjid, flag) {
        getmybox.SettingIsIns(compid, userid, subjid, flag)
        .then(function (result)
        {
            MyBoxCT.UpdateBoxCT(result.data);
        });
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
    $scope.ShowSubject = function (DiscID, CompanyID, UserID, SubjectID)
    {
        var ShowSubjTemplate = function () {
            var q = $q.defer();
            q.resolve(SubDetail.OpenSubDetail(DiscID, CompanyID, UserID, SubjectID, UserName, 7));
            return q.promise;
        }
        // 設定目前所在的討論組
        $scope.$parent.$parent.CurrentDiscussion = { discID: DiscID, discName: '' };
        if ($scope.$parent.$parent.detailMsgUrl == '')
        {
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
    FavFactory.onUpdateFav($scope, 7, function (Item) {
        var DiscID = Item.DiscID;
        var SubjID = Item.SubjID;
        var Flag = Item.Flag;
        var DiscData = $filter('filter')($scope.SearchData, { DiscID: DiscID }, true)[0];
        $filter('filter')(DiscData.SubjectList, { SubjectID: SubjID }, true)[0].IsFav = Flag;
    });
    // #endregion
    // #region 主題詳細頁更新IsIns 同步更新scope Data List
    IsInsFactory.onUpdateIsIns($scope, 7, function (Item) {
        var DiscID = Item.DiscID;
        var SubjID = Item.SubjID;
        var Flag = Item.Flag;
        var DiscData = $filter('filter')($scope.SearchData, { DiscID: DiscID }, true)[0];
        $filter('filter')(DiscData.SubjectList, { SubjectID: SubjID }, true)[0].IsIns = Flag;
    });
    // #endregion
    // #region 主題詳細頁更新Color 同步更新scope Data List
    ColorFactory.onUpdateColor($scope, 7, function (Item) {
        var DiscID = Item.DiscID;
        var SubjID = Item.SubjID;
        var Color = Item.Color;
        var DiscData = $filter('filter')($scope.SearchData, { DiscID: DiscID }, true)[0];
        $filter('filter')(DiscData.SubjectList, { SubjectID: SubjID }, true)[0].SubjectColor = Color;
    });
    // #endregion
    // #region 主題詳細頁刪除主題，同步更新Scope Data List
    DelSubjFactory.onAfterDelSubj($scope, 7, function (Item) {
        var DiscID = Item.DiscID;
        var SubjID = Item.SubjID;
        var DiscData = $filter('filter')($scope.SearchData, { DiscID: DiscID }, true)[0];
        var subjItem = $filter('filter')(DiscData.SubjectList, { SubjectID: SubjID }, true);
        var subjIndex = DiscData.SubjectList.indexOf(subjItem[0]);
        if(subjIndex > -1)
        {
            DiscData.SubjectList.splice(subjIndex, 1);
        }
        RightSide.DeleteSubjDetailBlock($scope.$parent.$parent);
    });
    // #endregion
    // #region 檔案分享區Icon 設定
    $scope.IconPath = function (FileType) {
        switch (FileType) {
            case 9:
                return "IconSetting mp4";
                break;
            case 8:
                return "IconSetting text";
                break;
            case 7:
                return "IconSetting jpg";
                break;
            case 6:
                return "IconSetting mp3";
                break;
            case 5:
                return "IconSetting pdf";
                break;
            case 4:
                return "IconSetting ppt";
                break;
            case 3:
                return "IconSetting excel";
                break;
            case 2:
                return "IconSetting word";
                break;
            case 1:
                return "IconSetting rar";
                break;
            case -1:
                return "IconSetting other";
                break;
        }
    }
    // #endregion
    // #region 點擊檔案進行下載(檔案分享區)
    $scope.DownLoadFile = function (FileID,Version)
    {
        $("#frameSetting").attr("src", encodeURI("../../FileShare/downloadFile/?FileID=" + FileID + "&version=" + Version));
    }
    // #endregion
    // #region 點擊檔案進行下載(主題附帶檔案)
    $scope.DownLoadAtt = function(AttID)
    {
        $("#frameSetting").attr("src", encodeURI("../../FileShare/downloadFileByAttID/?AttID=" + AttID));
    }
    // #endregion
    // #region 已在搜尋頁面，重新進行$http
    SearchStart.onSearchBegin($scope, function (Data)
    {
        //呼叫搜尋動作
        GetSearchList(Data.KeyWord, Data.StartDate, Data.EndDate, Data.Member, Data.Disc, UserID, CompanyID, Data.FileState, Data.SubState);
    });
    // #endregion
    // #region 監聽到編輯完成，更新主題列表
    EditFinish.onEditSubj($scope, 7, function (Data)
    {
        var DiscData = $filter('filter')($scope.SearchData, { DiscID: Data.DiscID }, true)[0];

        if (Data.Type == 0)
        {
            //更新主題列表主題
            $filter('filter')(DiscData.SubjectList, { SubjectID: Data.SubjID }, true)[0].SubjectTitle = Data.Title;
            //更新主題列表收件人
            $filter('filter')(DiscData.SubjectList, { SubjectID: Data.SubjID }, true)[0].Receiver = Data.Receiver;
        }
        //更新主題列表最後回覆人
        $filter('filter')(DiscData.SubjectList, { SubjectID: Data.SubjID }, true)[0].ModifiedBy = Data.ModifiedBy;
        //更新主題列表最後回覆人名稱
        $filter('filter')(DiscData.SubjectList, { SubjectID: Data.SubjID }, true)[0].ModifierName = Data.ModifierName;
        //更新主題列表最後回覆人時間
        $filter('filter')(DiscData.SubjectList, { SubjectID: Data.SubjID }, true)[0].ModifiedOn = Data.ModifiedOn;
    });
    // #endregion
    // #region 主題詳細頁監聽 更新主題狀態事件
    SubDetail.onUpdateSubjectProgress(7, function (Item)
    {
        var DiscID = Item.DiscID;
        var SubjID = Item.SubjId;
        var State = Item.State;
        var DiscData = $filter('filter')($scope.SearchData, { DiscID: DiscID }, true)[0];
        $filter('filter')(DiscData.SubjectList, { SubjectID: SubjID }, true)[0].Progress = State;
    });
    // #endregion
    // #region 主題詳細頁監聽==更新已讀取==的事件
    SubDetail.onUpdateReadState(function (Item) {
        var SubjID = Item.SubjID;
        var DiscID = Item.DiscID;
        var DiscData = $filter('filter')($scope.SearchData, { DiscID: DiscID }, true)[0];
        var subjItem = $filter('filter')(DiscData.SubjectList, { SubjectID: SubjID }, true);
        if (typeof subjItem[0] !== 'undefined') {
            subjItem[0].IsRead = true;
        };
    });
    // #endregion
    // #region 監聽討論組的排序變動
    DiscSeq.onUpdateDiscSeq(7, function (Data) {
        var DiscArray = Data['DiscArray'];
        for (var i = 0; i < DiscArray.length; i++) {
            var DiscList = $filter('filter')($scope.SearchData, { DiscID: DiscArray[i].DiscId }, true)[0];
            if (DiscList != undefined) {
                $filter('filter')($scope.SearchData, { DiscID: DiscArray[i].DiscId }, true)[0]['Sequence'] = DiscArray[i]['Sequence'];
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