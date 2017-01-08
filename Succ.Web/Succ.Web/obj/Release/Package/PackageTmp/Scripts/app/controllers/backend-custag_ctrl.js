SuccApp.controller('CusTag', ['$scope', '$filter', 'GetBackendData', '$rootScope', 'BackendGuide', function ($scope, $filter, GetBackendData, $rootScope, BackendGuide) {
    //解除畫面封鎖
    $.unblockUI();
    // #region 參數區域
    var _CompID = $scope.$parent.$parent.$parent.$parent.CurrentCompany['CompanyID'];
    var _UserID = $scope.$parent.$parent.$parent.$parent.IndexData.CurrentUser['UserID'];
    var _UserName = $scope.$parent.$parent.$parent.$parent.IndexData.CurrentUser['UserName'];
    $scope.TagManage = {};
    $scope.TagManage.CompID = _CompID;
    $scope.TagManage.UserID = _UserID;
    // Grid初始設定
    $scope.TagManage.TagConfig = {};
    // 預設對象標籤編輯狀態
    $scope.TagManage.Edit_CusTag_Val = "";
    $scope.TagManage.Edit_CusTag_ID = "";
    // 預設搜尋字串
    $scope.TagManage.SearchText = "";
    // 預設對象標籤新增數量
    $scope.TagManage.AddCount = 1;
    // 預設新增對象標籤物件
    $scope.TagManage.NewCusTag = [{
        'CountNum': 1,
        'SubjTagIdName': '',
        'CreatorName': _UserName
    }];
    // #endregion
    console.log($scope.TagManage.NewCusTag);
    GetCusTagList();
    // #region jqGrid自定義按鈕
    function editBtn(cellvalue, options, rowObject) {
        return "<button id='editSubjTag' class='btn btn-primary btn-sm' subjTagid=" + rowObject['SubjTagId'] + " subjTagName=" + rowObject['SubjTagIdName'] + ">" + $filter('translate')('Edit') + "</button>";
    }
    function IsableBtn(cellvalue, options, rowObject) {
        if (cellvalue) {
            return "<button id='IsableSubjTag' class='btn btn-warning btn-sm' data-value=" + cellvalue + " subjTagid=" + rowObject['SubjTagId'] + ">" + $filter('translate')('Disable') + "</button>";
        }
        else {
            return "<button id='IsableSubjTag' class='btn btn-success btn-sm' data-value=" + cellvalue + " subjTagid=" + rowObject['SubjTagId'] + ">" + $filter('translate')('Enable') + "</button>"
        }
    }
    // #endregion
    // #region 設定客戶標籤Config
    function GetCusTagList() {
        var ParentWidth = $("#CusTag_List").width();
        $scope.TagManage.TagConfig = {
            url: 'Backend/GetSubjTagList/?TagType=1&CompanyID=' + _CompID + '&search=false',
            datatype: 'json',
            colNames: [$filter('translate')('TagName'), $filter('translate')('Edit'), $filter('translate')('Enable') + "/" + $filter('translate')('Disable')],
            colModel: [
                { name: 'SubjTagIdName', width: ParentWidth * 0.6, sortable: false, stype: 'text', align: 'center' },
                { name: 'SubjTagId', width: ParentWidth * 0.19, search: false, editable: false, viewable: false, formatter: editBtn, align: 'center' },
                { name: 'IsActive', width: ParentWidth * 0.19, search: false, editable: false, viewable: false, formatter: IsableBtn, align: 'center' }
            ],
            rowNum: 10,
            ntype: 'Get',
            loadonce: false,
            rowList: [10, 20],
            pager: '#pager',
            sortorder: 'desc',
            shrinkToFit: false,
            autowidth: true,
            height: '100%',
            scrollOffset: 0
        }
    };
    // #endregion
    // #region 啟用與停用按紐
    $("#CusTag_List").delegate("#IsableSubjTag", "click", function () {
        var _IsAble = angular.element(this).attr("data-value");
        var _TagID = angular.element(this).attr("subjTagid");
        var Para = ({
            flag: _IsAble,
            TagID: _TagID
        });
        GetBackendData.SettingTagAble(Para)
            .then(function (result) {
                if(result.data == "true")
                {
                    var thisTag = angular.element("[id=IsableSubjTag][subjTagid=" + _TagID + "]");
                    var CurrentText = _IsAble == "true" ? $filter('translate')('Enable') : $filter('translate')('Disable');
                    angular.element(thisTag).text(CurrentText);
                    angular.element(thisTag).attr("class", _IsAble == "true" ? "btn btn-success btn-sm" : "btn btn-warning btn-sm");
                    angular.element(thisTag).attr("data-value", _IsAble == "true" ? "false" : "true");
                }
            });
    });
    // #endregion
    // #region 編輯按鈕
    $("#CusTag_List").delegate("#editSubjTag", "click", function () {
        var _TagID = angular.element(this).attr("subjTagid");
        var _TagName = angular.element(this).attr("subjTagName");
        $scope.TagManage.Edit_CusTag_Val = _TagName;
        $scope.TagManage.Edit_CusTag_ID = _TagID;
        $scope.$apply();
        $("#EditModal").modal('show');
    });
    // #endregion
    // #region 搜尋方法
    $scope.StartSearch = function () {
        var _SearchText = $scope.TagManage.SearchText;
        var _SearchURL = "Backend/GetSubjTagList/?TagType=1&CompanyID=" + _CompID + "&search=true&searchString=" + _SearchText;
        var allParameters = angular.element("#TagGrid").jqGrid("getGridParam");
        allParameters.url = _SearchURL;
        allParameters.page = 1;
        angular.element("#TagGrid").setGridParam({ datatype: 'json' }).trigger('reloadGrid');
    };
    // #endregion
    // #region 開啟新增客戶標籤視窗
    $scope.OpenAddTagView = function () {
        $scope.TagManage.AddCount = 1;
        $("#AddCusModal").modal('show');
    };
    // #endregion
    // #region 增加對象標籤項目
    $scope.AddCus = function () {
        $scope.TagManage.AddCount += 1;
        var contentLength = $scope.TagManage.AddCount;
        //限制一次最多新增10個
        if (contentLength > 10) {
            return;
        }
        var _Para = ({
            'CountNum': contentLength,
            'SubjTagIdName': '',
            'CreatorName': _UserName
        });
        $scope.TagManage.NewCusTag.push(_Para);
    };
    // #endregion
    // #region 呼叫新增對象標簽
    $scope.Store_CusTag = function () {
        var flag = true;
        angular.forEach($scope.TagManage.NewCusTag, function (val) {
            if (val.SubjTagIdName.length <= 0) {
                var _msg = $filter('translate')('Number') + val.CountNum + $filter('translate')('Count') + $filter('translate')('PleaseNotEmpty');
                alert(_msg);
                flag = false;
            }
        });
        if(flag)
        {
            var _Para = ({
                CompanyID: _CompID,
                UserID: _UserID,
                TagType: 1,
                SubjTagList: $scope.TagManage.NewCusTag
            });
            GetBackendData.CreateEventTag(_Para)
                .then(function (result) {
                    if(result.data.IsSuccess)
                    {
                        // 重複新增
                        var DisableString = "";
                        if (result.data.DisableList.length > 0) {
                            angular.forEach(result.data.DisableList, function (val) {
                                DisableString += val;
                            });
                            alert("以下標籤因重複新增，已為您取消新增動作:" + DisableString);
                        }
                        else
                        {
                            RefreshGrid();
                        }
                        $("#AddCusModal").modal('hide');
                        // Scroll Animation
                        $("body").animate({ scrollTop: 250 }, "slow");
                        // 恢復對象標籤新增的原始狀態
                        $scope.TagManage.NewCusTag = [{
                            'CountNum': 1,
                            'SubjTagIdName': '',
                            'CreatorName': _UserName
                        }];
                        // 廣播完成後台引導可以繼續
                        $rootScope.$emit(BackendGuide.EmitModify, false);
                    }
                });
        }
    };
    // #endregion
    // #region 呼叫編輯對象標籤
    $scope.Edit_CusTag = function () {
        if ($scope.TagManage.Edit_CusTag_Val.length > 1)
        {
            var _Para = ({
                CompID: _CompID,
                TagType: 0,
                TagID: $scope.TagManage.Edit_CusTag_ID,
                SubjTagName: $scope.TagManage.Edit_CusTag_Val
            });
            GetBackendData.EditEventTag(_Para)
                .then(function (result) {
                    if(result.data.IsSuccess)
                    {
                        // 重複新增
                        var DisableString = "";
                        if (result.data.DisableList.length > 0) {
                            angular.forEach(result.data.DisableList, function (val) {
                                DisableString += val;
                            });
                            alert("以下標籤因重複新增，已為您取消編輯動作:" + DisableString);
                        }
                        else {
                            RefreshGrid_Edit();
                        }
                        $("#EditModal").modal('hide');
                        // Scroll Animation
                        $("body").animate({ scrollTop: 250 }, "slow");
                    }
                });
        }
        else
        {

        }
    };
    // #endregion
    // #region 新增主題標簽使用刷新Grid方法
    function RefreshGrid() {
        var records = $("#TagGrid").jqGrid("getGridParam", "records");
        var totalNumber = parseInt(records) + 1;
        var total = Math.ceil(totalNumber / 10);
        var allParameters = angular.element("#TagGrid").jqGrid("getGridParam");
        allParameters.datatype = 'json';
        allParameters.page = total;
        angular.element("#TagGrid").setGridParam({ datatype: 'json' }).trigger('reloadGrid');
    };
    // #endregion
    // #region 編輯主題標簽使用刷新Grid方法
    function RefreshGrid_Edit() {
        var records = $("#TagGrid").jqGrid("getGridParam", "page");
        var allParameters = angular.element("#TagGrid").jqGrid("getGridParam");
        allParameters.datatype = 'json';
        allParameters.page = records;
        angular.element("#TagGrid").setGridParam({ datatype: 'json' }).trigger('reloadGrid');
    };
    // #endregion
    // #region 接收註冊時的特殊廣播事件
    $rootScope.$on(BackendGuide.EmitInsertCusTag, function () {
        var para = ({
            CompanyID: _CompID,
            UserID: _UserID
        });
        GetBackendData.GetmemberList(para)
            .success(function (result) {
                $scope.TagManage.NewCusTag = [];
                angular.forEach(result['UserList'], function (val, key) {
                    var _obj = {
                        'CountNum': $scope.TagManage.NewCusTag.length + 1,
                        'SubjTagIdName': val.FullName,
                        'CreatorName': _UserName,
                        'SortBy': 0
                    };
                    $scope.TagManage.NewCusTag.push(_obj);
                });
                // 補上一個其他的選項
                $scope.TagManage.NewCusTag.push({
                    'CountNum': $scope.TagManage.NewCusTag.length + 1,
                    'SubjTagIdName': $filter('translate')('Others'),
                    'CreatorName': _UserName,
                    'SortBy': 1
                });

            });
    });
    // #endregion
}]);
