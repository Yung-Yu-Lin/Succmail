SuccApp.directive('backendguide', ['$rootScope', 'BackendGuide', 'GetBackendData', '$filter', '$timeout', function ($rootScope, BackendGuide, GetBackendData, $filter, $timeout)
{
    // #region scope物件的初始化
    function InitGuideTemplate(scope) {
        // 箭頭是否顯示的初始化
        scope.UserGuide.IsShowArrow1 = false;
        scope.UserGuide.IsShowArrow2 = false;
        scope.UserGuide.IsShowArrow3 = false;
        scope.UserGuide.IsShowArrow4 = false;
        // 箭頭的樣式的初始化
        scope.UserGuide.Arrow1Style = {};
        scope.UserGuide.Arrow2Style = {};
        scope.UserGuide.Arrow3Style = {};
        scope.UserGuide.Arrow4Style = {};
        // 放置解說內容樣式的初始化
        scope.UserGuide.ContentStyle = {};
        // 初始化按鈕可以點擊
        scope.UserGuide.IsableToNext = false;
        // 一般下一步按鈕狀態
        scope.UserGuide.Normal = true;
    };
    // #endregion
    // #region 依據象限決定顯示哪一個箭頭
    function ShowIndicator(scope ,_IsLargerWidth, _IsLargerHeight) {
        scope.UserGuide.IsShowArrow1 = (_IsLargerWidth == false && _IsLargerHeight == true) ? true : false;
        scope.UserGuide.IsShowArrow2 = (_IsLargerWidth == true && _IsLargerHeight == true) ? true : false;
        scope.UserGuide.IsShowArrow3 = (_IsLargerWidth == false && _IsLargerHeight == false) ? true : false;
        scope.UserGuide.IsShowArrow4 = (_IsLargerWidth == true && _IsLargerHeight == false) ? true : false;
    };
    // #endregion
    // #region 定位箭頭位置
    function DirectionOfArrow(scope , _ArrowNumber, _elementLeft, _elementTop, _elementWidth, _elementHeight, _documentWidth, _documentHeight) {
        var _ArrowWidth = 110;
        var _ArrowHeight = 110;
        switch (_ArrowNumber) {
            case 1:
                scope.UserGuide.Arrow1Style = { "left": _elementLeft + _ArrowWidth + "px", "top": _elementTop + _ArrowHeight + "px" };
                // 解說內容樣式的移動
                scope.UserGuide.ContentStyle = { "left": "0", "top": _documentHeight - (Math.floor(_documentHeight*0.5)) + "px" };
                break;
            case 2:
                scope.UserGuide.Arrow2Style = { "left": _elementLeft - _ArrowWidth + "px", "top": _elementTop + _ArrowHeight + "px" };
                // 解說內容樣式的移動
                scope.UserGuide.ContentStyle = { "left": _documentWidth - (Math.floor(_documentWidth*0.4)) + "px", "top": _documentHeight - (Math.floor(_documentHeight*0.5)) };
                break;
            case 3:
                scope.UserGuide.Arrow3Style = { "left": _elementLeft + _ArrowWidth + "px", "top": _elementTop - _ArrowHeight + "px" };
                // 解說內容樣式的移動
                scope.UserGuide.ContentStyle = { "left": _documentWidth - (Math.floor(_documentWidth * 0.4)) + "px", "top": "0" };
                break;
            case 4:
                scope.UserGuide.Arrow4Style = { "left": _elementLeft - _ArrowWidth + "px", "top": _elementTop - _ArrowHeight + "px" };
                // 解說內容樣式的移動
                scope.UserGuide.ContentStyle = { "left": _documentWidth - (Math.floor(_documentWidth*0.4)) + "px", "top": "0" };
                break;
            default:
                break;
        }
    };
    // #endregion
    // #region link 方法實際執行
    var linker = function (_scope, _stepInfo)
    {
        // 選擇當下步驟物件物件
        var _StepObj = $filter('filter')(BackendGuide.Step, { '_no': _stepInfo['RegistStep'] }, true)[0];
        var _SelectDom = _StepObj._element[0];
        if(!_stepInfo['IsFinish'])
        {
            // 尚未完成註冊步驟
            // 黑屏預設style string
            _scope.blackpad_css = { "display": "block" };
            // 呼叫初始化方法
            InitGuideTemplate(_scope);
            // 可視範圍寬度
            var _documentWidth = document.body.offsetWidth;
            // 可視範圍高度
            var _documentHeight = document.documentElement.clientHeight;
            // 物件寬度
            var _elementWidth = angular.element(_SelectDom).prop("offsetWidth");
            // 物件高度
            var _elementHeight = angular.element(_SelectDom).prop("offsetHeight");
            // 物件離上距離
            var _elementTop = angular.element(_SelectDom).prop("offsetTop");
            // 物件離左距離
            var _elementLeft = angular.element(_SelectDom).prop("offsetLeft");
            // 計算物件位於哪一個象限
            var _targerHeight = (_elementTop + _elementHeight / 2) < _documentHeight / 2 ? true : false;
            var _targetWidth = (_elementLeft + _elementWidth / 2) > _documentWidth / 2 ? true : false;
            // 綁定要顯示的標題與內容
            _scope.UserGuide.GuideTitle = _StepObj._title;
            _scope.UserGuide.GuideContent = _StepObj._content;
            // 根據象限位置，決定箭頭方向
            ShowIndicator(_scope, _targetWidth, _targerHeight);
            // 顯示導引內容頁
            _scope.mainstyle = { "display": "block" };
            // 定位箭頭位置
            angular.forEach([_scope.UserGuide.IsShowArrow1, _scope.UserGuide.IsShowArrow2, _scope.UserGuide.IsShowArrow3, _scope.UserGuide.IsShowArrow4], function (value, key)
            {
                if(value)
                {
                    DirectionOfArrow(_scope, (key + 1), _elementLeft, _elementTop, _elementWidth, _elementHeight, _documentWidth, _documentHeight);
                }
            });
            // 顯示要操作的DOM
            angular.forEach(_StepObj._element, function (value, key)
            {
                angular.element(value).addClass("lightDOM");
            });
            // 向下滑動使物件置中
            var _elementCentral = _elementTop + _elementHeight / 2;
            var _documentCentral = _documentHeight / 2;
            var _scrollDistance = 0;
            if (_documentCentral < _elementCentral)
            {
                _scrollDistance = _elementTop / 2;
            }
            else
            {
                _scrollDistance = _documentCentral + (_documentCentral - _elementTop) / 2;
            }
            $("html, body").stop().animate({ scrollTop: Math.abs(_scrollDistance)/2 }, '500', 'swing');
        }
        else {
            // 完成註冊步驟
            _scope.mainstyle = { "display": "none" };
        }
    };
    // #endregion
    // #region 隱藏引導前一個引導畫面的方法
    function HidePrevious(_scope, _currentInfo) {
        var _CurrentStepObj = $filter('filter')(BackendGuide.Step, { '_no': _currentInfo['RegistStep'] }, true)[0];
        // 移除要顯示的標題與內容
        _scope.UserGuide.GuideTitle = "";
        _scope.UserGuide.GuideContent = "";
        // 四個箭頭都關閉
        _scope.UserGuide.IsShowArrow1 = false;
        _scope.UserGuide.IsShowArrow2 = false;
        _scope.UserGuide.IsShowArrow3 = false;
        _scope.UserGuide.IsShowArrow4 = false;
        // 四個箭頭樣式重置
        _scope.UserGuide.Arrow1Style = {};
        _scope.UserGuide.Arrow2Style = {};
        _scope.UserGuide.Arrow3Style = {};
        _scope.UserGuide.Arrow4Style = {};
        // 解說內容樣式重置
        _scope.UserGuide.ContentStyle = {};
        // 隱藏要操作的DOM
        angular.forEach(_CurrentStepObj._element, function (value, key) {
            angular.element(value).removeClass("lightDOM");
        });
        // 隱藏註冊引導步驟內容
        _scope.UserGuide.ContentStyle = { "display": "none" };
    };
    // #endregion
    // #region 呼叫linker方法前，取得實際執行步驟及constant的物件
    function GetConstantObj(_scope, _stepInfo) {
        var _StepObj = $filter('filter')(BackendGuide.Step, { '_no': _stepInfo['RegistStep'] }, true)[0];
        // 指向目前註冊步驟給scope
        _scope.UserGuide.CurrentStepInfo = _stepInfo;
        // 檢測目前要前往的導引是否需要轉頁
        if (_StepObj._IsChangePage)
        {
            ApplyPageBroadcast(_StepObj._PageName);
        }
        angular.element(_StepObj._element[0]).ready(function () {
            // 為什麼利用timeout 請參考 http://blog.brunoscopelliti.com/run-a-directive-after-the-dom-has-finished-rendering/
            $timeout(function () {
                linker(_scope, _stepInfo);
                console.log("步驟:");
                console.log(_StepObj._no);
                // 引為linker裡面包含init 事件，因而此步驟放置在後，檢測此步驟是否需要封鎖下一步按鈕
                if (_StepObj._IsDisableBtn) {
                    _scope.UserGuide.IsableToNext = true;
                }
                // 第四步 討論組隱藏收件人及指定收件人畫面
                if (_StepObj._no == 3 || _StepObj._no == 4 || _StepObj._no == 5) {
                    DisableDiscReceiver();
                }
                // 第六步 在底層直接新增客服部門和客服人員
                if (_StepObj._no == 6) {
                    DisableDiscReceiver();
                    AddSupportDept(_scope);
                }
                // 第八步 畫面特殊操作(避免妨礙到人員新增)
                if(_StepObj._no == 8){
                    _scope.UserGuide.ContentStyle = { "float": "left" };
                }
                // 第十步 在底層把預設事件標籤鎖死
                if (_StepObj._no == 10){
                    SettingDefaultTag();
                }
                // 第十一步 新增對象標籤，廣播對象標籤加入預設標籤
                if(_StepObj._no == 11)
                {
                    AddCusTag();
                }
                // 完成步驟前，將按鈕置換成開始使用按鈕
                if (_StepObj._no == 13) {
                    _scope.UserGuide.Normal = false;
                }
            }, 1500);
        });
    };
    // #endregion
    // #region 解除畫面
    function ClearGuide(_scope)
    {
        _scope.mainstyle = { "display": "none" };
        _scope.blackpad_css = { "display": "none" };
    };
    // #endregion
    // #region 呼叫導頁方法的廣播
    function ApplyPageBroadcast(Pagetype) {
        $rootScope.$emit(BackendGuide.EmitDirectPage, Pagetype);
    };
    // #endregion
    // #region 下一步的方法
    function ToNextGuide(_scope)
    {
        var _currentInfo = _scope.UserGuide.CurrentStepInfo;
        // 隱藏先前的引導部分
        HidePrevious(_scope, _currentInfo);
        // 顯示下一個應該要顯示的引導
        if((_currentInfo.RegistStep + 1) > _currentInfo.FinishStep)
        {
            // 不可以在顯示下一步的按鈕
        }
        else
        {
            // 繼續執行下一步
            _scope.UserGuide.CurrentStepInfo['RegistStep'] += 1;
            // 呼叫更新RegistStep的Factory
            GetBackendData.UpdateRegistStep(_scope.compid, _scope.userid, _scope.UserGuide.CurrentStepInfo['RegistStep'])
            .then(function (result) {
                if (result.data.IsSuccessful)
                {
                    var _stepInfo = result.data.DataObj;
                    // 前往預備呼叫linker動作
                    GetConstantObj(_scope, _stepInfo);
                }
            });
        }
    };
    // #endregion
    // #region 第四步的事件 隱藏討論組管理收件人的畫面
    function DisableDiscReceiver() {
        $rootScope.$emit(BackendGuide.EmitDisableDiscReceiver);
    };
    // #endregion
    // #region 第六步的事件 直接新增線上客服部門和客服人員
    function AddSupportDept(_scope) {
        $rootScope.$broadcast(BackendGuide.EmitInsertSupport);
    };
    // #endregion
    // #region 第十步的事件 鎖死事件預設的標籤
    function SettingDefaultTag() {
        $rootScope.$emit(BackendGuide.EmitDefaultEventTag);
    };
    // #endregion
    // #region 第十一步的事件 新增對象標籤特殊事件
    function AddCusTag() {
        $rootScope.$emit(BackendGuide.EmitInsertCusTag);
    };
    // #endregion
    // #region 完成註冊導覽步驟
    function FinishGuide(_scope) {
        _scope.mainstyle = { "display": "none" };
        _scope.blackpad_css = { "display": "none" };
        _scope.UserGuide.CurrentStepInfo['RegistStep'] += 1;
        GetBackendData.UpdateRegistStep(_scope.compid, _scope.userid, _scope.UserGuide.CurrentStepInfo['RegistStep'])
            .then(function (result) {
                if (result.data.IsSuccessful) {
                    window.location.href = "/mybox";
                }
            });
    };
    // #endregion
    return {
        restrict: "A",
        templateUrl: "/Backend/BackendGuide",
        scope: {
            compid: '=',
            userid: '=',
            isstart: '=',
            mainstyle: '='
        },
        link: function (scope, element, attrs)
        {
            // 放置使用者導引的物件
            scope.UserGuide = {};
            // 取得目前註冊引導進行到哪一個步驟
            $timeout(function () {
                GetBackendData.GetRegistStep(scope.compid, scope.userid)
                .then(function (result) {
                    var _stepInfo = result.data.DataObj;
                    // 前往預備呼叫linker動作
                    if (!_stepInfo.IsFinish)
                    {
                        if (location.pathname != "/manager") {
                            location.href = "/manager";
                        }
                        GetConstantObj(scope, _stepInfo);
                    }
                });
            });
            // 下一步的方法
            scope.ToNextGuide = function () {
                ToNextGuide(scope);
            };
            // 解除畫面的方法
            scope.ClearGuide = function () {
                ClearGuide(scope);
            };
            // 完成註冊的方法
            scope.FinishGuide = function () {
                FinishGuide(scope);
            };
            // 接聽當有值改變或關閉改變時，針對按鈕要做的動作
            $rootScope.$on(BackendGuide.EmitModify, function (event, data) {
                // 解除要傳入false
                scope.UserGuide.IsableToNext = data;
            });
        }
    };
}]);