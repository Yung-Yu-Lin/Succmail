SuccApp.controller('AddNewMessageCtrl', ['GetBackendData', '$location', '$scope', 'FileUploader', '$log', 'AttatchService', 'ImageService', 'filterFilter', '$filter', '$rootScope', 'AddNewMessageService', 'DiscType', 'SubjectColor', '$timeout', 'SubjectEvent', 'Draft', '$interval', '$translate', 'EditorPara', 'ReceiptsService', 'AddNewDraftService', 'RightSide', 'SubjectProgress', 'getdraft', '$sce', 'UniqueComp', 'Filesize_Conf', function (GetBackendData, $location, $scope, FileUploader, $log, AttatchService, ImageService, filterFilter, $filter, $rootScope, AddNewMessageService, DiscType, SubjectColor, $timeout, SubjectEvent, Draft, $interval, $translate, EditorPara, ReceiptsService, AddNewDraftService, RightSide, SubjectProgress, getdraft, $sce, UniqueComp, Filesize_Conf)
{
    // #region 給定從草稿出來的物件
    var ReEditSubjDraft = $scope.$parent.$parent.ReEditNewSubjDraft;
    AttatchService.Attatchs.splice(0, AttatchService.Attatchs.length);
    $scope.$parent.$parent.ReEditNewSubjDraft = {};
    // #endregion
    // #region 設定定時儲存
    SettingInterval();
    // #endregion
    // #region 取得基本參數
    //var _UserName = $scope.$parent.$parent.$parent.$parent.IndexData.CurrentUser['UserName'];
    $scope.discId = $scope.CurrentDiscussion.discID;
    $scope.discName = $scope.CurrentDiscussion.discName;
    $scope.userID = $scope.IndexData.CurrentUser.UserID;
    $scope.companyID = $scope.CurrentCompany.CompanyID;
    $scope.userName = $scope.IndexData.CurrentUser.UserName;
    var date = new Date();
    $scope.createDate = date;
    //顯示草稿儲存當下的時間在編輯器的右下角
    $scope.DraftMessage = '';
    //ui-select設定
    $scope.disabled = undefined;
    $scope.enable = function () {
        $scope.disabled = false;
    };
    $scope.disable = function () {
        $scope.disabled = true;
    };
    $scope.clear = function () {
        $scope.subjTag.selected = undefined;
    };
    //預設無主題標籤
    $scope.EventTag = [];
    $scope.SubjEventTag = {};
    //預設無對象標籤
    $scope.CusTag = [];
    $scope.SubjCusTag = {};
    //預設不顯示新增事件標籤頁面
    $scope.IsShowEventTag = false;
    $scope.EventTagStyle = { 'display': 'none' };
    //取得主題標籤Service
    AddNewMessageService.GetEventTag($scope.companyID)
    .then(function (result)
    {
        $scope.EventTag = result.data;
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
    //取得對象標籤Service
    AddNewMessageService.GetCusTag($scope.companyID)
    .then(function (result)
    {
        $scope.CusTag = result.data;
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
        InitDraftCusTag();
    });
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
            CompanyID: $scope.companyID,
            UserID: $scope.userID,
            TagType: $scope.JudgTagType,
            SubjTagList: $scope.NewAddEventTag
        });
        GetBackendData.AddNewTag(_Para)
            .then(function (result) {
                if (result.data.IsSuccess)
                {
                  //如果C#controller新增完回傳回來的TagType等於0，就把新增的資料放進事件標籤的scope
                  if(result.data.TagType == 0)
                  {
                      $scope.EventTag.push(result.data);
                      //新增完後，保留剛剛新增輸入的值
                      $scope.SubjEventTag.selected = $filter('filter')($scope.EventTag, { SubjTagId: result.data.SubjTagId }, true);
                  }
                  //如果C#controller新增完回傳回來的TagType不等於0，就把新增的資料放進對象標籤的scope
                  else
                  {
                      $scope.CusTag.push(result.data);
                      //新增完後，保留剛剛新增輸入的值
                      $scope.SubjCusTag.selected = $filter('filter')($scope.CusTag, { SubjTagId: result.data.SubjTagId }, true);
                  }
                }
            });
        //新增完後隱藏及時新增的頁面
        $scope.EventTagStyle = { 'display': 'none' };
    };
    //存放儲存草稿後，回傳的物件 subjID,DraftID
    $scope.DraftObj = {};
    //存放新增主題的基本物件
    $scope.AddSubjObj = {};
    // #endregion
    // #region 呼叫判斷是否為草稿開啟新主題的方法
    IsReEditSubjDraft();
    // #endregion
    // #region 收件人
    $scope.AddReceiver = {};
    $scope.receipts = null;
    $scope.departments = null;
    $scope.AddReceiver.selectedReceipts = [];
    // #endregion
    // #region 新增訊息viewmodel
    $scope.NewMessage = {
        SubjectID: '',
        DiscID: $scope.discId,
        SubjType: 0,
        Title: '',
        Receipts: [],
        Content: '',
        Attatchs: [],
        SubjectColor: SubjectColor.Unmarked,
        PlanDate: '',
        DiscType: DiscType.Normal,
        DiscName: '',
        ModifiedOn: '',
        CreatedOn: ''
    };
    // #endregion
    // #region 收件人Data
    ReceiptsService.callReceipts($scope.discId, $scope.userID)
    .then(function (data) {
        // 部門
        $scope.departments = data.departments;
        // 收件人
        $scope.receipts = data.receipts;
        // 已選擇的收件人
        $scope.AddReceiver.selectedReceipts = data.selectReceipts;
        //未選擇的收件人
        $scope.unSelectedReceipts = $filter('filter')($scope.receipts, { selected: false }, true);
        //草稿收件人初始化
        IsDraftReceiver();

    }, function (data) {
    });
    // #endregion
    // #region 下拉選單收件人的樣板
    $scope.templates = EditorPara.ReceiptHtml;
    // #endregion
    // #region 左方選擇的收件人發生變化時同步更新
    $scope.$watch('receipts', function (newValue, oldValue, scope)
    {
        if (!angular.equals(newValue, oldValue)) {
            $scope.AddReceiver.selectedReceipts = filterFilter($scope.receipts, { selected: true });
        }
    }, true);
    // #endregion
    // #region 下方選擇的收件人發生變化時同步更新
    $scope.$watch('AddReceiver.selectedReceipts', function (newValue, oldValue, scope) {
        angular.forEach(scope.receipts, function (item) {
            item.selected = false;
        });
        angular.forEach(newValue, function (item) {
            item.selected = true;
        });
    });
    // #endregion
    // #region init 初始化設定
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
    IsSettingAtt();
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
    // #region  移除檔案
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
    // 上傳檔案前大小判斷
    uploader.onBeforeUploadItem = function (item) {
        // 利用FormData 裡面的IsValidate來判斷是否超過10MB
        var _FileSize = item.file.size / 1024 / 1024;
        var _LimitSize = 0;
        switch ($scope.companyID) {
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
            $scope.uploader.formData[0].IsValidate = false;
        }
        else {
            $scope.uploader.formData[0].IsValidate = true;
        }
        Array.prototype.pop.apply(item.formData, []);
        Array.prototype.push.apply(item.formData, $scope.uploader.formData);
    };
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
    // #region init初始化設定
    $scope.options = EditorPara.Para;
    $scope.AddSubjObj.text = SettingIsDraftSubjContent();
    $scope.imageUpload = imageUpload;
    $scope.imageRemove = imageRemove;
    $scope.change = change;
    function change(contents, editable$) {
    }
    // #endregion
    // #region 上傳圖片
    function imageUpload(files, editor, welEditable) {
        var fm = new FormData();
        fm.append('file', files[0]);
        fm.append('CompanyId', $scope.companyID);
        fm.append('DiscussionID', $scope.discId);
        fm.append('UserId', $scope.userID);
        fm.append('UserName', $scope.UserName);

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
            uploader.addToQueue(files[0], AttatchOptions, uploader.filters);
        }
    };
    // #endregion
    // #region 移除圖片
    function imageRemove(target, editor, welEditable) {
        var img = angular.element(target);
        AttatchService.RemoveItem({ AttID: img.data('filename') });
    };
    // #endregion
    // #region 到期日angular UI bootstrap

    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.datepickerOpened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.initDate = new Date('2016-15-20');
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[1];
    // #endregion
    // #region 儲存
    $scope.save = function ()
    {
        // #region 驗證欄位
        if (typeof $scope.SubjEventTag.selected == 'undefined' || typeof $scope.SubjCusTag.selected == 'undefined')
        {
            alert($filter('translate')('AlertAddTag'));
            return;
        }
        if (typeof $scope.title == 'undefined') {
            var typeSubj = $filter('translate')('typeSubj');
            alert(typeSubj);
            return;
        }
        if ($scope.AddReceiver.selectedReceipts.length == 0) {
            alert($filter('translate')('Choose_Receivrer'));
            return;
        }
        //驗證檔案是否上傳完成
        var queueCount = $scope.uploader['queue'].length;
        if (queueCount > 0)
        {
            if(queueCount > AttatchService.Attatchs.length)
            {
                alert($filter('translate')('FileNotUploaded'));
                return;
            }
        }
        // #endregion
        // #region 驗證成功後關閉草稿的自動儲存
        $interval.cancel($scope.intervalPromise);
        // #endregion
        // #region 轉存收件人陣列
        var receiptsForSend = [];
        angular.forEach($scope.AddReceiver.selectedReceipts, function (value, key) {
            receiptsForSend.push(value.UserId);
        });
        // #endregion
        // #region 新訊息物件
        $scope.NewMessage =
        {
            DiscID: $scope.discId,
            CreatorID: $scope.userID,
            CreatorName: $scope.userName,
            CompID: $scope.companyID,
            Title: $scope.title,
            Receipts: receiptsForSend,
            Content: $scope.AddSubjObj.text,
            Attatchs: AttatchService.Attatchs,
            SubjectColor: SubjectColor.Unmarked,
            PlanDate: $filter('date')($scope.dueDate, 'yyyy/MM/dd') || "0",
            DiscType: DiscType.Normal,
            DiscName: $scope.discName,
            SubjTagID: null,
            SubjTagName: "",
            CusTagID: null,
            CusTagName: "",
            isDraft: 0,
            SubjectId: Object.getOwnPropertyNames($scope.DraftObj).length > 0 ? $scope.DraftObj['SubjectID'] : "",
        };
        // #endregion
        // #region 新增主題的標籤，判斷是從草稿帶過來的，還是自己重新選擇的
        IsSubjTagSettingBySelf();
        // #endregion
        // 確定儲存
        AddNewMessageService.save($scope.NewMessage)
        .success(function (response)
        {
            if (response.IsSuccessful)
            {
                $scope.NewMessage.SubjectID = response.DataObj.SubjectID;
                $scope.NewMessage.PlanDiff = response.DataObj.PlanDiff;
                $scope.NewMessage.CreatedOn = response.DataObj.CreatedOn;
                $scope.NewMessage.ModifiedOn = response.DataObj.ModifiedOn;
                $scope.NewMessage.PlanDate = $scope.NewMessage.PlanDate == "0" ? 0 : (Date.parse($scope.NewMessage.PlanDate) + 86400000) / 1000
                // 廣播新增完成由companyMessageCtrl監聽
                $rootScope.$broadcast(SubjectEvent.Inserted, $scope.NewMessage);
                // 草稿開啟的新增主題
                if(Object.getOwnPropertyNames(ReEditSubjDraft).length > 0)
                {
                    $rootScope.$broadcast('DraftToCreate', ReEditSubjDraft);
                }
                $scope.disableMsgBlock();
            }
        })
        .error(function (error) {
        });
    };
    // #endregion
    // #region 取消
    $scope.cancelNew = function () {
        AttatchService.Attatchs.splice(0, AttatchService.Attatchs.length);
        RightSide.DeleteNewSubjBlock();
        $scope.$parent.$parent.createMsgUrl = "";
    };
    // #endregion
    // #region 儲存草稿
    $scope.Draft = function () {
        saveDraft();
    };
    // #endregion
    // #region 草稿
    var saveDraft = function () {
        // #region  驗證欄位
        // 主題判斷
        if (typeof $scope.title == 'undefined')
        {
            return;
        }
        else
        {
            if ($scope.title.length < 1)
                return;
        }
        //沒有收件人
        if ($scope.AddReceiver.selectedReceipts.length == 0)
        {
            return;
        }
        // 主題內容判斷
        if ($scope.AddSubjObj.text.length <= 0)
        {
            return;
        }
        // #endregion

        // 轉存收件人陣列
        var receiptsForSend = [];
        angular.forEach($scope.AddReceiver.selectedReceipts, function (value, key) {
            receiptsForSend.push(value.UserId);
        });
        //angular.forEach(AttatchService.Attatchs, function (value, key) {

        //});

        //草稿訊息物件viewmodel
        $scope.DraftModel =
            {
                SubjectId: Object.getOwnPropertyNames($scope.DraftObj).length > 0 ? $scope.DraftObj['SubjectID'] : "",
                DiscID: $scope.discId,
                CreatorID: $scope.userID,
                CreatorName: $scope.userName,
                CompId: $scope.companyID,
                Title: $scope.title,
                //收件人
                Receipts: receiptsForSend,
                Content: $scope.AddSubjObj.text,
                //附件
                Attatchs: AttatchService.Attatchs,
                SubjectColor: SubjectColor.Unmarked,
                PlanDate: $filter('date')($scope.dueDate, 'yyyy-MM-dd HH:mm') || "0",
                DiscType: DiscType.Normal,
                DiscName: $scope.discName,
                //主題標籤
                SubjTagID: null,
                SubjTagName: "",
                CusTagID: null,
                CusTagName: "",
                isDraft: 1
            };
        // #region 新增主題的標籤，判斷是從草稿帶過來的，還是自己重新選擇的
        IsSubjTagSettingBySelf_Draft();
        // #endregion
        AddNewDraftService.save($scope.DraftModel)
        .success(function (response)
        {
            var now = new Date();
            $scope.DraftMessage = $filter('translate')('On') + now.getHours() + ':' + now.getMinutes() + $filter('translate')('Save_Draft');
            $scope.DraftObj = response.DataObj;
        })
        .error(function () {

        });

    };
    // #endregion
    // #region 定時儲存
    function SettingInterval()
    {
        $scope.intervalPromise = $interval(function () {
            saveDraft();
        }, Draft.Timeout);
    };
    // #endregion
    // #region 接聽新增主題頁面關閉，取消自動儲存Interval
    $rootScope.$on('CancelInterval', function () {
        $interval.cancel($scope.intervalPromise);
    });
    // #endregion
    // #region 接聽新增主題頁面重新開啟，重新啟動自動儲存Interval
    $rootScope.$on('ReStartInterval', function () {
        SettingInterval();
    });
    // #endregion
    // #region 無填入主題翻譯
    function noTitle()
    {
        var typeSubj = $filter('translate')('typeSubj');
        return;
    };
    // #endregion
    // #region (主題)新增主題的標籤，判斷是從草稿帶過來的，還是自己重新選擇的
    function IsSubjTagSettingBySelf()
    {
        if ($scope.SubjEventTag.selected != undefined)
        {
            //事件標籤ID
            $scope.NewMessage['SubjTagID'] = $scope.SubjEventTag.selected.__proto__.constructor['name'] == 'Array' ? $scope.SubjEventTag.selected[0].SubjTagId : $scope.SubjEventTag.selected['SubjTagId'];
            //事件標籤名稱
            $scope.NewMessage['SubjTagName'] = $scope.SubjEventTag.selected.__proto__.constructor['name'] == 'Array' ? $scope.SubjEventTag.selected[0].SubjTagIdName : $scope.SubjEventTag.selected['SubjTagIdName'];
        };
        if ($scope.SubjCusTag.selected != undefined)
        {
            //對象標籤ID
            $scope.NewMessage['CusTagID'] = $scope.SubjCusTag.selected.__proto__.constructor['name'] == 'Array' ? $scope.SubjCusTag.selected[0].SubjTagId : $scope.SubjCusTag.selected['SubjTagId'];
            //對象標籤名稱
            $scope.NewMessage['CusTagName'] = $scope.SubjCusTag.selected.__proto__.constructor['name'] == 'Array' ? $scope.SubjCusTag.selected[0].SubjTagIdName : $scope.SubjCusTag.selected['SubjTagIdName'];
        };
    }
    // #endregion
    // #region (草稿)新增主題的標籤，判斷是從草稿帶過來的，還是自己重新選擇的
    function IsSubjTagSettingBySelf_Draft() {
        if ($scope.SubjEventTag.selected != undefined) {
            //事件標籤ID
            $scope.DraftModel['SubjTagID'] = $scope.SubjEventTag.selected.__proto__.constructor['name'] == 'Array' ? $scope.SubjEventTag.selected[0].SubjTagId : $scope.SubjEventTag.selected['SubjTagId'];
            //事件標籤名稱
            $scope.DraftModel['SubjTagName'] = $scope.SubjEventTag.selected.__proto__.constructor['name'] == 'Array' ? $scope.SubjEventTag.selected[0].SubjTagIdName : $scope.SubjEventTag.selected['SubjTagIdName'];
        };
        if ($scope.SubjCusTag.selected != undefined) {
            //對象標籤ID
            $scope.DraftModel['CusTagID'] = $scope.SubjCusTag.selected.__proto__.constructor['name'] == 'Array' ? $scope.SubjCusTag.selected[0].SubjTagId : $scope.SubjCusTag.selected['SubjTagId'];
            //對象標籤名稱
            $scope.DraftModel['CusTagName'] = $scope.SubjCusTag.selected.__proto__.constructor['name'] == 'Array' ? $scope.SubjCusTag.selected[0].SubjTagIdName : $scope.SubjCusTag.selected['SubjTagIdName'];
        };
    }
    // #endregion
    // #region 判斷是否從草稿進來的收件人
    function IsDraftReceiver()
    {
        if (Object.getOwnPropertyNames(ReEditSubjDraft).length > 0)
        {
            //未選擇
            angular.forEach($scope.unSelectedReceipts, function (value, key)
            {
                var index = ReEditSubjDraft['Receipts'].indexOf(value.UserId);
                if (index != -1)
                {
                    $filter('filter')($scope.receipts, { UserId: value.UserId }, true)[0].selected = true;
                    $scope.AddReceiver.selectedReceipts.push(value);
                };
            });
        };
    };
    // #endregion
    // #region 判斷是否從草稿增加附件
    function IsSettingAtt()
    {
        if (Object.getOwnPropertyNames(ReEditSubjDraft).length > 0)
        {
            //設定草稿的附件
            angular.forEach(ReEditSubjDraft['Attatchs'], function (value, key) {
                //不是內簽圖才加入附件區
                if (value.isEmbed == false)
                {
                    $scope.uploader.queue.push({
                        file: {
                            name: value.FileName,
                            tyoe: value.FileType,
                            size: value.FileSize,
                        },
                        isUploaded: true,
                        isSuccess: false,
                        DataObj: value,
                        progress:100
                    });
                };
                //加入到附件的陣列
                AttatchService.InsertToAttatch(value);
            });
        };
    }
    // #endregion
    // #region 判斷是否是從草稿進來新增主題頁面的
    function IsReEditSubjDraft()
    {
        if (Object.getOwnPropertyNames(ReEditSubjDraft).length > 0)
        {
            //設定主題
            $scope.title = ReEditSubjDraft['Title'];
            //設定草稿的物件
            $scope.DraftObj =
                {
                    SubjectID: ReEditSubjDraft['SubjId'],
                    PlanDiff: ReEditSubjDraft['PlanCloseOn'],
                    CreatedOn: ReEditSubjDraft['DraftCreatedOn'],
                    ModifiedOn: ReEditSubjDraft['ModifiedOn'],
                    Attatchs: ReEditSubjDraft['Attatchs'],
                    isDraft: true,
                    DraftId: ReEditSubjDraft['DraftId']
                };          
        }
    };
    // #endregion
    // #region 判斷新增主題是否為草稿，來決定編輯器Content
    function SettingIsDraftSubjContent()
    {
        if (Object.getOwnPropertyNames(ReEditSubjDraft).length > 0)
        {
            return $sce.getTrustedHtml(ReEditSubjDraft['sContent']);
        }
        else
        {
            return $sce.getTrustedHtml('<p><br></p>');
        }
    }
    // #endregion
    // #region 初始化草稿動作標籤
    function InitDraftEventTag()
    {
        if (Object.getOwnPropertyNames(ReEditSubjDraft).length > 0) {
            //設定主題標籤
            var SubjTagID = parseInt(ReEditSubjDraft['SubjTagID']);
            if (!isNaN(SubjTagID)) {
                $scope.SubjEventTag.selected = $filter('filter')($scope.EventTag, { SubjTagId: SubjTagID }, true);
            };
        };
    };
    // #endregion
    // #region 初始化草稿對象標籤
    function InitDraftCusTag()
    {
        if (Object.getOwnPropertyNames(ReEditSubjDraft).length > 0) {
            //設定對象標籤
            var CusTagID = parseInt(ReEditSubjDraft['CusTagID']);
            console.log(CusTagID);
            if (!isNaN(CusTagID)) {
                $scope.SubjCusTag.selected = $filter('filter')($scope.CusTag, { SubjTagId: CusTagID }, true);
                console.log($scope.SubjCusTag.selected);
            };
        };
    };
    // #endregion
}]);