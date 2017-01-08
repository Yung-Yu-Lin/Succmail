SuccApp.controller('DeptManage', ['$scope', 'GetBackendData', 'BackendGuide', '$rootScope', '$filter', function ($scope, GetBackendData, BackendGuide, $rootScope, $filter)
{
    // #region 參數區域
    var _CompID = $scope.$parent.$parent.$parent.$parent.CurrentCompany['CompanyID'];
    var _UserID = $scope.$parent.$parent.$parent.$parent.IndexData.CurrentUser['UserID'];
    // 初始頁面scope物件
    $scope.DeptManage = {}
    // Grid 列表資料
    $scope.DeptManage.GridData = [];
    // 建立部門後的訊息通知
    $scope.DeptManage.ShowDeptMsg = false;
    $scope.DeptManage.DeptMsg = "";
    $scope.DeptManage.DeptName = "";
    // #endregion
    // #region 拿取部門資料後，初始化Grid
    function InitDeptGrid() {
        GetBackendData.GetDeptListData(_CompID)
        .then(function (result) {
            $scope.DeptManage.GridData = result.data;
            InitGrid();
            // #region 刪除部門的按鈕
            $("#DeptGrid").delegate("#DeleteDeptBtn1", "click", function () {
                var _Msg = $filter('translate')('AreYouSure');
                var _DeptID = angular.element(this).attr("DeptID");
                if (confirm(_Msg) == true) {
                    var Para = ({
                        CompID: _CompID,
                        DeptID: _DeptID,
                        UserID: _UserID
                    });
                    GetBackendData.DelDept(Para)
                        .success(function (result) {
                            if (result.IsSuccessful) {
                                var _DeleteItem = $filter('filter')($scope.DeptManage.GridData, { DeptID: _DeptID }, true)[0];
                                var _DeleteIndex = $scope.DeptManage.GridData.indexOf(_DeleteItem);
                                $scope.DeptManage.GridData.splice(_DeleteIndex, 1);
                                // 觸發JqGrid更新動作
                                var allParameters = angular.element("#DeptGrid").jqGrid("getGridParam");
                                allParameters.data = $scope.DeptManage.GridData;
                                angular.element("#DeptGrid").setGridParam({ datatype: 'local' }).trigger('reloadGrid');
                            }
                        });
                }
            });
            // #endregion
        });
    };
    // #endregion
    InitDeptGrid();
    // #region 刪除部門 jqGrid自訂義按鈕
    function DeleteBtn(cellvalue, options, rowObject) {
        var _CompID = rowObject['CompID'];
        var _DeptID = rowObject['DeptID'];
        var _Style = "";
        if (_CompID == _DeptID)
        {
            _Style = "display:none;";
        }
        return "<button id='DeleteDeptBtn1' style='"+ _Style +"' class='w3-btn w3-ripple w3-red' CompID=" + _CompID + " DeptID=" + _DeptID + ">" + $filter('translate')('DeleteDepart') + "</button>";
    };
    // #endregion
    // #region 呼叫初始化Grid的服務
    function InitGrid() {
        console.log("Grid 資料初始化:");
        console.log($scope.DeptManage.GridData);
        $scope.DeptManage.deptconfig = {
            data: $scope.DeptManage.GridData,
            datatype: "local",
            colNames: ["部門名稱", "建立時間", "成員數量", "刪除動作"],
            colModel: [
                { name: 'DeptName', sortable: false, stype: 'text', align: 'center', width: 200},
                { name: 'ShowDate', sortable: false, align: 'center', width: 200},
                { name: 'MemberCount', sortable: false, align: 'center', width: 155},
                { name: 'DeptID', search: false, viewable: false, formatter: DeleteBtn, align: 'center', width: 200 }
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
            scrollOffset: 0
        }
    };
    // #endregion
    // #region 開啟建立部門視窗
    $scope.OpenNewDeptView = function () {
        $scope.DeptManage.ShowDeptMsg = false;
        $("#myModal").modal("toggle");
        // 還原新增討論組頁面資料
        $scope.DeptManage.DeptName = "";
        $scope.DeptManage.DeptMsg = "";
    };
    // #endregion
    // #region 開始新增部門
    $scope.CreateDept = function () {
        var _DeptName = $scope.DeptManage.DeptName;
        if (_DeptName.length <= 0) {
            // 無新增部門名稱
            $scope.DeptManage.ShowDeptMsg = true;
            $scope.DeptManage.DeptMsg = $filter('translate')('TypeDeptName');
        }
        else {
            $scope.DeptManage.DeptMsg = "";
            $scope.DeptManage.ShowDeptMsg = false;
            var Para = ({
                CompID: _CompID,
                BossID: _UserID,
                DepartName: _DeptName
            });
            GetBackendData.CreateDept(Para)
                .then(function (result) {
                    var _DeptData = result.data.DataObj;
                    RefreshFrid(_DeptData);
                    $scope.DeptManage.DeptName = "";
                    $("#myModal").modal('hide');
                    // 廣播完成後台引導可以繼續
                    $rootScope.$emit(BackendGuide.EmitModify, false);
                });
        }
    };
    // #endregion
    // #region 重新整理Grid
    function RefreshFrid(Data)
    {
        var d = new Date();
        var DateString = d.getFullYear() + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + d.getDate();
        var _DeptObj = ({
            DeptID: Data.DepartID,
            DeptName: Data.DepartName,
            ShowDate: DateString,
            MemberCount: 0
        });
        $scope.DeptManage.GridData.unshift(_DeptObj);
        // 觸發JqGrid更新動作
        var allParameters = angular.element("#DeptGrid").jqGrid("getGridParam");
        allParameters.data = $scope.DeptManage.GridData;
        angular.element("#DeptGrid").setGridParam({ datatype: 'local' }).trigger('reloadGrid');
    };
    // #endregion
}]);