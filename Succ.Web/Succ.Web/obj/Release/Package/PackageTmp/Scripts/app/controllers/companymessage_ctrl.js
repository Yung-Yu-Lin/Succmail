SuccApp.controller('ComapnyMessageCtrl', ['$scope', '$routeParams', '$location', '$filter', '$http', 'MyBoxCT', 'MyFavCT', 'SubDetail', '$rootScope', 'SubjectEvent', 'SubjectColor', 'DiscType', 'SubjectProgress', 'FavFactory', 'IsInsFactory', 'ColorFactory', 'getFinish', 'getSubjList', 'FileFolder', 'ClickFolder', 'FileUploader', 'UploadFile', 'UploadFinish', 'UploadOk', 'GetListFinish', 'EditFinish', 'RightSide', 'getmybox', 'getfav', '$q', 'DelSubjFactory', 'DiscSeq', 'Filesize_Conf', 'UniqueComp', function ($scope, $routeParams, $location, $filter, $http, MyBoxCT, MyFavCT, SubDetail, $rootScope, SubjectEvent, SubjectColor, DiscType, SubjectProgress, FavFactory, IsInsFactory, ColorFactory, getFinish, getSubjList, FileFolder, ClickFolder, FileUploader, UploadFile, UploadFinish, UploadOk, GetListFinish, EditFinish, RightSide, getmybox, getfav, $q, DelSubjFactory, DiscSeq, Filesize_Conf, UniqueComp)
{
    // #region 參數
    // click target
    var clickTarget = '';
    //預設左邊選單會顯示
    $scope.$parent.$parent.ShowLeftMenu = true;
    //Parameter (DiscID,UserID)
    var DiscID = $routeParams.id;
    //指定給Filter Directive
    $scope.discussionid = DiscID;
    var UserID = "";
    //CompanyID
    var CompID = ""
    //UserName
    var UserName = ""

    // 找出目前所在討論組
    var nowDiscussion = function (id) {
        var DiscItem = [];
        var discCate = $scope.$parent.$parent.CurrentCompany.DiscussionCate;
        angular.forEach(discCate, function (value, key) {
            if (DiscItem.length == 0) {
                DiscItem = $filter('filter')(value.Discussions, { DiscussionID: id });
            }
        });
        return DiscItem[0];
    };
    $scope.nowDiscussion = new nowDiscussion(DiscID);

    //預設不製作完成區頁面
    $scope.IsLoadingFinish = false;
    //預設完成區頁面不載入Template
    $scope.FinishUrl = '';
    //預設不製做檔案分享區頁面
    $scope.IsLoadingFile = false;
    //預設檔案分享區不載入Template
    $scope.FileUrl = '';
    //控制檔案分享去的新增按鈕不顯示
    $scope.Btnobj = {};
    $scope.Btnobj.IsShowFileBtn = false;
    //顯示新增訊息按鈕
    $scope.Btnobj.IsShowMsgBtn = true;

    $scope.File = {};
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
    // #region 主題詳細頁更新Fav 同步更新scope Data List
    FavFactory.onUpdateFav($scope, 3, function (Item)
    {
        var SubjID = Item.SubjID;
        var Flag = Item.Flag;
        $filter('filter')($scope.datalist_continue, { SubjectID: SubjID }, true)[0].IsFav = Flag;
    });
    // #endregion
    // #region 主題詳細頁更新IsIns 同步更新scope Data List
    IsInsFactory.onUpdateIsIns($scope, 3, function (Item) {
        var SubjID = Item.SubjID;
        var Flag = Item.Flag;
        $filter('filter')($scope.datalist_continue, { SubjectID: SubjID }, true)[0].IsIns = Flag;
    });
    // #endregion
    // #region 主題詳細頁更新Color 同步更新 scope Data List
    ColorFactory.onUpdateColor($scope, 3, function (Item) {
        var SubjID = Item.SubjID;
        var Color = Item.Color;
        $filter('filter')($scope.datalist_continue, { SubjectID: SubjID }, true)[0].SubjectColor = Color;
    });
    // #endregion
    // #region 主題詳細頁刪除主題，同步更新scope Data List
    DelSubjFactory.onAfterDelSubj($scope, 3, function (Item)
    {
        var SubjID = Item.SubjID;
        var subjItem = $filter('filter')($scope.datalist_continue, { SubjectID: SubjID }, true);
        var subjIndex = $scope.datalist_continue.indexOf(subjItem[0]);
        if(subjIndex > -1)
        {
            $scope.datalist_continue.splice(subjIndex, 1);
        }
        RightSide.DeleteSubjDetailBlock($scope.$parent.$parent);
    });
    // #endregion
    // #region 主題詳細頁監聽==更新已讀取==的事件
    SubDetail.onUpdateReadState(function (Item) {
        var SubjID = Item.SubjID;
        var subjItem = $filter('filter')($scope.datalist_continue, { SubjectID: SubjID })[0];
        if (typeof subjItem !== 'undefined') {
            subjItem.IsRead = true;
        }
    });
    // #endregion
    // #region 主題詳細頁監聽==更新主題狀態的事件
    SubDetail.onUpdateSubjectProgress(3, function (Item) {
        var subjID = Item.SubjId;
        var state = Item.State;
        //完成主題 state = 9
        if (state == SubjectProgress.Closed)
        {
            var subjItem = $filter('filter')($scope.datalist_continue, { SubjectID: subjID }, true);
            subjItem[0].Progress = state;
            $scope.SubjCloseData = subjItem[0];
            var subjIndex = $scope.datalist_continue.indexOf(subjItem[0]);
            if (subjIndex > -1)
            {
                $scope.datalist_continue.splice(subjIndex, 1);
            }
        }
        //一般申請 state = 2
        else if (state == SubjectProgress.ApplyClose)
        {
            var subjItem = $filter('filter')($scope.datalist_continue, { SubjectID: subjID }, true);
            subjItem[0].Progress = state;
        }
        //完成主題退回 state = 5
        else if (state == SubjectProgress.Reject)
        {
            if (Object.getOwnPropertyNames($scope.SubjCloseData).length > 0)
            {
                $scope.SubjCloseData['Progress'] = state;
                $scope.datalist_continue.unshift($scope.SubjCloseData);
            }
            $scope.SubjCloseData = {};
        }
        //一般申請退回 state = 1
        else if (state == SubjectProgress.InProgress)
        {
            var subjItem = $filter('filter')($scope.datalist_continue, { SubjectID: subjID }, true);
            subjItem[0].Progress = state;
        }
    });
    // #endregion
    // #region 初始化 檔案上傳設定
    UploadFileInit("00000000-0000-0000-0000-000000000000");
    // #endregion
    // #region 拿取討論組列表資料
    GetSubjectList();
    // #endregion
    // #region 新視窗
    //angular.element('#tab_content_data').on('mouseover', '.data-table-tr', function () {
    //    $(this).find('.glyphicon-new-window').css('visibility', 'visible');
    //});
    //angular.element('#tab_content_data').on('mouseout', '.data-table-tr', function () {
    //    $(this).find('.glyphicon-new-window').css('visibility', 'hidden');
    //});
    // #endregion
    // #region 變換進行、完成、檔案Tag
    angular.element('#tab_content_head').on('click', 'a', function () {
        $('.tab-continue').attr("class", "tab-continue tab-li");
    });
    // #endregion
    // #region 加入我的排程
    $scope.AddMyMsg = function (SubjectID)
    {
        FilterInIns(SubjectID, true);
        SettingIsIns(CompID, UserID, SubjectID, true);
    }
    // #endregion
    // #region 移除我的排程
    $scope.RemoveMyMsg = function (SubjectID) {
        FilterInIns(SubjectID, false);
        SettingIsIns(CompID, UserID, SubjectID, false);
    }
    // #endregion
    // #region 加入收藏
    $scope.AddFav = function (SubjectID) {
        FilterFav(SubjectID, true);
        SettingFav(CompID, UserID, SubjectID, true);
    }
    // #endregion
    // #region 移除收藏
    $scope.RemoveFav = function (SubjectID) {
        FilterFav(SubjectID, false);
        SettingFav(CompID, UserID, SubjectID, false);
    }
    // #endregion
    // #region 開啟新增的view
    $scope.openNewMsgBlock = function (discId, type) {
        clickTarget = 'create';
        // if discId不同,一定要重load view
        // switch type to get viewUrl
        if (discId !== $scope.$parent.$parent.nowCreateMsgDiscId || $scope.$parent.$parent.createMsgUrl === '') {
            // 為了讓angular 快取失效所以弄了一個隨機數讓網址不同
            var rndNum = new Date().getMilliseconds();
            switch (type) {
                case DiscType.Normal:
                    $scope.$parent.$parent.createMsgUrl = '/subject/create?i=' + rndNum;
                    break;
                case DiscType.ApplyMoney:
                    //款項請領
                    $scope.$parent.$parent.createMsgUrl = '/applymoney/create?i=' + rndNum;
                    break;
                case DiscType.Purchasing:
                    //採購
                    $scope.$parent.$parent.createMsgUrl = '/purchase/create?i=' + rndNum;
                    break;
                case DiscType.PersonLeave:
                    //請假
                    $scope.$parent.$parent.createMsgUrl = '/personleave/create?i=' + rndNum;
                    break;
                case DiscType.GoOut:
                    //外出
                    $scope.$parent.$parent.createMsgUrl = '/goout/create?i=' + rndNum;
                    break;
                case DiscType.Overtime:
                    //加班
                    $scope.$parent.$parent.createMsgUrl = '/overtime/create?i=' + rndNum;
                    break;
            }
        }
        else
        {
            RightSide.OpenNewMsg();
        }
        $scope.$parent.$parent.nowCreateMsgDiscId = discId;
        $scope.$parent.$parent.nowCreateMsgDiscType = type;
    };
    // #endregion
    // #region 主題新增及詳細頁 IncludeLoading
    $rootScope.$on('$includeContentLoaded', function (event)
    {
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
    // #region 拿取討論組 主題列表
    function GetSubjectList() {
        getSubjList.GetSubjectList(UserID,DiscID)
        .then(function (result)
        {
            console.log(result.data);
            $scope.DiscListData = result.data;
            //指定討論組列表資料
            $scope.datalist_continue = result.data.SubjectList;
            //指定討論組名稱
            $scope.subject_title = result.data.DiscName;
            //設定目前所在的討論組
            $scope.$parent.$parent.CurrentDiscussion = { discID: DiscID, discName: result.data.DiscName };
            GetListFinish.GetFinish();
        });
    }
    // #endregion
    // #region 討論組列表點擊觸發
    getSubjList.onGetSubjList($scope, function ()
    {
        GetSubjectList();
    });
    // #endregion
    // #region 點擊主題展開右側內容
    $scope.ShowSubject = function (CompanyID, UserID, SubjectID)
    {
        UpdateGlobalParam();
        clickTarget = 'detail';
        var ShowSubjTemplate = function () {
            var q = $q.defer();
            q.resolve(SubDetail.OpenSubDetail(DiscID, CompanyID, UserID, SubjectID, UserName, 3));
            return q.promise;
        };
        // 設定目前所在的討論組
        $scope.$parent.$parent.CurrentDiscussion = { discID: DiscID, discName: '' };
        if ($scope.$parent.$parent.detailMsgUrl == '') {
            $scope.$parent.$parent.detailMsgUrl = '/Subject/SubDetailTemplate';
        }
        else {
            clickTarget = '';
            RightSide.ShowSubject();
        };
        $scope.promise = ShowSubjTemplate();
        $scope.promise
        .then(function () {
            //傳送參數至SubDetail Factory
            return RightSide.ShowSubject();
        });
    };
    // #endregion
    // #region 新增主題完成後會發生的事件
    $scope.$on(SubjectEvent.Inserted, function (event, args)
    {
        // #region  更新列表資料
        //#region 判斷事件標籤及對象標籤
        //建立時間轉換
        var date = new Date(args.CreatedOn * 1000);
        var MonthString = (date.getMonth() + 1).toString().length < 2 ? '0' + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString();
        //var MonthString = (date.getMonth() + 1).toString();
        var DateString = date.getDate().toString().length < 2 ? '0' + (date.getDate()).toString() : date.getDate().toString();
        //var DateString = date.getDate().toString();
        var CreatedOnString = date.getFullYear() + "/" + MonthString + "/" + DateString;
        //主題合併部分
        var SubjectTitle = "";
        args.SubjTagName.length > 0 ? SubjectTitle += args.SubjTagName + " - " : false;
        args.CusTagName.length > 0 ? SubjectTitle += args.CusTagName + " - " : false;
        SubjectTitle += args.Title + " - " + CreatedOnString;
        // #endregion
        // #region  SubjectListItem Viewmodel
        $scope.Subject = {
            SubjectID: args.SubjectID,
            SubjectTitle: SubjectTitle,
            ReplyCount: 0,
            ApplyCloseBy: null,
            ApplyCloseOn: "",
            ApplyerName: null,
            PlanDiff: args.PlanDiff,
            CloseOn: null,
            CloseDays: 0,
            CreatedOn: args.CreatedOn,
            CreatedBy: args.CreatorID,
            IsFav: false,
            ModifiedOn: '',
            ModifiedBy: '',
            IsRead: true,
            SubjectColor: SubjectColor.Unmarked,
            Progress: 1,
            DiscType: DiscType.Normal,
            IsIns: true,
            PlanCloseOn: args.PlanDate,
            CreatorName: args.CreatorName,
            ModifierName: '',
            LastReplyer: null,
            LastReplyOn: null,
            Receiver: args.Receipts,
            EventTagName: args.SubjTagName,
            CusTagName: args.CusTagName
        };
        // #endregion
        $scope.datalist_continue.push($scope.Subject);
        // #endregion
        // #region  更新我的排程及討論組數字
        // 拉出目前討論組
        var discussionForUpdate = {};
        angular.forEach($scope.CurrentCompany.DiscussionCate, function (value, key)
        {
            var cates = $filter('filter')(value.Discussions, { DiscussionID: args.DiscID });
            if (cates.length > 0)
            {
                discussionForUpdate = cates[0];
            }
        });
        var MarkParam =
        {
            UserID: args.CreatorID,
            DiscID: args.DiscID,
            CompanyID: $scope.CurrentCompany.CompanyID,
            IsPublic: discussionForUpdate.isPublic
        };

        var updateMarkPromise = $http.post('/Subject/UpdateMark', MarkParam);
        updateMarkPromise.success(function (payload)
        {
            if (payload.IsSuccessful)
            {
                $scope.IndexData.MySubjectCount = payload.DataObj.MyBoxCount;
                discussionForUpdate.SubjectCount = payload.DataObj.SubjectCount;
                //一般討論組的數字更新
                if (args.DiscType <= 2)
                {
                    $filter('filter')($scope.$parent.$parent.CurrentCompany.DiscussionCate[0].Discussions, { DiscussionID: args.DiscID }, true)[0].SubjectCount = payload.DataObj.SubjectCount;
                }
                //行政區討論組的數字更新
                else
                {
                    $filter('filter')($scope.$parent.$parent.CurrentCompany.DiscussionCate[1].Discussions, { DiscussionID: args.DiscID }, true)[0].SubjectCount = payload.DataObj.SubjectCount;
                };
            };
        });
        // #endregion
    });
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
    // #region 過濾Scope Data 需要Setting Fav
    function FilterFav(SubjectID, flag)
    {
        $filter('filter')($scope.datalist_continue, { SubjectID: SubjectID }, true)[0].IsFav = flag;
    }
    // #endregion
    // #region 設定我的信箱
    function SettingIsIns(compid, userid, subjid, flag)
    {
        getmybox.SettingIsIns(compid, userid, subjid, flag)
        .then(function (result) {
            MyBoxCT.UpdateBoxCT(result.data);
        });
    }
    // #endregion
    // #region 過濾Scope Data 需要Setting IsIns
    function FilterInIns(SubjectID, Flag)
    {
        $filter('filter')($scope.datalist_continue, { SubjectID: SubjectID }, true)[0].IsIns = Flag;
    }
    // #endregion
    // #region 是否載入完成區頁面
    $scope.SeleceFinish = function ()
    {
        if ($scope.FinishUrl != "")
        {
            getFinish.GetFinish()
        }
        //隱藏上傳檔案
        $scope.Btnobj.IsShowFileBtn = false;
        //隱藏新增訊息
        $scope.Btnobj.IsShowMsgBtn = false;
        //載入完成區
        $scope.IsLoadingFinish = true;
        //載入完成區Template
        $scope.FinishUrl = '/Subject/FinishList';
    }
    // #endregion
    // #region 選擇進行中標籤
    $scope.SelectRunning = function ()
    {
        GetSubjectList();
        //隱藏上傳檔案
        $scope.Btnobj.IsShowFileBtn = false;
        //顯示新增訊息
        $scope.Btnobj.IsShowMsgBtn = true;
    }
    // #endregion
    // #region 重新HttpGet FileList
    $scope.SelectFile = function ()
    {
        if($scope.FileUrl != "")
        {
            //重新Http
        }
        //隱藏上傳檔案
        $scope.Btnobj.IsShowFileBtn = true;
        //顯示新增訊息
        $scope.Btnobj.IsShowMsgBtn = false;
        //載入檔案分享區
        $scope.IsLoadingFile = true;
        //載入完成區Template
        $scope.FileUrl = '/FileShare/FilesList';
    }
    // #endregion
    // #region 監聽由ReplyCtrl ReplyInserted廣播來的事件
    $rootScope.$on(SubjectEvent.ReplyInserted, function (event, data)
    {
        var CurrentSubject = $filter('filter')($scope.datalist_continue, { SubjectID: data.SubjId }, true)[0];
        if (typeof CurrentSubject !== 'undefined')
        {
            CurrentSubject.ModifiedOn = data.CreateOn;
            CurrentSubject.ModifierName = data.CreatedName;
            CurrentSubject.ReplyCount = CurrentSubject.ReplyCount + 1;
        }
    });
    // #endregion
    // #region 檔案分享區 建立資料夾
    $scope.CreateFolder = function ()
    {
        FileFolder.AddFileFolder();
    }
    // #endregion
    // #region 產生Guid
    function ProduceGuid()
    {
        function GuidString()
        {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return (GuidString() + GuidString() + "-" + GuidString() + "-" + GuidString() + "-" + GuidString() + "-" + GuidString() + GuidString() + GuidString());
    }
    // #endregion
    // #region 檔案分享區 上傳檔案 初始化設定
    function UploadFileInit(DiriD)
    {
        var UploadAttach =
            {
                url: '/FileShare/UploadFile',
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
                autoUpload: true,
                removeAfterUpload: false,
                formData: [
                    {
                        CompanyId: CompID,
                        DiscussionID: DiscID,
                        DirID: DiriD,
                        UserId: UserID,
                        UserName: UserName,
                        IsValidate: true
                    }
                ]
            };
        var uploader = $scope.File.Uploader = new FileUploader(UploadAttach);
        
        //上傳檔案前置換FormData (更換資料夾目的地)
        uploader.onBeforeUploadItem = function (item)
        {
            // 利用FormData 裡面的IsValidate來判斷是否超過10MB
            var _FileSize = item.file.size / 1024 / 1024;
            var _LimitSize = 0;
            switch (CompID) {
                case UniqueComp.CompList[0]:
                case UniqueComp.CompList[1]:
                    _LimitSize = Filesize_Conf.AdvancedSize;
                    break;
                default:
                    _LimitSize = Filesize_Conf.Size;
                    break;
            }
            console.log("上傳檔案大小:" + _FileSize);
            console.log("限制檔案大小:" + _LimitSize);
            if (_FileSize > _LimitSize) {
                $scope.File.Uploader.formData[0].IsValidate = false;
            }
            else {
                $scope.File.Uploader.formData[0].IsValidate = true;
            }
            Array.prototype.pop.apply(item.formData,[]);
            Array.prototype.push.apply(item.formData, $scope.File.Uploader.formData);
        };
        //上傳檔案中Pass Progress
        uploader.onAfterAddingFile = function (fileItem)
        {
            UploadFinish.FinishUpload(fileItem);
        };
        //完成上傳後
        uploader.onCompleteItem = function (item, response, status, headers)
        {
            ValiadateUploadFile(item, response, status);
        };

    }
    // #endregion
    // #region 判斷檔案是否有正常上傳，沒有的話不進入假資料動作
    function ValiadateUploadFile(item, response, status) {
        if (status == 400) {
            var _msg = $filter('translate')('FileSizeFail');
            alert(_msg);
        }
        else {
            response = response.replace(/\"/g, "");
            UploadOk.UploadComplete(item, response);
        }
    };
    // #endregion
    // #region 檔案分享區 點即進入資料夾 更新上傳檔案目的地
    ClickFolder.onClickFolder($scope, function (data)
    {
        UploadFileInit(data.DirID);
    });
    // #endregion
    // #region 檔案分享區 點擊上傳檔案
    $scope.ShowUploadView = function ()
    {
        UploadFile.UploadFile();
    }
    // #endregion
    // #region 監聽到編輯完成，更新主題、回覆列表
    EditFinish.onEditSubj($scope, 3, function (Data)
    {
        if (Data.Type == 0)
        {
            //更新主題列表主題
            $filter('filter')($scope.datalist_continue, { SubjectID: Data.SubjID }, true)[0].SubjectTitle = Data.Title;
            //更新主題列表收件人
            $filter('filter')($scope.datalist_continue, { SubjectID: Data.SubjID }, true)[0].Receiver = Data.Receiver;
            //更新主題列表預定完成日期時間
            $filter('filter')($scope.datalist_continue, { SubjectID: Data.SubjID }, true)[0].PlanDiff = CalculatePlanDiff(Data.PlanDate);
        }
        //更新主題列表最後回覆人
        $filter('filter')($scope.datalist_continue, { SubjectID: Data.SubjID }, true)[0].ModifiedBy = Data.ModifiedBy;
        //更新主題列表最後回覆人名稱
        $filter('filter')($scope.datalist_continue, { SubjectID: Data.SubjID }, true)[0].ModifierName = Data.ModifierName;
        //更新主題列表最後回覆人時間
        $filter('filter')($scope.datalist_continue, { SubjectID: Data.SubjID }, true)[0].ModifiedOn = Data.ModifiedOn;
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
            return  Math.abs(dayDifference);
    };
    // #endregion
    // #region 成員列表功能
    //開啟成員列表
    $scope.ShowMember = function () {
        $(".bs-Member-modal").modal("show");
        //拿取成員名單
        $http({
            method: 'get',
            url: '/Backend/GetMemberList/?DiscID=' + $scope.discussionid + '&CompanyID=' + $scope.companyid
        })
        .success(function (data) {
            //指派成員列表資料
            $scope.MemberList = data;
            //指派成員列表數量
            $scope.MemberNum = data.length;

        })
        .error(function () {

        });
    }

    //關閉成員列表
    $scope.CloseMember = function () {
        $(".bs-Member-modal").modal("hide");
    }

    //移除成員列表中的成員
    $scope.RemoveMember = function (DiscID, UserID, member) {
        //將移除人員加入左邊公司成員
        var Dept = $filter('filter')($scope.ComMember, { DepartmentID: member.DepartmentID }, true)[0];
        Dept.CompMember.unshift(
            {
                FullName: member.FullName,
                LastName: member.LastName,
                PhotoCss: member.PhotoCss,
                UserEmail: member.UserEmail,
                UserID: member.UserID,
                isPhotoImg: member.isPhotoImg,
                isRegister: member.isRegister
            });
        //自討論組成員中移除該人
        var index = $scope.MemberList.indexOf(member);
        if (index != -1) {
            $scope.MemberList.splice(index, 1);
            //Server
            $http({
                method: 'get',
                url: '/Backend/RemoveMember/?CompanyID=' + $scope.companyid + '&DiscID=' + DiscID + '&UserID=' + UserID
            })
            .success(function (data) {

            })
            .error(function () {

            });
        }
    }

    //設定成員的Css
    $scope.PhotoStyle = function (cssString) {
        return { 'background-color': cssString };
    }

    //舊成員Tab切換
    $scope.AddMember = function ()
    {
        GetCompUser();
        $('.AddMember').addClass("active").tab('show');
        $('.memberAddNew').addClass("hideObj");
        $('.memberAddOld').removeClass("hideObj");
    }

    //新成員Tab切換
    $scope.AddNewMember = function () {
        $('.AddNewMember').addClass("active").tab('show');
        $('.memberAddNew').removeClass("hideObj");
        $('.memberAddOld').addClass("hideObj");
    }

    //取得公司成員列表
    function GetCompUser() {
        $http({
            method: 'get',
            url: '/Backend/GetCompList/?CompanyID=' + $scope.companyid + '&DiscID=' + DiscID
        })
        .success(function (data) {
            $scope.ComMember = data;
        })
        .error(function () {

        });
    }

    //寄送邀請信
    $scope.ConfirmInvite = function ()
    {
        // #region  正式版
        if ($scope.InviteEmail == undefined)
        {
            alert($filter('translate')('InviteEmailFail'));
            return false;
        }
        else if($scope.InviteFirstName == undefined || $scope.InviteLastName == undefined)
        {
            alert($filter('translate')('NameTooShort'));
            return false;
        }
        else
        {
            if($scope.InviteFirstName.length < 1 || $scope.InviteLastName.length < 1)
            {
                alert($filter('translate')('NameTooShort'));
                return false;
            }
            else
            {
                var data =
                    {
                        CompanyID: $scope.companyid,
                        DiscID: DiscID,
                        UserName: UserName,
                        UserID: $scope.userid,
                        FirstName: $scope.InviteFirstName,
                        LastName: $scope.InviteLastName,
                        PhotoText: settingImgTxt($scope.InviteLastName, $scope.InviteFirstName),
                        Email: $scope.InviteEmail,
                        PhotoCss: $scope.InvitePhoto['background-color']
                    };
                $http({
                    method: 'post',
                    url: '/Backend/InviteMember',
                    data: data
                })
                .success(function (result)
                {
                    var pushData =
                        {
                            DepartmentID: result.DepartmentID,
                            DepartmentName: result.DepartmentName,
                            DiscID: DiscID,
                            FullName: result.LastName + result.FirstName,
                            LastName: result.PhotoText,
                            PhotoCss: result.PhotoCss,
                            UserEmail: result.Email,
                            UserID: result.UserID,
                            isPhotoImg: false,
                            isRegister: false
                        };
                    $scope.MemberList.unshift(pushData);
                })
                .error(function () {

                });
            }
        }
        $scope.InviteLastName = '';
        $scope.InviteFirstName = '';
        $scope.InviteEmail = '';
        $scope.InvitePhoto = undefined;
        $scope.photoTxt = '';
        // #endregion

    }

    //姓改變
    $scope.lastNameChange = function()
    {
        //color Div InvitePersonPhoto
        if($scope.InviteLastName.search(/[a-zA-Z]/g) == -1)
        {
            $scope.photoTxt = $scope.InviteLastName.substr(0, 1).toUpperCase();
        }
        else if($scope.InviteLastName.search(/[a-zA-Z]/g) != -1 && $scope.InviteFirstName.search(/[a-zA-Z]/g) != -1)
        {
            $scope.photoTxt = $scope.InviteLastName.substr(0, 1).toUpperCase() + $scope.InviteFirstName.substr(0, 1).toUpperCase();
        }
        else if($scope.InviteLastName.search(/[a-zA-Z]/g) != -1 && $scope.InviteFirstName.search(/[a-zA-Z]/g) == -1)
        {
            $scope.photoTxt = $scope.InviteLastName.substr(0, 2).toUpperCase();
        }
        if ($scope.InvitePhoto == undefined)
        {
            $scope.InvitePhoto = { 'background-color': randomColor() };
        }
    }

    //名改變
    $scope.firstNameChange = function()
    {
        if($scope.InviteLastName.search(/[a-zA-Z]/g) != -1 && $scope.InviteFirstName.search(/[a-zA-Z]/g) != -1)
        {
            $scope.photoTxt = $scope.InviteLastName.substr(0, 1).toUpperCase() + $scope.InviteFirstName.substr(0, 1).toUpperCase();
        }
        else
        {
            $scope.photoTxt = $scope.InviteLastName.substr(0, 2).toUpperCase();
        }
        if ($scope.InvitePhoto == undefined)
        {
            $scope.InvitePhoto = { 'background-color': randomColor() };
        }
    }

    //增加所有部門下的員工
    $scope.memberAllAdd = function (DeptID)
    {
        var data = [];
        var Dept = $filter('filter')($scope.ComMember, { DepartmentID: DeptID }, true)[0].CompMember;
        for(var i = 0; i < Dept.length; i++)
        {
            var member =
                {
                    UserID: Dept[i].UserID,
                    CompanyID: $scope.companyid,
                    DepartmentID: DeptID,
                    DiscID: DiscID,
                    CreatedBy:$scope.userid
                };
            data.push(member);
        }
        $http({
            method: 'post',
            url: '/Backend/AddAllCompMember',
            data:data
        })
        .success(function (result) {
            if(result == 0)
            {
                //自左方公司成員未加入該討論組清單移除
                var Dept = $filter('filter')($scope.ComMember, { DepartmentID: DeptID }, true)[0];
                for(var i = 0; i < Dept.CompMember.length;i++)
                {
                    //將該人員加入至右方討論組成員
                    var PushData =
                        {
                            DepartmentID: DeptID,
                            DepartmentName: Dept.DepartmentName,
                            DiscID: DiscID,
                            FullName: Dept.CompMember[i].FullName,
                            InviteState: 0,
                            LastName: Dept.CompMember[i].LastName,
                            PhotoCss: Dept.CompMember[i].PhotoCss,
                            UserEmail: Dept.CompMember[i].UserEmail,
                            UserID: Dept.CompMember[i].UserID,
                            isPhotoImg: Dept.CompMember[i].isPhotoImg
                        };
                    $scope.MemberList.unshift(PushData);
                }
                //將公司成員縮排css調回預設
                Dept.IsShowDisc = false;
                //清空該公司成員
                Dept.CompMember = [];
            }
        })
        .error(function () {

        });
    }

    //單獨加入部門下的各別員工
    $scope.memberAdd = function (DepID, MemberID)
    {
        var data =
            {
                UserID: MemberID,
                CompanyID: $scope.companyid,
                DepartmentID: DepID,
                DiscID: DiscID,
                CreatedBy: $scope.userid
            };
        $http({
            method: 'post',
            url: '/Backend/AddCompMember',
            data:data
        })
        .success(function (result) {
            if(result == 0)
            {
                //自左方公司成員未加入該討論組清單移除
                var Dept = $filter('filter')($scope.ComMember, { DepartmentID: DepID }, true)[0];
                var member = $filter('filter')(Dept.CompMember, { UserID: MemberID }, true)[0];
                var memberIndex = Dept.CompMember.indexOf(member);
                Dept.CompMember.splice(memberIndex, 1);
                //將該人員加入至右方討論組成員
                var PushData =
                    {
                        DepartmentID: DepID,
                        DepartmentName: Dept.DepartmentName,
                        DiscID: DiscID,
                        FullName: member.FullName,
                        LastName: member.LastName,
                        PhotoCss: member.PhotoCss,
                        UserEmail: member.UserEmail,
                        UserID: member.UserID,
                        isPhotoImg: member.isPhotoImg,
                        isRegister:true
                    };
                $scope.MemberList.unshift(PushData);
            }
        })
        .error(function () {

        });
    }

    //設定圖像的名字
    function settingImgTxt(LName,FName)
    {
        if (LName.search(/[a-zA-Z]/g) == -1) {
            return LName.substr(0, 1).toUpperCase();
        }
        else if (LName.search(/[a-zA-Z]/g) != -1 && FName.search(/[a-zA-Z]/g) != -1) {
            return LName.substr(0, 1).toUpperCase() + FName.substr(0, 1).toUpperCase();
        }
        else if (LName.search(/[a-zA-Z]/g) != -1 && FName.search(/[a-zA-Z]/g) == -1) {
            return LName.substr(0, 2).toUpperCase();
        }
    }

    //拿取個人上傳的圖像
    $scope.PersonalImg = function (UserID)
    {
        return "/Backend/getUserImg/?UserID=" + UserID;
    }

    //亂數決定頭像顏色
    function randomColor()
    {
        var n = Math.floor(Math.random() * (10 - 1 + 1));
        var ColorArray = ["#ca7497","#60b4d0","#8fcbcc","#f17b60","#7594b3","#f2a5a7","#e29e4b","#b7d28d","#d9b9f1","#fed049"];
        var ColorString = ColorArray[n];
        return ColorString;
    }

    // #endregion
    // #region 前往垃圾桶
    $scope.trash = function () {
        $location.url('/Trash/' + DiscID);
    };
    // #endregion
    // #region 我的信箱PDF(顏色)
    function PDFColor(type) {
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
    // #region 匯出列表功能
    $scope.ExportSubjList = function () {
        var WebSiteURL = "https://succmail.com";
        var borderString = "border-top-width:1px;border-top-color:rgb(196, 196, 196);border-top-style:solid;border-right-width:1px;border-right-color:rgb(196, 196, 196);border-right-style:solid;border-bottom-width:1px;border-bottom-color:rgb(196, 196, 196);border-bottom-style:solid;border-left-width:1px;border-left-color:rgb(196, 196, 196);border-left-style:solid;";
        var borderbottomString = "border-bottom-width:1px;border-bottom-color:rgb(196, 196, 196);border-bottom-style:solid;";
        //Start
        var source = "<div>";
        var DiscString = $("#middle").children("h2").html();
        // #region Logo
        source += "<div style='margin:0;width:80px;height:80px;background-image:url(\"" + WebSiteURL + "/Statics/img/home/logo.png\")'></div>";
        // #endregion
        //DiscName
        source = source + "<h2>" + DiscString + "</h2>";
        source += "<div id='tab_content_body' style='min-height:600px;margin-left:10px;margin-right:12px;'>";
        source += "<table style='width:100%;' cellpadding='4' cellspacing='4'>";
        var DiscSubjEntity = $("#continue").children("#tab_content_data").children("table");
        for (var i = 0; i < DiscSubjEntity.length; i++)
        {
            var colorEntity = $(DiscSubjEntity).children("tbody").children("tr").children(".type").children("div")[i];
            var MyBoxEntity = $(DiscSubjEntity).children("tbody").children("tr").children(".my-msg").children("span")[i];
            var StarEntity = $(DiscSubjEntity).children("tbody").children("tr").children(".collect").children("span")[i];
            var TitleEntity = $(DiscSubjEntity).children("tbody").children("tr").children(".title").children("a")[i];
            var CreatorEntity = $(DiscSubjEntity).children("tbody").children("tr").children(".sender").children("p")[i];
            var CreateTimeEntity = $(DiscSubjEntity).children("tbody").children("tr").children(".sender").children("label")[i];
            var ReplyEntity = $(DiscSubjEntity).children("tbody").children("tr").children(".respond").children("div")[i];
            var ModifierEntity = $(DiscSubjEntity).children("tbody").children("tr").children(".lastrespond").children("p")[i];
            var ModifyTimeEntity = $(DiscSubjEntity).children("tbody").children("tr").children(".lastrespond").children("label")[i];
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
        //End
        source += "</div>";
        // Send Parameters to Controller
        var form = $("<form></form>").attr('method', 'post').attr("name", "PostPDF").attr("target", "iframe").attr("action", "/Subject/GetSubjListPDF");
        form.append($("<input></input>").attr('type', 'hidden').attr('name', 'HtmlContent').attr('value', source.replace(/</g, '%26')));
        form.appendTo('body').submit();
    };
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