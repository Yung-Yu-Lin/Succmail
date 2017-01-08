SuccApp.controller('EventTag', ['$scope', 'GetBackendData', '$filter', 'DefaultTag', '$rootScope', 'BackendGuide', function ($scope, GetBackendData, $filter, DefaultTag, $rootScope, BackendGuide) {
    //解除畫面封鎖
    $.unblockUI();
    // #region 參數區域
    var _CompID = $scope.$parent.$parent.$parent.$parent.CurrentCompany['CompanyID'];
    var _UserID = $scope.$parent.$parent.$parent.$parent.IndexData.CurrentUser['UserID'];
    var _UserName = $scope.$parent.$parent.$parent.$parent.IndexData.CurrentUser['UserName'];
    $scope.TagManage = {};
    $scope.TagManage.CompID = _CompID;
    $scope.TagManage.UserID = _UserID;
    $scope.TagManage.TagConfig = {};
    // 預設搜尋字AddEvent串
    $scope.TagManage.SearchText = "";
    // 預設主題標簽新增數量
    $scope.TagManage.AddCount = 1;
    // 預設新增主題標簽物件
    $scope.TagManage.NewEventTag = [{
        'CountNum': 1,
        'SubjTagIdName': '',
        'CreatorName': _UserName
    }];
    // 預設主題標簽編輯狀態
    $scope.TagManage.Edit_EventTag_Val = "";
    $scope.TagManage.Edit_EventTag_ID = "";
    // 給值預設主題標簽
    $scope.TagManage.DefaultEvent_Tag = [];
    // #endregion
    GetEventTagList();
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
    // #region 設定主題標簽Config
    function GetEventTagList() {
        var ParentWidth = $("#EventTag_List").width();
        $scope.TagManage.TagConfig = {
            url: 'Backend/GetSubjTagList/?TagType=0&CompanyID=' + _CompID + '&search=false',
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
            sortname: 'SortBy',
            sortorder: 'desc',
            shrinkToFit: false,
            autowidth: true,
            height: '100%',
            scrollOffset: 0
        }
    };
    // #endregion
    // #region 啟用與停用按紐
    $("#EventTag_List").delegate("#IsableSubjTag", "click", function () {
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
    $("#EventTag_List").delegate("#editSubjTag", "click", function () {
        var _TagID = angular.element(this).attr("subjTagid");
        var _TagName = angular.element(this).attr("subjTagName");
        $scope.TagManage.Edit_EventTag_Val = _TagName;
        $scope.TagManage.Edit_EventTag_ID = _TagID;
        $scope.$apply();
        $("#EditModal").modal('show');
    });
    // #endregion
    // #region 搜尋方法
    $scope.StartSearch = function () {
        var _SearchText = $scope.TagManage.SearchText;
        var _SearchURL = "Backend/GetSubjTagList/?TagType=0&CompanyID=" + _CompID + "&search=true&searchString=" + _SearchText;
        var allParameters = angular.element("#TagGrid").jqGrid("getGridParam");
        allParameters.url = _SearchURL;
        allParameters.page = 1;
        angular.element("#TagGrid").setGridParam({ datatype: 'json' }).trigger('reloadGrid');
    };
    // #endregion
    // #region 開啟新增標籤視窗 
    $scope.OpenAddTagView = function () {
        $scope.TagManage.AddCount = 1;
        $scope.TagManage.NewEventTag = [{
            'CountNum': 1,
            'SubjTagIdName': '',
            'CreatorName': _UserName
        }];
        $("#AddModal").modal('show');
    };
    // #endregion
    // #region 增加主題標籤
    $scope.AddEvent = function() {
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
        $scope.TagManage.NewEventTag.push(_Para);
    };
    // #endregion
    // #region 呼叫新增主題標簽
    $scope.Store_EventTag = function () {
        var flag = true;
        angular.forEach($scope.TagManage.NewEventTag, function (val) {
            if(val.SubjTagIdName.length <= 0)
            {
                var _msg = $filter('translate')('Number') + val.CountNum + $filter('translate')('Count') + $filter('translate')('PleaseNotEmpty');
                alert(_msg);
                flag = false;
            }
        });
        if (flag)
        {
            var _Para = ({
                CompanyID: _CompID,
                UserID: _UserID,
                TagType: 0,
                SubjTagList: $scope.TagManage.NewEventTag
            });
            GetBackendData.CreateEventTag(_Para)
                .then(function (result) {
                    if(result.data.IsSuccess)
                    {
                        // 重複新增
                        var DisableString = "";
                        if (result.data.DisableList.length > 0)
                        {
                            angular.forEach(result.data.DisableList, function (val) {
                                DisableString += val;
                            });
                            alert("以下標籤因重複新增，已為您取消新增動作:" + DisableString);
                        }
                        else
                        {
                            RefreshGrid();
                        }
                        $("#AddModal").modal('hide');
                        // Scroll Animation
                        $("body").animate({ scrollTop: 250 }, "slow");
                    }
                });
        }
    };
    // #endregion
    // #region 呼叫編輯主題標簽
    $scope.Edit_EventTag = function () {
        if($scope.TagManage.Edit_EventTag_Val.length > 1)
        {
            var _Para = ({
                CompID: _CompID,
                TagType: 0,
                TagID: $scope.TagManage.Edit_EventTag_ID,
                SubjTagName: $scope.TagManage.Edit_EventTag_Val
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
                        else
                        {
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
            var _msg = $filter('translate')('PleaseNotEmpty');
            alert(_msg);
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
    // #region 開啟預設標籤View
    $scope.OpenDefaultTagView = function () {
        $scope.TagManage.DefaultEvent_Tag = DefaultTag.EventTag
        $("#DefaultModal").modal('show');
    };
    // #endregion
    // #region 儲存預設主題標簽
    $scope.Store_DefaultTag = function () {
        var _SelectedDefault = $filter('filter')($scope.TagManage.DefaultEvent_Tag, { IsCheck: true }, true);
        var _DefaultList = [];
        // #region 繞迴圈準備儲存的資料
        angular.forEach(_SelectedDefault, function (val) {
            _DefaultList.push({ 'SubjTagIdName': val.TagName, 'CreatorName': _UserName, 'SortBy': val.SortBy });
        });
        // #endregion
        // #region 參數
        var _Para = ({
            CompanyID: _CompID,
            UserID: _UserID,
            TagType: 0,
            SubjTagList: _DefaultList,
        });
        // #endregion
        // #region 呼叫Service儲存預設標籤
        GetBackendData.CreateEventTag(_Para)
        .then(function (result) {
            if (result.data.IsSuccess) {
                // 重複新增
                var DisableString = "";
                if (result.data.DisableList.length > 0) {
                    angular.forEach(result.data.DisableList, function (val) {
                        var varString = " " + val;
                        DisableString += varString;
                    });
                    alert("以下標籤因重複新增，已為您取消新增動作:" + DisableString);
                }
                else {
                    // 廣播完成後台引導可以繼續
                    $rootScope.$emit(BackendGuide.EmitModify, false);
                    RefreshGrid();
                }
                $("#DefaultModal").modal('hide');
                // Scroll Animation
                $("body").animate({ scrollTop: 250 }, "slow");
            }
        });
        // #endregion
    };
    // #endregion
    // #region 註冊時接收廣播，鎖死預設的其他標籤
    $rootScope.$on(BackendGuide.EmitDefaultEventTag, function ()
    {
        $filter('filter')(DefaultTag.EventTag, { ID: 1 }, true)[0].IsCheck = true;
        $filter('filter')(DefaultTag.EventTag, { ID: 1 }, true)[0].Default = true;
        $filter('filter')(DefaultTag.EventTag, { ID: 1 }, true)[0].SortBy = 1;
    });
    // #endregion
}]);