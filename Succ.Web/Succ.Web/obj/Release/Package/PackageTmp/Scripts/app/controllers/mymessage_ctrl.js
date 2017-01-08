SuccApp.controller('MyMessageCtrl', ['$scope', '$routeParams', '$location', '$filter', '$http', 'MyBoxCT', 'MyFavCT', 'SubDetail', '$rootScope', 'FavFactory', 'IsInsFactory', 'ColorFactory', 'getmybox', 'getfav', 'SubjectProgress', 'GetListFinish', 'EditFinish', '$routeParams', 'SubjectEvent', 'RightSide', '$q', 'DelSubjFactory', 'DiscSeq', function ($scope, $routeParams, $location, $filter, $http, MyBoxCT, MyFavCT, SubDetail, $rootScope, FavFactory, IsInsFactory, ColorFactory, getmybox, getfav, SubjectProgress, GetListFinish, EditFinish, $routeParams, SubjectEvent, RightSide, $q, DelSubjFactory, DiscSeq) {
    // #region  參數
    //預設左邊選單會顯示
    $scope.$parent.$parent.ShowLeftMenu = true;
    $scope.$parent.IsFirstVisit = $routeParams.IsFirst;
    //Time Random
    var d = new Date();
    // 每次頁面讀取更新全域參數

    //UserID
    var UserID = "";
    //CompanyID
    var CompanyID = "";
    //UserName
    var UserName = "";
    UpdateGlobalParam();

    // #endregion 
    // #region 更新全域參數
    function UpdateGlobalParam() {
        UserID = $scope.$parent.$parent.IndexData.CurrentUser.UserID;
        $scope.userid = UserID;
        CompanyID = $scope.$parent.$parent.CurrentCompany.CompanyID;
        $scope.$parent.$parent.compid = CompanyID;
        UserName = $scope.$parent.$parent.IndexData.CurrentUser.UserName;
    };
    // #endregion 
    // #region 首次登入 進行廣播
    if ($routeParams.IsFirst)
    {
        $rootScope.$broadcast('FirstVisit', 'true');
    }
    // #endregion
    // #region 呼叫拿取我的信箱列表資料
    GetMyBox();
    // #endregion
    // #region 重新Http Get My Box
    getmybox.onGetMyBoxList($scope, function ()
    {
        GetMyBox();
    });
    // #endregion
    // #region 呼叫Factory，拿取我的信箱列表資料
    function GetMyBox()
    {
        getmybox.GetMyBoxData(UserID, $scope.$parent.$parent.CurrentCompany.CompanyID)
        .then(function (result) {
            //設定我的信箱列表資料
            $scope.MyBoxData = result.data;
            //確定資料完成Loading，開始建立Filter
            GetListFinish.GetFinish();
        });
    }
    // #endregion
    // #region 加入我的訊息
    $scope.AddMyMsg = function (DiscID, SubjectID)
    {
        var Disc = $filter('filter')($scope.MyBoxData, { DiscID: DiscID }, true)[0];
        $filter('filter')(Disc.SubjectList, { SubjectID: SubjectID }, true)[0].IsIns = true;
        SettingIsIns(CompanyID, UserID, SubjectID, true);
    }
    // #endregion
    // #region 移除我的訊息
    $scope.RemoveMyMsg = function (DiscID, SubjectID)
    {
        var Disc = $filter('filter')($scope.MyBoxData, { DiscID: DiscID }, true)[0];
        $filter('filter')(Disc.SubjectList, { SubjectID: SubjectID }, true)[0].IsIns = false;
        SettingIsIns(CompanyID, UserID, SubjectID, false);
    }
    // #endregion
    // #region 加入收藏
    $scope.AddFav = function (DiscID, SubjectID)
    {
        var Disc = $filter('filter')($scope.MyBoxData, { DiscID: DiscID }, true)[0];
        $filter('filter')(Disc.SubjectList, { SubjectID: SubjectID }, true)[0].IsFav = true;
        SettingFav(CompanyID, UserID, SubjectID, true);
    }
    // #endregion
    // #region 移除收藏
    $scope.RemoveFav = function (DiscID, SubjectID)
    {
        var Disc = $filter('filter')($scope.MyBoxData, { DiscID: DiscID }, true)[0];
        $filter('filter')(Disc.SubjectList, { SubjectID: SubjectID }, true)[0].IsFav = false;
        SettingFav(CompanyID, UserID, SubjectID, false);
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
    // #region 新視窗
    //angular.element('#tab_content_body').on('mouseover', '.data-table-tr', function () {
    //    $(this).find('.glyphicon-new-window').css('visibility', 'visible');
    //});
    //angular.element('#tab_content_body').on('mouseout', '.data-table-tr', function () {
    //    $(this).find('.glyphicon-new-window').css('visibility', 'hidden');
    //});
    // #endregion
    // #region 變換進行、完成、檔案Tag
    angular.element('#tab_content_head').on('click', 'a', function () {
        $('.tab-continue').attr("class", "tab-continue tab-li");
    });
    // #endregion
    // #region 按鈕主題展開右側內容
    $scope.ShowSubject = function (DiscID, CompanyID, UserID, SubjectID)
    {
        UpdateGlobalParam();
        var ShowSubjTemplate = function ()
        {
            var q = $q.defer();
            q.resolve(SubDetail.OpenSubDetail(DiscID, CompanyID, UserID, SubjectID, UserName, 1));
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
    // #region 主題詳細頁更新Fav 同步更新 socpe Data List
    FavFactory.onUpdateFav($scope, 1, function (Item)
    {
        var DiscID = Item.DiscID;
        var SubjID = Item.SubjID;
        var Flag = Item.Flag;
        var Disc = $filter('filter')($scope.MyBoxData, { DiscID: DiscID }, true)[0];
        $filter('filter')(Disc.SubjectList, { SubjectID: SubjID }, true)[0].IsFav = Flag;
    });
    // #endregion
    // #region 主題詳細頁更新IsIns 同步更新scope Data List
    IsInsFactory.onUpdateIsIns($scope, 1, function (Item)
    {
        var DiscID = Item.DiscID;
        var SubjID = Item.SubjID;
        var Flag = Item.Flag;
        var DiscData = $filter('filter')($scope.MyBoxData, { DiscID: DiscID }, true)[0];
        $filter('filter')(DiscData.SubjectList, { SubjectID: SubjID }, true)[0].IsIns = Flag;
    });
    // #endregion
    // #region 主題詳細頁更新Color 同步更新scope Data List
    ColorFactory.onUpdateColor($scope, 1, function (Item) {
        var DiscID = Item.DiscID;
        var SubjID = Item.SubjID;
        var Color = Item.Color;
        var DiscData = $filter('filter')($scope.MyBoxData, { DiscID: DiscID }, true)[0];
        $filter('filter')(DiscData.SubjectList, { SubjectID: SubjID }, true)[0].SubjectColor = Color;
    });
    // #endregion
    // #region 主題詳細頁刪除主題 同步更新scope Data List
    DelSubjFactory.onAfterDelSubj($scope, 1, function (Item)
    {
        var DiscID = Item.DiscID;
        var SubjID = Item.SubjID;
        var DiscData = $filter('filter')($scope.MyBoxData, { DiscID: DiscID }, true)[0];
        var subjItem = $filter('filter')(DiscData.SubjectList, { SubjectID: SubjID }, true);
        var subjIndex = DiscData.SubjectList.indexOf(subjItem[0]);
        if (subjIndex > -1)
        {
            DiscData.SubjectList.splice(subjIndex, 1);
        }
        RightSide.DeleteSubjDetailBlock($scope.$parent.$parent);
    });
    // #endregion
    // #region 主題詳細頁監聽==更新主題狀態的事件
    SubDetail.onUpdateSubjectProgress(1, function (Item)
    {
        var subjID = Item.SubjId;
        var state = Item.State;
        var DiscID = Item.DiscID;
        // 完成主題 state = 9
        if (state == SubjectProgress.Closed)
        {
            var DiscData = $filter('filter')($scope.MyBoxData, { DiscID: DiscID }, true)[0];
            var subjItem = $filter('filter')(DiscData.SubjectList, { SubjectID: subjID }, true);
            subjItem[0].Progress = state;
            $scope.MyBoxCloseData = subjItem[0];
            var subjIndex = DiscData.SubjectList.indexOf(subjItem[0]);
            if (subjIndex > -1)
            {
                DiscData.SubjectList.splice(subjIndex, 1);
            }
        }
        // 一般申請 state = 2
        else if (state == SubjectProgress.ApplyClose)
        {
            var DiscData = $filter('filter')($scope.MyBoxData, { DiscID: DiscID }, true)[0];
            var subjItem = $filter('filter')(DiscData.SubjectList, { SubjectID: subjID }, true);
            subjItem[0].Progress = state;
        }
        //完成主題退回 state = 5
        else if (state == SubjectProgress.Reject)
        {
            //一次頁面中，執行歸檔在執行退回
            if (Object.getOwnPropertyNames($scope.MyBoxCloseData).length > 0)
            {
                $scope.MyBoxCloseData['Progress'] = state;
                var DiscData = $filter('filter')($scope.MyBoxData, { DiscID: DiscID }, true)[0];
                DiscData.SubjectList.unshift($scope.MyBoxCloseData);
            }
            //直接退回主題
            else
            {
                var DiscData = $filter('filter')($scope.MyBoxData, { DiscID: DiscID }, true)[0];
                var subjItem = $filter('filter')(DiscData.SubjectList, { SubjectID: subjID }, true);
                subjItem[0].Progress = state;
            }
            $scope.MyBoxCloseData = {};
        }
        //一般申請退回 state = 1
        else if (state == SubjectProgress.InProgress)
        {
            var DiscData = $filter('filter')($scope.MyBoxData, { DiscID: DiscID }, true)[0];
            var subjItem = $filter('filter')(DiscData.SubjectList, { SubjectID: subjID }, true);
            subjItem[0].Progress = state;
        }
    });
    // #endregion
    // #region 監聽討論組的排序變動
    DiscSeq.onUpdateDiscSeq(1, function (Data)
    {
        var DiscArray = Data['DiscArray'];
        for(var i = 0; i < DiscArray.length;i++)
        {
            var DiscList = $filter('filter')($scope.MyBoxData, { DiscID: DiscArray[i].DiscId }, true)[0];
            if (DiscList != undefined)
            {
                $filter('filter')($scope.MyBoxData, { DiscID: DiscArray[i].DiscId }, true)[0]['Sequence'] = DiscArray[i]['Sequence'];
            }
        }
    });
    // #endregion
    // #region 監聽到編輯完成，更新主題列表
    EditFinish.onEditSubj($scope, 1, function (Data)
    {
        var Disc = $filter('filter')($scope.MyBoxData, { DiscID: Data.DiscID }, true)[0];

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
    // #region 轉換預計完成日期
    $scope.ConvertPlanDiff = function (_PlanCloseOn, _Progress, _Type)
    {
        // Type 0: 已超過期限, 1:尚未超過期限
        if(_PlanCloseOn == 0)
        {
            return "";
        }
        else
        {
            var _result = ListCalculatePlanDiff(_PlanCloseOn, _Progress, _Type);
            return _result;
        }
    };
    // #endregion
    // #region 列表計算日期差距
    function ListCalculatePlanDiff(para1, para2, para3)
    {
        var Today = Date.parse(new Date()) / 1000;
        var dayDifference = 0;
        if(para2 >= 9)
        {
            dayDifference = 0;
        }
        else
        {
            dayDifference = Math.round((para1 - Today) / 60 / 60 / 24);
        }
        //超越99 顯示99+
        if (Math.abs(dayDifference) > 99)
            return "99+";
        else
        {
            var _result = para3 == 1 ? Math.abs(dayDifference) : dayDifference;
            return _result;
        }
            
    }
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
    // #region 主題詳細頁監聽==更新已讀取==的事件
    SubDetail.onUpdateReadState(function (Item) {
        var SubjID = Item.SubjID;
        var DiscID = Item.DiscID;
        var DiscData = $filter('filter')($scope.MyBoxData, { DiscID: DiscID }, true)[0];
        var subjItem = $filter('filter')(DiscData.SubjectList, { SubjectID: SubjID }, true);
        if (typeof subjItem[0] !== 'undefined') {
            subjItem[0].IsRead = true;
        };
    });
    // #endregion
    // #region 監聽由ReplyCtrl ReplyInserted廣播來的事件
    $rootScope.$on(SubjectEvent.ReplyInserted, function (event, data) {
        var SubjID = data.SubjId;
        var DiscID = data.DiscID;
        var discItem = $filter('filter')($scope.MyBoxData, { DiscID: DiscID }, true)[0];
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
    // #region 我的信箱PDF(顏色)
    function PDFColor(type)
    {
        switch (type) {
            case '0':
                return "<div style='display:inline:block;width:12px;height:49px;background-color:white'></div>";
                break;
            case '1':
                return "<div style='display:inline:block;width:12px;height:49px;background-color:rgb(102, 204, 51)'></div>";
                break;
            case '2':
                return "<div style='display:inline:block;width:12px;height:49px;background-color:rgb(255, 153, 51)'></div>";
                break;
            case '3':
                return "<div style='display:inline:block;width:12px;height:49px;background-color:rgb(255, 102, 102)'></div>";
                break;
        }
    }
    // #endregion
    // #region 我的信箱PDF(信箱)
    function PDFMyBox(url, type) {
        switch (type) {
            case 'false':
                return "<div style='width:24px;height:24px;background-image:url(\"" + url + "/Statics/img/GeneratePDF/EmptyMybox.png\")'></div>";
                break;
            case 'true':
                return "<div style='width:24px;height:24px;background-image:url(\"" + url + "/Statics/img/GeneratePDF/RealMybox.png\")'></div>";
                break;
        }
    };
    // #endregion
    // #region 我的信箱PDF(星星)
    function PDFStar(url, type) {
        switch (type) {
            case 'false':
                return "<div style='width:24px;height:24px;background-image:url(\"" + url + "/Statics/img/GeneratePDF/EmptyStar.png\")'></div>";
                break;
            case 'true':
                return "<div style='width:24px;height:24px;background-image:url(\"" + url + "/Statics/img/GeneratePDF/RealStar.png\")'></div>";
                break;
        }
    };
    // #endregion
    // #region 我的信箱PDF(回覆)
    function PDFReply(type) {
        var IsReply = $(type).attr("class") == "ng-hide" ? "false" : "true";
        switch (IsReply) {
            case 'false':
                return "<div></div>";
                break;
            case 'true':
                return "<div style='width:30px;height:30px;'>" + $(type).children("label").text() + "</div>";
                break;
        }
    };
    // #endregion
    // #region 匯出我的信箱
    $scope.ExportMyBox = function ()
    {
        var WebSiteURL = "https://succmail.com";
        var borderString = "border-top-width:1px;border-top-color:rgb(196, 196, 196);border-top-style:solid;border-right-width:1px;border-right-color:rgb(196, 196, 196);border-right-style:solid;border-bottom-width:1px;border-bottom-color:rgb(196, 196, 196);border-bottom-style:solid;border-left-width:1px;border-left-color:rgb(196, 196, 196);border-left-style:solid;";
        var borderbottomString = "border-bottom-width:1px;border-bottom-color:rgb(196, 196, 196);border-bottom-style:solid;";
        var source = "<div>";
        var MyBoxString = $("#middle").children("h2").html();
        // #region Logo
        source += "<div style='margin:0;width:80px;height:80px;background-image:url(\"" + WebSiteURL + "/Statics/img/home/logo.png\")'></div>";
        // #endregion
        //Mybox
        source = source + "<h2>" + MyBoxString + "</h2>";
        //確認總共有多少討論組
        var DiscLength = $(".General_DiscName").length;
        source += "<div id='tab_content_body' style='min-height:600px;margin-left:10px;margin-right:12px;'>";
        for (var i = 0; i < DiscLength; i++)
        {
            var DiscEntity = $(".General_DiscName").children("h3").children("span[class='ng-binding']")[i];
            var DiscName = $(DiscEntity).text();
            source += "<div id='tab_content_data' style='display:block;'>";
            source += "<table style='width:100%;' cellpadding='4' cellspacing='4'>";
            // #region 討論組名稱tr
            source += "<tr>";
            source += "<td style='background-color:white;padding-top:14px;" + borderString + "'>";
            source += "<div style='width:300px;display:inline-block;float:left;'><h3><span>" + DiscName + "</span></h3></div>";
            source += "<div style='display:inline-block;float:right;margin:0;width:20px;height:20px;background-image:url(\"" + WebSiteURL + "/Statics/img/GeneratePDF/arrow.png\")'></div>";
            source += "</td>";
            source += "</tr>";
            // #endregion End 討論組名稱tr
            var DiscRowEntity = $(".General_DiscName").parent().children("table").children("tbody")[i];
            var tr = $(DiscRowEntity).children("tr");
            for (var j = 0; j < tr.length; j++)
            {
                var colorEntity = $(DiscRowEntity).children("tr").children(".type").children("div")[j];
                var MyBoxEntity = $(DiscRowEntity).children("tr").children(".my-msg").children("span")[j];
                var StarEntity = $(DiscRowEntity).children("tr").children(".collect").children("span")[j];
                var TitleEntity = $(DiscRowEntity).children("tr").children(".title").children("a")[j];
                var CreatorEntity = $(DiscRowEntity).children("tr").children(".sender").children("p")[j];
                var CreateTimeEntity = $(DiscRowEntity).children("tr").children(".sender").children("label")[j];
                var ReplyEntity = $(DiscRowEntity).children("tr").children(".respond").children("div")[j];
                var ModifierEntity = $(DiscRowEntity).children("tr").children(".lastrespond").children("p")[j];
                var ModifyTimeEntity = $(DiscRowEntity).children("tr").children(".lastrespond").children("label")[j];
                source += "<tr style='" + borderString + "'>";
                source += "<td width='90%'>";
                source += "<table cellpadding='0' cellspacing='0' width='100%'>";
                source += "<tr>";
                source += "<td width='7%'>";
                source += PDFColor($(colorEntity).attr("ng-switch-when"));
                source += "</td>";
                source += "<td width='7%'>";
                source += PDFMyBox(WebSiteURL, $(MyBoxEntity).attr("ng-switch-when"));
                source += "</td>";
                source += "<td width='7%'>";
                source += PDFStar(WebSiteURL, $(StarEntity).attr("ng-switch-when"));
                source += "</td>";
                source += "<td width='60%'>";
                source += "<span>" + $(TitleEntity).text() + "</span>";
                source += "</td>";
                source += "<td width='10%'>";
                source += "<p style='margin-bottom:0;'>" + $(CreatorEntity).text() + "</p>";
                source += "<label style='font-size:15px;display:inline-block;font-weight:bold;'>" + $(CreateTimeEntity).text() + "</label>";
                source += "</td>";
                source += "<td width='10%'>";
                source += PDFReply($(ReplyEntity));
                source += "</td>";
                source += "<td width='10%'>";
                source += "<p style='margin-bottom:0;'>" + $(ModifierEntity).text() + "</p>";
                source += "<label style='font-size:15px;display:inline-block;font-weight:bold;'>" + $(ModifyTimeEntity).text() + "</label>";
                source += "</td>";
                source += "</tr>";
                source += "</table>";
                source += "</td>";
                source += "</tr>";
            }

            source += "</table>";
            source += "</div>";
        }
        source += "</div>";
        //End
        source += "</div>";
        //Content
        var form = $("<form></form>").attr('method', 'post').attr("name", "PostPDF").attr("target", "iframe").attr("action", "/Subject/GetMyBoxPDF");
        form.append($("<input></input>").attr('type', 'hidden').attr('name', 'HtmlContent').attr('value', source.replace(/</g,'%26')));
        form.appendTo('body').submit();
    };
    // #endregion
}]);