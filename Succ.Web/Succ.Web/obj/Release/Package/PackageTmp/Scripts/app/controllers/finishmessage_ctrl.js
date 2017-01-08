SuccApp.controller('FinishMessageCtrl', [ '$scope', '$http', '$filter', 'MyFavCT', '$rootScope', 'ColorFactory', 'FavFactory', 'SubDetail', 'getFinish', 'GetListFinish', 'getMoreFinish', 'SubjectProgress', 'getfav', '$q', 'RightSide', function ($scope, $http, $filter, MyFavCT, $rootScope, ColorFactory, FavFactory, SubDetail, getFinish, GetListFinish, getMoreFinish, SubjectProgress, getfav, $q, RightSide)
{
    //設定default值的參數
    var _default = "default";
    //設定NaN值的參數
    var _nan = "NaN/NaN/NaN";
    // 設定default值給newconvertsdate $scope
    $scope.newconvertsdate = _default;
    // 設定default值給newconvertedate $scope
    $scope.newconvertedate = _default;
    // 設定default值給newconvertCreateSdate $scope
    $scope.newconvertCreateSdate = null;
    // 設定default值給newconvertCreateEdate $scope
    $scope.newconvertCreateEdate = null;
    // #region  參數
    //開啟右側頁面目標
    var clickTarget = '';
    //UserID
    var UserID = "";
    //CompanyID
    var CompID = "";
    //DiscID
    var DiscID = $scope.discussionid;
    //UserName
    var UserName = "";
    // 放置完成區物件
    $scope.FinishObj = {};
    //時間運算
    var Today = new Date();
    var TwoMonth = new Date();
    Today.setDate(Today.getDate());

    var monString = new Date(TwoMonth.setMonth(TwoMonth.getMonth() - 2));
    var SDate = monString.getFullYear() + '/' + (monString.getMonth() + 1) + '/' + monString.getDate();
    //會有UTC問題
    var EDate = Today.getFullYear() + '/' + (Today.getMonth() + 1) + '/' + (Today.getDate()+1);
    // #endregion
    // #region 更新全域參數
    function UpdateGlobalParam() {
        UserID = $scope.IndexData.CurrentUser.UserID;
        //指定給Filter Directive
        $scope.userid = UserID;
        CompID = $scope.IndexData.CurrentUser.CompID;
        //指定給Filter Directive
        $scope.companyid = CompID;
        UserName = $scope.IndexData.CurrentUser.UserName;
    };
    // #endregion
    UpdateGlobalParam();
    // #region 拿取完成區主題列表資料
    GetFinishList(UserID, CompID, DiscID, null, null, SDate, EDate);
    // #endregion
    // #region 點選討論組上方的完成區
    getFinish.onGetFinish($scope, function ()
    {
        GetFinishList(UserID, CompID, DiscID, null, null, SDate, EDate);
    });
    // #endregion
    //接收輸入建立and歸檔日期的廣播
    getFinish.onGetSlectFilterDate($scope, function (Data) {
        //建立開始日期
        var CreateStartDate = new Date(Data.createstartdate);
        //轉換成yy/mm/dd格式
        var ConvertCreateStartDate = CreateStartDate.getFullYear() + '/' + (CreateStartDate.getMonth() + 1) + '/' + CreateStartDate.getDate();
        //建立結束日期
        var CreateEndDate = new Date(Data.createenddate);
        //轉換成yy/mm/dd格式
        var ConvertCreateEndDate = CreateEndDate.getFullYear() + '/' + (CreateEndDate.getMonth() + 1) + '/' + (CreateEndDate.getDate()+1);
        //歸檔開始日期
        var CloseStartDate = new Date(Data.closestartdate);
        //轉換成yy/mm/dd格式
        var ConvertCloseStartDate = CloseStartDate.getFullYear() + '/' + (CloseStartDate.getMonth() + 1) + '/' + CloseStartDate.getDate();
        //歸檔結束日期
        var CloseeEndDate = new Date(Data.closeenddate);
        //轉換成yy/mm/dd格式
        var ConvertCloseEndDate = CloseeEndDate.getFullYear() + '/' + (CloseeEndDate.getMonth() + 1) + '/' + (CloseeEndDate.getDate()+1);
        //預設開始日期
        var sdate = new Date(SDate);
        //轉換成yy/mm/dd格式
        var convertsdate = sdate.getFullYear() + '/' + (sdate.getMonth() + 1) + '/' + sdate.getDate();
        //預設結束日期
        var edate = new Date(EDate);
        //轉換成yy/mm/dd格式
        var convertedate = edate.getFullYear() + '/' + (edate.getMonth() + 1) + '/' + edate.getDate();
        //建立日期塞選條件案叉叉取消時
        if (ConvertCreateStartDate == _nan && ConvertCreateEndDate == _nan && ConvertCloseStartDate == _nan && ConvertCloseEndDate == _nan)
        {
            //拿取歸檔開始日期的$scope值
            var NewConvertSDateScope = $scope.newconvertsdate;
            //拿取歸檔結束日期的$scope值
            var NewConvertEDateScope = $scope.newconvertedate;
            //把輸入的歸檔開始日期寫入$scope
            $scope.newconvertsdate = ConvertCloseStartDate;
            //把輸入的歸檔結束日期寫入$scope
            $scope.newconvertedate = ConvertCloseEndDate;
            //歸檔起始日期皆未輸入
            if (NewConvertSDateScope == _default && NewConvertEDateScope == _default)
            {
            GetFinishList(UserID, CompID, DiscID, null, null, SDate, EDate);
        }
            //歸檔開始日期未輸入
            else if (NewConvertSDateScope == _default && NewConvertEDateScope != _default)
            {
                GetFinishList(UserID, CompID, DiscID, null, null, SDate, NewConvertEDateScope);
            }
            //歸檔結束日期未輸入
            else if (NewConvertSDateScope != _default && NewConvertEDateScope == _default)
            {
                GetFinishList(UserID, CompID, DiscID, null, null, NewConvertSDateScope, EDate);
            }
            else
            {
                GetFinishList(UserID, CompID, DiscID, null, null, NewConvertSDateScope, NewConvertEDateScope);
            }
        }
        //如果輸入的建立日期區間大於2個月，重新拿取資料
        if (Date.parse(ConvertCreateEndDate) - Date.parse(ConvertCreateStartDate) > Date.parse(convertedate) - Date.parse(convertsdate))
        {
            //把輸入的建立開始日期存到$scope
            $scope.newconvertCreateSdate = ConvertCreateStartDate;
            //把輸入的建立結束日期存到$scope
            $scope.newconvertCreateEdate = ConvertCreateEndDate;
            //拿取歸檔開始日期的$scope值
            var NewConvertSDateScope = $scope.newconvertsdate;
            //拿取歸檔結束日期的$scope值
            var NewConvertEDateScope = $scope.newconvertedate;
            //拿取建立開始日期的$scope值
            var NewConvertCreateSDateScope = $scope.newconvertCreateSdate;
            //拿取建立結束日期的$scope值
            var NewConvertCreateEDateScope = $scope.newconvertCreateEdate;
            //如果歸檔開始日期的$scope值及歸檔結束日期的$scope值皆為default，用預設的兩個月當歸檔日期的條件
            if (NewConvertSDateScope == _default && NewConvertEDateScope == _default)
            {
                //輸入的開始建立日期(ConvertCreateStartDate),輸入的結束建立日期(ConvertCreateStartDate)重新拿資料
                GetFinishList(UserID, CompID, DiscID, NewConvertCreateSDateScope, NewConvertCreateEDateScope, convertsdate, convertedate);
            }
            //如果歸檔開始日期的$scope值為default，用NewConvertSDateScope當歸檔結束日期
            else if (NewConvertSDateScope == _default && NewConvertEDateScope != _default)
            {
                //輸入的開始建立日期(ConvertCreateStartDate),輸入的結束建立日期(ConvertCreateStartDate)重新拿資料
                GetFinishList(UserID, CompID, DiscID, NewConvertCreateSDateScope, NewConvertCreateEDateScope, convertsdate, NewConvertEDateScope);
            }
            //如果歸檔結束日期的$scope值為default，用NewConvertSDateScope當歸檔開始日期
            else if (NewConvertSDateScope != _default && NewConvertEDateScope == _default)
            {
                //輸入的開始建立日期(ConvertCreateStartDate),輸入的結束建立日期(ConvertCreateStartDate)重新拿資料
                GetFinishList(UserID, CompID, DiscID, NewConvertCreateSDateScope, NewConvertCreateEDateScope, NewConvertSDateScope, convertedate);
            }
            else
            {
                //輸入的開始建立日期(ConvertCreateStartDate),輸入的結束建立日期(ConvertCreateStartDate)重新拿資料
                GetFinishList(UserID, CompID, DiscID, NewConvertCreateSDateScope, NewConvertCreateEDateScope, NewConvertSDateScope, NewConvertEDateScope);
            }
        }
        else
        {
            //建立起始日期皆沒有輸入且未大於兩個月
            if (ConvertCreateStartDate == _nan && ConvertCreateEndDate == _nan)
            {
                //拿取建立開始日期的$scope值
                var NewConvertCreateSDateScope = $scope.newconvertCreateSdate;
                //拿取建立結束日期的$scope值
                var NewConvertCreateEDateScope = $scope.newconvertCreateEdate;
                //歸檔結束日期未輸入
                if (ConvertCloseEndDate == _nan)
                {
                    //把輸入的歸檔開始日期寫入$scope
                    $scope.newconvertsdate = ConvertCloseStartDate;
                    //如果今天的日期(convertedate)減掉輸入的歸檔開始日期(ConvertCloseStartDate)大於兩個月重新拿資料
                    if (Date.parse(convertedate) - Date.parse(ConvertCloseStartDate) > Date.parse(convertedate) - Date.parse(convertsdate))
                    {
                        //輸入的開始歸檔日期(ConvertCloseStartDate),今天的日期(convertedate)重新拿資料,不用CreateOn當條件(傳null)
                        GetFinishList(UserID, CompID, DiscID, NewConvertCreateSDateScope, NewConvertCreateEDateScope, ConvertCloseStartDate, convertedate);
                    }
                }
                //歸檔開始日期未輸入
                if (ConvertCloseStartDate == _nan)
                {
                    //把輸入的歸檔結束日期寫入$scope
                    $scope.newconvertedate = ConvertCloseEndDate;
                    //如果今天日期(convertedate)減掉輸入的歸檔結束日期(ConvertCloseEndDate)大於兩個月重新拿資料
                    if (Date.parse(convertedate) - Date.parse(ConvertCloseEndDate) > Date.parse(convertedate) - Date.parse(convertsdate))
                    {
                        //輸入的結束歸檔日期(ConvertCloseEndDate),預設日期(null)重新拿資料,不用CreateOn當條件(傳null)
                        GetFinishList(UserID, CompID, DiscID, NewConvertCreateSDateScope, NewConvertCreateEDateScope, null, ConvertCloseEndDate);
                    }
                }
                //歸檔起始日期皆有輸入
                if (ConvertCloseStartDate != _nan && ConvertCloseEndDate != _nan)
                {
                    //把輸入的歸檔開始日期寫入$scope
                    $scope.newconvertsdate = ConvertCloseStartDate;
                    //把輸入的歸檔結束日期寫入$scope
                    $scope.newconvertedate = ConvertCloseEndDate;
                    //如果輸入的歸檔結束日期(ConvertCloseEndDate)減掉輸入的歸檔開始日期(ConvertCloseStartDate)大於兩個月重新拿資料
                    if (Date.parse(ConvertCloseEndDate) - Date.parse(ConvertCloseStartDate) > Date.parse(convertedate) - Date.parse(convertsdate))
                    {
                        //輸入的開始歸檔日期(ConvertCloseStartDate),輸入的結束歸檔日期(ConvertCloseEndDate)重新拿資料,不用CreateOn當條件(傳null)
                        GetFinishList(UserID, CompID, DiscID, NewConvertCreateSDateScope, NewConvertCreateEDateScope, ConvertCloseStartDate, ConvertCloseEndDate);
                    }
                }
            }
            //如果未輸入建立結束日期
            else if (ConvertCreateStartDate != _nan && ConvertCreateEndDate == _nan)
            {
                //把輸入的建立開始日期寫入$scope
                $scope.newconvertCreateSdate = ConvertCreateStartDate;
                //拿取歸檔開始日期的$scope值
                var NewConvertSDateScope = $scope.newconvertsdate;
                //拿取歸檔結束日期的$scope值
                var NewConvertEDateScope = $scope.newconvertedate;
                //拿取建立開始日期的$scope值
                var NewConvertCreateSDateScope = $scope.newconvertCreateSdate;
                //拿取建立結束日期的$scope值
                var NewConvertCreateEDateScope = $scope.newconvertCreateEdate;
                //如果歸檔開始日期的$scope值及歸檔結束日期的$scope值皆為default，用預設的兩個月當歸檔日期的條件
                if (NewConvertSDateScope == _default && NewConvertEDateScope == _default)
                {
                    //如果今天的日期(convertedate)減掉輸入的建立開始日期(ConvertCreateStartDate)大於兩個月重新拿資料
                    if (Date.parse(convertedate) - Date.parse(ConvertCreateStartDate) > Date.parse(convertedate) - Date.parse(convertsdate))
                    {
                        //輸入的開始建立日期(ConvertCreateStartDate),今天的日期(convertedate)重新拿資料
                        GetFinishList(UserID, CompID, DiscID, NewConvertCreateSDateScope, convertedate, convertsdate, convertedate);
                    }
                }
                //如果歸檔開始日期的$scope值為default，用NewConvertSDateScope當歸檔結束日期
                else if (NewConvertSDateScope == _default && NewConvertEDateScope != _default)
                {
                    //如果今天的日期(convertedate)減掉輸入的建立開始日期(ConvertCreateStartDate)大於兩個月重新拿資料
                    if (Date.parse(convertedate) - Date.parse(ConvertCreateStartDate) > Date.parse(convertedate) - Date.parse(convertsdate))
                    {
                        //輸入的開始建立日期(ConvertCreateStartDate),今天的日期(convertedate)重新拿資料
                        GetFinishList(UserID, CompID, DiscID, NewConvertCreateSDateScope, convertedate, convertsdate, NewConvertEDateScope);
                    }
                }
                //如果歸檔結束日期的$scope值為default，用NewConvertSDateScope當歸檔開始日期
                else if (NewConvertSDateScope != _default && NewConvertEDateScope == _default)
                {
                    //如果今天的日期(convertedate)減掉輸入的建立開始日期(ConvertCreateStartDate)大於兩個月重新拿資料
                    if (Date.parse(convertedate) - Date.parse(ConvertCreateStartDate) > Date.parse(convertedate) - Date.parse(convertsdate))
                    {
                        //輸入的開始建立日期(ConvertCreateStartDate),今天的日期(convertedate)重新拿資料
                        GetFinishList(UserID, CompID, DiscID, NewConvertCreateSDateScope, convertedate, NewConvertSDateScope, convertedate);
                    }
                }
                else
                {
                    //如果今天的日期(convertedate)減掉輸入的建立開始日期(ConvertCreateStartDate)大於兩個月重新拿資料
                    if (Date.parse(convertedate) - Date.parse(ConvertCreateStartDate) > Date.parse(convertedate) - Date.parse(convertsdate))
                    {
                        //輸入的開始建立日期(ConvertCreateStartDate),今天的日期(convertedate)重新拿資料
                        GetFinishList(UserID, CompID, DiscID, NewConvertCreateSDateScope, convertedate, NewConvertSDateScope, NewConvertEDateScope);
                    }
                }
            }
            //如果未輸入建立開始建立日期
            else if (ConvertCreateStartDate == _nan && ConvertCreateEndDate != _nan)
            {
                //把輸入的建立結束日期寫入$scope
                $scope.newconvertCreateEdate = ConvertCreateEndDate;
                //拿取歸檔開始日期的$scope值
                var NewConvertSDateScope = $scope.newconvertsdate;
                //拿取歸檔結束日期的$scope值
                var NewConvertEDateScope = $scope.newconvertedate;
                //拿取建立開始日期的$scope值
                var NewConvertCreateSDateScope = $scope.newconvertCreateSdate;
                //拿取建立結束日期的$scope值
                var NewConvertCreateEDateScope = $scope.newconvertCreateEdate;
                //如果歸檔開始日期的$scope值及歸檔結束日期的$scope值皆為default，用預設的兩個月當歸檔日期的條件
                if (NewConvertSDateScope == _default && NewConvertEDateScope == _default)
                {
                    //如果今天日期(convertedate)減掉輸入的建立結束日期(ConvertCreateEndDate)大於兩個月重新拿資料
                    if (Date.parse(convertedate) - Date.parse(ConvertCreateEndDate) > Date.parse(convertedate) - Date.parse(convertsdate))
                    {
                        //輸入的結束建立日期(ConvertCreateEndDate),預設日期(null)重新拿資料
                        GetFinishList(UserID, CompID, DiscID, NewConvertCreateSDateScope, NewConvertCreateEDateScope, convertsdate, convertedate);
                    }
                }
                //如果歸檔開始日期的$scope值為default，用NewConvertSDateScope當歸檔結束日期
                else if (NewConvertSDateScope == _default && NewConvertEDateScope != _default)
                {
                    //如果今天日期(convertedate)減掉輸入的建立結束日期(ConvertCreateEndDate)大於兩個月重新拿資料
                    if (Date.parse(convertedate) - Date.parse(ConvertCreateEndDate) > Date.parse(convertedate) - Date.parse(convertsdate))
                    {
                        //輸入的結束建立日期(ConvertCreateEndDate),預設日期(null)重新拿資料
                        GetFinishList(UserID, CompID, DiscID, NewConvertCreateSDateScope, NewConvertCreateEDateScope, convertsdate, NewConvertEDateScope);
                    }
                }
                //如果歸檔結束日期的$scope值為default，用NewConvertSDateScope當歸檔開始日期
                else if (NewConvertSDateScope != _default && NewConvertEDateScope == _default)
                {
                    //如果今天日期(convertedate)減掉輸入的建立結束日期(ConvertCreateEndDate)大於兩個月重新拿資料
                    if (Date.parse(convertedate) - Date.parse(ConvertCreateEndDate) > Date.parse(convertedate) - Date.parse(convertsdate))
                    {
                        //輸入的結束建立日期(ConvertCreateEndDate),預設日期(null)重新拿資料
                        GetFinishList(UserID, CompID, DiscID, NewConvertCreateSDateScope, NewConvertCreateEDateScope, NewConvertSDateScope, convertedate);
                    }
                }
                else
                {
                    //如果今天日期(convertedate)減掉輸入的建立結束日期(ConvertCreateEndDate)大於兩個月重新拿資料
                    if (Date.parse(convertedate) - Date.parse(ConvertCreateEndDate) > Date.parse(convertedate) - Date.parse(convertsdate))
                    {
                        //輸入的結束建立日期(ConvertCreateEndDate),預設日期(null)重新拿資料
                        GetFinishList(UserID, CompID, DiscID, NewConvertCreateSDateScope, NewConvertCreateEDateScope, NewConvertSDateScope, NewConvertEDateScope);
                    }
                    }
                }
            else
            {
                //把輸入的建立開始日期存到$scope
                $scope.newconvertCreateSdate = ConvertCreateStartDate;
                //把輸入的建立結束日期存到$scope
                $scope.newconvertCreateEdate = ConvertCreateEndDate;
            }
        }
    });
    // #endregion
    // #region 讀取更多完成區主題
    $scope.LoadingMore = function (number)
    {
        var insideDate = new Date();
        var thisDay = new Date(insideDate.setMonth(insideDate.getMonth() - 2));
        var monthString = new Date(thisDay.setMonth(thisDay.getMonth() - number));
        var moreStartDate = monthString.getFullYear() + '/' + (monthString.getMonth() + 1) + '/' + monthString.getDate();
        //把輸入的歸檔開始日期寫入$scope
        $scope.newconvertsdate = moreStartDate;
        //把輸入的歸檔結束日期寫入$scope
        $scope.newconvertedate = EDate;
        GetFinishList(UserID, CompID, DiscID, null, null, moreStartDate, EDate);
        //載入更多完成區主題後，刷新頁面的OrderBy
        console.log(number);
        getMoreFinish.GetMore(Today, monthString, EDate, moreStartDate);
    }
    // #endregion
    // #region 呼叫Service取得完成區列表
    function GetFinishList(uid, compid, discid, sdate, edate,closesdate,closeedate)
    {
        getFinish.GetFinishList(uid, compid, discid, sdate, edate, closesdate, closeedate)
        .then(function (result) {
            $scope.FinishObj.FinishData = result.data;
            console.log(result.data);
            //確定取得完成區主題列表
            GetListFinish.GetFinish();
        });
    }
    // #endregion
    // #region 完成區建立時間解釋 即完成時間解釋
    angular.element('.tab-pane').on('mouseover', '.data-table-tr', function () {
        //$(this).find('.glyphicon-new-window').css('visibility', 'visible');
        $(this).find('.hideDatetime').css("visibility", 'visible');
    });
    angular.element('.tab-pane').on('mouseout', '.data-table-tr', function () {
        //$(this).find('.glyphicon-new-window').css('visibility', 'hidden');
        $(this).find('.hideDatetime').css("visibility", 'hidden');
    });
    // #endregion
    // #region 移出收藏
    $scope.RemoveFav = function (subjid)
    {
        FilterFav(subjid, false);
        SettingFav(CompID, UserID, subjid, false);
    }
    // #endregion
    // #region 加入收藏
    $scope.AddFav = function (subjid)
    {
        FilterFav(subjid, true);
        SettingFav(CompID, UserID, subjid, true);
    }
    // #endregion
    // #region 過濾Scope Data 需要Setting Fav
    function FilterFav(SubjectID, flag)
    {
        $filter('filter')($scope.FinishObj.FinishData, { SubjectID: SubjectID }, true)[0].IsFav = flag;
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
    // #region 主題詳細頁更新Color 同步更新scope data list
    ColorFactory.onFinishUpdateColor($scope, function (Item) {
        var SubjID = Item.SubjID;
        var Color = Item.Color;
        $filter('filter')($scope.FinishObj.FinishData, { SubjectID: SubjID }, true)[0].SubjectColor = Color;
    });
    // #endregion
    // #region 主題詳細誒更新Fav 同步更新scope data list
    FavFactory.onFinishUpdateFav($scope, function (Item) {
        var SubjID = Item.SubjID;
        var Flag = Item.Flag;
        $filter('filter')($scope.FinishObj.FinishData, { SubjectID: SubjID }, true)[0].IsFav = Flag;
    });
    // #endregion
    // #region 主題詳細頁監聽==更新已讀取==的事件
    SubDetail.onUpdateReadState(function (Item) {
        var SubjID = Item.SubjID;
        var subjItem = $filter('filter')($scope.FinishObj.FinishData, { SubjectID: SubjID }, true)[0];
        if (typeof subjItem !== 'undefined') {
            subjItem.IsRead = true;
        }
    });
    // #endregion
    // #region 主題詳細頁監聽==更新主題狀態的事件
    SubDetail.onUpdateSubjectProgress(6,function (Item) {
        var subjID = Item.SubjId;
        var state = Item.State;
        //完成主題
        if (state == SubjectProgress.Closed)
        {
            if (Object.getOwnPropertyNames($scope.FinishRejectData).length > 0)
            {
                $scope.FinishObj.FinishData.unshift($scope.FinishRejectData);
            }
            //清空
            $scope.FinishRejectData = {};
        }
        //退回主題，把退回的主題hold on $socpe.FinishRejectData，以防使用者再次歸檔
        else if (state == SubjectProgress.Reject)
        {
            var subjItem = $filter('filter')($scope.FinishObj.FinishData, { SubjectID: subjID }, true)[0];
            $scope.FinishRejectData = subjItem;
            var subjIndex = $scope.FinishObj.FinishData.indexOf(subjItem);
            if (subjIndex > -1)
            {
                $scope.FinishObj.FinishData.splice(subjIndex, 1);
            }
        }
        //申請歸檔，退回申請歸檔不做任何動作，此View本來就不是顯示這些狀態的主題
    });
    // #endregion\
    // #region 點擊主題展開右側內容
    $scope.ShowSubject = function (CompanyID, UserID, SubjectID)
    {
        UpdateGlobalParam();
        clickTarget = 'detail';
        var ShowSubjTemplate = function () {
            var q = $q.defer();
            q.resolve(SubDetail.OpenSubDetail(DiscID, CompanyID, UserID, SubjectID, UserName, 6));
            return q.promise;
        };
        //設定目前討論組
        $scope.$parent.$parent.$parent.$parent.CurrentDiscussion = { discID: DiscID, discName: '' };
        if ($scope.$parent.$parent.$parent.$parent.detailMsgUrl == '')
        {
            $scope.$parent.$parent.$parent.$parent.detailMsgUrl = '/Subject/SubDetailTemplate';
        }
        else
        {
            clickTarget = '';
            RightSide.ShowSubject();
        };
        $scope.promise = ShowSubjTemplate();
        $scope.promise
        .then(function () {
            //傳送參數至SubDetail Factory
            return RightSide.ShowSubject();
        });
    }
    // #endregion
    // #region 主題新增及詳細頁 IncludeLoading
    $rootScope.$on('$includeContentLoaded', function (event) {
        if (clickTarget === 'create') {
            RightSide.OpenNewMsg();
        }
        else if (clickTarget === 'detail') {
            RightSide.ShowSubject();
        }
        clickTarget = '';
    });
    // #endregion
}]);