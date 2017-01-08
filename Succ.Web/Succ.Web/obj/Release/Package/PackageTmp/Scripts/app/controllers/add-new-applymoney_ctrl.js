SuccApp.controller('AddNewAppplyMoneyCtrl', ['$scope', 'FileUploader', '$log', 'AttatchService', 'ImageService', 'filterFilter', '$filter', '$rootScope', 'AddNewApplyMoneyService', 'DiscType', 'SubjectColor', '$timeout', 'SubjectEvent', 'Draft', '$interval', '$translate', 'EditorPara', 'AdminService', 'ReceiptsService', 'RightSide', '$sce', function ($scope, FileUploader, $log, AttatchService, ImageService, filterFilter, $filter, $rootScope, AddNewApplyMoneyService, DiscType, SubjectColor, $timeout, SubjectEvent, Draft, $interval, $translate, EditorPara, AdminService, ReceiptsService, RightSide,$sce)
{
    AttatchService.Attatchs.splice(0, AttatchService.Attatchs.length);
    // #region �򥻰ѼƳ]�w
    $scope.discId = $scope.CurrentDiscussion.discID;
    $scope.discName = $scope.CurrentDiscussion.discName;
    $scope.userID = $scope.IndexData.CurrentUser.UserID;
    $scope.companyID = $scope.CurrentCompany.CompanyID;
    $scope.userName = $scope.IndexData.CurrentUser.UserName;
    $scope.DraftMessage = '';
    $scope.Total = 0;
    $scope.complicateTitle = $scope.title + ' ' + $filter('currency')($scope.Total);
    // �w�]��l����(�д�)����
    var defaultItem = 5;
    $scope.purchases = [];
    // #endregion
    // #region �ڶ��л�浧 Viewmodel
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
    // #region �s�W�ڶ��л� viewmodel
    $scope.NewApplyMoney = {
        SubjectID: '',
        DiscID: $scope.discId,
        SubjType: 0,
        Title: '',
        Receipts: [],
        Content: '',
        Attatchs: [],
        SubjectColor: SubjectColor.Unmarked,
        PlanDate: '',
        DiscType: DiscType.ApplyMoney,
        DiscName: $scope.discName,
        ModifiedOn: '',
        CreatedOn: '',
        ApplyMoney: []
    };
    // #endregion
    // #region �s�W�T���ɭn�����ͦh�ֵ�(defautItem�M�w)
    for (var i = 0; i < defaultItem; i++)
    {
        $scope.purchases.push(new Purchase({}));
    };
    // #endregion
    // #region ����H��l�]�w
    $scope.receipts = null;
    $scope.departments = null;
    $scope.selectedReceipts = [];
    // #endregion
    // #region ��������H���
    ReceiptsService.callReceipts($scope.discId, $scope.userID)
    .then(function (data) {
        // ����
        $scope.departments = data.departments;
        // ����H
        $scope.receipts = data.receipts;
        // �w��ܪ�����H
        $scope.selectedReceipts = data.selectReceipts;
    }, function (data) {
        
    });
    // #endregion
    // #region �U�Կ�榬��H���˪O
    $scope.templates = EditorPara.ReceiptHtml;
    // #endregion
    // #region ��ܪ�����H�o���ܤƮɦP�B��s
    $scope.$watch('receipts', function (newValue, oldValue, scope)
    {
        if (!angular.equals(newValue, oldValue))
        {
            $scope.selectedReceipts = filterFilter($scope.receipts, { selected: true });
        }
    }, true);
    // #endregion
    // #region ��ܪ�����H�o���ܤƮɦP�B��s
    $scope.$watch('selectedReceipts', function (newValue, oldValue, scope) {
        angular.forEach(scope.receipts, function (item) {
            item.selected = false;
        });
        angular.forEach(newValue, function (item) {
            item.selected = true;
        });
    });
    // #endregion
    // #region ����
    // #region init��l�Ƴ]�w
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
    // #region �ɮפW�� and ����
    // #region �����ɮ�
    // ������@�ɮ�
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
    // ���������ɮ�
    function removeAll() {
        // �q��ܲM�沾��
        uploader.clearQueue();
        // �NIsDelete�]��true
        AttatchService.RemoveAll();
    };

    // #endregion 
    // On file upload Success
    uploader.onSuccessItem = function (fileItem, response, status, headers) {
        $log.info('onSuccessItem', fileItem, response, status, headers);
        // �W�ǧ��ɮ׫�
        AttatchService.InsertToAttatch(response.DataObj);

    };
    // On file upload Success
    uploader.onErrorItem = function (fileItem, response, status, headers) {
        $log.info('onErrorItem', fileItem, response, status, headers);
        var index = uploader.queue.indexOf(fileItem);
        $log.info('index:' + index);
        uploader.queue.splice(index, 1);
        $log.info('queue:' + uploader.queue);
        // �o�Ϳ��~
        var _Msg = $filter('translate')('FileSizeFail');
        alert(_Msg);
    };

    // On file upload complete (independently of the sucess of the operation)
    //uploader.onCompleteItem = function (fileItem, response, status, headers) {
    //    $log.info('onCompleteItem', fileItem, response, status, headers);
    //    // �W�ǧ��ɮ׫�
    //    AttatchService.InsertToAttatch(response.DataObj);

    //};

    // #endregion
    // #endregion
    // #region init��l�Ƴ]�w
    $scope.options = EditorPara.Para;
    $scope.text = $sce.getTrustedHtml('<p><br></p>');
    $scope.imageUpload = imageUpload;
    $scope.imageRemove = imageRemove;
    // #endregion
    // #region �W�ǹϤ�
    function imageUpload(files, editor, welEditable) {
        var fm = new FormData();
        fm.append('file', files[0]);

        fm.append('CompanyId', $scope.companyID);
        fm.append('DiscussionID', $scope.discId);
        fm.append('UserId', $scope.userID);
        fm.append('UserName', $scope.UserName);
        if (files[0].type.indexOf('image') > -1) {
            // �O���O���O�Ϥ�
            fm.append('isEmbed', true);
            var promise = ImageService.upload(fm);

            promise.then(
               function (payload) {
                   AttatchService.InsertToAttatch(payload.data.DataObj);
                   var imagepath = '/Attatch/getImg/?CompanyId=' + payload.data.DataObj.CompanyID + '&FileName=' + payload.data.DataObj.AttID +'.'+ payload.data.DataObj.FileType;
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
            // ���O���ܴN�[������C
            uploader.addToQueue(files[0], AttatchOptions, uploader.filters);
        }
    };
    // #endregion
    // #region �����Ϥ�
    function imageRemove(target, editor, welEditable) {
        var img = angular.element(target);
        AttatchService.RemoveItem({ AttID: img.data('filename') });
    };
    // #endregion
    // #region datepicker angular UI bootstrap

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
        for (item in $scope.purchases) {
            if ($scope.purchases[item] === $scope.purchases[$index]) {
                $scope.purchases[item].datepickerOpened = true;
            } else {
                $scope.purchases[item].datepickerOpened = false;
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
    // #region ��檺�ȭק���ˬd����ΰ��p��
    $scope.checkVal = function ($index, prop, properr, error) {
        //�˴����ĴX�����ڶ��л�A���Ĥ�����B�S��s���̤j���ɤ~�s�W�@���Ū��ڶ��л�
        if ($index >= 4 && $index == ($scope.purchases.length - 1)) {
            $scope.purchases.push(new Purchase({}));
        }
        var result = AdminService.Cal($scope.purchases, $index, prop, properr, error);
        $scope.purchases = result.Model;
        $scope.Total = result.Total;
    };
    // #endregion
    // #region �x�s
    $scope.save = function () {

        // #region�������
        if (typeof $scope.title === 'undefined') {
            var typeSubj = $filter('translate')('typeSubj');
            alert(typeSubj);
            return;
        }

        if ($scope.selectedReceipts.length === 0) {
            alert($filter('translate')('Choose_Receivrer'));
            return;
        }

        var result = AdminService.ValidApplyMoney($scope.purchases);
        $scope.purchases = result.Model;
        if (result.isValid === false) {
            return;
        }
        // #endregion
        // #region��s����H�}�C 
        var receiptsForSend = [];
        angular.forEach($scope.selectedReceipts, function (value, key) {
            receiptsForSend.push(value.UserId);
        });
        // #endregion
        angular.forEach(AttatchService.Attatchs, function (value, key) {

        });
        // #region�e�X�T����ViewModel
        $scope.NewApplyMoney = {
            DiscID: $scope.discId,
            CreatorID: $scope.userID,
            CreatorName: $scope.userName,
            SubjectColor: SubjectColor.Unmarked,
            DiscType: DiscType.ApplyMoney,
            DiscName: $scope.discName,
            CompID: $scope.companyID,
            Title: $scope.title,
            Receipts: receiptsForSend,
            Content: $scope.text,
            Attatchs: AttatchService.Attatchs,
            ApplyMoney: $filter('adminFilter')($scope.purchases, 'pDate'),
            //��F�ϼȤ��W�[�D�D����
            SubjTagID: null,
            SubjTagName: '',
            CusTagID: null,
            CusTagName: ''
        }
        // #endregion
        // #region�T�w�x�s
        AddNewApplyMoneyService.save($scope.NewApplyMoney)
        .success(function (response) {
            if (response.IsSuccessful) {
                $scope.loadingText = $filter('translate')('CreateMsgOk');
                $scope.NewApplyMoney.SubjectID = response.DataObj.SubjectID;
                $scope.NewApplyMoney.CreatedOn = response.DataObj.CreatedOn;
                $scope.NewApplyMoney.ModifiedOn = response.DataObj.ModifiedOn;

                // �s���s�W������companyMessageCtrl��ť
                $rootScope.$broadcast(SubjectEvent.Inserted, $scope.NewApplyMoney);
                $scope.disableMsgBlock();

            }
        })
        .error(function (error) {
        });
        // #endregion
    };
    // #endregion
    // #region ����
    $scope.cancelNew = function () {
        RightSide.DeleteNewSubjBlock();
    };
    // #endregion
    // #region ��Z
    var saveDraft = function () {
        var now = new Date();
        //$scope.DraftMessage = $filter('translate')('On') + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + $filter('translate')('Save_Draft');

        // ��Z�T������viewmodel
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
    // �w���x�s
    //var intervalPromise = $interval(saveDraft, Draft.Timeout);
    // #endregion
}]);