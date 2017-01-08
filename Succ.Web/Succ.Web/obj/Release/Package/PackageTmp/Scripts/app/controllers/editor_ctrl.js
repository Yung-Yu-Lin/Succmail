SuccApp.controller('EditorCtrl', ['GetBackendData', '$scope', 'FileUploader', '$log', 'AttatchService', 'ImageService', 'filterFilter', '$filter', '$rootScope', 'AddNewMessageService', 'DiscType', 'SubjectColor', '$timeout', 'SubjectEvent', 'Draft', '$interval', '$sce', '$http', 'EditorPara', 'AdminService', 'ReceiptsService', 'UniqueComp', 'Filesize_Conf', function (GetBackendData, $scope, FileUploader, $log, AttatchService, ImageService, filterFilter, $filter, $rootScope, AddNewMessageService, DiscType, SubjectColor, $timeout, SubjectEvent, Draft, $interval, $sce, $http, EditorPara, AdminService, ReceiptsService, UniqueComp, Filesize_Conf)
{
    //執行自動儲存草稿
    //tSettingInterval();
    //執行一般初始化
    $scope.EditSubjObj = {};
    GeneralInit();
    //設定初始化尚未完成載入標籤列表
    $scope.IsInitEvnttag = false;
    $scope.IsInitCustag = false;
    //預設觀察值為False
    var updateValid = false;
    //預設沒有主題標籤
    $scope.EditEventTag = [];
    //預設沒有對象標籤
    $scope.EditCusTag = [];
    //預設不顯示新增事件標籤頁面
    $scope.IsShowEventTag = false;
    $scope.EventTagStyle = { 'display': 'none' };
    //初始化主題標籤ng-model
    $scope.SubjEventTag = {};
    $scope.SubjCusTag = {};
    //需擷取的Scope
    var ThisScope = $scope.$parent.$parent.$parent.$parent.$parent;
    if (ThisScope.isEditSubj == undefined)
    {
        ThisScope = $scope.$parent.$parent.$parent.$parent;
    }
    // 判斷是否使用詳細頁封閉區間
    InitCurrentDetail();
    //如果為編輯主題，在呼叫方法拿取主題標籤
    if (ThisScope.isEditSubj && $scope.$parent.data.DiscType== DiscType.Normal)
    {
        //給定編輯當下的時間字串
        var date = new Date($scope.$parent.$parent.EditMessage.CreatedOn * 1000);
        $scope.CreatedonString = date.getFullYear() + "/" + (('0' + (date.getMonth() + 1)).slice(-2)) + "/" + ('0' + date.getDate()).slice(-2);
        //取得主題標籤
        GetSubjTag();
    }
    else
    {
        $scope.IsInitEvnttag = true;
        $scope.IsInitCustag = true;
    }
    // #region 款項請領及採購單筆 Viewmodel
    var Purchase = function (purchase) {
        if (!purchase) purchase = {};

        var Purchase = {
            pDate: purchase.pDate || null,
            pName: purchase.pName || null,
            pPrice: purchase.pPrice || null,
            pQty: purchase.pQty || null,
            pTotal: purchase.pTotal || null,
            pMemo: purchase.pMemo || null,
            pDateError: null,
            pNameError: null,
            pPriceError: null,
            pQtyError: null,
            pTotalError: null,
            pMemoError: null,
            datepickerOpened: false,
        };
        return Purchase;
    };
    // #endregion
    // #region 確認編輯的討論組型態
    var discType = $scope.$parent.data.DiscType;
    $scope.EditDiscType = discType;
    // #endregion
    // #region 根據討論組型態進行初始化
    if ($scope.$parent.isEditSubj === true) {

        switch (discType) {
            case DiscType.ApplyMoney:
                ApplyInit();
                break;
            case DiscType.Purchasing:
                PurchaseInit();
                break;
            case DiscType.PersonLeave:
                LeaveInit();
                break;
            case DiscType.GoOut:
                GoOutInit();
                break;
            case DiscType.Overtime:
                OverTimeInit();
                break;
        }
    };
    // #endregion
    // #region 附件
    // #region init 初始化設定
    var tAttatchOptions = {
        url: '/Attatch/Upload',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        autoUpload: true,
        formData: [
            {
                CompanyId: $scope.CurrentDetail.CompID,
                DiscussionID: $scope.CurrentDetail.DiscID,
                UserId: $scope.CurrentDetail.UserID,
                UserName: $scope.CurrentDetail.UserName
            }
        ]
    }
    var tUploader = $scope.tUploader = new FileUploader(tAttatchOptions);
    // 如果有已經有附件就要加
    if ($scope.$parent.EditorObj.attatchs.length > 0) {
        angular.forEach($scope.$parent.EditorObj.attatchs, function (value, key) {
        // 先包成AttatchInfo的樣子
        var attInfo = {
            AttID: value.AttID || null,
            Okey: value.Okey || null,
            Skey: value.Skey || null,
            Mkey: value.Mkey || null,
            Size: value.FileSize || null,
            FileType: value.FileType || null,
            FileName: value.FileName || null,
            CompanyID: $scope.$parent.EditorObj.CompanyID || null,
            SubjectID: $scope.$parent.EditorObj.SubjectID || null,
            DiscussionID: $scope.$parent.EditorObj.DiscussionID || null,
            UserID: $scope.$parent.EditorObj.UserID || null,
            ReplyID: $scope.$parent.EditorObj.ReplyID || null,
            CreatedOn: new Date(parseInt(value.CreatedOn.substr(6)))|| null,
            isEmbed: value.isEmbed || false,
            isDel: value.isDel || false,
            isCloud: value.isCloud
        }
        // 不是內嵌圖才加到附件區
        if (value.isEmbed == false) {
            tUploader.queue.push({
                file: {
                    name: value.FileName,
                    type: value.FileType,
                    size: value.FileSize,
                },
                isUploaded: true,
                isSuccess: false,
                DataObj: attInfo
            });
        }
        // 在加進去附件陣列
        AttatchService.InsertToAttatch(attInfo);
    });

    }
    var tController = $scope.tController = {
        isImage: function (item) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        },
        fileTypeImg: function (item) {
            return $filter('FileTypeFilter')(item.name);
        },
        fileNameSubStr: function (item) {
            var nameLength = item.name.length;
            //return nameLength;
            if (nameLength > 30) {
                return item.name.substr(0, 30) + '...';
            } else {
                return item.name;
            }
        }
    };
    $scope.tRemove = tRemoveItem;
    $scope.tRemoveAll = tRemoveAll;
    // #endregion

    // #region 檔案上傳 and 移除
    // #region 移除檔案
    // 移除單一檔案
    function tRemoveItem(item) {
        if (item._xhr) {
            var itemObj = angular.fromJson(item._xhr.response);
            AttatchService.RemoveItem(itemObj.DataObj);
            item.remove();
        } else {
            var index = tUploader.queue.indexOf(item);
            AttatchService.RemoveItem(item.DataObj);
            tUploader.queue.splice(index, 1);
        }
    }
    // 移除全部檔案
    function tRemoveAll() {
        // 從顯示清單移除
        tUploader.clearQueue();
        // 將IsDelete設為true
        AttatchService.RemoveAll();
    };

    // #endregion 
    // 上傳檔案前大小判斷
    tUploader.onBeforeUploadItem = function (item) {
        // 利用FormData 裡面的IsValidate來判斷是否超過10MB
        var _FileSize = item.file.size / 1024 / 1024;
        var _LimitSize = 0;
        switch (_ThisScope.CurrentDetail.CompID) {
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
            $scope.tUploader.formData[0].IsValidate = false;
        }
        else {
            $scope.tUploader.formData[0].IsValidate = true;
        }
        Array.prototype.pop.apply(item.formData, []);
        Array.prototype.push.apply(item.formData, $scope.tUploader.formData);
    };
    // On file upload Success
    tUploader.onSuccessItem = function (fileItem, response, status, headers) {
        $log.info('onSuccessItem', fileItem, response, status, headers);
        // 上傳完檔案後
        AttatchService.InsertToAttatch(response.DataObj);
    };
    // On file upload Success
    tUploader.onErrorItem = function (fileItem, response, status, headers) {
        $log.info('onErrorItem', fileItem, response, status, headers);
        var index = tUploader.queue.indexOf(fileItem);
        $log.info('index:' + index);
        tUploader.queue.splice(index, 1);
        $log.info('queue:' + tUploader.queue);
        // 發生錯誤
        var _Msg = $filter('translate')('FileSizeFail');
        alert(_Msg);
    };

    // On file upload complete (independently of the sucess of the operation)
    //tUploader.onCompleteItem = function (fileItem, response, status, headers) {
    //    $log.info('onCompleteItem', fileItem, response, status, headers);
    //    // 上傳完檔案後
    //    AttatchService.InsertToAttatch(response.DataObj);

    //};

    // #endregion

    // #endregion
    // #region 編輯器
    // #region init初始化設定
    $scope.tOptions = EditorPara.Para;
    $scope.tTitle = $scope.$parent.EditorObj.tTitle;
    $scope.EditSubjObj.tText = $sce.getTrustedHtml($scope.$parent.EditorObj.tContent);
    $scope.tImageUpload = tImageUpload;
    $scope.tImageRemove = tImageRemove;

    // #endregion
    // #region 圖片上傳 and 移除
    // #region 上傳圖片
    function tImageUpload(files, editor, welEditable) {
        var fm = new FormData();
        fm.append('file', files[0]);
        fm.append('CompanyId', $scope.EditorObj.CompanyID);
        fm.append('DiscussionID', $scope.EditorObj.DiscussionID);
        fm.append('UserId', $scope.EditorObj.UserID);
        fm.append('UserName', $scope.EditorObj.UserName);

        if (files[0].type.indexOf('image') > -1) {
            // 是不是內嵌圖片
            fm.append('isEmbed', true);
            var promise = ImageService.upload(fm);

            promise.then(
               function (payload) {
                   AttatchService.InsertToAttatch(payload.data.DataObj);
                   var imagepath = '/Attatch/getImg/?CompanyId=' + payload.data.DataObj.CompanyID + '&FileName=' + payload.data.DataObj.AttID + '.' + payload.data.DataObj.FileType;
                   editor.insertImage($(".note-editable"), imagepath, payload.data.DataObj.AttID);
               },
               function (errorpayload) {
                   $log.log('errorData:' + errorpayload.data);
                   $log.log('errorStatus:' + errorpayload.status);
               },
               function (progress) {
                   $log.log(progress);
               });
        } else {
            // 不是的話就加到附件佇列
            tUploader.addToQueue(files[0], tAttatchOptions, tUploader.filters);
        }
    };
    // #endregion
    // #region 移除圖片
    function tImageRemove(target, editor, welEditable) {
        var img = angular.element(target);
        AttatchService.RemoveItem({ AttID: img.data('filename') });
    };
    // #endregion

    // #endregion
    // #endregion
    // #region 到期日angular UI bootstrap
    $scope.ttoday = function () {
        $scope.EditSubjObj.tPlanCloseOn = $scope.EditSubjObj.tPlanCloseOn !== null ? new Date($scope.EditSubjObj.tPlanCloseOn) : null;
    };
    $scope.ttoday();

    $scope.topen = function ($event) {
        $event.stopPropagation();
        $scope.tdatepickerOpened = true;
    };

    $scope.tdateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.tinitDate = new Date('2016-15-20');
    $scope.tformats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.tformat = $scope.tformats[1];
    // #endregion
    // #region 時間選擇
    $scope.today = function () {
        $scope.dueDate = null;
    };
    $scope.today();

    $scope.clear = function () {
        $scope.dueDate = null;
    };

    $scope.toggleMin = function () {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function ($event, $index) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.tApplyMoneyData[$index].datepickerOpened = true;

        for (item in $scope.tApplyMoneyData) {
            if ($scope.tApplyMoneyData[item] === $scope.tApplyMoneyData[$index]) {
                $scope.tApplyMoneyData[item].datepickerOpened = true;
            } else {
                $scope.tApplyMoneyData[item].datepickerOpened = false;
            }
        }
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.initDate = new Date('2016-15-20');
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[1];
    // #endregion
    // #region 行政區表格變更
    $scope.check_Upt_Val = function ($index, prop, properr, error) {
        //區別各種行政區表格
        switch (discType) {
            case DiscType.ApplyMoney:
                UpdateGrid($scope.tApplyMoneyData, $index, prop, properr, error);
                break;
            case DiscType.Purchasing:
                UpdateGrid($scope.tPurchaseMoney, $index, prop, properr, error);
                break;
            case DiscType.PersonLeave:
                UpdateLeaveGrid(prop, properr, error);
                break;
            case DiscType.GoOut:
                UpdateGoOutGrid(prop, properr, error);
                break;
                //case DiscType.Overtime:

                //    break;
        }



    }
    // #endregion
    // #region 變更方法
    //款項請領及採購計畫
    function UpdateGrid(model, $index, prop, properr, error) {

        //檢查是否有增加款項請領項目
        if ($index === (model.length - 1)) {
            model.push(new Purchase({}));
        }
        var result = AdminService.Cal(model, $index, prop, properr, error);

        model = result.Model;
        $scope.Total = result.Total;
    }
    //外出單
    function UpdateGoOutGrid(prop, properr, error) {
        var item = $scope.tGoOut;
        if (item[properr] === error && item[prop] === null)
            item[properr] = error;
        else
            item[properr] = null;
    }
    //請假單
    function UpdateLeaveGrid(prop, properr, error) {
        // 檢查是不是有值決定要不要改變errorClass
        var item = $scope.tLeave;
        if (item[properr] === error && item[prop] === null)
            item[properr] = error;
        else
            item[properr] = null;
    }
    // #endregion
    // #region Title有變更
    $scope.change = function (text) {
        $scope.$parent.EditorObj.tTitle = text;
        $scope.tTitle = text;
    };
    // #endregion
    // #region 儲存及取消
    $scope.tSave = function () {
        // #region 檢查檔案上傳狀況
        var queueCount = $scope.tUploader['queue'].length;
        if (queueCount > AttatchService.Attatchs.length)
        {
            alert($filter('translate')('FileNotUploaded'));
            return;
        }
        // #endregion
        // #region 檢查主題跟收件人
        // 編輯主題狀態才要檢查標題跟送出主題內容
        if ($scope.$parent.EditorObj.editorType === 'EditSubj') {
            // #region 驗證欄位
            // 主題標籤與對象標籤的判斷
            if (discType == DiscType.Normal && (typeof $scope.SubjEventTag.selected == 'undefined' || typeof $scope.SubjCusTag.selected == 'undefined'))
            {
                alert($filter('translate')('AlertAddTag'));
                return;
            }
            //主題標題判斷
            if ($scope.tTitle.length < 1) {
                var typeSubj = $filter('translate')('typeSubj');
                alert(typeSubj);
            }
            //主題內容判斷
            if ($scope.EditSubjObj.tText.length <= 0 && discType == DiscType.Normal) {
                return;
            }
            if ($scope.EditSubjObj.tText.length <= 0 && discType != DiscType.Normal) {
                //如果不是一般討論組，但是內容為空，補入空白字元
                $scope.EditSubjObj.tText = "&nbsp;";
            }
            // #endregion

            switch (discType) {
                case DiscType.ApplyMoney:
                    ApplySave();
                    break;
                case DiscType.Purchasing:
                    PurchaseSave();
                    break;
                case DiscType.PersonLeave:
                    LeaveSave();
                    break;
                case DiscType.GoOut:
                    GoOutSave();
                    break;
                case DiscType.Overtime:
                    OverTimeSave();
                    break;
                case DiscType.Normal:
                    updateValid = true;
                    break;
            }

        } else {
            if ($scope.EditSubjObj.tText.length > 1) {
                updateValid = true;
            }
        }

        if ($scope.EditReceiver.tSelectedReceipts.length == 0) {
            alert($filter('translate')('Choose_Receivrer'));
        }
        // #endregion
        GeneralSave();
        if (updateValid === true) {
            saveAll();
        }
    }
    $scope.tCancel = function () {
        AttatchService.RemoveAll();
        $scope.EditReceiver.tSelectedReceipts.length = 0;
        // 廣播事件由subjectDetailCtrl監聽
        $scope.$emit('closeEditor', { editorType: $scope.$parent.EditorObj.editorType });
        $interval.cancel($scope.intervalPromise);
    };
    // #endregion
    // #region 儲存主題草稿
    $scope.tSaveDraft = function () {
        // #region 驗證欄位
        //主題標題判斷
        if ($scope.tTitle.length < 1) {
            var typeSubj = $filter('translate')('typeSubj');
            alert(typeSubj);
        }
        //主題內容判斷
        if ($scope.EditSubjObj.tText.length <= 0) {
            return;
        }
        // #endregion
        var now = new Date();
        $scope.tDraftMessage = $filter('translate')('On') + now.getHours() + ':' + now.getMinutes() + $filter('translate')('Save_Draft');
        GeneralSave();
        $scope.$emit('tSaveDraft', {});
    };
    // #endregion
    // #region 儲存回覆草稿
    $scope.tSaveReplyDraft = function () {
        //回覆內容判斷
        GeneralReplySave();
        $scope.$emit('tSaveReplyDraft', {});
    }
    // #endregion
    // #region 儲存
    function saveAll() {
        // 廣播儲存事件
        $scope.$emit('saveEditor', {});
    };
    // #endregion
    // #region 不同討論組類別，廣播前事件
    //款項請領
    function ApplySave() {
        // #region 驗證欄位

        var result = AdminService.ValidApplyMoney($scope.tApplyMoneyData);
        $scope.tApplyMoneyData = result.Model;
        updateValid = result.isValid;

        // #endregion
        $scope.tApplyMoneyData.splice(($scope.tApplyMoneyData.length - 1), 1);
        $scope.$parent.UpdateApplyMoney.ApplyMoney = $filter('adminFilter')($scope.tApplyMoneyData, 'pDate');
    };

    //採購
    function PurchaseSave() {
        // #region 驗證欄位
        var result = AdminService.ValidPurchase($scope.tPurchaseMoney);
        $scope.tPurchaseMoney = result.Model;
        updateValid = result.isValid;
        // #endregion
        $scope.tPurchaseMoney.splice(($scope.tPurchaseMoney.length - 1), 1);
        $scope.$parent.UpdatePurchaseMoney.Purchase = $filter('adminFilter')($scope.tPurchaseMoney, 'pTotal');
    };

    //請假
    function LeaveSave() {
        // #region 驗證欄位
        // 驗證有沒有填寫每一個欄位
        var needToFills = [];
        if ($scope.tLeave['Member'] == null) {
            needToFills.push({ value: 'Member' });
        }
        if ($scope.tLeave['sYear'] == null) {
            needToFills.push({ value: 'sYear' });
        }
        if ($scope.tLeave['sMonth'] == null) {
            needToFills.push({ value: 'sMonth' });
        }
        if ($scope.tLeave['sDay'] == null) {
            needToFills.push({ value: 'sDay' });
        }
        if ($scope.tLeave['sHour'] == null) {
            needToFills.push({ value: 'sHour' });
        }
        if ($scope.tLeave['sMinute'] == null) {
            needToFills.push({ value: 'sMinute' });
        }
        if ($scope.tLeave['eYear'] == null) {
            needToFills.push({ value: 'eYear' });
        }
        if ($scope.tLeave['eMonth'] == null) {
            needToFills.push({ value: 'eMonth' });
        }
        if ($scope.tLeave['eDay'] == null) {
            needToFills.push({ value: 'eDay' });
        }
        if ($scope.tLeave['eHour'] == null) {
            needToFills.push({ value: 'eHour' });
        }
        if ($scope.tLeave['eMinute'] == null) {
            needToFills.push({ value: 'eMinute' });
        }
        if ($scope.tLeave['TotalDays'] == null) {
            needToFills.push({ value: 'TotalDays' });
        }
        if ($scope.tLeave['TotalHours'] == null) {
            needToFills.push({ value: 'TotalHours' });
        }

        if (needToFills.length > 0) {
            angular.forEach(needToFills, function (value, key) {
                if (value.value == 'Member') {
                    $scope.tLeave.MemberError = 'error';
                }
                if (value.value == 'sYear') {
                    $scope.tLeave.sYearError = 'error';
                }
                if (value.value == 'sMonth') {
                    $scope.tLeave.sMonthError = 'error';
                }
                if (value.value == 'sDay') {
                    $scope.tLeave.sDayError = 'error';
                }
                if (value.value == 'sHour') {
                    $scope.tLeave.sHourError = 'error';
                }
                if (value.value == 'sMinute') {
                    $scope.tLeave.sMinuteError = 'error';
                }
                if (value.value == 'eYear') {
                    $scope.tLeave.eYearError = 'error';
                }
                if (value.value == 'eMonth') {
                    $scope.tLeave.eMonthError = 'error';
                }
                if (value.value == 'eDay') {
                    $scope.tLeave.eDayError = 'error';
                }
                if (value.value == 'eHour') {
                    $scope.tLeave.eHourError = 'error';
                }
                if (value.value == 'eMinute') {
                    $scope.tLeave.eMinuteError = 'error';
                }
                if (value.value == 'TotalDays') {
                    $scope.tLeave.TotalDaysError = 'error';
                }
                if (value.value == 'TotalHours') {
                    $scope.tLeave.TotalHoursError = 'error';
                }
            });
            updateValid = false;
        } else {
            updateValid = true;
        }
        // #endregion

        $scope.tLeave.sYear = $scope.tLeave.sYear.toString();
        $scope.tLeave.sMonth = $scope.tLeave.sMonth.toString();
        $scope.tLeave.sDay = $scope.tLeave.sDay.toString();
        $scope.tLeave.sHour = $scope.tLeave.sHour.toString();
        $scope.tLeave.sMinute = $scope.tLeave.sMinute.toString();
        $scope.tLeave.eYear = $scope.tLeave.eYear.toString();
        $scope.tLeave.eMonth = $scope.tLeave.eMonth.toString();
        $scope.tLeave.eDay = $scope.tLeave.eDay.toString();
        $scope.tLeave.eHour = $scope.tLeave.eHour.toString();
        $scope.tLeave.eMinute = $scope.tLeave.eMinute.toString();
        $scope.tLeave.TotalHours = $scope.tLeave.TotalHours.toString();
        $scope.tLeave.TotalDays = $scope.tLeave.TotalDays.toString();

        $scope.$parent.UpdatePersonLeave.PersonLeave = $scope.tLeave;
    };

    //外出
    function GoOutSave() {
        // #region 驗證欄位
        // 驗證有沒有填寫每一個欄位
        var needToFills = [];
        if ($scope.tGoOut['Member'] == null) {
            needToFills.push({ value: 'Member' });
        }
        if ($scope.tGoOut['sYear'] == null) {
            needToFills.push({ value: 'sYear' });
        }
        if ($scope.tGoOut['sMonth'] == null) {
            needToFills.push({ value: 'sMonth' });
        }
        if ($scope.tGoOut['sDay'] == null) {
            needToFills.push({ value: 'sDay' });
        }
        if ($scope.tGoOut['sHour'] == null) {
            needToFills.push({ value: 'sHour' });
        }
        if ($scope.tGoOut['sMinute'] == null) {
            needToFills.push({ value: 'sMinute' });
        }
        if ($scope.tGoOut['eYear'] == null) {
            needToFills.push({ value: 'eYear' });
        }
        if ($scope.tGoOut['eMonth'] == null) {
            needToFills.push({ value: 'eMonth' });
        }
        if ($scope.tGoOut['eDay'] == null) {
            needToFills.push({ value: 'eDay' });
        }
        if ($scope.tGoOut['eHour'] == null) {
            needToFills.push({ value: 'eHour' });
        }
        if ($scope.tGoOut['eMinute'] == null) {
            needToFills.push({ value: 'eMinute' });
        }
        if ($scope.tGoOut['TotalDays'] == null) {
            needToFills.push({ value: 'TotalDays' });
        }
        if ($scope.tGoOut['TotalHours'] == null) {
            needToFills.push({ value: 'TotalHours' });
        }

        if (needToFills.length > 0) {
            angular.forEach(needToFills, function (value, key) {
                if (value.value == 'Member') {
                    $scope.tGoOut.MemberError = 'error';
                }
                if (value.value == 'sYear') {
                    $scope.tGoOut.sYearError = 'error';
                }
                if (value.value == 'sMonth') {
                    $scope.tGoOut.sMonthError = 'error';
                }
                if (value.value == 'sDay') {
                    $scope.tGoOut.sDayError = 'error';
                }
                if (value.value == 'sHour') {
                    $scope.tGoOut.sHourError = 'error';
                }
                if (value.value == 'sMinute') {
                    $scope.tGoOut.sMinuteError = 'error';
                }
                if (value.value == 'eYear') {
                    $scope.tGoOut.eYearError = 'error';
                }
                if (value.value == 'eMonth') {
                    $scope.tGoOut.eMonthError = 'error';
                }
                if (value.value == 'eDay') {
                    $scope.tGoOut.eDayError = 'error';
                }
                if (value.value == 'eHour') {
                    $scope.tGoOut.eHourError = 'error';
                }
                if (value.value == 'eMinute') {
                    $scope.tGoOut.eMinuteError = 'error';
                }
                if (value.value == 'TotalDays') {
                    $scope.tGoOut.TotalDaysError = 'error';
                }
                if (value.value == 'TotalHours') {
                    $scope.tGoOut.TotalHoursError = 'error';
                }
            });
            updateValid = false;
        } else {
            updateValid = true;
        }
        // #endregion

        $scope.tGoOut.sYear = $scope.tGoOut.sYear.toString();
        $scope.tGoOut.sMonth = $scope.tGoOut.sMonth.toString();
        $scope.tGoOut.sDay = $scope.tGoOut.sDay.toString();
        $scope.tGoOut.sHour = $scope.tGoOut.sHour.toString();
        $scope.tGoOut.sMinute = $scope.tGoOut.sMinute.toString();
        $scope.tGoOut.eYear = $scope.tGoOut.eYear.toString();
        $scope.tGoOut.eMonth = $scope.tGoOut.eMonth.toString();
        $scope.tGoOut.eDay = $scope.tGoOut.eDay.toString();
        $scope.tGoOut.eHour = $scope.tGoOut.eHour.toString();
        $scope.tGoOut.eMinute = $scope.tGoOut.eMinute.toString();
        $scope.tGoOut.TotalHours = $scope.tGoOut.TotalHours.toString();
        $scope.tGoOut.TotalDays = $scope.tGoOut.TotalDays.toString();

        $scope.$parent.UpdateGoOut.GoOut = $scope.tGoOut;
    };

    //加班
    function OverTimeSave() {
        // #region 驗證欄位

        // 驗證有沒有填寫每一個欄位
        var needToFills = [];
        if ($scope.tOverTime['Member'] == null) {
            needToFills.push({ value: 'Member' });
        }
        if ($scope.tOverTime['sYear'] == null) {
            needToFills.push({ value: 'sYear' });
        }
        if ($scope.tOverTime['sMonth'] == null) {
            needToFills.push({ value: 'sMonth' });
        }
        if ($scope.tOverTime['sDay'] == null) {
            needToFills.push({ value: 'sDay' });
        }
        if ($scope.tOverTime['sHour'] == null) {
            needToFills.push({ value: 'sHour' });
        }
        if ($scope.tOverTime['sMinute'] == null) {
            needToFills.push({ value: 'sMinute' });
        }
        if ($scope.tOverTime['eYear'] == null) {
            needToFills.push({ value: 'eYear' });
        }
        if ($scope.tOverTime['eMonth'] == null) {
            needToFills.push({ value: 'eMonth' });
        }
        if ($scope.tOverTime['eDay'] == null) {
            needToFills.push({ value: 'eDay' });
        }
        if ($scope.tOverTime['eHour'] == null) {
            needToFills.push({ value: 'eHour' });
        }
        if ($scope.tOverTime['eMinute'] == null) {
            needToFills.push({ value: 'eMinute' });
        }
        if ($scope.tOverTime['TotalDays'] == null) {
            needToFills.push({ value: 'TotalDays' });
        }
        if ($scope.tOverTime['TotalHours'] == null) {
            needToFills.push({ value: 'TotalHours' });
        }
        if ($scope.tOverTime['Content'] == null || $scope.tOverTime['Content'].length < 1) {
            needToFills.push({ value: 'Content' });
        }
        if (needToFills.length > 0) {
            angular.forEach(needToFills, function (value, key) {
                if (value.value == 'Member') {
                    $scope.tOverTime.MemberError = 'error';
                }
                if (value.value == 'sYear') {
                    $scope.tOverTime.sYearError = 'error';
                }
                if (value.value == 'sMonth') {
                    $scope.tOverTime.sMonthError = 'error';
                }
                if (value.value == 'sDay') {
                    $scope.tOverTime.sDayError = 'error';
                }
                if (value.value == 'sHour') {
                    $scope.tOverTime.sHourError = 'error';
                }
                if (value.value == 'sMinute') {
                    $scope.tOverTime.sMinuteError = 'error';
                }
                if (value.value == 'eYear') {
                    $scope.tOverTime.eYearError = 'error';
                }
                if (value.value == 'eMonth') {
                    $scope.tOverTime.eMonthError = 'error';
                }
                if (value.value == 'eDay') {
                    $scope.tOverTime.eDayError = 'error';
                }
                if (value.value == 'eHour') {
                    $scope.tOverTime.eHourError = 'error';
                }
                if (value.value == 'eMinute') {
                    $scope.tOverTime.eMinuteError = 'error';
                }
                if (value.value == 'TotalDays') {
                    $scope.tOverTime.TotalDaysError = 'error';
                }
                if (value.value == 'TotalHours') {
                    $scope.tOverTime.TotalHoursError = 'error';
                }
                if (value.value == 'Content') {
                    $scope.tOverTime.ContentError = 'error';
                }
            });
            updateValid = false;
        } else {
            updateValid = true;
        }
        // #endregion

        $scope.tOverTime.sYear = $scope.tOverTime.sYear.toString();
        $scope.tOverTime.sMonth = $scope.tOverTime.sMonth.toString();
        $scope.tOverTime.sDay = $scope.tOverTime.sDay.toString();
        $scope.tOverTime.sHour = $scope.tOverTime.sHour.toString();
        $scope.tOverTime.sMinute = $scope.tOverTime.sMinute.toString();
        $scope.tOverTime.eYear = $scope.tOverTime.eYear.toString();
        $scope.tOverTime.eMonth = $scope.tOverTime.eMonth.toString();
        $scope.tOverTime.eDay = $scope.tOverTime.eDay.toString();
        $scope.tOverTime.eHour = $scope.tOverTime.eHour.toString();
        $scope.tOverTime.eMinute = $scope.tOverTime.eMinute.toString();
        $scope.tOverTime.TotalHours = $scope.tOverTime.TotalHours.toString();
        $scope.tOverTime.TotalDays = $scope.tOverTime.TotalDays.toString();

        $scope.$parent.UpdateOverTime.OverTime = $scope.tOverTime;
    };

    //共同使用的儲存方法
    function GeneralSave() {
        //一般事件(內容、附件、收件人、預計完成日期)
        $scope.$parent.EditorObj.tContent = $scope.EditSubjObj.tText;
        $scope.$parent.EditorObj.attatchs = AttatchService.Attatchs;
        $scope.$parent.EditorObj.receipts = $scope.EditReceiver.tSelectedReceipts;
        $scope.$parent.EditorObj.PlanCloseOn = $scope.EditSubjObj.tPlanCloseOn == null ? "0" : $scope.EditSubjObj.tPlanCloseOn;
        //判斷事件標籤 & 對象標籤 (Array = 沒有變動,Object = 重新選取)
        if ($scope.SubjEventTag.selected != undefined)
        {
            if ($scope.SubjEventTag.selected.constructor == Object)
            {
                AssignEventTag();
            }
            else
            {
                if ($scope.SubjEventTag.selected.length > 0) {
                    AssignEventTag();
                }
            }
        }
        if ($scope.SubjCusTag.selected != undefined)
        {
            if ($scope.SubjCusTag.selected.constructor == Object)
            {
                AssignCusTag();
            }
            else
            {
                if ($scope.SubjCusTag.selected.length > 0) {
                    AssignCusTag();
                }
            }
        }
    };
    // #endregion
    function AssignEventTag()
    {
        //事件標籤ID
        var EventTagID = $scope.SubjEventTag.selected.__proto__.constructor['name'] == 'Array' ? $scope.SubjEventTag.selected[0].SubjTagId : $scope.SubjEventTag.selected['SubjTagId'];
        $scope.$parent.EditorObj.EventTagID = EventTagID;
        //事件標籤名稱
        var EventTagName = $scope.SubjEventTag.selected.__proto__.constructor['name'] == 'Array' ? $scope.SubjEventTag.selected[0].SubjTagIdName : $scope.SubjEventTag.selected['SubjTagIdName'];
        $scope.$parent.EditorObj.EventTagName = EventTagName;
    }
    function AssignCusTag()
    {
        //對象標籤ID
        var CusTagID = $scope.SubjCusTag.selected.__proto__.constructor['name'] == 'Array' ? $scope.SubjCusTag.selected[0].SubjTagId : $scope.SubjCusTag.selected['SubjTagId'];
        $scope.$parent.EditorObj.CusTagID = CusTagID;
        //對象標籤名稱
        var CusTagName = $scope.SubjCusTag.selected.__proto__.constructor['name'] == 'Array' ? $scope.SubjCusTag.selected[0].SubjTagIdName : $scope.SubjCusTag.selected['SubjTagIdName'];
        $scope.$parent.EditorObj.CusTagName = CusTagName;
    }
    // #region 回覆共用使用儲存方法
    function GeneralReplySave() {
        //一般事件(內容、附件、收件人)
        $scope.$parent.EditorObj.tContent = $scope.EditSubjObj.tText;
        $scope.$parent.EditorObj.attatchs = AttatchService.Attatchs;
        $scope.$parent.EditorObj.receipts = $scope.EditReceiver.tSelectedReceipts;
    }
    // #endregion
    // #region 不同討論組類別的初始化
    //款項請領
    function ApplyInit() {
        //行政區資料
        $scope.tApplyMoneyData = [];
        angular.copy($scope.$parent.EditorObj.ProgressData, $scope.tApplyMoneyData);
        //比資料拉出來的比數多一筆，使用者可以新增
        $scope.tApplyMoneyData.push(new Purchase({}));
        //設置討論組名稱
        $scope.$parent.Disc.discName = $scope.$parent.UpdateApplyMoney.DiscName;
        //顯示款項請領編輯的表格
        $scope.Edit.ApplyMoney = true;

    };

    //採購
    function PurchaseInit() {
        //行政區資料
        $scope.tPurchaseMoney = [];
        angular.copy($scope.$parent.EditorObj.PurchaseData, $scope.tPurchaseMoney);
        //筆資料拉出來的比數多一筆，使用者可以新增
        $scope.tPurchaseMoney.push(new Purchase({}));
        //設置討論組名稱
        $scope.$parent.Disc.discName = $scope.$parent.UpdatePurchaseMoney.DiscName;
        //顯示採購計畫編輯的表格
        $scope.Edit.Purchase = true;
    };

    //請假
    function LeaveInit() {
        // PersonLeave Viewmodel
        var PersonLeave = function (personLeave) {
            if (!personLeave) personLeave = {};

            var PersonLeave = {
                sYear: personLeave.sYear || today.getFullYear(),
                sMonth: personLeave.sMonth || today.getMonth(),
                sDay: personLeave.sDay || today.getDate(),
                sHour: personLeave.sHour || 0,
                sMinute: personLeave.sMinute || 0,
                eYear: personLeave.sYear || today.getFullYear(),
                eMonth: personLeave.eMonth || today.getMonth(),
                eDay: personLeave.eDay || today.getDate(),
                eHour: personLeave.eHour || 0,
                eMinute: personLeave.eMinute || 0,
                TotalDays: personLeave.TotalDays || 0,
                TotalHours: personLeave.TotalHours || 0,
                Member: personLeave.Member || null,
                Agent: personLeave.Agent || null,
                OtherLeaveType: personLeave.OtherLeaveType || null,
                Reason: personLeave.Reason || null,
                Memo: personLeave.Memo || null,
                LeaveType: personLeave.LeaveType,
                LeaveTypeID: personLeave.LeaveTypeID,
                WorkId: personLeave.WorkId,
                AgentError: null,
                MemberError: null,
                sYearError: null,
                sMonthError: null,
                sDayError: null,
                sHourError: null,
                eYearError: null,
                eMonthError: null,
                eDayError: null,
                eHourError: null,
                TotalDaysError: null,
                TotalHoursError: null
            };
            return PersonLeave;
        };
        //請假單資料
        $scope.tLeave = new PersonLeave($scope.$parent.EditorObj.PersonLeaveData);
        //設置討論組名稱
        $scope.$parent.Disc.discName = $scope.$parent.UpdatePersonLeave.DiscName;
        //顯示請假單編輯的表格
        $scope.Edit.Leave = true;
        //初始化收件人
        ReceiptsService.callReceipts($scope.$parent.UpdatePersonLeave.DiscID, $scope.$parent.UpdatePersonLeave.CreatorID)
        .then(function (data) {
            //收件人
            $scope.receipts = ReceiptsService.getReceipts();
            //指定人員及職務代理人
            $scope.tLeave['Member'] = $filter('filter')($scope.receipts, { UserId: $scope.$parent.EditorObj.PersonLeaveData.Member })[0];
            $scope.tLeave['Agent'] = $filter('filter')($scope.receipts, { UserId: $scope.$parent.EditorObj.PersonLeaveData.Agent })[0];
        });
        //取得請假類別
        $http({
            method: 'get',
            url: '/PersonLeave/GetType/?DiscID=' + $scope.$parent.UpdatePersonLeave.DiscID
        })
        .success(function (data) {
            $scope.Edit.LeaveType = data;
        })
        .error(function () {

        });

    };

    //外出
    function GoOutInit() {
        // GoOut Viewmodel
        var GoOut = function (goOut) {
            if (!goOut) goOut = {};

            var GoOut = {
                sYear: goOut.sYear || today.getFullYear(),
                sMonth: goOut.sMonth || (today.getMonth() + 1),
                sDay: goOut.sDay || today.getDate(),
                sHour: goOut.sHour || 0,
                sMinute: goOut.sMinute || 0,
                eYear: goOut.sYear || today.getFullYear(),
                eMonth: goOut.eMonth || (today.getMonth() + 1),
                eDay: goOut.eDay || today.getDate(),
                eHour: goOut.eHour || 0,
                eMinute: goOut.eMinute || 0,
                TotalDays: goOut.TotalDays || 0,
                TotalHours: goOut.TotalHours || 0,
                Member: goOut.Member || null,
                MemberName: goOut.MemberName || null,
                Agent: goOut.Agent || null,//代理人
                AgentName: goOut.AgentName || null,
                Reason: goOut.Reason || null,
                Memo: goOut.Memo || null,
                OutType: goOut.OutType,
                OutTypeID: goOut.OutTypeID,
                WorkId: goOut.WorkId,
                AgentError: null,
                MemberError: null,
                sYearError: null,
                sMonthError: null,
                sDayError: null,
                sHourError: null,
                eYearError: null,
                eMonthError: null,
                eDayError: null,
                eHourError: null,
                TotalDaysError: null,
                TotalHoursError: null
            };
            return GoOut;
        };
        //外出單資料
        $scope.tGoOut = new GoOut($scope.$parent.EditorObj.GoOutData);
        //設置討論組名稱
        $scope.$parent.Disc.discName = $scope.$parent.UpdateGoOut.DiscName;
        //顯示外出單編輯的表格
        $scope.Edit.GoOut = true;
        //初始化收件人
        ReceiptsService.callReceipts($scope.$parent.UpdateGoOut.DiscID, $scope.$parent.UpdateGoOut.CreatorID)
        .then(function (data) {
            //收件人
            $scope.receipts = ReceiptsService.getReceipts();
            //指定人員及職務代理人
            $scope.tGoOut['Member'] = $filter('filter')($scope.receipts, { UserId: $scope.$parent.EditorObj.GoOutData.Member })[0];
            $scope.tGoOut['Agent'] = $filter('filter')($scope.receipts, { UserId: $scope.$parent.EditorObj.GoOutData.Agent })[0];

        });
        //取得公事類型
        $http({
            method: 'get',
            url: '/GoOut/GetLeaveType/?DiscID=' + $scope.$parent.UpdateGoOut.DiscID
        })
        .success(function (data) {
            $scope.Edit.OutType = data;
        })
        .error(function () {

        });
    };

    //加班
    function OverTimeInit() {
        //Overtime ViewModel
        var Overtime = function (overtime) {
            if (!overtime) overtime = {};

            var OverTime = {
                sYear: overtime.sYear || today.getFullYear(),
                sMonth: overtime.sMonth || (today.getMonth() + 1),
                sDay: overtime.sDay || today.getDate(),
                sHour: overtime.sHour || 0,
                sMinute: overtime.sMinute || 0,
                eYear: overtime.sYear || today.getFullYear(),
                eMonth: overtime.eMonth || (today.getMonth() + 1),
                eDay: overtime.eDay || today.getDate(),
                eHour: overtime.eHour || 0,
                eMinute: overtime.eMinute || 0,
                TotalDays: overtime.TotalDays || 0,
                TotalHours: overtime.TotalHours || 0,
                Member: overtime.Member || null,
                Reason: overtime.Reason || null,
                Content: overtime.Content || null,
                Memo: overtime.Memo || null,
                WorkId: overtime.WorkId,
                ContentError: null,
                MemberError: null,
                sYearError: null,
                sMonthError: null,
                sDayError: null,
                sHourError: null,
                eYearError: null,
                eMonthError: null,
                eDayError: null,
                eHourError: null,
                TotalDaysError: null,
                TotalHoursError: null
            };
            return OverTime;
        }
        //外出單資料
        $scope.tOverTime = new Overtime($scope.$parent.EditorObj.OverTimeData);
        //設置討論組名稱
        $scope.$parent.Disc.discName = $scope.$parent.UpdateOverTime.DiscName;
        //顯示外出單編輯的表格
        $scope.Edit.OverTime = true;
        //初始化收件人
        ReceiptsService.callReceipts($scope.$parent.UpdateOverTime.DiscID, $scope.$parent.UpdateOverTime.CreatorID)
        .then(function (data) {
            //收件人
            $scope.receipts = ReceiptsService.getReceipts();
            //指定人員及職務代理人
            $scope.tOverTime['Member'] = $filter('filter')($scope.receipts, { UserId: $scope.$parent.EditorObj.OverTimeData.Member })[0];
            $scope.tOverTime['Agent'] = $filter('filter')($scope.receipts, { UserId: $scope.$parent.EditorObj.OverTimeData.Agent })[0];

        });
    };
    // #endregion
    // #region 一般初始化
    function GeneralInit() {
        //款項請領表格
        $scope.Edit = {};
        $scope.Edit.ApplyMoney = false;
        $scope.EditSubjObj.tPlanCloseOn = $scope.$parent.EditorObj.PlanCloseOn !== 0 ? $filter('converdate')($scope.$parent.EditorObj.PlanCloseOn, { forUpdate: true }) : null;
        AttatchService.Attatchs.length = 0;
    };
    // #endregion
    // #region 編輯主題情況下，拿取事件標籤全部 & 對象標籤全部(查看$scope.isEditSubj == true)，回覆不執行
    function GetSubjTag() {
        //判斷Scope 位置
        _ThisScope = ThisScope.$parent.CurrentDetail == undefined ? ThisScope.$parent.$parent : ThisScope.$parent;
        //取得事件標籤
        AddNewMessageService.GetEventTag(_ThisScope.CurrentDetail.CompID)
        .then(function (result) {
            $scope.EditEventTag = result.data;
            if (ThisScope.SubjTag['EventTagID'] != null) {
                InitEditEventTag();
                $scope.IsInitEvnttag = true;
            }
            else {
                $scope.IsInitEvnttag = true;
            }
            //草稿動作
            //拿取ui select(事件標籤) watch到輸入的值
            $rootScope.$on('testAddEventTag', function (event, Data) {
                //filer輸入的EventTag有沒有新增過
                var IsEventTag = $filter('filter')(result.data, { SubjTagIdName: Data });
                if (IsEventTag == 0)
                {
                    $scope.TypeTagName = Data;
                    $scope.AddCreatorName = result.data[0].CreatorName;
                    $scope.JudgTagType = 0;
                    $scope.AddTag = $filter('translate')('AddEventTag');
                    //顯示新增事件標籤頁面
                    $scope.IsShowEventTag = true;
                    $scope.EventTagStyle = { 'display': 'block' };
                }
                //如果沒有filter到就把及時新增的視窗隱藏
                else
                {
                    $scope.EventTagStyle = { 'display': 'none' };
                }
            });
            InitDraftEventTag();
        });
        //取得對象標籤
        AddNewMessageService.GetCusTag(_ThisScope.CurrentDetail.CompID)
        .then(function (result) {
            $scope.EditCusTag = result.data;
            if (ThisScope.SubjTag['CusTagID'] != null) {
                InitEditCusTag();
                $scope.IsInitCustag = true;
            }
            else {
                $scope.IsInitCustag = true;
            }
            //拿取ui select(對象標籤) watch到輸入的值
            $rootScope.$on('testAddCusTag', function (event, Data) {
                //filer輸入的CusTag有沒有新增過
                var IsCusTag = $filter('filter')(result.data, { SubjTagIdName: Data });
                if (IsCusTag == 0)
                {
                    $scope.TypeTagName = Data;
                    $scope.AddCreatorName = result.data[0].CreatorName;
                    $scope.JudgTagType = 1;
                    $scope.AddTag = $filter('translate')('AddCusTag');
                    //顯示新增事件標籤頁面
                    $scope.IsShowEventTag = true;
                    $scope.EventTagStyle = { 'display': 'block' };
                }
                //如果沒有filter到就把及時新增的視窗隱藏
                else
                {
                    $scope.EventTagStyle = { 'display': 'none' };
                }
            });
            //草稿動作
            InitDraftCusTag();
        });
    };
    // #endregion
    //點選及時新增頁面的取消
    $scope.Cancle = function () {
        $scope.EventTagStyle = { 'display': 'none' };
    };
    //點選及時新增頁面的新增
    $scope.goAddTagPage = function () {
        $scope.NewAddEventTag = [{
            'CountNum': 1,
            'SubjTagIdName': $scope.TypeTagName,
            'CreatorName': $scope.AddCreatorName
        }];
        //傳到C#controller新增的資料
        var _Para = ({
            CompanyID: $scope.EditorObj.CompanyID,
            UserID: $scope.EditorObj.UserID,
            TagType: $scope.JudgTagType,
            SubjTagList: $scope.NewAddEventTag
        });
        GetBackendData.AddNewTag(_Para)
            .then(function (result) {
                console.log(result);
                if (result.data.IsSuccess)
                {
                    //如果C#controller新增完回傳回來的TagType等於0，就把新增的資料放進事件標籤的scope
                    if (result.data.TagType == 0)
                    {
                        $scope.EditEventTag.push(result.data);
                        //新增完後，保留剛剛新增輸入的值
                        $scope.SubjEventTag.selected = $filter('filter')($scope.EditEventTag, { SubjTagId: result.data.SubjTagId }, true);
                    }
                    //如果C#controller新增完回傳回來的TagType不等於0，就把新增的資料放進對象標籤的scope
                    else
                    {
                        $scope.EditCusTag.push(result.data);
                        //新增完後，保留剛剛新增輸入的值
                        $scope.SubjCusTag.selected = $filter('filter')($scope.EditCusTag, { SubjTagId: result.data.SubjTagId }, true);
                    }
                }
            });
        //新增完後隱藏及時新增的頁面
        $scope.EventTagStyle = { 'display': 'none' };
    };
    // #region 編輯主題的原事件標籤初始化
    function InitEditEventTag() {
        $scope.SubjEventTag.selected = $filter('filter')($scope.EditEventTag, { SubjTagId: ThisScope.SubjTag['EventTagID'] }, true);
    };
    // #endregion
    // #region 編輯主題的原對象標籤初始化
    function InitEditCusTag() {
        $scope.SubjCusTag.selected = $filter('filter')($scope.EditCusTag, { SubjTagId: ThisScope.SubjTag['CusTagID'] }, true);
    };
    // #endregion
    // #region 草稿的主題事件初始化
    function InitDraftEventTag() {
        if ($scope.$parent.$parent.EditorObj['EventTagID'] != null) {
            $scope.SubjEventTag.selected = $filter('filter')($scope.EditEventTag, { SubjTagId: $scope.$parent.$parent.EditorObj['EventTagID'] }, true);
        }
    };
    // #endregion
    // #region 草稿的主題對象初始化
    function InitDraftCusTag() {
        if ($scope.$parent.$parent.EditorObj['CusTagID'] != null) {
            $scope.SubjCusTag.selected = $filter('filter')($scope.EditCusTag, { SubjTagId: $scope.$parent.$parent.EditorObj['CusTagID'] }, true);
        }
    };
    // #endregion
    // #region 編輯草稿時，自動儲存草稿
    function tSettingInterval() {
        if ($scope.isEditSubj == true) {
            //編輯主題的狀態
            $scope.intervalPromise = $interval(function () {
                // #region 驗證欄位
                //主題標題判斷
                if ($scope.tTitle.length < 1) {
                    var typeSubj = $filter('translate')('typeSubj');
                    alert(typeSubj);
                }
                //主題內容判斷
                if ($scope.EditSubjObj.tText.length <= 0) {
                    return;
                }
                // #endregion
                var now = new Date();
                $scope.tDraftMessage = $filter('translate')('On') + now.getHours() + ':' + now.getMinutes() + $filter('translate')('Save_Draft');
                $scope.$emit('tSaveDraft', {});
            }, Draft.Timeout);
        }
        else {
            //編輯回覆的狀態
            $scope.intervalPromise = $interval(function () {
                // #region 驗證欄位
                //主題內容判斷
                if ($scope.EditSubjObj.tText.length <= 0) {
                    return;
                }
                // #endregion
                var now = new Date();
                $scope.tDraftMessage = $filter('translate')('On') + now.getHours() + ':' + now.getMinutes() + $filter('translate')('Save_Draft');
                $scope.$emit('tSaveReplyDraft', {});
            }, Draft.Timeout);
        }
    };
    // #endregion
    // #region 接收關閉草稿自動儲存廣播
    $scope.$on('CancelDetailInterval', function () {
        $interval.cancel($scope.intervalPromise);
    });
    // #endregion
    // #region 因為建立起開啟主題詳細頁需要封閉空間，但是如果對方是直接開啟獨立詳細頁，區間並沒有建立，這種情況下，直接拿取CurrentUser的資料
    function InitCurrentDetail() {
        _ThisScope = ThisScope.$parent.CurrentDetail == undefined ? ThisScope.$parent.$parent : ThisScope.$parent;
        if (Object.getOwnPropertyNames(_ThisScope.CurrentDetail).length === 0)
        {
            _ThisScope.CurrentDetail.SubjID = "";
            _ThisScope.CurrentDetail.CompID = _ThisScope.CurrentSpage.CompID;
            _ThisScope.CurrentDetail.UserID = _ThisScope.IndexData.CurrentUser.UserID;
            _ThisScope.CurrentDetail.DiscID = _ThisScope.CurrentDiscussion.discID;
            _ThisScope.CurrentDetail.UserName = _ThisScope.IndexData.CurrentUser.UserName;
        }
        console.log(_ThisScope.CurrentDetail);
    };
    // #endregion
}]);
