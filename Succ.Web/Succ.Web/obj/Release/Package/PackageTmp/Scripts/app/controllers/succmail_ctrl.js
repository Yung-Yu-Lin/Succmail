SuccApp.controller('SuccmailCtrl', ['$scope', 'MyBoxCT', 'MyFavCT', 'SearchDate', 'SearchEndDate', 'IndexDataService', '$http', 'AttatchService', 'TimeZoneService', '$location', '$filter', 'SubDetail', 'getSubjList', 'getfav', 'getnord', 'getdraft', 'getmybox', 'SearchStart', 'SearchMember', 'EditorPara', 'DiscTemplate', 'RightSide', 'NoReadSetting', '$interval', '$cookieStore', 'DiscSeq', 'GetBackendData', function ($scope, MyBoxCT, MyFavCT, SearchDate, SearchEndDate, IndexDataService, $http, AttatchService, TimeZoneService, $location, $filter, SubDetail, getSubjList, getfav, getnord, getdraft, getmybox, SearchStart, SearchMember, EditorPara, DiscTemplate, RightSide, NoReadSetting, $interval, $cookieStore, DiscSeq, GetBackendData) {
    // #region 參數
    //搜尋功能要實作two way Data Binding，就要使用Object來包裝
    $scope.search = {};
    $scope.IsLoadingFinish = false;
    var discSetting = new DiscSetting();
    //CompanyID
    var CompanyID = '';
    //搜尋使用 開始日期初始值
    $scope.SearchStartDate = '';
    //搜尋使用 結束日期初始值
    $scope.SearchsEndDate = '';

    // 右邊浮動標籤的標題
    $scope.subjectTitle = '';
    $scope.createMsgUrl = '';
    $scope.createMsgDiscType = '';
    $scope.createMsgDiscId = '';
    $scope.nowCreateMsgUrl = '';
    $scope.nowCreateMsgDiscId = '';
    $scope.nowCreateMsgDiscType = '';

    //主題內容預設style string
    $scope.body_css = { "background-attachment": "fixed" };

    //初始化RightSide Class
    $scope.browseContentClass = "browse-content-div tab-pane";
    $scope.browseContentStyle = {};
    $scope.browseContent_li = "browse-content-li tab_list_head_li";
    $scope.browseContent_li_css = {};
    $scope.newMessageClass = "new-message-div tab-pane";
    $scope.newmessage_li = {};
    $scope.newMessage_Div = {};
    $scope.newMsg_li_css = {};
    $scope.tab_list_content = {};
    $scope.tab_list_head = {};
    $scope.tab_list_body = {};
    $scope.tab_list_body_class = "tab_list_body new-message nopadding";
    //初始化Drag的樣式
    $scope.Drag_css = {};
    //初始化Drag的狀態
    $scope.DiscDrag = false;
    //初始化Drag滑過的狀態
    $scope.DiscDragHover = false;

    $scope.detailMsgUrl = '';
    //目前所在的公司
    $scope.CurrentCompany = {};
    // 目前所在的討論組
    $scope.CurrentDiscussion = { discID: '', discName: '' };
    //初始化不顯示進階搜尋
    $scope.ShowAdvanced = false;
    //設定最外層的Scope DraftObject
    $scope.ReEditNewSubjDraft = {};
    //設定最外層的Scope Reply DraftObject
    $scope.ReEditReplyDraft = {};
    //設定目前公司已得知的未讀通知
    $scope.CurrentNoRead = {};
    // 不要顯示新增討論組畫面
    $scope.showNewDiscussion = false;
    // 初始化未讀通知數量
    var notifyCount = 0;
    // 圖片快取解除的時間值
    $scope.timer = 0;
    // 主題詳細開啟後，條件參數依據的物件
    $scope.CurrentDetail = {};
    // 放置獨立主題詳細頁主題ID
    $scope.CurrentSpage = {};
    // 後台是否可以開始導引
    $scope.BackendGuide = { "IsStart": false, "MainStyle": {"display":"none"} };
    // #endregion
    // #region 初始化 左方討論組清單不顯示
    $scope.InitLeftMenu = function () {
        $scope.ShowLeftMenu = false;
    };
    // #endregion
    // #region 登出
    $scope.Logout = function () {
        $http({
            method: 'get',
            url: '/Home/LogOut'
        })
        .success(function (result) {
            location.href = '/Home/Login';
        })
        .error(function () {

        });
    };
    // #endregion
    // #region 未讀數字規則
    if (news >= 11) {
        $scope.news = '10+';
    } else {
        $scope.news = news;
    }
    // #endregion
    // #region 頁面重新讀取時，檢查Cookie與CurrentCompanyID是否一致
    $(window).unload(function () {
        IsUpdateCookie();
    });
    function IsUpdateCookie() {
        var DateString = new Date().getTime();
        var CurrentCompanyID = $("#CurrentCompID").val();
        var CurrentUserID = $("#CurrentUserID").val();
        $.ajax({
            url: '/Succ/IsUpdateCurrentCompID/?CompID=' + CurrentCompanyID + '&UserID=' + CurrentUserID + "&t=" + DateString,
            type: 'get',
            cache: false,
            async: false,
            success: function (result) {
            }
        });
    }
    // #endregion
    GetIndexInitData();
    // #region 取得首頁資料
    // 重新取IndexData
    function GetIndexInitData()
    {
        var promise = IndexDataService.GetIndexDataInfo("");
        promise.then(function (payload) {
            if (payload.data.IsSuccessful === true) {
                $scope.IndexData = IndexDataService.IndexDataInfo = payload.data.DataObj;
                $scope.CurrentCompany = $filter('filter')($scope.IndexData.Companies, { CompanyID: $scope.IndexData.CurrentUser.CompID })[0];
                //填充進階搜尋使用的討論組
                GetDiscList($scope.CurrentCompany);
                //設定CompanyID
                $("#CurrentCompID").val($scope.CurrentCompany.CompanyID);
                $("#CurrentUserID").val(IndexDataService.IndexDataInfo.CurrentUser.UserID);
                $scope.compid = $scope.CurrentCompany.CompanyID;
                $scope.compname = $scope.CurrentCompany.CompanyName;
                //待CompanyID得到時，在拿取公司成員名單
                GetCompanyUser($scope.compid);
                //設定公司一般討論組
                $scope.GeneralDisc = $scope.CurrentCompany.DiscussionCate[0].Discussions;
                //設定UserID
                $scope.userid = IndexDataService.IndexDataInfo.CurrentUser.UserID;
                $scope.username = IndexDataService.IndexDataInfo.CurrentUser.UserName;
                //設定時區cookie
                TimeZoneService.setTimezone($scope.CurrentCompany.UtfOffSet);
                //設定標題
                document.title = "(" + $scope.IndexData.NoReadCount + ") SuccMail";
                //設定自動讀取未讀數字
                TriggerNoRead();
                // 判斷是否已經完成註冊，如果尚未完成，則不啟動未讀的通知
                GetBackendData.GetRegistStep($scope.IndexData.CurrentUser.CompID, $scope.IndexData.CurrentUser.UserID)
                    .success(function (result)
                    {
                        $scope.IndexData.CurrentUser.IsFinishRegist = result.DataObj.IsFinish;
                    });
                //設定未讀訊息通知
                Setting_NoReadNotice();
                //首次登入先進行所有公司未讀數字刷新
                MultipleCompany_NoReadNum();
                if ($scope.compid == 'AF00535B-7A92-4B7B-9964-BD3A02823718' || $scope.compid == 'af00535b-7a92-4b7b-9964-bd3a02823718') {
                    $scope.msgCheck = true;
                } else {
                    $scope.msgCheck = false;
                }
                $scope.timer = GetMilliSeconds();
                //可以啟用後台引導的Directive
                $scope.$on('$viewContentLoaded', function () {
                    $scope.BackendGuide.IsStart = true;
                });
            }
            else {
                window.location.href = '/Home/LogOut';
            }
        }, function (error) {
            $http({
                method: 'get',
                url: '/Home/LogOut'
            })
            .success(function (result) {
                window.location.href = '/Home/Login';
            })
            .error(function () {

            });
        });
    }
    // #endregion
    // #region 呼叫刷新未讀
    function TriggerNoRead() {
        setInterval(function () { Setting_NoReadNum(); Setting_OnlineMemberNum(); }, NoReadSetting.Time);
    };
    // #endregion
    // #region 我的信箱 & 收藏夾更新數字
    MyBoxCT.onUpdateBoxCT($scope, function (Item) {
        $scope.IndexData.MySubjectCount = Item.BoxCT;
    });
    MyFavCT.onUpdateFavCT($scope, function (Item) {
        $scope.IndexData.MyFavoriteCount = Item.FavCT;
    });
    // #endregion
    // #region 取得討論組列表資料
    $scope.GetSubjList = function (DiscID) {
        //不是Drag的狀態下才可以點擊
        if (!$scope.DiscDrag) {
            //拿取Url 中的param DiscID
            var currentDiscid = document.URL.substr((document.URL.indexOf('SubjList/') + 9), 36);
            //當Url param的DiscID 等同於當下Click的Target ， 觸發Factory 重新 $http.Get
            if (DiscID == currentDiscid) {
                getSubjList.GetSubjList(DiscID);
            }
            else {
                $location.url('/SubjList/' + DiscID);
            }
            getSubjList.UpdateStyle(DiscID);
        }
    };
    // #endregion
    // #region 取得我的排程列表
    $scope.GetBox = function (userid, compid) {
        ToGetMyBoxList(false);
    };
    function ToGetMyBoxList(isNotification) {
        //確認是否在我的信箱頁面
        var result = document.URL.indexOf('mybox');
        if (result > 0 && !isNotification) {
            getmybox.GetMyBoxList();
        }
        else if (isNotification) {
            $location.url('/news');
        }
        else {
            $location.url('/mybox');
        }
        getmybox.UpdateStyle();
    };
    // #endregion
    // #region 取得我的收藏列表
    $scope.GetFavList = function (userid, compid) {
        //確認是否在我的收藏夾頁面
        var result = document.URL.indexOf('my_favorite');
        if (result > 0) {
            getfav.GetFavList();
        }
        else {
            $location.url('/my_favorite');
        }
        getfav.UpdateStyle();
    };
    // #endregion
    // #region 取得草稿列表
    $scope.GetDraft = function (userid, compid) {
        //確認是否在草稿頁面
        var result = document.URL.indexOf('my_draft');
        if (result > 0) {
            getdraft.GetDraftList();
        }
        else {
            $location.url('my_draft');
        }
        getdraft.UpdateStyle();
    };
    // #endregion
    // #region 取得未讀訊息列表
    $scope.GetNews = function (userid, compid) {
        GetNoReadNews();
    };
    // #endregion
    // #region 獨立未讀訊息拿取功能
    function GetNoReadNews() {
        //確認是否在未讀頁面
        var result = document.URL.indexOf('news');
        if (result > 0) {
            getnord.GetnoRdList();
        }
    };
    // #endregion
    // #region 關閉新訊息
    $scope.closeRightSide = function () {
        $scope.$broadcast('toggleNewMsgBlock', 'close');
        RightSide.CloseRightSide($scope);
    };
    // #endregion
    // #region 按X關閉新訊息
    $scope.disableMsgBlock = function (e) {
        if (typeof e !== 'undefined')
            e.stopPropagation();

        RightSide.DeleteNewSubjBlock();
        $scope.createMsgUrl = '';
        AttatchService.Attatchs.splice(0, AttatchService.Attatchs.length);
    };
    // #endregion
    // #region 按X關閉訊息詳細頁
    $scope.disableDetailMsgBlock = function (e) {
        if (typeof e !== 'undefined')
            e.stopPropagation();

        //關閉主題詳細頁
        RightSide.DeleteSubjDetailBlock($scope);
        //清空SubjDetailScope
        RightSide.ReNewSubjDetailScope();
    };
    // #endregion
    // #region 接收新訊息取消按鈕事件
    RightSide.onDeleteNewSubjBlock($scope);
    // #endregion
    // #region 點擊標籤開啟新訊息視窗
    $scope.OpenNewMsg = function () {
        RightSide.newMsg($scope);
    }
    // #endregion
    // #region 點擊標籤開啟詳細頁
    $scope.OpenDetailContent = function () {
        RightSide.SubDetail($scope);
    }
    // #endregion
    // #region 接收主題列表點擊開啟主題之廣播
    RightSide.onShowSubject($scope);
    // #endregion
    // #region 接收開啟新訊息
    RightSide.onOpenNewMsg($scope);
    // #endregion
    // #region 接收編輯主題的廣播
    $scope.$on('EditDetail', function (event, detail) {
        if ($scope.createMsgUrl != '') {

        } else {
        }
    });
    // #endregion
    // #region 導頁方法(後台)
    $scope.goPage = function (page) {
        switch (page) {
            case 'admin':
                IsUpdateCookie();
                window.location.href = "/manager";
                break;
        };
    };
    // #endregion
    // #region 未讀數字監聽==更新已讀取==的事件
    SubDetail.onUpdateReadState(function (Item) {
        var noReadCount = Item.NoReadCount;
        $scope.IndexData.NoReadCount = noReadCount;
        document.title = "(" + noReadCount + ") SuccMail";
        //刷取多公司列表未讀數字
        $filter('filter')($scope.IndexData.Companies, { CompanyID: Item.CompID }, true)[0].UnReadCount = noReadCount;
    });
    // #endregion
    // #region 定時未讀訊息通知
    function Setting_NoReadNotice()
    {
        if (angular.isDefined($scope.intervalPromise))
        {
            $interval.cancel($scope.intervalPromise);
        }
        $scope.intervalPromise = $interval(function () {
            //呼叫所有公司的未讀數字Service
            MultipleCompany_NoReadNum();
        }, NoReadSetting.NoticeTime);
    }
    // #endregion
    // #region 定時刷新未讀數字()
    function Setting_NoReadNum() {
        //呼叫目前視窗公司的未讀數字Service
        IndexDataService.GetNoReadNumber($scope.compid, $scope.userid)
        .success(function (data) {
            $scope.IndexData.NoReadCount = data;
            document.title = "(" + data + ") SuccMail";
        });
    };
    // #endregion
    // #region 定時刷新線上人員數量
    function Setting_OnlineMemberNum() {
        IndexDataService.GetOnlineMember()
            .success(function (data) {
                $scope.IndexData.OnlineUserCount = data;
            });
    };
    // #endregion
    // #region 取得線上人員IP列表
    $scope.GetOnlineUserList = function ()
    {
        var _Para = { "ExecutorID": $scope.IndexData.CurrentUser.UserID };
        IndexDataService.GetOnlineIPList(_Para)
            .success(function (data) {
                // 確認權限OK
                if (data.IsSuccessful)
                {
                    $scope.IndexData.OnlineIPList = [];
                    angular.forEach(data.DataObj, function (value, key) {
                        var _IPObj = value;
                        $scope.IndexData.OnlineIPList.push(_IPObj);
                    });
                    $("#IPListModel").modal("show");
                }
            });
    };
    // #endregion
    // #region 多公司更新未讀數字
    function MultipleCompany_NoReadNum() {
        var CompArray = [];
        for (var i = 0; i < $scope.IndexData.Companies.length; i++) {
            var ListCompID = $scope.IndexData.Companies[i].CompanyID;
            var inner = { CompID: ListCompID, UserID: $scope.userid };
            CompArray.push(inner);
        }
        IndexDataService.GetAllNoReadNumber(CompArray)
        .success(function (data) {
            for (var i = 0 ; i < data.length ; i++) {
                $filter('filter')($scope.IndexData.Companies, { CompanyID: data[i].CompanyID }, true)[0].UnReadCount = data[i].NoReadNum;
                var rCompName = $filter('filter')($scope.IndexData.Companies, { CompanyID: data[i].CompanyID }, true)[0].CompanyName;
                remind(data[i].CompanyID, rCompName, data[i].NoReadNum);
            }
        });
    };
    // #endregion
    // #region 開啟切換公司的畫面
    $scope.OpenSwitchView = function () {
        $("#SwitchCompModal").modal("show");
    };
    // #endregion
    // #region 切換公司
    $scope.SwitchCompany = function (compId) {
        SwitchComp(compId, false);
        $("#SwitchCompModal").modal("hide");
    };
    function SwitchComp(compId, isNotification) {
        IndexDataService.UpdateIndexData(compId, $scope.IndexData.CurrentUser.UserID)
          .then(function (result) {
              if (result.data.IsSuccessful == true) {
                  //更新現今的公司
                  $scope.CurrentCompany = $filter('filter')($scope.IndexData.Companies, { CompanyID: compId })[0];
                  //更新公司的ID
                  $("#CurrentCompID").val(compId);
                  $scope.compid = compId;
                  //重新讀取MyBox
                  ToGetMyBoxList(isNotification);
                  //更新IndexData
                  $scope.IndexData.CurrentUser = result.data.DataObj.CurrentUser;
                  $scope.IndexData.MyDraftCount = result.data.DataObj.MyDraftCount;
                  $scope.IndexData.MyFavoriteCount = result.data.DataObj.MyFavoriteCount;
                  $scope.IndexData.MySubjectCount = result.data.DataObj.MySubjectCount;
                  $scope.IndexData.NoReadCount = result.data.DataObj.NoReadCount.toString();
                  // 重新讀取未讀訊息
                  GetNoReadNews();
                  //進階搜尋討論組參數更新
                  GetDiscList($scope.CurrentCompany);
                  //進階搜尋收件人參數更新
                  GetCompanyUser($scope.compid);
                  //設定時區cookie
                  TimeZoneService.setTimezone($scope.CurrentCompany.UtfOffSet);
                  //更新瀏覽器標題
                  document.title = "(" + result.data.DataObj.NoReadCount.toString() + ") SuccMail";
              }
          });
    };
    // #endregion
    // #region 取得公司Logo的Timer
    function GetMilliSeconds () {
        var date = new Date;
        return date.getMilliseconds();
    };
    // #endregion
    // 進階搜尋
    // #region 進階搜尋多國語言
    //關鍵字
    $scope.KeyWordString = $filter('translate')('Key_Search');
    //日期
    $scope.SearchDateString = $filter('translate')('Date_Range');
    //成員
    $scope.MemberString = $filter('translate')('Member');
    //討論組
    $scope.DiscString = $filter('translate')('Disc');
    //檔案
    $scope.FileString = $filter('translate')('File');
    // #endregion
    // #region 進階搜尋 成員ng-model 初始為空陣列
    $scope.search.SearchMemberList = [];
    $scope.search.SearchDiscList = [];
    // #endregion
    // #region 進階搜尋收件人Template
    $scope.templates = EditorPara.ReceiptHtml;
    // #endregion
    // #region 進階搜尋討論組Template
    $scope.Disctemplates = DiscTemplate.DiscHtml;
    // #endregion
    // #region 開啟進階搜尋視窗
    $scope.ToShowAdvanced = function () {
        $scope.ShowAdvanced = !$scope.ShowAdvanced;
    }
    // #endregion
    // #region 搜尋起始日期
    SearchDate.onUpdateDate($scope, function (Item) {
        if (Item.Date == undefined || Item.Date == "") {
            $scope.search.SearchStartPara = undefined;
            return;
        }
        else {
            $scope.search.SearchStartPara = Date.parse(Item.Date) / 1000;
        }
    });
    // #endregion
    // #region 搜尋結束日期
    SearchEndDate.onUpdateDate($scope, function (Item) {
        if (Item.Date == undefined || Item.Date == "") {
            $scope.search.SearchEndPara = undefined;
            return;
        }
        else {
            $scope.search.SearchEndPara = Date.parse(Item.Date) / 1000;
        }
    });
    // #endregion
    // #region 呼叫搜尋動作(進階搜尋)
    $scope.SearchData = function () {
        $scope.ShowAdvanced = false;
        StartSearch();
    };
    // #endregion
    // #region 呼叫搜尋動作(僅關鍵字搜尋)
    $scope.SimpleSearch = function (event) {
        if (event.keyCode == 13 && $scope.search.SearchKeyWord != undefined)
        {
            // 重製所有進階搜尋參數
            $scope.search.SearchStartPara = undefined;
            $scope.search.SearchEndPara = undefined;
            $scope.search.SelectSearchMember = undefined;
            $scope.search.SelectSearchDisc = undefined;
            $scope.search.SearchFile = undefined;
            $scope.search.SubState = undefined;
            GoSearchPage();
        }
    };
    // #endregion
    // #region 搜尋動作(進階搜尋)
    function StartSearch() {
        $("#nbsearch").collapse('hide');
        if ($scope.search.SearchKeyWord != undefined)
        {
            GoSearchPage();
        }
    };
    // #endregion
    // #region 搜尋動作 進行導頁 Type=0 初階搜尋(純關鍵字)， Type=1 進階搜尋(加入多條件)
    function GoSearchPage() {
        var urlIndex = document.URL.indexOf("Search");
        if (urlIndex > 0)
        {
            //已在搜尋頁面，呼叫factory重新$http
            SearchStart.SearchBegin($scope.search.SearchKeyWord, $scope.search.SearchStartPara, $scope.search.SearchEndPara, $scope.search.SelectSearchMember, $scope.search.SelectSearchDisc, $scope.search.SearchFile, $scope.search.SubState);
        }
        else
        {
            $location.url('/Search');
        }
    };
    // #endregion
    // #region 拿取公司的所有成員列表
    function GetCompanyUser(compID) {
        SearchMember.GetCompUser(compID)
         .success(function (response) {
             $scope.search.SearchMemberList = response;
         })
    };
    // #endregion
    // #region 填充搜尋使用的討論組資料
    function GetDiscList(CurrentCompany) {
        $scope.search.SearchDiscList = [];
        //一般討論組
        var CompanyDisc = CurrentCompany.DiscussionCate[0].Discussions;
        for (var i = 0; i < CompanyDisc.length; i++) {
            var Result =
                {
                    Name: CompanyDisc[i].DiscussionTitle,
                    DiscID: CompanyDisc[i].DiscussionID
                };
            $scope.search.SearchDiscList.push(Result);
        }
        //行政區討論組
        var AdminDisc = CurrentCompany.DiscussionCate[1].Discussions;
        for (var i = 0; i < AdminDisc.length; i++) {
            $scope.search.SearchDiscList.push({ 'Name': AdminDisc[i].DiscussionTitle, 'DiscID': AdminDisc[i].DiscussionID });
        }
    };
    function createguid() {
        function _p8(s) {
            var p = (Math.random().toString(16) + "000000000").substr(2, 8);
            return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
        }
        return _p8() + _p8(true) + _p8(true) + _p8();
    }
    function sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds) {
                break;
            }
        }
    }

    //視窗關閉事件

    // #endregion
    // #region 個人設定
    $scope.PersonalSetting = function () {
        $location.url('/Personal');
    };
    // #endregion
    //#region 初始化新增討論組的畫面
    $scope.initNewDiscussion = function () {
        $scope.showNewDiscussion = true;
        // 初始化畫面
        //discSetting.initdiscussionsetting();
        // 廣播初始化資料事件
        $scope.$broadcast('initNewDiscussion', { 'init': $scope.showNewDiscussion });
    };
    //#endregion
    // #region 未讀的訊息通知
    function remind(rCompID, rCompName, rNoreadNum) {
        if (window.webkitNotifications && navigator.userAgent.indexOf("Chrome") > -1)
        {
            webkitNotifications.requestPermission();
            // 判斷條件包含三項
            // 1. 可以進行推播 2. 未讀數量大於0 3. 已經完成了註冊的流程
            var _IsFinishRegist = IndexDataService.IndexDataInfo.CurrentUser.IsFinishRegist;
            console.log(_IsFinishRegist);
            if (webkitNotifications.checkPermission == 0 && rNoreadNum > 0 && _IsFinishRegist) {
                var Notification_Img = '/Backend/getCompImg?CompID=' + rCompID;
                var n = webkitNotifications.createNotification(Notification_Img, rCompName, '您有' + rNoreadNum + '筆未讀訊息');
                n.show();
            }
            else {

            }
        }
        else if (window.Notification)
        {
            Notification.requestPermission();
            // 1. 可以進行推播 2. 未讀數量大於0 3. 已經完成了註冊的流程
            var _IsFinishRegist = IndexDataService.IndexDataInfo.CurrentUser['IsFinishRegist'];
            console.log(IndexDataService.IndexDataInfo);
            console.log(IndexDataService.IndexDataInfo.CurrentUser.IsFinishRegist);
            console.log(_IsFinishRegist);
            console.log(Notification.permission);
            console.log(rNoreadNum);
            console.log(notifyCount);
            if (Notification.permission == "granted" && rNoreadNum > 0 && notifyCount < 3 && _IsFinishRegist) {
                var Notification_Img = '/Backend/getCompImg?CompID=' + rCompID;
                var n = new Notification(rCompName, { 'body': '您有' + rNoreadNum + '筆未讀訊息', 'icon': Notification_Img, 'data': rCompID});
                //點擊動作
                n.onclick = function (para) {
                    var paraCompID = para.srcElement.data;
                    SwitchComp(paraCompID, true);
                };
                // 通知出現
                n.onshow = function () {
                    notifyCount++;
                };
                // 通知消失
                n.onclose = function () {
                    notifyCount--;
                };
                //設定自動關閉
                setTimeout(n.close.bind(n), 10000);
            }
        }
        else {
        }
    };
    // #endregion
    // #region 進入Drag狀態
    $scope.startCallback = function (event, ui, title, index) {
        //表示已經進入Drag的狀態
        $scope.DiscDrag = true;
        angular.forEach(angular.element(".DragDisc:not([class~='ui-draggable-dragging'])"), function (value, key) {
            angular.element(value).addClass('droppable-select');
        });
    };
    // #endregion
    // #region Drop事件停止
    $scope.stopCallback = function (event, ui, dataItem) {
        angular.forEach(angular.element(".DragDisc:not([class~='ui-draggable-dragging'])"), function (value, key) {
            angular.element(value).removeClass('droppable-select');
        });
        if (!$scope.DiscDragHover)
        {
            // 清除Drag狀態
            $scope.DiscDrag = false;
        }
    };
    // #endregion
    // #region Drop事件完成
    $scope.dropCallback = function (event, ui, dataItem) {
        //清除Drag狀態
        $scope.DiscDrag = false;
        $scope.DiscDragHover = false;
        var flag = 1;
        if (dataItem['DiscussionType'] == 2)
        {
            flag = 0;
        }
        //呼叫資料庫
        UpdateDiscSequence(flag);
    };
    // #endregion
    // #region 滑過
    $scope.overCallback = function (event, ui, dataItem)
    {
        $scope.DiscDragHover = true;
    };
    // #endregion
    // #region 滑出
    $scope.outCallback = function (event, ui, dataItem) {
        //var DragDiscID = dataItem['DiscussionID'];
        //var DragIndex = $("#" + DragDiscID).parent("div").index();
    };
    // #endregion
    // #region 呼叫資料庫更新排序
    function UpdateDiscSequence(flag) 
    {
        var DiscUpdateArray = [];
        var CurrencyDiscList = $scope.CurrentCompany.DiscussionCate[flag]['Discussions'];
        angular.forEach(CurrencyDiscList, function (value, key) {
            var ItemDiscID = value['DiscussionID'];
            var ItemTitle = value['DiscussionTitle'];
            var ItemIndex = $("#" + ItemDiscID).parent("div").index();
            $filter('filter')($scope.CurrentCompany.DiscussionCate[flag]['Discussions'], { DiscussionID: ItemDiscID }, true)[0].Sequence = key + 1;
            var DiscSeqObj = { "UserId": $scope.userid, "DiscId": ItemDiscID, "Sequence": key + 1 };
            DiscUpdateArray.push(DiscSeqObj);
        });
        //更新資料庫的DiscUser
        IndexDataService.UpdateDiscSeq(DiscUpdateArray)
            .then(function(result) {
                if(result.data['IsSuccess'])
                {
                    // 廣播事件
                    // 呼叫服務
                    CallDiscSeqService(DiscUpdateArray);
                }
            });
    };
    // #endregion
    // #region 呼叫討論組順序變換服務
    function CallDiscSeqService(param)
    {
        var source = 9;
        var WindowsURL = window.document.URL;
        var urlArray = [{ url: "news", val: 0 },{ url: "mybox", val: 1 },{ url: "my_favorite", val: 2 },{ url: "Search", val: 7 }];

        for (var i = 0; i < urlArray.length; i++)
        {
            var urlString = urlArray[i].url;
            if(WindowsURL.indexOf(urlString) > 1)
            {
                source = urlArray[i].val;
                break;
            }
        }

        DiscSeq.UpdateDiscSeq({ CompID: $scope.compid, DiscArray: param, Source: source });
    };
    // #endregion
    // #region 退出公司
    $scope.Dropout = function (DropCompID, BossID) {
        if ($scope.CurrentCompany.CompanyID == DropCompID)
        {
            var _msg = $filter('translate')('BeforeDropout');
            alert(_msg);
            return;
        }
        else
        {
            var _msg = $filter('translate')('AreYouSure');
            var _makesure = confirm(_msg);
            if(!_makesure)
            {
                return;
            }
        }
        $("#SwitchCompModal").modal("hide");
        $.blockUI();
        var _Param = ({
            CompID: DropCompID,
            BossID: BossID,
            UserID: $scope.userid
        });
        GetBackendData.DropoutComp(_Param)
            .then(function (result) {
                $.unblockUI();
                if(result.data.IsSuccessful)
                {
                    window.location.href = "/mybox";
                }
                else
                {
                    _Msg = $filter('translate')('FailToDropout');
                    alert(_Msg);
                }
            });
    };
    // #endregion
    // #region 偵測頁面滑鼠滾動
    //$(window).scroll(function () {
        //$("#left-side").css({ 'position': 'fixed', 'bottom': '' });
        //var MenuTop = $('#left-side').offset().top + 16;
        //var MenuHeight = parseInt($("#left-side").css('height')) + 40;
        //var ContentHeight = parseInt($("#middle").css('height'));
        //var Screen = $(window).height();
        //if (MenuHeight >= Screen && ContentHeight >= Screen)
        //{
        //    // 左側選單跟內容高度都大於等於螢幕高
        //    if($(window).scrollTop() <= MenuHeight/2.42)
        //    {
        //        $("#left-side").css({ 'position': 'relative', 'bottom': '' });
        //        console.log(1);
        //    }
        //    else if($(window).scrollTop() >= MenuHeight - (Screen - 200))
        //    {
        //        $("#left-side").css({ 'position': 'fixed', 'bottom': '0' });
        //        console.log(2);
        //    }
        //}
        //// 左側選單小於視窗高度，但是右側內容大於螢幕高度
        //else if(MenuHeight < Screen && ContentHeight >= Screen)
        //{
        //    $("#left-side").css({ 'position': 'fixed', 'bottom': '' });
        //    console.log(MenuHeight);
        //    console.log(Screen);
        //}
        //else {
        //    $("#left-side").css({ 'position': 'relative' });
        //    console.log(4);
        //}
    //});
    // #endregion
    // #region 左側選單的滑鼠滾動方法
    $("#left-side").bind("mousewheel DOMMouseScroll", function (event) {
        var scrollTo = null;

        if(event.type == "mousewheel")
        {
            console.log(event.originalEvent.wheelDelta);
            scrollTo = (event.originalEvent.wheelDelta * -1);
        }
        else if (event.type == "DOMMouseScroll")
        {
            scrollTo = 40 * event.originalEvent.detail;
        }

        if (scrollTo)
        {
            event.preventDefault();
            $(this).scrollTop(scrollTo + $(this).scrollTop());
        }
    });
    // #endregion
}]);