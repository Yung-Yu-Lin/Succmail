SuccApp.controller('AddNewPersonLeaveCtrl', ['$scope', 'FileUploader', '$log', 'AttatchService', 'filterFilter', '$filter', '$rootScope', 'AddNewPersonLeaveService', 'DiscType', 'SubjectColor', '$timeout', 'SubjectEvent', 'Draft', '$interval', '$translate', 'ReceiptsService', 'EditorPara', 'RightSide', function ($scope, FileUploader, $log, AttatchService, filterFilter, $filter, $rootScope, AddNewPersonLeaveService, DiscType, SubjectColor, $timeout, SubjectEvent, Draft, $interval, $translate, ReceiptsService, EditorPara, RightSide)
{
    AttatchService.Attatchs.splice(0, AttatchService.Attatchs.length);
    // #region 取得基本參數
    var ThisScope = $scope.$parent.$parent;
    $scope.discId = ThisScope.CurrentDiscussion.discID;
    $scope.discName = ThisScope.CurrentDiscussion.discName;
    $scope.userID = ThisScope.IndexData.CurrentUser.UserID;
    $scope.companyID = ThisScope.CurrentCompany.CompanyID;
    $scope.userName = ThisScope.IndexData.CurrentUser.UserName;
    $scope.DraftMessage = '';
    var today = new Date();
    // #endregion
    // #region 取得假別
    $scope.LeaveType = AddNewPersonLeaveService.LeaveType($scope.discId)
    .then(function (data) {
        $scope.LeaveType = data;
        $scope.PersonLeave = new PersonLeave();
        ReceiverMethod();
    });
    // #endregion
    // #region PersonLeave Viewmodel
    var PersonLeave = function (personLeave) {
        if (!personLeave) personLeave = {};

        var PersonLeave = {
            sYear: personLeave.sYear || today.getFullYear(),
            sMonth: personLeave.sMonth || (today.getMonth() + 1),
            sDay: personLeave.sDay || today.getDate(),
            sHour: personLeave.sHour || null,
            sMinute: personLeave.sMinute || null,
            eYear: personLeave.sYear || today.getFullYear(),
            eMonth: personLeave.eMonth || (today.getMonth() + 1),
            eDay: personLeave.eDay || today.getDate(),
            eHour: personLeave.eHour || null,
            eMinute: personLeave.eMinute || null,
            TotalDays: personLeave.TotalDays || null,
            TotalHours: personLeave.TotalHours || null,
            Member: personLeave.Member || null,
            Agent: personLeave.Agent || null,
            OtherLeaveType: personLeave.OtherLeaveType || null,
            Reason: personLeave.Reason || null,
            Memo: personLeave.Memo || null,
            LeaveType: personLeave.LeaveType || $scope.LeaveType.length > 0 ? $scope.LeaveType[0].TypeID:null,
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
    // #endregion
    // #region NewPersonLeave viewmodel
    $scope.NewPersonLeave = {
        SubjectID: '',
        DiscID: $scope.discId,
        SubjType: 0,
        Title: '',
        Receipts: [],
        Content: '',
        Attatchs: [],
        SubjectColor: SubjectColor.Unmarked,
        DiscType: DiscType.PersonLeave,
        DiscName: $scope.discName,
        ModifiedOn: '',
        CreatedOn: '',
        PersonLeave: $scope.PersonLeave
    };
    // #endregion
    // #region 收件人初始設定
    $scope.receipts = null;
    $scope.departments = null;
    $scope.selectedReceipts = [];
    // #endregion
    // #region 下拉選單收件人的樣板
    $scope.templates = EditorPara.ReceiptHtml;
    // #endregion
    // #region 取得收件人資料 + 收件人點擊反應
    function ReceiverMethod() {
        ReceiptsService.callReceipts($scope.discId, $scope.userID)
        .then(function (data) {
            // 部門
            $scope.departments = data.departments;
            // 收件人
            $scope.receipts = data.receipts;
            // 已選擇的收件人
            $scope.selectedReceipts = data.selectReceipts;            // 預設請假人員
            $scope.PersonLeave['Member'] = $filter('filter')($scope.receipts, { UserId: $scope.userID })[0];
        }, function (data) {
        });

        // 選擇的收件人發生變化時同步更新
        $scope.$watch('receipts', function (newValue, oldValue, scope) {
            if (!angular.equals(newValue, oldValue)) {
                $scope.selectedReceipts = filterFilter($scope.receipts, { selected: true });
            }
        }, true);

        // 選擇的收件人發生變化時同步更新
        $scope.$watch('selectedReceipts', function (newValue, oldValue, scope) {
            angular.forEach(scope.receipts, function (item) {
                item.selected = false;
            });
            angular.forEach(newValue, function (item) {
                item.selected = true;
            });
        });
    }
    // #endregion
    // #region 附件初始化設定
    var AttatchOptions = {
        url: '/Attatch/Upload',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        autoUpload: true,
        formData: [
            {
                CompanyId: $scope.companyID,
                DiscussionID: $scope.discId,
                UserId: $scope.userID,
                UserName: $scope.UserName
            }
        ]
    }

    var uploader = $scope.uploader = new FileUploader(AttatchOptions);

    // FILTERS
    uploader.filters.push({
        name: 'customFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            return this.queue.length < 20;
        }
    });

    var controller = $scope.controller = {
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
    $scope.remove = removeItem;
    $scope.removeAll = removeAll;
    // #endregion
    // #region 檔案上傳 and 移除
    // #region 移除檔案
    // 移除單一檔案
    function removeItem(item) {
        if (item._xhr) {
            var itemObj = angular.fromJson(item._xhr.response);
            AttatchService.RemoveItem(itemObj.DataObj);
            item.remove();
        } else {
            var index = uploader.queue.indexOf(item);
            uploader.queue.splice(index, 1);
        }
    }
    // 移除全部檔案
    function removeAll() {
        // 從顯示清單移除
        uploader.clearQueue();
        // 將IsDelete設為true
        AttatchService.RemoveAll();
    };

    // #endregion 
    // On file upload Success
    uploader.onSuccessItem = function (fileItem, response, status, headers) {
        $log.info('onSuccessItem', fileItem, response, status, headers);
        // 上傳完檔案後
        AttatchService.InsertToAttatch(response.DataObj);
    };
    // On file upload Success
    uploader.onErrorItem = function (fileItem, response, status, headers) {
        $log.info('onErrorItem', fileItem, response, status, headers);
        var index = uploader.queue.indexOf(fileItem);
        $log.info('index:' + index);
        uploader.queue.splice(index, 1);
        $log.info('queue:' + uploader.queue);
        // 發生錯誤
        var _Msg = $filter('translate')('FileSizeFail');
        alert(_Msg);
    };
    // #endregion
    // #region 表格的值修改時檢查必填或做計算
    $scope.checkVal = function (prop, properr, error) {
        // 檢查是不是有值決定要不要改變errorClass
        var item = $scope.PersonLeave;
        if (item[properr] == error && item[prop] == null)
            item[properr] = error;
        else
            item[properr] = null;
    };
    // #endregion
    // #region 儲存
    $scope.save = function () {
        // #region 驗證欄位
        if (typeof $scope.title == 'undefined') {
            var typeSubj = $filter('translate')('typeSubj');
            alert(typeSubj);
            return;
        }

        if ($scope.selectedReceipts.length == 0) {
            alert($filter('translate')('Choose_Receivrer'));
            return;
        }

        // 驗證有沒有填寫每一個欄位
        var needToFills = [];
        if ($scope.PersonLeave['Member'] == null) {
            needToFills.push({ value: 'Member' });
        }
        if ($scope.PersonLeave['sYear'] == null) {
            needToFills.push({ value: 'sYear' });
        }
        if ($scope.PersonLeave['sMonth'] == null) {
            needToFills.push({ value: 'sMonth' });
        }
        if ($scope.PersonLeave['sDay'] == null) {
            needToFills.push({ value: 'sDay' });
        }
        if ($scope.PersonLeave['sHour'] == null) {
            needToFills.push({ value: 'sHour' });
        }
        if ($scope.PersonLeave['sMinute'] == null) {
            needToFills.push({ value: 'sMinute' });
        }
        if ($scope.PersonLeave['eYear'] == null) {
            needToFills.push({ value: 'eYear' });
        }
        if ($scope.PersonLeave['eMonth'] == null) {
            needToFills.push({ value: 'eMonth' });
        }
        if ($scope.PersonLeave['eDay'] == null) {
            needToFills.push({ value: 'eDay' });
        }
        if ($scope.PersonLeave['eHour'] == null) {
            needToFills.push({ value: 'eHour' });
        }
        if ($scope.PersonLeave['eMinute'] == null) {
            needToFills.push({ value: 'eMinute' });
        }
        if ($scope.PersonLeave['TotalDays'] == null) {
            needToFills.push({ value: 'TotalDays' });
        }
        if ($scope.PersonLeave['TotalHours'] == null) {
            needToFills.push({ value: 'TotalHours' });
        }

        if (needToFills.length > 0) {
            angular.forEach(needToFills, function (value, key) {
                if (value.value == 'Member') {
                    $scope.PersonLeave.MemberError = 'error';
                }
                if (value.value == 'sYear') {
                    $scope.PersonLeave.sYearError = 'error';
                }
                if (value.value == 'sMonth') {
                    $scope.PersonLeave.sMonthError = 'error';
                }
                if (value.value == 'sDay') {
                    $scope.PersonLeave.sDayError = 'error';
                }
                if (value.value == 'sHour') {
                    $scope.PersonLeave.sHourError = 'error';
                }
                if (value.value == 'sMinute') {
                    $scope.PersonLeave.sMinuteError = 'error';
                }
                if (value.value == 'eYear') {
                    $scope.PersonLeave.eYearError = 'error';
                }
                if (value.value == 'eMonth') {
                    $scope.PersonLeave.eMonthError = 'error';
                }
                if (value.value == 'eDay') {
                    $scope.PersonLeave.eDayError = 'error';
                }
                if (value.value == 'eHour') {
                    $scope.PersonLeave.eHourError = 'error';
                }
                if (value.value == 'eMinute') {
                    $scope.PersonLeave.eMinuteError = 'error';
                }
                if (value.value == 'TotalDays') {
                    $scope.PersonLeave.TotalDaysError = 'error';
                }
                if (value.value == 'TotalHours') {
                    $scope.PersonLeave.TotalHoursError = 'error';
                }
            });
            return;
        }
        // #endregion

        // 轉存收件人陣列 
        var receiptsForSend = [];
        angular.forEach($scope.selectedReceipts, function (value, key) {
            receiptsForSend.push(value.UserId);
        });

        // 轉換選擇的人員
        if ($scope.PersonLeave['Agent'] !== null) {
            $scope.PersonLeave['Agent'] = $scope.PersonLeave['Agent'].UserId;
        }
        $scope.PersonLeave['Member'] = $scope.PersonLeave['Member'].UserId;
        // 新訊息物件
        $scope.NewPersonLeave = {
            DiscID: $scope.discId,
            CreatorID: $scope.userID,
            CreatorName: $scope.userName,
            SubjectColor: SubjectColor.Unmarked,
            DiscType: DiscType.PersonLeave,
            DiscName: $scope.discName,
            CompID: $scope.companyID,
            Title: $scope.title,
            Receipts: receiptsForSend,
            Content: $scope.text,
            Attatchs: AttatchService.Attatchs,
            PersonLeave: $scope.PersonLeave,
            //行政區暫不增加主題標籤
            SubjTagID: null,
            SubjTagName: '',
            CusTagID: null,
            CusTagName: ''
        }
        // 確定儲存
        AddNewPersonLeaveService.save($scope.NewPersonLeave)
        .success(function (response) {
            if (response.IsSuccessful) {
                $scope.loadingText = $filter('translate')('CreateMsgOk');
                $scope.NewPersonLeave.SubjectID = response.DataObj.SubjectID;
                $scope.NewPersonLeave.CreatedOn = response.DataObj.CreatedOn;
                $scope.NewPersonLeave.ModifiedOn = response.DataObj.ModifiedOn;

                // 廣播新增完成由companyMessageCtrl監聽
                $rootScope.$broadcast(SubjectEvent.Inserted, $scope.NewPersonLeave);
                $scope.disableMsgBlock();

            } else {
                $scope.loadingText = $filter('translate')('CreateMsgFail');
            }
        })
        .error(function (error) {
        });
    };
    // #endregion
    // #region 取消
    $scope.cancelNew = function () {
        RightSide.DeleteNewSubjBlock();
    };
    // #endregion
    // #region 草稿
    var saveDraft = function () {
        var now = new Date();
        //$scope.DraftMessage = $filter('translate')('On') + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + $filter('translate')('Save_Draft');

        // 草稿訊息物件viewmodel
        //$scope.DraftMessage = {
        //    DiscID: $scope.discId,
        //    CreatorID: $scope.userID,
        //    CreatorName: $scope.userName,
        //    CompID: $scope.companyID,
        //    Title: $scope.title,
        //    Receipts: receiptsForSend,
        //    Content: $scope.text,
        //    Attatchs: AttatchService.Attatchs,
        //    SubjectColor: SubjectColor.Unmarked,
        //    PlanDate: $filter('date')($scope.dueDate, 'yyyy-MM-dd') || "",
        //    DiscType: DiscType.Normal,
        //    DiscName: $scope.discName

        //}

    };
    // 定時儲存
    //var intervalPromise = $interval(saveDraft, Draft.Timeout);
    // #endregion
}]);