SuccApp.controller('BackendManage', ['$scope', 'GetBackendData', '$filter', 'PhotoColor', '$rootScope', 'BackendGuide', function ($scope, GetBackendData, $filter, PhotoColor, $rootScope, BackendGuide) {
    // #region 參數設定
    var _CompID = $scope.$parent.$parent.$parent.$parent.CurrentCompany['CompanyID'];
    var _UserID = $scope.$parent.$parent.$parent.$parent.IndexData.CurrentUser['UserID'];
    $scope.MemberManage = {};
    $scope.MemberManage.CompID = _CompID;
    $scope.MemberManage.UserID = _UserID;
    // 放置目前點擊的部門人員清單
    $scope.MemberManage.CurrentDeptMember = [];
    // 是否前往使用者個人資料表
    $scope.MemberManage.IsViewUserDetail = false;
    // 目前是否顯示為所有人員清單(或者已點擊各部門):預設為查看全部
    $scope.MemberManage.IsAllDepList = true;
    // 目前點擊的部門名稱
    $scope.MemberManage.CurrentDeptName = "";
    // 目前點擊的部門ID
    $scope.MemberManage.CurrentDeptID = "";
    // 預設部門標籤Tab的Class
    $scope.MemberManage.DeptTabClass = "alluser_list active";
    // 預設部門人員標籤Tab的Class
    $scope.MemberManage.UserTabClass = "user_detail";
    // 預設部門畫面的Class
    $scope.MemberManage.DepuUserList = "tab-pane active";
    // 預設部門人員畫面的Class
    $scope.MemberManage.DepuUserDetail = "tab-pane";
    // 人員管理搜尋關鍵字
    $scope.MemberManage.SearchString = "";
    // 讀取人員資料的物件
    $scope.MemberManage.Detail = {};
    // 是否開啟建立人員狀態
    $scope.MemberManage.Detail.IsNew = false;
    // 判斷輸入的User Email是否有重複
    $scope.MemberManage.Detail.Duplicate = false;
    // 人員是否在職的樣式
    $scope.MemberManage.Detail.WorkClass = "btn btn-sm active";
    $scope.MemberManage.Detail.ResignClass = "btn btn-sm";
    // 預設人員在職
    $scope.MemberManage.Detail.IsWork = true;
    // 預設不綁定Email
    $scope.MemberManage.Detail.BindEmail = false;
    // 預設顯示的設定頁面
    $scope.MemberManage.Detail.IsShowPersonal = {'display':'block'};
    $scope.MemberManage.Detail.PersonalViewClass = "basicinfo w3-animate-left";
    $scope.MemberManage.Detail.DiscViewClass = "w3-animate-left";
    // 預設照片文字為空
    $scope.MemberManage.Detail.Imgname = "";
    // 預設照片顏色為空
    $scope.MemberManage.Detail.ImgColor = "";
    // 預設Name框框樣式
    $scope.MemberManage.Detail.LNameStyle = {};
    $scope.MemberManage.Detail.FNameStyle = {};
    // 預設Email & Password框框樣式
    $scope.MemberManage.Detail.EmailStyle = {};
    $scope.MemberManage.Detail.PwordStyle = {};
    // 預設部門框框樣式
    $scope.MemberManage.Detail.DepartStyle = {};
    // 是否通過建立資料驗證
    $scope.MemberManage.Detail.CreateValidate = true;
    // 預設檢驗訊息
    $scope.MemberManage.Detail.Msg = "";
    $scope.MemberManage.Detail.ShowMsg = false;
    // 預設上傳圖片前的照片
    $scope.MemberManage.Detail.MemberImg = "/Statics/img/backend/people.jpg";
    // 預設人員ID為空
    $scope.MemberManage.Detail.MemberID = "";
    // 預設新增部門名稱為空
    $scope.MemberManage.DeptName = "";
    // 新增部門訊息
    $scope.MemberManage.ShowDeptMsg = false;
    $scope.MemberManage.DeptMsg = "";
    // 判斷是否前往離職員工區域
    $scope.MemberManage.IsLeaveArea = false;
    // 預設Email
    $scope.MemberManage.Detail.Email = "";
    $scope.MemberManage.Detail.Password = "";
    // 判斷現在查看的使用者詳細資料是不是老闆的
    $scope.MemberManage.IsBoss = false;
    // #endregion
    // #region 拿取人員清單
    var para = ({
        CompanyID: _CompID,
        UserID: _UserID
    });
    GetBackendData.GetmemberList(para)
        .then(function (result) {
            var _data = result.data;
            $scope.MemberManage.AllCount = _data['AllMember'];
            $scope.MemberManage.DepList = _data['DepList'];
            $scope.MemberManage.DiscList = _data['DiscList'];
            $scope.MemberManage.UserList = _data['UserList'];
            $scope.MemberManage.AllUserList = _data['UserList'];
            $scope.MemberManage.LeaveCount = _data['orgLevelMemberCouunt'];
            // 建立所有人員的預設Grid
            InitAllMemberGrid();
        });
    // #endregion
    // #region 建立預設的全部人員Grid
    function InitAllMemberGrid()
    {
        // 建立所有人的Grid
        $scope.MemberManage.allconfig = {
            data: $filter('filter')($scope.MemberManage.UserList, {IsActive: true}, true),
            datatype: "local",
            colNames: ["使用者ID", "姓名", "電子郵件", "部門", "部門ID"],
            colModel: [
                { name: 'MemberID', hidden: true, hidedlg: true },
                { name: 'FullName', sortable: false, stype: 'text', align: 'center', width: 261 },
                { name: 'Email', sortable: false, align: 'center', width: 256 },
                { name: 'DepName', sortable: false, align: 'center', width: 240 },
                { name: 'DeptID', hidden: true, hidedlg: true }
            ],
            rowNum: 10,
            ntype: 'Get',
            loadonce: true,
            rowList: [10, 20],
            pager: '#pager',
            sortorder: 'desc',
            shrinkToFit: false,
            width: 758,
            height: '100%',
            scrollOffset: 0,
            onSelectRow: function (rowid, status, a, e) {
                var MemberID = $("#AllmemberGrid").jqGrid('getCell', rowid, 'MemberID');
                var DeptID = $("#AllmemberGrid").jqGrid('getCell', rowid, 'DeptID');
                var Name = $("#AllmemberGrid").jqGrid('getCell', rowid, 'FullName');
                // 取消新增人員狀態
                $scope.MemberManage.Detail.IsNew = false;
                GetDeptUserDetail(MemberID);
            }
        }
    };
    // #endregion
    // #region 點擊左側所有成員列表
    $scope.ClickAllDep = function () {
        UpdateAllItem();
    };
    // #endregion
    // #region 更新左側所有成員事件
    function UpdateAllItem() {
        // 點擊Tab切換Tab的動作
        ChangeTabClass_Dept();
        // 控制Tab標籤為全部人員
        $scope.MemberManage.IsAllDepList = true;
        // 所在區域非離職區
        $scope.MemberManage.IsLeaveArea = false;
        // 清空關鍵字搜索
        $scope.MemberManage.SearchString = "";
        // 重置點擊的部門ID
        $scope.MemberManage.CurrentDeptID = "";
        // 關閉部門人員展開
        var _data = $scope.MemberManage.DepList;
        angular.forEach(_data, function (value) {
            $filter('filter')($scope.MemberManage.DepList, { DeptID: value.DeptID }, true)[0].IsHide = false;
        });
        // 清空部門人員顯示
        $scope.MemberManage.CurrentDeptMember = [];
        // JqGrid 資料更新
        $scope.MemberManage.UserList = $filter('filter')($scope.MemberManage.AllUserList, { IsActive: true }, true);
        // 觸發JqGrid更新動作
        var allParameters = angular.element("#AllmemberGrid").jqGrid("getGridParam");
        allParameters.data = $scope.MemberManage.UserList;
        angular.element("#AllmemberGrid").setGridParam({ datatype: 'local' }).trigger('reloadGrid');
    };
    // #endregion
    // #region 點擊左側選單的部門列表
    $scope.ClickDep = function (item) {
        UpdateDeptItem(item);
    };
    // #endregion
    // #region 點選部門Item更新事件
    function UpdateDeptItem(item) {
        // 點擊Tab切換Tab的動作
        ChangeTabClass_Dept();
        // 控制Tab標籤為部門名稱
        $scope.MemberManage.IsAllDepList = false;
        // 所在區域非離職區
        $scope.MemberManage.IsLeaveArea = false;
        // 顯示Tab標籤為目前部門名稱
        $scope.MemberManage.CurrentDeptName = item.DeptName;
        $scope.MemberManage.CurrentDeptID = item.DeptID;
        // 清空關鍵字搜索
        $scope.MemberManage.SearchString = "";
        // 關閉其他部門顯示
        var data = $filter('filter')($scope.MemberManage.DepList, { DeptID: '!' + item.DeptID }, true);
        angular.forEach(data, function (value) {
            $filter('filter')($scope.MemberManage.DepList, { DeptID: value.DeptID }, true)[0].IsHide = false;
        });
        // 顯示目前的部門成員
        $filter('filter')($scope.MemberManage.DepList, { DeptID: item.DeptID }, true)[0].IsHide = !item.IsHide;
        // 過濾出屬於目前的部門人員
        var _currentDepUser = $filter('filter')($scope.MemberManage.AllUserList, { DeptID: item.DeptID, IsActive: true }, true);
        // 塞入左邊清單的顯示的陣列當中
        $scope.MemberManage.CurrentDeptMember = _currentDepUser;
        // JqGrid 資料更新
        $scope.MemberManage.UserList = $scope.MemberManage.CurrentDeptMember;
        // 觸發JqGrid更新動作
        var allParameters = angular.element("#AllmemberGrid").jqGrid("getGridParam");
        allParameters.data = $scope.MemberManage.CurrentDeptMember;
        angular.element("#AllmemberGrid").setGridParam({ datatype: 'local' }).trigger('reloadGrid');
    };
    // #endregion
    // #region 產生部門人員頭像樣式
    $scope.memberIcon = function (item) {
        var _ItemStyle = "";
        if (item.Photo == null) {
            _ItemStyle = { 'background-color': item.ImgColor };
        }
        return _ItemStyle;
    };
    // #endregion
    // #region 查看部門人員資料
    function GetDeptUserDetail(MemberID) {
        ChangeTabClass_User();
        // 刷新UserDetail的Scope資料
        UpdateUserDetail(MemberID);
        // 因為SelectRow 不是Angular的方法，利用Apply通知更新
        $scope.$apply();
    };
    // #endregion
    // #region 點擊Tab的動作
    $scope.tab_changeDept = function () {
        ChangeTabClass_Dept();
    };
    // #endregion
    // #region 點擊Tab切換部門的動作
    function ChangeTabClass_Dept() {
        // 部門標籤Tab的Class
        $scope.MemberManage.DeptTabClass = "alluser_list active";
        // 部門人員標籤Tab的Class
        $scope.MemberManage.UserTabClass = "user_detail";
        // 部門畫面的Class
        $scope.MemberManage.DepuUserList = "tab-pane active";
        // 預部門人員畫面的Class
        $scope.MemberManage.DepuUserDetail = "tab-pane";
        // 關閉人員查看視窗
        $scope.MemberManage.IsViewUserDetail = false;
    };
    // #endregion
    // #region 點擊人員Tab動作
    $scope.tab_changeMember = function () {
        ChangeTabClass_Member();
    };
    // #endregion
    // #region 點擊Tab切換人員的動作
    function ChangeTabClass_Member() {
        // 部門標籤Tab的Class
        $scope.MemberManage.DeptTabClass = "alluser_list";
        // 部門人員標籤Tab的Class
        $scope.MemberManage.UserTabClass = "user_detail active";
        // 部門畫面的Class
        $scope.MemberManage.DepuUserList = "tab-pane";
        // 預部門人員畫面的Class
        $scope.MemberManage.DepuUserDetail = "tab-pane active";
    };
    // #endregion
    // #region 點擊部門人員的動作
    function ChangeTabClass_User() {
        // 顯示人員標籤的Tab
        $scope.MemberManage.IsViewUserDetail = true;
        // 部門標籤Tab的Class
        $scope.MemberManage.DeptTabClass = "alluser_list";
        // 部門人員標籤Tab的Class
        $scope.MemberManage.UserTabClass = "user_detail active";
        // 部門畫面的Class
        $scope.MemberManage.DepuUserList = "tab-pane";
        // 預部門人員畫面的Class
        $scope.MemberManage.DepuUserDetail = "tab-pane active";

    };
    // #endregion
    // #region 點擊左側清單中的成員
    $scope.ClickDeptUser = function (item) {
        // 刷新Tab資料
        ChangeTabClass_User();
        // 重置使用者詳細資料的討論組資料
        ResetUserDiscData();
        // 刷新UserDetail的Scope資料
        UpdateUserDetail(item.MemberID);
        // 解除新增人員狀態
        $scope.MemberManage.Detail.IsNew = false;
    };
    // #endregion
    // #region 重置使用這詳細資料的討論組
    function ResetUserDiscData() {
        // 還原所有討論組選擇狀態
        angular.forEach($scope.MemberManage.DiscList, function (value) {
            $filter('filter')($scope.MemberManage.DiscList, { DiscID: value.DiscID }, true)[0].Check = false;
            $filter('filter')($scope.MemberManage.DiscList, { DiscID: value.DiscID }, true)[0].IsRegular = false;
        });
    };
    // #endregion
    // #region 提示何為Email綁定
    $scope.HowSetEmail = function () {
        angular.element('#myModal').modal('toggle');
    };
    // #endregion
    // #region 更新個人詳細資料
    function UpdateUserDetail(MemberID) {
        var _CurrentUser = $filter('filter')($scope.MemberManage.AllUserList, { MemberID: MemberID }, true)[0];
        // 過濾出個人的部門
        var _CurrentDept = $filter('filter')($scope.MemberManage.DepList, { DeptID: _CurrentUser.DeptID }, true)[0];
        // 過濾出個人參加的討論組
        $scope.MemberManage.Detail.MemberID = _CurrentUser.MemberID;
        $scope.MemberManage.Detail.FirstName = _CurrentUser.FirstName;
        $scope.MemberManage.Detail.LastName = _CurrentUser.LastName;
        $scope.MemberManage.Detail.Email = _CurrentUser.Email;
        $scope.MemberManage.Detail.Password = _CurrentUser.Password;
        // Tab標籤名稱
        $scope.MemberManage.Detail.FullName = _CurrentUser.FullName;
        $scope.MemberManage.Detail.CurrentDept = _CurrentDept;
        // 員工在職、離職設定
        if (_CurrentUser.IsActive)
        {
            SettingWork();
        }
        else
        {
            SettingLeave();
        }
        // 使用者照片
        if (_CurrentUser.Photo != null)
        {
            var d = new Date();
            $scope.MemberManage.Detail.MemberImg = "/Backend/getUserImg/?UserID=" + $scope.MemberManage.Detail.MemberID + "&t=" + d.getTime();
            $scope.MemberManage.Detail.Imgname = "";
        }
        else
        {
            // 使用者預設圖示
            angular.element(".user_img").attr("src", "");
            $scope.MemberManage.Detail.MemberImg = "";
            $scope.MemberManage.Detail.Imgname = _CurrentUser.ImgName;
            angular.element('.user_img').css("background-color", _CurrentUser.ImgColor);
            $scope.MemberManage.Detail.ImgColor = _CurrentUser.ImgColor;
        }
        // 過濾出個人參加的討論組
        // 過濾出個人包含指定收件人的討論組
        angular.forEach(_CurrentUser.Discussions, function (value) {
            if (angular.isDefined($filter('filter')($scope.MemberManage.DiscList, { DiscID: value.DiscID }, true)[0]))
            {
                $filter('filter')($scope.MemberManage.DiscList, { DiscID: value.DiscID }, true)[0].Check = true;
                $filter('filter')($scope.MemberManage.DiscList, { DiscID: value.DiscID }, true)[0].IsRegular = value.IsRegular;
            }
        });
        // 解除EmailBinding 控制
        $scope.MemberManage.Detail.BindEmail = false;
        $scope.MemberManage.Detail.Duplicate = false;
        // 判斷這個詳細者資料，是否為老闆的
        $scope.MemberManage.IsBoss = MemberID == $scope.MemberManage.UserID ? true : false;
    };
    // #endregion
    // #region 新增人員
    $scope.AddUser = function () {
        // 新增人員狀態
        $scope.MemberManage.Detail.IsNew = true;
        ChangeTabClass_User();
        $scope.MemberManage.Detail.FirstName = "";
        $scope.MemberManage.Detail.LastName = "";
        $scope.MemberManage.Detail.Email = "";
        $scope.MemberManage.Detail.Password = "";
        $scope.MemberManage.Detail.CurrentDept = {};
        $scope.MemberManage.Detail.MemberID = "";
        $scope.MemberManage.Detail.FullName = "";
        // 先還原所有討論組選擇狀態
        angular.forEach($scope.MemberManage.DiscList, function (value) {
            $filter('filter')($scope.MemberManage.DiscList, { DiscID: value.DiscID }, true)[0].Check = false;
            $filter('filter')($scope.MemberManage.DiscList, { DiscID: value.DiscID }, true)[0].IsRegular = false;
        });
        // 還原提醒樣式
        // 預設Name框框樣式
        $scope.MemberManage.Detail.LNameStyle = {};
        $scope.MemberManage.Detail.FNameStyle = {};
        // 預設照片文字為空
        $scope.MemberManage.Detail.Imgname = "";
        // 預設照片顏色為空
        $scope.MemberManage.Detail.ImgColor = "";
        angular.element('.user_img').css("background-color", "");
        if (angular.element('.user_img').data("color") != null)
        {
            // 連續新增人員 顏色歸零
            angular.element(".user_img").data("color", null);
        }
        // 預設Email & Password框框樣式
        $scope.MemberManage.Detail.EmailStyle = {};
        $scope.MemberManage.Detail.PwordStyle = {};
        // 預設部門框框樣式
        $scope.MemberManage.Detail.DepartStyle = {};
        // 是否通過建立資料驗證
        $scope.MemberManage.Detail.CreateValidate = true;
        // 預設檢驗訊息
        $scope.MemberManage.Detail.Msg = "";
        $scope.MemberManage.Detail.ShowMsg = false;
        // 還原預設人員在職
        $scope.MemberManage.Detail.IsWork = true;
        $scope.MemberManage.Detail.WorkClass = "btn btn-sm active";
        $scope.MemberManage.Detail.ResignClass = "btn btn-sm";
        // 還原預設不綁定Email
        $scope.MemberManage.Detail.BindEmail = false;
        // 還原Email 並非重複狀態
        $scope.MemberManage.Detail.Duplicate = false;
        // 重置為非老闆狀態的人員資料樣式
        $scope.MemberManage.IsBoss = false;
        // Scroll Animation
        $("body").animate({ scrollTop: 150 }, "slow");
    };
    // #endregion
    // #region 是否顯示討論組收件人的設定
    $scope.IsShowRegular = function (item) {
         var _ItemStyle = { 'visibility': "hidden" };
         if (item.Check) {
             _ItemStyle = { 'visibility': "visible" };
        }
        return _ItemStyle;
    };
    // #endregion
    // #region 在職
    $scope.Setwork = function () {
        $scope.MemberManage.Detail.IsWork = true;
    };
    // #endregion
    // #region 離職
    $scope.Setwork = function () {
        $scope.MemberManage.Detail.IsWork = false;
    };
    // #endregion
    // #region 人員設定按下確定按鈕
    $scope.SubmitMember = function () {
        var _CompanyID = _CompID;
        var _MemberID = $scope.MemberManage.Detail.IsNew == true ? $scope.MemberManage.Detail.MemberID : $scope.MemberManage.Detail.MemberID;
        var _LastName = $scope.MemberManage.Detail.LastName;
        var _FirstName = $scope.MemberManage.Detail.FirstName;
        var _Email = $scope.MemberManage.Detail.Email;
        var _Password = $scope.MemberManage.Detail.Password;
        var _Depart = $scope.MemberManage.Detail.CurrentDept.DeptID;
        var _IsWork = $scope.MemberManage.Detail.IsWork;
        var _IsSettingEmail = $scope.MemberManage.Detail.BindEmail;
        var _Disc = $filter('filter')($scope.MemberManage.DiscList, {Check:true}, true);
        var _ImgColor = $scope.MemberManage.Detail.ImgColor;
        var _ImgName = $scope.MemberManage.Detail.Imgname;
        var _file = $('#MemberImg[type=file]')[0].files[0];

        var fm = new FormData();
        fm.append('file', _file);
        fm.append('CompID', _CompanyID);
        fm.append('BossID', _UserID);
        fm.append('MemberID', _MemberID);
        fm.append('LastName', _LastName);
        fm.append('FirstName', _FirstName);
        fm.append('Email', _Email);
        fm.append('Password', _Password);
        fm.append('DepartID', _Depart);
        fm.append('ImgColor', _ImgColor);
        fm.append('ImgName', _ImgName);
        fm.append('Discussions', JSON.stringify(_Disc));
        fm.append('Work', _IsWork);
        fm.append('IsSettingEmail', _IsSettingEmail);

        var _Para = ({
            file: _file,
            CompID: _CompanyID,
            BossID: _UserID,
            MemberID: _MemberID,
            LastName: _LastName,
            FirstName: _FirstName,
            Email: _Email,
            Password: _Password,
            DepartID: _Depart,
            ImgColor: _ImgColor,
            ImgName: _ImgName,
            Discussions: _Disc,
            Work: _IsWork,
            IsSettingEmail: _IsSettingEmail
        });
        var _Validate = false;
        _Validate = CheckCreateNewUser(_Para);
        if (_Validate && $scope.MemberManage.Detail.IsNew)
        {
            // 新增人員
            CreateDiscMember(fm);
        }
        if(_Validate && !$scope.MemberManage.Detail.IsNew)
        {
            // 更新人員
            UpdateDiscMember(fm);
        }
    };
    // #endregion
    // #region 在職與否的上一步
    $scope.PrevStepOne = function () {
        // Scroll Animation
        $("body").animate({ scrollTop: 150 }, "slow");
    };
    // #endregion
    // #region 建立人員時檢查資料
    function CheckCreateNewUser(Para)
    {
        var result = true;

        if(Para['DepartID'] == undefined)
        {
            ValidateFail($filter('translate')('ChooseDept'));
            $scope.MemberManage.Detail.DepartStyle = { "border": "2px solid red" };
            result = false;
        }
        else {
            ValidateSuccess();
            $scope.MemberManage.Detail.DepartStyle = {};
            result = true;
        }

        if (Para.Password.length <= 0) {
            ValidateFail($filter('translate')('TypePsd'));
            $scope.MemberManage.Detail.PwordStyle = { "border": "2px solid red", "font": "small-caption" };
            result = false;
        }
        else {
            $scope.MemberManage.Detail.PwordStyle = {};
            result = result == true ? true : false;
            if(result)
            { ValidateSuccess(); }
        }

        if (Para.Email == undefined || Para.Email.length <= 0) {
            ValidateFail($filter('translate')('TypeEmail'));
            $scope.MemberManage.Detail.EmailStyle = { "border": "2px solid red" };
            result = false;
        }
        else {
            $scope.MemberManage.Detail.EmailStyle = {};
            result = result == true ? true : false;
            if (result)
            { ValidateSuccess(); }
        }

        if (Para.FirstName.length <= 0) {
            ValidateFail($filter('translate')('TypeFullName'));
            $scope.MemberManage.Detail.FNameStyle = { "border": "2px solid red" };
            result = false;
        }
        else {
            $scope.MemberManage.Detail.FNameStyle = {};
            result = result == true ? true : false;
            if (result)
            { ValidateSuccess(); }
        }
        if (Para.LastName.length <= 0) {
            ValidateFail($filter('translate')('TypeFullName'));
            $scope.MemberManage.Detail.LNameStyle = { "border": "2px solid red" };
            result = false;
        }
        else {
            $scope.MemberManage.Detail.LNameStyle = {};
            result = result == true ? true : false;
            if (result)
            { ValidateSuccess(); }
        }
        return result;
    };
    // #endregion
    // #region 建立人員呼叫Factory
    function CreateDiscMember(Para)
    {
        GetBackendData.CreateMember(Para)
            .then(function (result) {
                if(result.data.IsSuccessful)
                {
                    var _DepartID = $scope.MemberManage.Detail.CurrentDept.DeptID;
                    var _DepartList = $filter('filter')($scope.MemberManage.DepList, { DeptID: _DepartID }, true)[0];
                    $filter('filter')($scope.MemberManage.DepList, { DeptID: _DepartID }, true)[0].MemberCount += 1;
                    $scope.MemberManage.AllCount += 1;
                    InsertMember();
                    UpdateDeptItem(_DepartList);
                    $scope.MemberManage.IsViewUserDetail = false;
                    $scope.MemberManage.Detail.IsNew = false;
                    $("body").animate({ scrollTop: 150 }, "slow");
                    // 廣播完成後台引導可以繼續
                    $rootScope.$emit(BackendGuide.EmitModify, false);
                }
            });
    };
    // #endregion
    // #region 更新人員呼叫Factory
    function UpdateDiscMember(Para)
    {
        GetBackendData.UpdateDiscMember(Para)
            .then(function (result) {
                ModifyMember();
                $scope.MemberManage.IsViewUserDetail = false;
                $scope.MemberManage.Detail.IsNew = false;
                $("body").animate({ scrollTop: 150 }, "slow");
            });
    };
    // #endregion
    // #region 填入人的名字 發生改變
    $scope.FirstnameChange = function () {
        // 中文
        if($scope.MemberManage.Detail.LastName.search(/[a-zA-Z]/g) != -1 && $scope.MemberManage.Detail.FirstName.search(/[a-zA-Z]/g) != -1)
        {
            var _name = $scope.MemberManage.Detail.LastName.substring(0, 1).toUpperCase() + $scope.MemberManage.Detail.FirstName.substring(0, 1).toUpperCase();
            $scope.MemberManage.Detail.Imgname = _name;
        }
        else {
            if($scope.MemberManage.Detail.LastName != "")
            {
                var _name = $scope.MemberManage.Detail.LastName.substring(0, 2).toUpperCase();
                $scope.MemberManage.Detail.Imgname = _name;
            }
            else {
                var _name = $scope.MemberManage.Detail.FirstName.substring(0, 1).toUpperCase();
                $scope.MemberManage.Detail.Imgname = _name;
            }
        }
        if (angular.element('.user_img').data("color") == null) {
            random_color();
            angular.element(".user_img").attr("src", "");
            $scope.MemberManage.Detail.ImgColor = angular.element('.user_img').data("color");
        }
    };
    // #endregion
    // #region 填入人的姓氏 發生改變
    $scope.LastnameChange = function () {
        // 中文
        if ($scope.MemberManage.Detail.LastName.search(/[a-zA-Z]/g) == -1) {
            var _name = $scope.MemberManage.Detail.LastName.substring(0, 1).toUpperCase();
            $scope.MemberManage.Detail.Imgname = _name;
        }
        // 英文
        else if($scope.MemberManage.Detail.LastName.search(/[a-zA-Z]/g) != -1 && $scope.MemberManage.Detail.FirstName.search(/[a-zA-Z]/g) != -1)
        {
            var _name = $scope.MemberManage.Detail.LastName.substring(0, 1).toUpperCase(); + $scope.MemberManage.Detail.FirstName.substring(0, 1).toUpperCase();
            $scope.MemberManage.Detail.Imgname = _name;
        }
        // 英中
        else if($scope.MemberManage.Detail.LastName.search(/[a-zA-Z]/g) != -1 && $scope.MemberManage.Detail.FirstName.search(/[a-zA-Z]/g) == -1)
        {
            var _name = $scope.MemberManage.Detail.LastName.substring(0, 2).toUpperCase();
            $scope.MemberManage.Detail.Imgname = _name;
        }
        if (angular.element('.user_img').data("color") == null) {
            random_color();
            angular.element(".user_img").attr("src", "");
            $scope.MemberManage.Detail.ImgColor = angular.element('.user_img').data("color");
        }
    };
    // #endregion
    // #region 亂數取得圖像顏色
    function random_color() {
        var n = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
        switch (n) {
            case 1:
                angular.element('.user_img').css("background-color", PhotoColor.color1);
                angular.element('.user_img').attr("data-color", PhotoColor.color1);
                angular.element('.user_img').data("color", PhotoColor.color1);
                break;
            case 2:
                angular.element('.user_img').css("background-color", PhotoColor.color2);
                angular.element('.user_img').attr("data-color", PhotoColor.color2);
                angular.element('.user_img').data("color", PhotoColor.color2);
                break;
            case 3:
                angular.element('.user_img').css("background-color",PhotoColor.color3);
                angular.element('.user_img').attr("data-color", PhotoColor.color3);
                angular.element('.user_img').data("color", PhotoColor.color3);
                break;
            case 4:
                angular.element('.user_img').css("background-color",PhotoColor.color4);
                angular.element('.user_img').attr("data-color", PhotoColor.color4);
                angular.element('.user_img').data("color", PhotoColor.color4);
                break;
            case 5:
                angular.element('.user_img').css("background-color",PhotoColor.color5);
                angular.element('.user_img').attr("data-color", PhotoColor.color5);
                angular.element('.user_img').data("color", PhotoColor.color5);
                break;
            case 6:
                angular.element('.user_img').css("background-color",PhotoColor.color6);
                angular.element('.user_img').attr("data-color", PhotoColor.color6);
                angular.element('.user_img').data("color", PhotoColor.color6);
                break;
            case 7:
                angular.element('.user_img').css("background-color",PhotoColor.color7);
                angular.element('.user_img').attr("data-color", PhotoColor.color7);
                angular.element('.user_img').data("color", PhotoColor.color7);
                break;
            case 8:
                angular.element('.user_img').css("background-color",PhotoColor.color8);
                angular.element('.user_img').attr("data-color", PhotoColor.color8);
                angular.element('.user_img').data("color", PhotoColor.color8);
                break;
            case 9:
                angular.element('.user_img').css("background-color",PhotoColor.color9);
                angular.element('.user_img').attr("data-color", PhotoColor.color9);
                angular.element('.user_img').data("color", PhotoColor.color9);
                break;
            case 10:
                angular.element('.user_img').css("background-color",PhotoColor.color10);
                angular.element('.user_img').attr("data-color", PhotoColor.color10);
                angular.element('.user_img').data("color", PhotoColor.color10);
                break;
        };
    };
    // #endregion
    // #region 綁定Email
    $scope.BindAccountChange = function () {
        // 綁定抹除Email 和 Password是要在這個Email沒有重複情況下
        if ($scope.MemberManage.Detail.BindEmail && !$scope.MemberManage.Detail.Duplicate)
        {
            // 綁定
            $scope.MemberManage.Detail.Email = "";
            $scope.MemberManage.Detail.Password = "";
        }
        
    };
    // #endregion
    // #region 設定在職
    $scope.Setwork = function () {
        SettingWork();
    };
    // #endregion
    // #region 設定離職
    $scope.Setresign = function () {
        SettingLeave();
    };
    // #endregion
    // #region 在職方法
    function SettingWork() {
        $scope.MemberManage.Detail.WorkClass = "btn btn-sm active";
        $scope.MemberManage.Detail.ResignClass = "btn btn-sm";
        $scope.MemberManage.Detail.IsWork = true;
    };
    // #endregion
    // #region 離職方法
    function SettingLeave() {
        $scope.MemberManage.Detail.WorkClass = "btn btn-sm";
        $scope.MemberManage.Detail.ResignClass = "btn btn-sm use_off";
        $scope.MemberManage.Detail.IsWork = false;
    };
    // #endregion
    // #region 檢驗失敗樣是改變及訊息通知
    function ValidateFail(msg) {
        $scope.MemberManage.Detail.CreateValidate = false;
        $scope.MemberManage.Detail.Msg = msg;
        $scope.MemberManage.Detail.ShowMsg = true;
    };
    // #endregion
    // #region 檢驗成功
    function ValidateSuccess() {
        $scope.MemberManage.Detail.CreateValidate = true;
        $scope.MemberManage.Detail.Msg = "";
        $scope.MemberManage.Detail.ShowMsg = false;
    };
    // #endregion
    // #region 點擊上傳照片
    $scope.UploadImg = function () {
        $('#MemberImg').trigger("click");
    };
    // #endregion
    // #region 呼叫上傳圖片
    $scope.UploadMemberImg = function (data) {
        var fm = new FormData();
        var file = document.getElementById("MemberImg").files[0];
        fm.append("file", file);
        fm.append("UserID", $scope.MemberManage.Detail.MemberID);
        fm.append("CompId", _CompID);
        GetBackendData.uploadMemberImg(fm)
          .then(function (result) {
              var d = new Date();
              $scope.MemberManage.Detail.MemberImg = "/Backend/getUserImg/?UserID=" + $scope.MemberManage.Detail.MemberID + "&t=" + d.getTime();
              //取完照片後，清除大頭貼姓名
              angular.element(".img_name").css("display", "none");
          });
    };
    // #endregion
    // #region 將新增的成員塞入Array
    function InsertMember()
    {
        var item = ({
            DepName: $filter('filter')($scope.MemberManage.DepList,{DeptID: $scope.MemberManage.Detail.CurrentDept.DeptID}, true)[0].DeptName,
            DeptID: $scope.MemberManage.Detail.CurrentDept.DeptID,
            Discussions: $filter('filter')($scope.MemberManage.DiscList, {Check:true}, true),
            Email: $scope.MemberManage.Detail.Email,
            FirstName: $scope.MemberManage.Detail.FirstName,
            FullName: $scope.MemberManage.Detail.LastName + $scope.MemberManage.Detail.FirstName,
            ImgColor: $scope.MemberManage.Detail.ImgColor,
            ImgName: $scope.MemberManage.Detail.Imgname,
            IsActive: $scope.MemberManage.Detail.IsWork,
            LastName: $scope.MemberManage.Detail.LastName,
            MemberID: $scope.MemberManage.Detail.MemberID,
            Password: $scope.MemberManage.Detail.Password,
            Phone: null,
            Photo: $('#MemberImg[type=file]')[0].files[0] == undefined ? null:"",
            PhotoByte: null
        });
        $scope.MemberManage.AllUserList.push(item);
    };
    // #endregion
    // #region 將更新人員資料進行改變
    function ModifyMember() {
        var item = ({
            DepName: $filter('filter')($scope.MemberManage.DepList, { DeptID: $scope.MemberManage.Detail.CurrentDept.DeptID }, true)[0].DeptName,
            DeptID: $scope.MemberManage.Detail.CurrentDept.DeptID,
            Discussions: $filter('filter')($scope.MemberManage.DiscList, { Check: true }, true),
            Email: $scope.MemberManage.Detail.Email,
            FirstName: $scope.MemberManage.Detail.FirstName,
            FullName: $scope.MemberManage.Detail.LastName + $scope.MemberManage.Detail.FirstName,
            ImgColor: $scope.MemberManage.Detail.ImgColor,
            ImgName: $scope.MemberManage.Detail.Imgname,
            IsActive: $scope.MemberManage.Detail.IsWork,
            LastName: $scope.MemberManage.Detail.LastName,
            MemberID: $scope.MemberManage.Detail.MemberID,
            Password: $scope.MemberManage.Detail.Password,
            Phone: null,
            Photo: $('#MemberImg[type=file]')[0].files[0] == undefined ? null : "",
            PhotoByte: null
        });
        var _OldItem = $filter('filter')($scope.MemberManage.AllUserList, { MemberID: $scope.MemberManage.Detail.MemberID }, true)[0];
        var _OldDept = _OldItem.DeptID;
        var _NewDept = $scope.MemberManage.Detail.CurrentDept.DeptID;
        // 改變部門
        if (_OldDept != _NewDept)
        {
            $filter('filter')($scope.MemberManage.DepList, { DeptID: _OldDept }, true)[0].MemberCount -= 1;
            $filter('filter')($scope.MemberManage.DepList, { DeptID: _NewDept }, true)[0].MemberCount += 1;
        }
        // 離職變成在職狀態
        if ($scope.MemberManage.Detail.IsWork == true && _OldItem.IsActive == false)
        {
            $filter('filter')($scope.MemberManage.DepList, { DeptID: _NewDept }, true)[0].MemberCount += 1;
            $scope.MemberManage.LeaveCount -= 1;
        }
        // 在職變成離職狀態
        if ($scope.MemberManage.Detail.IsWork == false && _OldItem.IsActive == true)
        {
            $filter('filter')($scope.MemberManage.DepList, { DeptID: _NewDept }, true)[0].MemberCount -= 1;
            $scope.MemberManage.LeaveCount += 1;
        }
        // 更換Alluser的資料
        var _OldIndex = $scope.MemberManage.AllUserList.indexOf(_OldItem);
        $scope.MemberManage.AllUserList.splice(_OldIndex, 1);
        $scope.MemberManage.AllUserList.unshift(item);
        // 離職狀態刷新Grid
        if ($scope.MemberManage.Detail.IsWork == false)
        {
            var allParameters = angular.element("#AllmemberGrid").jqGrid("getGridParam");
            allParameters.data = $filter('filter')($scope.MemberManage.AllUserList, {IsActive: false}, true);
            angular.element("#AllmemberGrid").setGridParam({ datatype: 'local' }).trigger('reloadGrid');
            $scope.MemberManage.IsAllDepList = false;
            $scope.MemberManage.CurrentDeptName = $filter('translate')('FormerEmployee');
        }
        // 在職狀態刷新Grid
        if ($scope.MemberManage.Detail.IsWork == true)
        {
            var allParameters = angular.element("#AllmemberGrid").jqGrid("getGridParam");
            allParameters.data = $scope.MemberManage.AllUserList;
            angular.element("#AllmemberGrid").setGridParam({ datatype: 'local' }).trigger('reloadGrid');
            $scope.MemberManage.IsAllDepList = true;
        }
        angular.forEach($scope.MemberManage.DepList, function (value) {
            $filter('filter')($scope.MemberManage.DepList, { DeptID: value.DeptID }, true)[0].IsHide = false;
        });
        $scope.MemberManage.IsViewUserDetail = false;
        ChangeTabClass_Dept();
    };
    // #endregion
    // #region 偵測到Email發生改變
    $scope.TypeEmail = function () {
        var _EmailString = $scope.MemberManage.Detail.Email;
        if (angular.isDefined($scope.MemberManage.Detail.Email) && _EmailString.length > 5)
        {
            var _IsRegist = "";
            // 確認Email是否已經註冊過
            GetBackendData.CheckIsRegist(_EmailString)
                .then(function (result) {
                    _IsRegist = result.data.DataObj;
                    if (_IsRegist != "Null" && _IsRegist != "")
                    {
                        $scope.MemberManage.Detail.Duplicate = true;
                        $scope.MemberManage.Detail.Password = _IsRegist;
                    }
                    else {
                        if (_EmailString.indexOf("@") > 0) {
                            $scope.MemberManage.Detail.Password = 123 + _EmailString.substring(0, _EmailString.indexOf("@"));
                            $scope.MemberManage.Detail.BindEmail = false;
                            $scope.MemberManage.Detail.Duplicate = false;
                        }
                    }
                });
        }
    };
    // #endregion
    // #region 是否禁止輸入帳號
    $scope.IsDisableInput = function ()
    {
        var result = false;
        if($scope.MemberManage.Detail.Duplicate)
        {
            // 重複Email情況下
            result = true;
        }
        else
        {
            // 沒有重複Email情況下
            result = $scope.MemberManage.Detail.BindEmail == true ? true : false;
        }
        if (!$scope.MemberManage.Detail.IsNew)
        {
            result = true;
        }
        return result;
    };
    // #endregion
    // #region 是否禁止輸入密碼
    $scope.IsDisableInputPwd = function () {
        var result = false;
        if ($scope.MemberManage.Detail.Duplicate) {
            // 重複Email情況下
            result = true;
        }
        else {
            // 沒有重複Email情況下
            result = $scope.MemberManage.Detail.BindEmail == true ? true : false;
        }
        return result;
    };
    // #endregion
    // #region 刪除部門
    $scope.DeleteDept = function () {
        var _DeptID = $scope.MemberManage.CurrentDeptID;
        var _Msg = $filter('translate')('AreYouSure');
        if(confirm(_Msg) == true)
        {
            var Para = ({
                CompID: _CompID,
                DeptID: _DeptID,
                UserID: _UserID
            });
            GetBackendData.DelDept(Para)
                .then(function (result) {
                    if(result.data.IsSuccessful == true)
                    {
                        UpdateAllItem();
                        var _DeleteItem = $filter('filter')($scope.MemberManage.DepList, { DeptID: _DeptID }, true)[0];
                        var _DeleteIndex = $scope.MemberManage.DepList.indexOf(_DeleteItem);
                        $scope.MemberManage.DepList.splice(_DeleteIndex, 1);
                    }
                });
        }
    };
    // #endregion
    // #region 前往離職員工區域
    $scope.GotoLeaveArea = function () {
        // 所在區域為離職區
        $scope.MemberManage.IsLeaveArea = true;
        // 重置點擊的部門ID
        $scope.MemberManage.CurrentDeptID = "";
        // 點擊Tab切換Tab的動作
        ChangeTabClass_Dept();
        // 控制Tab標籤為部門名稱
        $scope.MemberManage.IsAllDepList = false;
        // 顯示Tab標籤為離職員工
        $scope.MemberManage.CurrentDeptName = $filter('translate')('FormerEmployee');
        // 清空關鍵字搜索
        $scope.MemberManage.SearchString = "";
        //關閉其他部門顯示
        var data = $filter('filter')($scope.MemberManage.DepList, { IsHide: true }, true);
        angular.forEach(data, function (value) {
            $filter('filter')($scope.MemberManage.DepList, { DeptID: value.DeptID }, true)[0].IsHide = false;
        });
        // 過濾出屬於目前的部門人員
        var _currentDepUser = $filter('filter')($scope.MemberManage.AllUserList, { IsActive: false }, true);
        // 觸發JqGrid更新動作
        var allParameters = angular.element("#AllmemberGrid").jqGrid("getGridParam");
        allParameters.data = _currentDepUser;
        angular.element("#AllmemberGrid").setGridParam({ datatype: 'local' }).trigger('reloadGrid');
    };
    // #endregion
    // #region 搜尋人員
    $scope.SearchMember = function () {
        var _currentUser = [];
        if ($scope.MemberManage.IsLeaveArea)
        {
            // 離職區
            var _currentUser = $filter('filter')($scope.MemberManage.AllUserList, { IsActive: false, $: $scope.MemberManage.SearchString });
        }
        else
        {
            // 非離職區
            var _currentUser = $filter('filter')($scope.MemberManage.AllUserList, { IsActive: true, $: $scope.MemberManage.SearchString });
        }
        var allParameters = angular.element("#AllmemberGrid").jqGrid("getGridParam");
        allParameters.data = _currentUser;
        angular.element("#AllmemberGrid").setGridParam({ datatype: 'local' }).trigger('reloadGrid');
    };
    // #endregion
    // #region 搜尋人員自動偵測值改變
    $scope.$watch("MemberManage.SearchString", function (newValue, oldValue)
    {
        if ($scope.MemberManage.AllUserList)
        {
            var _currentUser = [];
            if ($scope.MemberManage.IsLeaveArea) {
                // 離職區
                var _currentUser = $filter('filter')($scope.MemberManage.AllUserList, { IsActive: false,DeptID: $scope.MemberManage.CurrentDeptID , $: newValue });
            }
            else {
                // 非離職區
                var _currentUser = $filter('filter')($scope.MemberManage.AllUserList, { IsActive: true,DeptID: $scope.MemberManage.CurrentDeptID , $: newValue });
            }
            var allParameters = angular.element("#AllmemberGrid").jqGrid("getGridParam");
            allParameters.data = _currentUser;
            angular.element("#AllmemberGrid").setGridParam({ datatype: 'local' }).trigger('reloadGrid');
        }
    });
    // #endregion
    // #region 顯示綁定Email解釋的視窗
    $scope.HowSetEmail = function () {
        angular.element('#myModal').modal('toggle');
    };
    // #endregion
    // #reguin 決定是否顯示解碼的按鈕
    $scope.DecodePWD = function () {
        var BossID = "40a58714-e154-404c-a031-67713ff883df";
        if ($scope.IndexData.CurrentUser.UserID == BossID)
        {
            return true;
        }
        else
        {
            return false;
        }
    };
    // #endregion
    // #region 解碼
    $scope.Click_Decode = function () {
        $("#Password").attr("type", "text");
    };
    // #endregion


    // #region 接收填寫客服人員資料進行新增的廣播
    //$rootScope.$on(BackendGuide.EmitInsertSupport, function ()
    //{
    //    // 新增線上客服此部門
    //    var Para = ({
    //        CompID: _CompID,
    //        BossID: _UserID,
    //        DepartName: $filter('translate')('OnlineSupport')
    //    });
    //    GetBackendData.CreateDept(Para)
    //        .then(function (result) {
    //            console.log(result);
    //        });

    //    // 新增人員狀態
    //    $scope.MemberManage.Detail.IsNew = true;
    //    ChangeTabClass_User();
    //    // 設定客服人員資料
    //    $scope.MemberManage.Detail.LastName = BackendGuide.SupportInfo.LastName;
    //    $scope.MemberManage.Detail.FirstName = BackendGuide.SupportInfo.FirstName;

    //    // 決定頭像顏色
    //    random_color();
    //    angular.element(".user_img").attr("src", "");
    //    $scope.MemberManage.Detail.ImgColor = angular.element('.user_img').data("color");
    //    $scope.LastnameChange();

    //    $scope.MemberManage.Detail.Email = BackendGuide.SupportInfo.Email;
    //    $scope.MemberManage.Detail.Password = BackendGuide.SupportInfo.Password;
    //    $scope.MemberManage.Detail.CurrentDept = $scope.MemberManage.DepList[0];
    //    // 直接卻認為已經有註冊過的人員，封閉input
    //    $scope.MemberManage.Detail.Duplicate = true;
    //});
    // #endregion
}]);