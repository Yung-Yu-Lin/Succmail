SuccApp.controller('BackDiscManageCtrl', ['$rootScope', '$scope', 'GetBackendData', '$filter', 'EditorPara', 'DiscType', '$timeout', 'LeaveSample', 'DiscTypeJudg', 'BackendGuide', function ($rootScope, $scope, GetBackendData, $filter, EditorPara, DiscType, $timeout, LeaveSample, DiscTypeJudg, BackendGuide) {
    // #region 參數設定
    var CompID = $scope.$parent.$parent.$parent.$parent.CurrentCompany['CompanyID'];
    var UserID = $scope.$parent.$parent.$parent.$parent.IndexData.CurrentUser['UserID'];
    $scope.DiscManage = {};
    // 預設不顯示成功更新提示
    $scope.DiscManage.IsSuccess = false;
    // 預設不顯示簽核關卡
    $scope.DiscManage.IsFlowDisc = false;
    // 預設請假 或 外出 假別名稱
    $scope.DiscManage.LeaveValue = "";
    // 預設假別新增正常
    $scope.DiscManage.LeaveValueSate = true;
    // 預設顯示討論組設定畫面(另一個畫面為討論組回收畫面)
    $scope.DiscManage.SettingView = true;
    // JqGrid參數
    $scope.DiscManage.CompID = CompID;
    $scope.DiscManage.UserID = UserID;
    // 預設不是新增討論組的狀態
    $scope.DiscManage.IsNew = false;
    // 預設並非註冊狀態下
    $scope.DiscManage.IsRegistState = false;
    // #endregion
    // #region 取得所有討論組列表資料
    GetBackendData.GetDiscListData(CompID, UserID)
        .then(function (result) {
            // 一般討論組
            $scope.DiscManage.NormalDiscList = result.data.NormalDisc;
            // 行政討論組
            $scope.DiscManage.AdminDiscList = result.data.AdminDisc;
            // 將第一筆的討論組列表資料預設為選擇
            SetDiscListStyle(true, false, $scope.DiscManage.NormalDiscList[0].DiscID);
            // 取得第一筆討論組詳細資料
            GetDiscDetailData(result.data.NormalDisc[0].DiscID, result.data.NormalDisc[0].DiscType);
        });
    // #endregion
    // #region 初始化討論組成員 以及 常用收件人 Model
    function InitDiscMembers() {
        // 初始化討論組成員model
        $scope.DiscManage.DiscDetail.Members = $filter('filter')($scope.DiscManage.DiscDetail.MemberList, { IsDiscMember: true });
        // 初始化討論組常用收件人model
        $scope.DiscManage.DiscDetail.Regulars = $filter('filter')($scope.DiscManage.DiscDetail.MemberList, { IsRegulars: true });
    };
    // #endregion
    //// #region 控制確定按鈕可以出現
    //function ModifyUpdateBtn(para)
    //{
    //    $scope.DiscManage.IsChangeDiscSetting = para;
    //};
    //// #endregion
    // #region 取得討論組管理資料
    function GetDiscDetailData(DiscID, _DiscType) {
        GetBackendData.GetDiscManageData(CompID, UserID, DiscID, _DiscType)
            .then(function (result) {
                $scope.DiscManage.DiscDetail = result.data;
                // 初始化討論組管理者
                DiscManager = $filter('filter')($scope.DiscManage.DiscDetail.MemberList, { MemberID: $scope.DiscManage.DiscDetail.AdminID }, true)[0];
                $scope.DiscManage.DiscDetail.Admin = DiscManager;
                InitDiscMembers();
                // 過濾出老闆以及管理者 除去刪除的按鈕
                $filter('filter')($scope.DiscManage.DiscDetail.MemberList, { MemberID: $scope.DiscManage.DiscDetail.AdminID }, true)[0].IsBackendRegular = true;
                $filter('filter')($scope.DiscManage.DiscDetail.MemberList, { MemberID: $scope.DiscManage.DiscDetail.BossID }, true)[0].IsBackendRegular = true;
                // 是否顯示FlowData
                $scope.DiscManage.IsFlowDisc = IsFlowDisc();
                // 更新FlowData(綁定Model) 行政區
                if (_DiscType == DiscType.Purchasing || _DiscType == DiscType.ApplyMoney) {
                    BindFlowData();
                }
            });
    };
    // #endregion
    // #region 改變左側討論組選單的樣式
    $scope.IsSelected = function (IsSelect) {
        if (IsSelect) {
            return {
                'background-color': '#30ACFF',
                'color': '#fff'
            }
        }
    };
    // #endregion
    // #region 點擊選擇左側選單討論組
    $scope.SelectDisc = function (item) {
        // 顯示討論組設定提示字
        $scope.DiscManage.IsNew = false;
        $scope.DiscManage.SettingView = true;
        // 先將所有討論組Style Reset
        ResetDiscStyle();
        // 在把目前點擊的討論組改變Style
        $filter('filter')($scope.DiscManage.NormalDiscList, { DiscID: item.DiscID }, true)[0].IsSelect = true;
        GetDiscDetailData(item.DiscID, item.DiscussionType);
    };
    // #endregion
    // #region 下拉選單的樣板(包括討論組成員 常用收件人)
    $scope.templates = EditorPara.BackendHtml;
    // #endregion
    // #region 討論組管理者變動
    $scope.ModifyAdmin = function () {
        // 管理者一定要在成員當中 
        $filter('filter')($scope.DiscManage.DiscDetail.MemberList, { MemberID: $scope.DiscManage.DiscDetail.Admin.MemberID }, true)[0].IsDiscMember = true;
        // 管理者一定要是固定收件人
        $filter('filter')($scope.DiscManage.DiscDetail.MemberList, { MemberID: $scope.DiscManage.DiscDetail.Admin.MemberID }, true)[0].IsRegulars = true;
        // 更新討論組成員以及常用收件人的Model
        InitDiscMembers();
        // 將原 Admin 狀態回復
        $filter('filter')($scope.DiscManage.DiscDetail.MemberList, { MemberID: $scope.DiscManage.DiscDetail.AdminID }, true)[0].IsBackendRegular = false;
        // 更新目前 Admin 狀態回復
        $filter('filter')($scope.DiscManage.DiscDetail.MemberList, { MemberID: $scope.DiscManage.DiscDetail.Admin.MemberID }, true)[0].IsBackendRegular = true;
        // 老闆的權限永遠都要在
        $filter('filter')($scope.DiscManage.DiscDetail.MemberList, { MemberID: $scope.DiscManage.DiscDetail.BossID }, true)[0].IsBackendRegular = true;
        // 更新Scope AdminID
        $scope.DiscManage.DiscDetail.AdminID = $scope.DiscManage.DiscDetail.Admin.MemberID;
    };
    // #endregion
    // #region 討論組成員變動 控制不可不是成員情況下卻是常用收件人
    $scope.$watch('DiscManage.DiscDetail.Members', function (newValue, oldValue) {
        if (angular.isDefined(newValue) && angular.isDefined(oldValue)) {
            // 新舊當中是常用收件人的
            var newIsRegular = $filter('filter')(newValue, { IsRegulars: true });
            var oldIsRegular = $filter('filter')(oldValue, { IsRegulars: true });
            // 判斷當舊值多於新值 代表是刪除
            if (oldIsRegular.length > newIsRegular.length)
            {
                for (var i = 0; i < newIsRegular.length; i++)
                {
                    var removItem = $filter('filter')(oldIsRegular, { MemberID: newIsRegular[i].MemberID }, true)[0];
                    var removeIndex = oldIsRegular.indexOf(removItem);
                    oldIsRegular.splice(removeIndex, 1);
                }
                // 剔除此人(不可以存在常用收件人)
                $filter('filter')($scope.DiscManage.DiscDetail.MemberList, { MemberID: oldIsRegular[0].MemberID }, true)[0].IsRegulars = false;
                // 變成不是討論組成員
                $filter('filter')($scope.DiscManage.DiscDetail.MemberList, { MemberID: oldIsRegular[0].MemberID }, true)[0].IsDiscMember = false;
                // 初始化討論組常用收件人model
                $scope.DiscManage.DiscDetail.Regulars = $filter('filter')($scope.DiscManage.DiscDetail.MemberList, { IsRegulars: true });
            }
        }
    }, true);
    // #endregion
    // #region 討論組指定收件人變動，判斷是否有為指定收件人卻非成員的操作
    $scope.$watch('DiscManage.DiscDetail.Regulars', function (newValue, oldValue) {
        if (angular.isDefined(newValue) && angular.isDefined(oldValue))
        {
            var newDiscMember = $filter('filter')(newValue, {});
            var oldDiscMember = $filter('filter')(oldValue, {});
            // 新值數量大於舊值數量，代表增加狀態
            if (newDiscMember.length > oldDiscMember.length)
            {
                for (var i = 0; i < oldDiscMember.length; i++)
                {
                    var removeItem = $filter('filter')(newValue, { MemberID: oldDiscMember[i].MemberID }, true)[0];
                    var removeIndex = newDiscMember.indexOf(removeItem);
                    newDiscMember.splice(removeIndex, 1);
                }
                // 加入此人成為成員
                $filter('filter')($scope.DiscManage.DiscDetail.MemberList, { MemberID: newDiscMember[0].MemberID }, true)[0].IsDiscMember = true;
                // 加入此人成為指定收件人
                $filter('filter')($scope.DiscManage.DiscDetail.MemberList, { MemberID: newDiscMember[0].MemberID }, true)[0].IsRegulars = true;
                // 初始化討論組常用收件人model
                $scope.DiscManage.DiscDetail.Members = $filter('filter')($scope.DiscManage.DiscDetail.MemberList, { IsDiscMember: true });
            }
            else
            {
                // 從指定收件人當中進行刪除
                if ($scope.DiscManage.DiscDetail.DiscussionType == DiscType.ApplyMoney || $scope.DiscManage.DiscDetail.DiscussionType == DiscType.Purchasing)
                {
                    for (var i = 0; i < newDiscMember.length; i++)
                    {
                        var removeItem = $filter('filter')(oldValue, { MemberID: newDiscMember[i].MemberID }, true)[0];
                        var removeIndex = oldDiscMember.indexOf(removeItem);
                        oldDiscMember.splice(removeIndex, 1);
                    }
                    if (oldDiscMember.length > 0)
                    {
                        var removeFlowItem = $filter('filter')($scope.DiscManage.DiscDetail.Flow, { AuditID: oldDiscMember[0].MemberID }, true)[0];
                        var removeFlowIndex = $scope.DiscManage.DiscDetail.Flow.indexOf(removeItem);
                        $scope.DiscManage.DiscDetail.Flow.splice(removeFlowIndex, 1);
                    }
                }
            }
        }
    }, true);
    // #endregion
    // #region 更新討論組資料
    function UpdateDiscData() {
        // 檢查機制
        if (!CheckDiscBeforeCreate()) {
            return false;
        };
        var CurrentDiscType = $scope.DiscManage.DiscDetail.DiscussionType;
        var Leave = [];
        var Flow = [];
        // 行政區討論組填充
        if (CurrentDiscType == DiscType.ApplyMoney || CurrentDiscType == DiscType.Purchasing) {
            Flow = SpeceficDisc();
        };
        if (CurrentDiscType == DiscType.PersonLeave || CurrentDiscType == DiscType.GoOut) {
            Leave = SpeceficDisc2();
        };
        // 送往後端的Obj 參數
        var parameter =
            {
                UserID: UserID,
                CompID: CompID,
                DiscID: $scope.DiscManage.DiscDetail.DiscID,
                DiscName: $scope.DiscManage.DiscDetail.DiscName,
                DiscussionType: $scope.DiscManage.DiscDetail.DiscussionType,
                AdminID: $scope.DiscManage.DiscDetail.Admin.MemberID,
                Members: ConvertMemberList($scope.DiscManage.DiscDetail.Members),
                RegularMembers: ConvertMemberList($scope.DiscManage.DiscDetail.Regulars),
                Flow: Flow,
                Leave: Leave
            };
        GetBackendData.UpdateDiscData(parameter)
            .then(function (result) {
                if (result.data.IsSuccessful) {
                    $scope.DiscManage.IsSuccess = true;
                    // 成功更新討論組資料
                    var mytimeout = $timeout(function () {
                        $scope.DiscManage.IsSuccess = false;
                        $timeout.cancel(mytimeout);
                    }, 3000);
                    // 更新討論組左側清單
                    UpdateDiscLeftSide();
                }
            });
    };
    // #endregion
    // #region 新增討論組資料
    function CreateDisc() {
        // 檢查機制
        if (!CheckDiscBeforeCreate()) {
            return false;
        };
        // 檢查是否有相同名稱的討論組
        if (!CheckRepeatDisc($scope.DiscManage.DiscDetail.DiscussionType, $scope.DiscManage.DiscDetail.DiscName))
        {
            alert($filter('translate')('DiscRepeat'));
            return false;
        }
        var CurrentDiscType = $scope.DiscManage.DiscDetail.DiscussionType;
        var Leave = [];
        var Flow = [];
        // 行政區討論組填充
        if (CurrentDiscType == DiscType.ApplyMoney || CurrentDiscType == DiscType.Purchasing) {
            Flow = SpeceficDisc();
        };
        if (CurrentDiscType == DiscType.PersonLeave || CurrentDiscType == DiscType.GoOut) {
            Leave = SpeceficDisc3();
        };
        // 送往後端的Obj 參數
        var parameter =
            {
                UserID: UserID,
                CompID: CompID,
                DiscID: $scope.DiscManage.DiscDetail.DiscID,
                DiscName: $scope.DiscManage.DiscDetail.DiscName,
                DiscussionType: $scope.DiscManage.DiscDetail.DiscussionType,
                AdminID: $scope.DiscManage.DiscDetail.Admin.MemberID,
                Member: ConvertMemberList($scope.DiscManage.DiscDetail.Members),
                RegularMember: ConvertMemberList($scope.DiscManage.DiscDetail.Regulars),
                Flow: Flow,
                Leave: Leave
            };
        GetBackendData.CreateDisc(parameter)
            .then(function (result) {
                if (result.data.IsSuccessful) {
                    $scope.DiscManage.IsSuccess = true;
                    //濾出剛新增討論組的資料
                    var AddDisc = $filter('filter')(result.data.DataObj._returnDisc, { DiscID: result.data.DataObj.NewDiscID });
                    //存放新增的討論組的物件
                    var CreateDiscData = {};
                    //新增Object Data
                    CreateDiscData.DiscussionID = AddDisc[0].DiscID;
                    CreateDiscData.DiscussionTitle = $scope.DiscManage.DiscDetail.DiscName;
                    //DiscussionType(討論組類型)大於100為行政討論組小於100為一般討論組
                    CreateDiscData.DiscussionType = $scope.DiscManage.DiscDetail.DiscussionType;
                    CreateDiscData.MyBoxCountByDisc = 0;
                    CreateDiscData.Sequence = -1;
                    CreateDiscData.SubjectCount = 0;
                    //如果DiscussionType(討論組類型)小於100，把剛新增的一般討論組Data加到Scope裡面
                    if (AddDisc[0].DiscussionType < DiscTypeJudg.Datum) {
                        $scope.CurrentCompany.DiscussionCate[0].Discussions.unshift(CreateDiscData);
                    }
                        //如果DiscussionType(討論組類型)大於100，把剛新增的行政討論組Data加到Scope裡面
                    else {
                        $scope.CurrentCompany.DiscussionCate[1].Discussions.unshift(CreateDiscData);
                    }
                    // 成功更新討論組資料
                    var mytimeout = $timeout(function () {
                        $scope.DiscManage.IsSuccess = false;
                        $timeout.cancel(mytimeout);
                    }, 3000);
                    // 更新討論組左側清單
                    if ($scope.DiscManage.DiscDetail.DiscussionType == DiscType.Normal) {
                        // 一般討論組 
                        $scope.DiscManage.NormalDiscList = result.data.DataObj._returnDisc;
                        // 將第一筆的討論組列表資料預設為選擇
                        SetDiscListStyle(true, false, CreateDiscData.DiscussionID);
                    }
                    else {
                        // 行政討論組
                        $scope.DiscManage.AdminDiscList = result.data.DataObj._returnDisc;
                        // 將第一筆的討論組列表資料預設為選擇
                        SetDiscListStyle(false, true, CreateDiscData.DiscussionID);
                    }
                    // 廣播完成後台引導可以繼續
                    $rootScope.$emit(BackendGuide.EmitModify, false);
                }
            });
    };
    // #endregion
    // #region 送往Server，更新或新增 討論組詳細資料
    $scope.UpdateDisc = function () {
        if ($scope.DiscManage.IsNew) {
            // 新增討論組
            CreateDisc();
        }
        else {
            // 更新討論組
            UpdateDiscData();
        }
    };
    // #endregion
    // #region 簽核流程討論組設定 填充陣列
    function SpeceficDisc() {
        return $scope.DiscManage.DiscDetail.Flow;
    };
    // #endregion
    // #region 事假/假別 討論組設定 填充陣列
    function SpeceficDisc2() {
        return $scope.DiscManage.DiscDetail.Leave;
    };
    // #endregion
    // #region 事假/假別 討論組設定 填充陣列(新增的時候要過濾掉刪除的)
    function SpeceficDisc3() {
        var _result = $filter('filter')($scope.DiscManage.DiscDetail.Leave, { Action: '!delete' }, true);
        return _result;
    };
    // #endregion
    // #region 資料沒有正確輸入(紅色框線)
    function TypeValueMiss(item, setting) {
        if (setting) {
            angular.element(item).css("border", "1px solid red");
        }
        else {
            angular.element(item).css("border", "");
        }

    };
    // #endregion
    // #region 建立前先檢查是否有帶正常的值
    function CheckDiscBeforeCreate() {
        var flag = true;
        var _CurrentDiscType = $scope.DiscManage.DiscDetail.DiscussionType;
        // #region 討論組名稱
        if ($scope.DiscManage.DiscDetail.DiscName.length <= 0) {
            flag = false;
            $("#DiscName").focus();
        }
        // #endregion
        // #region 討論組管理員
        if ($scope.DiscManage.DiscDetail.Admin.length <= 0) {
            flag = false;
            TypeValueMiss("#Adminer", true);
        }
        else {
            TypeValueMiss("#Adminer", false);
        }
        // #endregion
        // #region 討論組成員
        if ($scope.DiscManage.DiscDetail.Members.length <= 0) {
            flag = false;
            TypeValueMiss("#Member", true);
        }
        else {
            TypeValueMiss("#Member", false);
        }
        // #endregion
        // #region 討論組常用收件人
        if ($scope.DiscManage.DiscDetail.Regulars.length <= 0) {
            flag = false;
            TypeValueMiss("#Receiver", true);
        }
        else {
            TypeValueMiss("#Receiver", false);
        }
        // #endregion
        // #region 簽核關卡
        if (_CurrentDiscType == DiscType.ApplyMoney || _CurrentDiscType == DiscType.Purchasing) {
            var _UserLength = $scope.DiscManage.DiscDetail.Flow[0].AuditID.length;
            var _NameLength = $scope.DiscManage.DiscDetail.Flow[0].Name.length;
            if (_UserLength <= 0 || _NameLength <= 0) {
                flag = false;
                angular.element(".auditDiv").eq(0).css({ "border": "1px solid red", "padding": "2px" });
            }
            else {
                angular.element(".auditDiv").eq(0).css({ "border": "", "padding": "" });
            }
        }
        // #endregion
        if (_CurrentDiscType == DiscType.GoOut || _CurrentDiscType == DiscType.PersonLeave) {
            var _UpdateLeaveList = $filter('filter')($scope.DiscManage.DiscDetail.Leave, { Action: 'update' }, true);
            var _CreateLeaveList = $filter('filter')($scope.DiscManage.DiscDetail.Leave, { Action: 'create' }, true);
            var _DefaultLeaveList = $filter('filter')($scope.DiscManage.DiscDetail.Leave, { Action: null }, true);
            if (_UpdateLeaveList.length <= 0 && _CreateLeaveList.length <= 0 && _DefaultLeaveList.length <= 0) {
                TypeValueMiss("#Leave", true);
                flag = false;
            }
            else {
                TypeValueMiss("#Leave", false);
            }
        }
        return flag;
    };
    // #endregion
    // #region 建立討論組前，檢查是否有相同的討論組名稱
    function CheckRepeatDisc(_DiscType, _DiscName) {
        var _CheckDiscList = [];
        if (_DiscType == DiscType.Normal) {
            _CheckDiscList = $scope.DiscManage.NormalDiscList;
        }
        else{
            _CheckDiscList = $scope.DiscManage.AdminDiscList;
        }
        var _KeepGoing = true;
        var _flag = true;
        angular.forEach(_CheckDiscList, function (value, key) {
            if (_KeepGoing) {
                if (_DiscName == value['DiscName']) {
                    _KeepGoing = false;
                    _flag = false;
                }
                else {
                    _flag = true;
                }
            }
        });
        return _flag;
    };
    // #endregion
    // #region 轉換Member List to string List
    function ConvertMemberList(data) {
        var result = [];
        for (var i = 0; i < data.length; i++) {
            result.push(data[i].MemberID);
        }
        return result;
    };
    // #endregion
    // #region 討論組資料後端處理完成後，更新前端左側討論組列表(補上行政區)
    function UpdateDiscLeftSide() {
        var _DiscussionType = $scope.DiscManage.DiscDetail.DiscussionType;
        var _DiscID = $scope.DiscManage.DiscDetail.DiscID;
        var _DiscName = $scope.DiscManage.DiscDetail.DiscName;
        var _MemberCount = $scope.DiscManage.DiscDetail.Members.length;
        if (_DiscussionType == DiscType.Normal) {
            $filter('filter')($scope.DiscManage.NormalDiscList, { DiscID: _DiscID }, true)[0].DiscName = _DiscName
            $filter('filter')($scope.DiscManage.NormalDiscList, { DiscID: _DiscID }, true)[0].MemberCount = _MemberCount
        }
    };
    // #endregion
    // #region 點擊選擇左側行政討論組
    $scope.SelectAdminDisc = function (item) {
        // 顯示討論組設定提示字
        $scope.DiscManage.IsNew = false;
        $scope.DiscManage.SettingView = true;
        // 先將所有討論組Style Reset
        ResetDiscStyle();
        // 在把目前點擊的討論組改變Style
        $filter('filter')($scope.DiscManage.AdminDiscList, { DiscID: item.DiscID }, true)[0].IsSelect = true;
        GetDiscDetailData(item.DiscID, item.DiscussionType);
    };
    // #endregion
    // #region 討論組選擇狀態復原
    function ResetDiscStyle() {
        var NormalItem = $filter('filter')($scope.DiscManage.NormalDiscList, { IsSelect: true }, true)[0];
        var AdminItem = $filter('filter')($scope.DiscManage.AdminDiscList, { IsSelect: true }, true)[0];
        if (angular.isDefined(NormalItem))
            $filter('filter')($scope.DiscManage.NormalDiscList, { IsSelect: true }, true)[0].IsSelect = false;

        if (angular.isDefined(AdminItem))
            $filter('filter')($scope.DiscManage.AdminDiscList, { IsSelect: true }, true)[0].IsSelect = false;
    };
    // #endregion
    // #region 行政區討論組刪除關卡
    $scope.DeleteProcess = function (item) {
        var _removeItem = $filter('filter')($scope.DiscManage.DiscDetail.Flow, { Serise: item.Serise }, true)[0];
        var _removeIndex = $scope.DiscManage.DiscDetail.Flow.indexOf(_removeItem);
        $scope.DiscManage.DiscDetail.Flow.splice(_removeIndex, 1);
    };
    // #endregion
    // #region 是否顯示簽核關卡在討論組詳細頁面
    function IsFlowDisc() {
        var result = false;
        var _DiscDetail = $scope.DiscManage.DiscDetail;
        if (angular.isDefined(_DiscDetail)) {
            var _DiscType = $scope.DiscManage.DiscDetail.DiscussionType;
            if (_DiscType == DiscType.ApplyMoney || _DiscType == DiscType.Purchasing) {
                result = true;
            }
        }
        return result;
    };
    // #endregion
    // #region 綁定Flow 簽核者Model
    function BindFlowData() {
        var _length = $scope.DiscManage.DiscDetail.Flow.length;
        for (var i = 0; i < _length; i++) {
            var _item = $scope.DiscManage.DiscDetail.Flow[i];
            // 過濾出該筆Member資料
            var MemberData = $filter('filter')($scope.DiscManage.DiscDetail.MemberList, { MemberID: _item.AuditID }, true)[0];
            // 將Member資料塞入FlowData
            $filter('filter')($scope.DiscManage.DiscDetail.Flow, { Serise: _item.Serise }, true)[0].FlowMemberData = MemberData;
        }
    };
    // #endregion
    // #region 建立新的簽核流程 
    $scope.AddNewAudit = function () {
        var _FlowLength = $scope.DiscManage.DiscDetail.Flow.length;
        var _NewFlow = {
            AuditID: "",
            FlowMemberData: {},
            InArea: false,
            Name: "",
            Serise: _FlowLength + 1
        };
        $scope.DiscManage.DiscDetail.Flow.push(_NewFlow);
        // 成功更新討論組資料
        var inputtimeout = $timeout(function () {
            $(".audit").last().focus();
            $timeout.cancel(inputtimeout);
        }, 500);
    };
    // #endregion
    // #region 流程關卡負責人變動
    $scope.UpdateFlowUser = function (item) {
        var _MemberID = $filter('filter')($scope.DiscManage.DiscDetail.Flow, { Serise: item.Serise }, true)[0].FlowMemberData.MemberID;
        $filter('filter')($scope.DiscManage.DiscDetail.Flow, { Serise: item.Serise }, true)[0].AuditID = _MemberID;
        $filter('filter')($scope.DiscManage.DiscDetail.MemberList, { MemberID: item.AuditID }, true)[0].IsDiscMember = true;
        $filter('filter')($scope.DiscManage.DiscDetail.MemberList, { MemberID: item.AuditID }, true)[0].IsRegulars = true;
        InitDiscMembers();
    };
    // #endregion
    // #region 判斷討論組是否為請假區
    $scope.IsPersonalLeave = function () {
        var _result = false;
        if (angular.isDefined($scope.DiscManage.DiscDetail)) {
            if ($scope.DiscManage.DiscDetail.DiscussionType == DiscType.PersonLeave) {
                _result = true;
            }
        }
        return _result;
    };
    // #endregion
    // #region 判斷討論組是否為外出區
    $scope.IsGoOut = function () {
        var _result = false;
        if (angular.isDefined($scope.DiscManage.DiscDetail)) {
            if ($scope.DiscManage.DiscDetail.DiscussionType == DiscType.GoOut) {
                _result = true;
            }
        }
        return _result;
    };
    // #endregion
    // #region 新增假別 / 事別
    $scope.AddNewLeave = function () {
        var _Length = $scope.DiscManage.LeaveValue.length;
        if (_Length < 1) {
            $scope.DiscManage.LeaveValueSate = false;
        }
        else {
            // 顯示狀態
            $scope.DiscManage.LeaveValueSate = true;
            // 塞入資料進入
            var _CreateObj = {};
            _CreateObj['Action'] = "create";
            _CreateObj['ID'] = null;
            _CreateObj['IsUse'] = false;
            _CreateObj['Name'] = $scope.DiscManage.LeaveValue;
            //$scope.DiscManage.DiscDetail.Leave.splice(_Length, 0, _CreateObj);
            $scope.DiscManage.DiscDetail.Leave.push(_CreateObj);
            // 清空文字
            $scope.DiscManage.LeaveValue = "";
        }
    };
    // #endregion
    // #region 事別 / 假別 樣式
    $scope.LeaveStyle = function () {
        var _Obj = {};
        if (!$scope.DiscManage.LeaveValueSate) {
            _Obj = {
                'border': '2px solid red'
            }
        }
        return _Obj;
    };
    // #endregion
    // #region 事別 / 假別 發生更新事件
    $scope.UpdateLeaveName = function (item) {
        $filter('filter')($scope.DiscManage.DiscDetail.Leave, { ID: item.ID }, true)[0].Action = "update";
    };
    // #endregion
    // #region 刪除事別 / 假別的事件
    $scope.RemoveLeaveItem = function (item) {
        var removeIndex = $scope.DiscManage.DiscDetail.Leave.indexOf(item);
        $scope.DiscManage.DiscDetail.Leave[removeIndex].Action = "delete";
    };
    // #endregion
    // #region 刪除討論組
    $scope.DeleteDisc = function (item) {
        var remindMsg = $filter('translate')('AreYouSure');
        if (confirm(remindMsg) == true && item.IsPublic) {
            var _DiscID = item.DiscID;
            var _DiscussionType = item.DiscussionType;
            var para = ({ DiscID: _DiscID });
            GetBackendData.DeleteDisc(para)
                .then(function (result) {
                    if (result.data.IsSuccessful) {
                        //如果DiscussionType(討論組類型)小於100
                        if (item.DiscussionType < DiscTypeJudg.Datum) {
                            //呼叫Function(一般討論組)
                            RemokeDisc(0, item.DiscID);
                        }
                            //如果DiscussionType(討論組類型)大於100
                        else {
                            //呼叫Function(行政討論組)
                            RemokeDisc(1, item.DiscID);
                        }
                        if (_DiscussionType == DiscType.Normal) {
                            // 一般討論組刪除
                            var removeIndex = $scope.DiscManage.NormalDiscList.indexOf(item);
                            $scope.DiscManage.NormalDiscList.splice(removeIndex, 1);
                            // 補上不一定還會有剩下的討論組列表邏輯(如果所有討論組列表都刪除了) -- Gary
                            GetDiscDetailData($scope.DiscManage.NormalDiscList[0].DiscID, $scope.DiscManage.NormalDiscList[0].DiscussionType);
                            // 將第一筆的討論組列表資料預設為選擇
                            SetDiscListStyle(true, false, $scope.DiscManage.NormalDiscList[0].DiscID);
                        }
                        else {
                            // 行政討論組刪除
                            var removeIndex = $scope.DiscManage.AdminDiscList.indexOf(item);
                            $scope.DiscManage.AdminDiscList.splice(removeIndex, 1);
                            GetDiscDetailData($scope.DiscManage.AdminDiscList[0].DiscID, $scope.DiscManage.AdminDiscList[0].DiscussionType);
                            // 將第一筆的討論組列表資料預設為選擇
                            SetDiscListStyle(false, true, $scope.DiscManage.AdminDiscList[0].DiscID);
                        }
                    }
                });
        }
        else
        {
            var _DisableMsg = $filter('translate')('DisableToDelDisc');
            alert(_DisableMsg);
        }
    };
    function RemokeDisc(Para, NewDiscID) {
        //濾出剛刪除討論組的那筆資料
        var DelDisc = $filter('filter')($scope.CurrentCompany.DiscussionCate[Para].Discussions, { DiscussionID: NewDiscID });
        //找出剛刪除討論組那筆資料的Index
        var removeIndex = $scope.CurrentCompany.DiscussionCate[Para].Discussions.indexOf(DelDisc[0]);
        //從Scope裡面移除那筆資料
        $scope.CurrentCompany.DiscussionCate[Para].Discussions.splice(removeIndex, 1);
    }
    // #endregion
    // #region jqGrid自定義按鈕
    function recycleBtn(cellvalue, options, rowObject) {
        return "<button id='recoverDisc' class='redisc btn btn-success btn-sm' data-value=" + cellvalue + " data-disctype=" + rowObject['_DiscType'] + ">還原</button>"
    }
    // #endregion
    // #region 前往回收區
    $scope.GotoRecycle = function () {
        // 顯示回收區畫面
        $scope.DiscManage.SettingView = false;
        // 討論組選定樣式解除
        SetDiscListStyle(false, false);
        //讀取回收區資料 及建立Grid
        $scope.config = {
            url: '/Backend/RecycleDisc/?CompanyID=' + CompID,
            datatype: "json",
            colNames: ["討論組ID", "類別", "討論組名稱", "建立時間", "刪除時間", "動作"],
            colModel: [
                { name: 'DiscID', hidden: true, hidedlg: true },
                { name: 'DiscType', sortable: false, stype: 'text', align: 'center' },
                { name: 'DiscName', sortable: false, width: '200px', align: 'center' },
                { name: 'CreatTime', sortable: false, width: 100, align: 'center' },
                { name: 'DeleteTime', sortable: false, width: 100, align: 'center' },
                { name: 'DiscID', width: 120, search: false, editable: false, viewable: false, formatter: recycleBtn, align: 'center' }
            ],
            rowNum: 10,
            ntype: 'Get',
            loadonce: true,
            rowList: [10, 20],
            pager: '#pager',
            sortorder: 'desc',
            shrinkToFit: false,
            width: 672,
            height: '100%',
            scrollOffset: 0
        }
    };
    // #endregion
    // #region 接收到還原完成的廣播
    $scope.$on('UpdateBackendDisc', function (event, data) {
        var _DiscList = data['DiscList'];
        var _DiscType = data['DiscType'];
        if (_DiscType == DiscType.Normal) {
            // 一般討論組
            $scope.DiscManage.NormalDiscList = _DiscList
            // 將第一筆的討論組列表資料預設為選擇
            SetDiscListStyle(true, false, $scope.DiscManage.NormalDiscList[0].DiscID);
        }
        else {
            // 行政討論組
            $scope.DiscManage.AdminDiscList = _DiscList;
            // 將第一筆的討論組列表資料預設為選擇
            SetDiscListStyle(false, true, $scope.DiscManage.AdminDiscList[0].DiscID);
        }
    });
    // #endregion
    // #region 設置左方討論組列表選取樣式
    function SetDiscListStyle(normal, admin, _DiscID) {
        if ($scope.DiscManage.NormalDiscList.length > 0 && normal)
        {
            $filter('filter')($scope.DiscManage.NormalDiscList, { DiscID: _DiscID }, true)[0].IsSelect = true;
        }
        if ($scope.DiscManage.AdminDiscList.length > 0 && admin)
        {
            $filter('filter')($scope.DiscManage.AdminDiscList, { DiscID: _DiscID }, true)[0].IsSelect = true;
        }
    };
    // #endregion
    // #region 新增公司訊息討論組 與 行政討論組 共用方法
    function NewDiscGeneral() {
        // 將一切資料先歸零後，要再加入判斷此次是新增討論組的Service
        $scope.DiscManage.SettingView = true;
        SetDiscListStyle(false, false);
        // 顯示新增討論組提示字
        $scope.DiscManage.IsNew = true;
        // 名稱歸零
        $scope.DiscManage.DiscDetail.DiscName = "";
        // 管理員清空
        $scope.DiscManage.DiscDetail.Admin = [];
        // 成員清空
        $scope.DiscManage.DiscDetail.Members = [];
        // 常用收件人清空
        $scope.DiscManage.DiscDetail.Regulars = [];
        // 清除一定要在成員的設定
        ResetDiscMember();
    };
    // #endregion
    // #region 新增一般公司訊息討論組
    $scope.AddNewNormalDisc = function () {
        $scope.DiscManage.DiscDetail.DiscussionType = DiscType.Normal;
        NewDiscGeneral();
        // Focus 討論組名稱框框
        $("#DiscName").focus();
    };
    // #endregion
    // #region 重設成員及固定收件人的Scope內設定
    function ResetDiscMember() {
        var _length = $scope.DiscManage.DiscDetail.MemberList.length;
        for (var i = 0; i < _length; i++) {
            $scope.DiscManage.DiscDetail.MemberList[i].IsDiscMember = false;
            $scope.DiscManage.DiscDetail.MemberList[i].IsRegulars = false;
        }
    };
    // #endregion
    // #region 新增Flow討論組簽核流程
    function AddNewFlow() {
        var _NewFlow = {
            AuditID: "",
            FlowMemberData: {},
            InArea: false,
            Name: "",
            Serise: 1
        };
        $scope.DiscManage.DiscDetail.Flow = [];
        $scope.DiscManage.DiscDetail.Flow.push(_NewFlow);
        $scope.DiscManage.IsFlowDisc = true;
    };
    // #endregion
    // #region 處理預設請假區
    function DealPersonLeave() {
        var _sample = LeaveSample.PersonLeave_sample;
        angular.forEach(_sample, function (value) {
            value['Name'] = $filter('translate')(value['Name']);
            $scope.DiscManage.DiscDetail.Leave.push(value);
        });
    };
    // #endregion
    // #region 處理預設外出區
    function DealGoout() {
        var _sample = LeaveSample.Goout_sample;
        angular.forEach(_sample, function (value) {
            value['Name'] = $filter('translate')(value['Name']);
            $scope.DiscManage.DiscDetail.Leave.push(value);
        });
    };
    // #endregion
    // #region 新增行政區訊息討論組
    $scope.AddAdminDisc = function (item) {
        NewDiscGeneral();
        angular.element(".add_admin").find('button').trigger("click");
        // Focus 討論組名稱框框
        $("#DiscName").focus();
        switch (item) {
            case 'purchs':
                $scope.DiscManage.DiscDetail.DiscussionType = DiscType.Purchasing;
                AddNewFlow();
                break;
            case 'applyMoney':
                $scope.DiscManage.DiscDetail.DiscussionType = DiscType.ApplyMoney;
                AddNewFlow();
                break;
            case 'personLeave':
                // 請假
                $scope.DiscManage.DiscDetail.DiscussionType = DiscType.PersonLeave;
                $scope.DiscManage.DiscDetail.Leave = [];
                $scope.DiscManage.IsFlowDisc = false;
                DealPersonLeave();
                break;
            case 'overTime':
                $scope.DiscManage.DiscDetail.DiscussionType = DiscType.Overtime;
                $scope.DiscManage.IsFlowDisc = false;
                // 加班區
                break;
            case 'goOut':
                $scope.DiscManage.DiscDetail.DiscussionType = DiscType.GoOut;
                $scope.DiscManage.DiscDetail.Leave = [];
                $scope.DiscManage.IsFlowDisc = false;
                DealGoout();
                // 外出
                break;
        }
    };
    // #endregion
    // #region 預先新增線上客服部門以及客服人員
    $rootScope.$on(BackendGuide.EmitInsertSupport, function () {
        var Para = ({
            CompID: CompID,
            BossID: UserID,
            DepartName: $filter('translate')('OnlineSupport')
        });
        GetBackendData.CreateDept(Para)
            .success(function (result) {
                var _DeptID = result.DataObj.DepartID;
                var fm = new FormData();
                fm.append('file', undefined);
                fm.append('CompID', CompID);
                fm.append('BossID', UserID);
                fm.append('MemberID', "");
                fm.append('LastName', BackendGuide.SupportInfo.LastName);
                fm.append('FirstName', BackendGuide.SupportInfo.FirstName);
                fm.append('Email', BackendGuide.SupportInfo.Email);
                fm.append('Password', BackendGuide.SupportInfo.Password);
                fm.append('DepartID', _DeptID);
                fm.append('ImgColor', "#8fcbcc");
                fm.append('ImgName', BackendGuide.SupportInfo.LastName);
                fm.append('Discussions', JSON.stringify([{ Check: true, DiscID: CompID, DiscName: "公司公告", IsRegular: false }]));
                fm.append('Work', true);
                fm.append('IsSettingEmail', false);

                GetBackendData.CreateMember(fm)
                    .success(function (result2) {
                        console.log(result2);
                    });
            });
    });
    // #endregion
    // #region 接收註冊的廣播，不可以顯示收件人以及固定收件人的畫面
    $rootScope.$on(BackendGuide.EmitDisableDiscReceiver, function () {
        $scope.DiscManage.IsRegistState = true;
    });
    // #endregion
}]);