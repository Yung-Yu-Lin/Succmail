SuccApp.controller('DiscManageCtrl', ['$scope', 'ReceiptsService', 'DiscType', 'DiscManageService', 'filterFilter', 'LeaveTypes', '$filter', 'EditorPara', function ($scope, ReceiptsService, DiscType, DiscManageService, filterFilter, LeaveTypes, $filter, EditorPara) {
    $scope.isShowMemberReceiptsMenu = false;
    $scope.isShowRegularReceiptsMenu = false;
    $scope.isShowGeneralSetting = true;
    $scope.isShowAdminSetting = false;
    $scope.isShowFlow = false;
    $scope.isShowLeaveTypes = false;

    // 要操作DOM的物件
    var discSetting = new DiscSetting();
    // #region 收件人
    $scope.MemberDepartmentsForDiscManage = [];
    $scope.MemberReceiptsForDiscManage = null;
    $scope.RegularDepartmentsForDiscManage = [];
    $scope.RegularReceiptsForDiscManage = [];
    $scope.TempDepartmentsForDiscManage = [];
    $scope.TempReceiptsForDiscManage = [];
    // 選擇的成員
    $scope.selectedMemberForDiscManage = [];
    // 選擇的預設收件人
    $scope.selectedRegularForDiscManage = [];

    GetAllCompUser();

    function GetAllCompUser()
    {
        // 公司所有成員
        ReceiptsService.GetCompUsers($scope.CurrentCompany.CompanyID)
        .then(function (data) {
            // 成員部門
            $scope.MemberDepartmentsForDiscManage = ReceiptsService.getDepartments();
            // 成員收件人
            $scope.MemberReceiptsForDiscManage = ReceiptsService.getReceipts();

            angular.copy($scope.MemberDepartmentsForDiscManage, $scope.TempDepartmentsForDiscManage);
            // 因為有相同的hashkey 才對的到
            // 從Department把Receipts抽出來才有辦法雙向綁定否則用copy的話只會單向綁定
            $scope.TempReceiptsForDiscManage = ReceiptsService.getReceiptsInDepartment($scope.TempDepartmentsForDiscManage);
        }, function (data) {
        });
    }

    // 下拉選單收件人的樣板
    $scope.templatesForDiscManage = EditorPara.ReceiptHtml;

    // #region 成員發生變化時
    $scope.$watch('MemberReceiptsForDiscManage', function (newValue, oldValue, scope) {
        if (!angular.equals(newValue, oldValue)) {
            scope.selectedMemberForDiscManage = filterFilter(scope.MemberReceiptsForDiscManage, { selected: true });
        }

    }, true);
    // 成員下拉選單發生變化時
    $scope.$watch('selectedMemberForDiscManage', function (newValue, oldValue, scope) {
        // 把所有人先取消選取
        angular.forEach(scope.MemberReceiptsForDiscManage, function (item) {
            item.selected = false;
        });
        angular.forEach(newValue, function (item) {
            item.selected = true;
            setRegularMember(item);

        });
        // 比對選擇的成員陣列長度跟固定成員的長度
        // 如果選擇的成員陣列長度跟固定成員的長度不一樣
        if ($scope.selectedMemberForDiscManage.length !== $scope.RegularReceiptsForDiscManage.length) {
            resetRegularMember();
        }
    });
    // #endregion

    // #region 預設收件人發生變化時
    //$scope.$watch('RegularReceiptsForDiscManage', function (newValue, oldValue, scope) {
    //    if (!angular.equals(newValue, oldValue)) {
    //        scope.selectedRegularForDiscManage = filterFilter(scope.RegularReceiptsForDiscManage, { selected: true });
    //    }
    //}, true);
    // 預設收件人下拉選單發生變化時
    //$scope.$watch('selectedRegularForDiscManage', function (newValue, oldValue, scope) {
    //    var tmpArr = [];
    //    // 把所有人先取消選取
    //    angular.forEach(scope.RegularReceiptsForDiscManage, function (item) {
    //        item.selected = false;
    //    });
    //    angular.forEach(newValue, function (item) {
    //        item.selected = true;
    //        tmpArr.push(item.UserId);
    //    });
    //    // 選擇管理員後同步新增至預設收件人
    //    angular.forEach(scope.RegularReceiptsForDiscManage, function (item) {
    //        if (tmpArr.indexOf(item.UserId) > -1) {
    //            item.selected = true;
    //        } else {
    //            item.selected = false;
    //        }
    //    });
    //}, true);
    // #endregion

    // #endregion
    // 簽核viewmodel
    var Flow = function (flow) {
        if (!flow) flow = {};
        var Flow = {
            Name: flow.Name || null,
            AuditID: flow.AuditID || null,
            showDel: false,
            isValid: false
        };
        return Flow;
    };
    $scope.Flows = [];
    // 請假外出類型
    var LeaveType = function (leaveType) {
        if (!leaveType) leaveType = {};
        var LeaveType = {
            ID: leaveType.ID || null,
            Name: leaveType.Name || null,
            showDel: false
        };
        return LeaveType;
    };
    $scope.LeaveTypes = [];
    // 討論組新增viewmodel
    var DiscussionSetting = function (discussionSetting) {
        if (!discussionSetting) discussionSetting = {};
        var DiscussionSetting = {
            CompID: $scope.CurrentCompany.CompanyID,
            BossID: $scope.IndexData.CurrentUser.UserID,
            DiscName: discussionSetting.Name || null,
            DiscussionType: discussionSetting.DiscussionType || null,
            AdminID: discussionSetting.AdminID || null,
            Member: discussionSetting.Member || [],
            RegularMember: discussionSetting.RegularMember || [],
            Flow: discussionSetting.Flow || [],
            LeaveTypeTitle: discussionSetting.LeaveTypeTitle || null,
            LeaveType: discussionSetting.LeaveType || [],
        };
        return DiscussionSetting;
    };
    // 討論組說明Viewmodel
    var DiscussionMore = function (discussionMore) {
        if (!discussionMore) discussionMore = {};
        var DiscussionMore = {
            Title: discussionMore.Title || null,
            Desc: discussionMore.Desc || null,
            Content: discussionMore.Content || null,
            MoreView: discussionMore.MoreView || null
        };
        return DiscussionMore;
    };
    // 先初始化viewmodel成一般討論組
    $scope.DiscussionSetting = new DiscussionSetting({ DiscussionType: DiscType.Normal });
    // 初始化新增討論組的畫面
    $scope.disableNewDiscussion = function () {
        $scope.showNewDiscussion = null;
    };
    // 切換行政區討論組新增設定頁面
    $scope.discSetting = function ($event, page) {
        switch (page) {
            case 'general':
                $scope.isShowGeneralSetting = true;
                $scope.isShowAdminSetting = false;
                discSetting.settingGeneral();
                // 初始化viewmodel
                $scope.DiscussionSetting = new DiscussionSetting({ DiscussionType: DiscType.Normal });

                break;
                // 簽核型討論組首頁
            case 'admin':
                $scope.isShowGeneralSetting = false;
                $scope.isShowAdminSetting = true;
                discSetting.settingAdmin();
                initData(false);
                break;
            case 'purchs':
                // 初始化viewmodel
                $scope.Flows.push(new Flow({}));
                $scope.isShowFlow = true;
                $scope.DiscussionSetting = new DiscussionSetting({ DiscussionType: DiscType.Purchasing });
                $scope.DiscussionMore = new DiscussionMore(DiscManageService.getDiscPurchasingMore());
                discSetting.templateSettingAdmin('0');
                break;
            case 'applyMoney':
                // 初始化viewmodel
                $scope.Flows.push(new Flow({}));
                $scope.isShowFlow = true;
                $scope.DiscussionSetting = new DiscussionSetting({ DiscussionType: DiscType.ApplyMoney });
                $scope.DiscussionMore = new DiscussionMore(DiscManageService.getDiscApplyMoneyMore());
                discSetting.templateSettingAdmin('1');
                break;
            case 'personLeave':
                // 初始化viewmodel
                $scope.isShowLeaveTypes = true;
                $scope.DiscussionSetting = new DiscussionSetting({ DiscussionType: DiscType.PersonLeave, LeaveTypeTitle: $filter('translate')('LeaveCategory') });
                $scope.DiscussionMore = new DiscussionMore(DiscManageService.getDiscPersonLeaveMore());
                discSetting.templateSettingAdmin('2');
                PersonTypeInit();
                discSetting.toggleDelBtn();
                break;
            case 'overTime':
                // 初始化viewmodel
                $scope.DiscussionSetting = new DiscussionSetting({ DiscussionType: DiscType.Overtime });
                $scope.DiscussionMore = new DiscussionMore(DiscManageService.getDiscOverTimeMore());
                discSetting.templateSettingAdmin('3');

                break;
            case 'goOut':
                // 初始化viewmodel
                $scope.isShowLeaveTypes = true;
                $scope.DiscussionSetting = new DiscussionSetting({ DiscussionType: DiscType.GoOut, LeaveTypeTitle: $filter('translate')('OutCategory') });
                $scope.DiscussionMore = new DiscussionMore(DiscManageService.getDiscGoOutMore());
                discSetting.templateSettingAdmin('4');
                OutTypeInit();
                discSetting.toggleDelBtn();
                break;
            default:
                break;

        }
    };
    // 切換行政區討論組新增說明頁面
    $scope.discDesc = function ($event, page) {
        // 防止進入設定頁面
        $event.stopPropagation();
        switch (page) {
            case 'purchs':
                // 初始化viewmodel
                $scope.Flows.push(new Flow({}));
                $scope.isShowFlow = true;
                $scope.DiscussionSetting = new DiscussionSetting({ DiscussionType: DiscType.Purchasing });
                $scope.DiscussionMore = new DiscussionMore(DiscManageService.getDiscPurchasingMore());
                discSetting.templateMore('0');
                break;
            case 'applyMoney':
                // 初始化viewmodel
                $scope.Flows.push(new Flow({}));
                $scope.isShowFlow = true;
                $scope.DiscussionSetting = new DiscussionSetting({ DiscussionType: DiscType.ApplyMoney });
                $scope.DiscussionMore = new DiscussionMore(DiscManageService.getDiscApplyMoneyMore());
                discSetting.templateMore('1');
                break;
            case 'personLeave':
                $scope.isShowLeaveTypes = true;
                $scope.DiscussionSetting = new DiscussionSetting({ DiscussionType: DiscType.PersonLeave });
                $scope.DiscussionMore = new DiscussionMore(DiscManageService.getDiscPersonLeaveMore());
                discSetting.templateMore('2');
                break;
            case 'overTime':
                $scope.DiscussionMore = new DiscussionMore(DiscManageService.getDiscOverTimeMore());
                discSetting.templateMore('3');
                break;
            case 'goOut':
                $scope.isShowOutTypes = true;
                $scope.DiscussionSetting = new DiscussionSetting({ DiscussionType: DiscType.GoOut });
                $scope.DiscussionMore = new DiscussionMore(DiscManageService.getDiscGoOutMore());
                discSetting.templateMore('4');
                break;
            default:
                break;

        }
    };
    // 切換行政區討論組新增說明頁面
    $scope.optionsMore = function () {
        discSetting.optionsMore();
    };
    // 切換行政區討論組新增設定頁面
    $scope.optionsSet = function () {
        discSetting.optionsSet();
    };
    // 返回選擇頁
    $scope.returnAdminSet = function () {
        if (confirm($filter('translate')('BackCheckMessage'))) {
            discSetting.returnAdminSet();
            $scope.$broadcast('initNewDiscussion', { 'init': false });
        }
    };
    // 成員
    angular.element('#NewDiscussionModal').on('focus', '.chosen-container:eq(0)', function (e) {
        if ($scope.isShowMemberReceiptsMenu === false) {
            $scope.isShowMemberReceiptsMenu = true;
            $scope.isShowRegularReceiptsMenu = false;
            $scope.$apply();
            $(this).css({ 'z-index': 1051 });
            discSetting.setReceiptPosition();
        }
    });
    // 預設收件人
    angular.element('#NewDiscussionModal').on('focus', '.chosen-container:eq(1)', function (e) {
        if ($scope.isShowRegularReceiptsMenu === false) {
            $scope.isShowMemberReceiptsMenu = false;
            $scope.isShowRegularReceiptsMenu = true;
            $scope.$apply();
            $(this).css({ 'z-index': 1049 });
            discSetting.setReceiptPosition();
        }
    });
    // #region 行為
    $scope.hideBlackpad = function () {
        $scope.isShowMemberReceiptsMenu = false;
        $scope.isShowRegularReceiptsMenu = false;
    };
    // 選擇管理員時同步新增到預設收件人和成員
    $scope.selectAdmin = function () {
        $scope.DiscussionSetting['AdminID'].selected = true;
        $scope.selectedMemberForDiscManage.push($scope.DiscussionSetting['AdminID']);
        $scope.selectedRegularForDiscManage.push($scope.DiscussionSetting['AdminID']);
    };
    // 新增簽核步驟
    $scope.AddStep = function () {
        if ($scope.Flows.length <= 5) {
            $scope.Flows.push(new Flow({}));
            // #region 計算寬度
            if ($scope.Flows.length < 5)
                $scope.FlowStyle = { 'width': (100 / ($scope.Flows.length + 1) - 8) + '%' };
            else
                $scope.FlowStyle = { 'width': (100 / $scope.Flows.length) - 8 + '%' };
            // #endregion
        }
    };
    // 出現刪除按鈕
    $scope.showDel = function (item) {
        item.showDel = true;
    };
    // 隱藏刪除按鈕
    $scope.hideDel = function (item) {
        item.showDel = false;
    };
    // 刪除簽核
    $scope.delStep = function (item) {
        // 只剩一個不能刪
        if ($scope.Flows.length > 1) {
            $scope.Flows.splice($scope.Flows.indexOf(item), 1);
        }
    };
    // 刪除LeaveType
    $scope.delType = function (item) {
        // 只剩一個不能刪
        if ($scope.LeaveTypes.length > 1) {
            $scope.LeaveTypes.splice($scope.LeaveTypes.indexOf(item), 1);
        }
    };
    // 新增LeaveType
    $scope.AddLeaveType = function (TypeName) {
        if (typeof TypeName !== 'undefined') {
            $scope.LeaveTypes.push(new LeaveType({ 'Name': TypeName }));
        }
        $scope.TypeName = '';
    };
    // change Audit Select
    $scope.changeAudit = function (item) {
        if (item.Name === null) {
            item.Name = item.AuditID.UserName;
        }
    };
    // 初始化資料
    var initData = function (init) {
        GetAllCompUser();
        // 清空已選成員
        $scope.selectedMemberForDiscManage = [];
        // 清空已選預設收件人
        $scope.selectedRegularForDiscManage = [];
        // 清空已設定的簽核
        $scope.Flows = [];
        // 清空viewmodel
        $scope.DiscussionSetting = new DiscussionSetting({ DiscussionType: DiscType.Normal });
        // 隱藏簽核
        $scope.isShowFlow = false;
        // 清空已設定的事假別
        $scope.LeaveTypes = [];
        // 如果是第一次進入頁面
        if (init === true) {
            discSetting.initdiscussionsetting();
            // 再把showNewDiscussion 關掉
            $scope.showNewDiscussion = false;
            // 以一般討論組設定為優先讓下次進來時先顯示一般討論組
            $scope.isShowGeneralSetting = true;
            // 行政類討論組設定關閉
            $scope.isShowAdminSetting = false;
            // 如果只是跳出行政區設定
        } else {
            $scope.isShowLeaveTypes = false;
        }
    };
    // 監聽初始化資料事件
    $scope.$on('initNewDiscussion', function (event, data) {
        initData(data.init);
        console.log(data.init);
    });
    // 儲存 
    $scope.Save = function () {
        $scope.GeneralDiscSave = true;
        // #region 驗證欄位必填
        // 名稱
        if ($scope.DiscussionSetting['DiscName'] === null) {
            $scope.GeneralDiscSave = false;
            return;
        }
        // 成員
        if ($scope.selectedMemberForDiscManage.length === 0) {
            $scope.GeneralDiscSave = false;
            return;
        }
        // 預設收件人
        if ($scope.selectedRegularForDiscManage.length === 0) {
            $scope.GeneralDiscSave = false;
            return;
        }
        // 行政區檢查簽核
        if ($scope.DiscussionSetting['DiscussionType'] === DiscType.Purchasing || $scope.DiscussionSetting['DiscussionType'] === DiscType.ApplyMoney) {
            angular.forEach($scope.Flows, function (value, key) {
                if (value.AuditID === null) {
                    value.isValid = false;
                }
                else {
                    value.isValid = true;
                }
            });
            if (filterFilter($scope.Flows, { isValid: false }).length > 0) {
                return;
            }
            else {
                angular.forEach($scope.Flows, function (value, key) {
                    value.AuditID = value.AuditID.UserId;
                });
                $scope.DiscussionSetting['Flow'] = $scope.Flows;
            }
        }
        // #endregion

        // #region 塞viewmodel
        var tempArr = [];
        // 管理者
        $scope.DiscussionSetting['AdminID'] = $scope.DiscussionSetting['AdminID'].UserId;
        // 成員
        angular.forEach($scope.selectedMemberForDiscManage, function (value, key) {
            tempArr.push(value.UserId);
        });
        $scope.DiscussionSetting['Member'] = tempArr;
        tempArr = [];
        // 預設收件人
        angular.forEach($scope.selectedRegularForDiscManage, function (value, key) {
            tempArr.push(value.UserId);
        });
        $scope.DiscussionSetting['RegularMember'] = tempArr;
        $scope.DiscussionSetting['Leave'] = $scope.LeaveTypes;

        // #endregion

        // #region 送出後端
        var promise = DiscManageService.Create($scope.DiscussionSetting);
        promise.success(function (payload) {
            $scope.GeneralDiscSave = false;
            // 顯示回傳的物件
            var DiscObj = {
                DiscussionID: payload.DataObj.DiscID,
                DiscussionTitle: $scope.DiscussionSetting['DiscName'],
                DiscussionType: $scope.DiscussionSetting['DiscussionType'],
                MyBoxCountByDisc: 0,
                SubjectCount: 0,
                isPublic: false
            };
            if ($scope.DiscussionSetting['DiscussionType'] === DiscType.Normal) {
                $scope.CurrentCompany['DiscussionCate'][0]['Discussions'].push(DiscObj);
            } else {
                $scope.CurrentCompany['DiscussionCate'][1]['Discussions'].push(DiscObj);
            }
        })
        .error(function () {
            alert('create disc error');
        });

        angular.element('#NewDiscussionModal').modal('hide');
        $scope.showNewDiscussion = false;

        // #endregion
    };
    // #endregion

    // 初始化請假類型
    var PersonTypeInit = function () {
        $scope.LeaveTypes = [];
        angular.forEach(LeaveTypes.PersonLeave, function (value) {
            $scope.LeaveTypes.push(new LeaveType({ Name: $filter('translate')(value) }));
        });
    };
    // 初始化外出類型
    var OutTypeInit = function () {
        $scope.LeaveTypes = [];
        angular.forEach(LeaveTypes.GoOut, function (value) {
            $scope.LeaveTypes.push(new LeaveType({ Name: $filter('translate')(value) }));
        });
    };

    // 產生固定收件人
    // 1. 從成員收件人部門陣列裡的成員陣列找出這筆receipt和department
    // 2. 把這筆department直接塞到固定收件人的部門陣列RegularDepartmentsForDiscManage
    // 3. 把這筆receipt塞到固定收件人陣列RegularReceiptsForDiscManage
    function setRegularMember(receiptItem) {
        var members = [];
        var destDept = [];
        angular.forEach($scope.TempDepartmentsForDiscManage, function (item, key) {
            if (key !== 0) {
                members = $filter('filter')(item.Receipts, { UserId: receiptItem.UserId })[0];
                if (members !== undefined) {
                    // 先塞部門
                    // 沒有這筆部門資料才push
                    if ($filter('filter')($scope.RegularDepartmentsForDiscManage, { DepartmantID: item.DepartmantID })[0] === undefined) {
                        // 過濾出這筆成員然後塞這筆成員給他                        
                        // 從MemberReceiptsForDiscManage copy 出來再塞進去
                        angular.copy(item, destDept);
                        destDept.Receipts.length = 0;
                        $scope.RegularDepartmentsForDiscManage.push(destDept);
                    } else {
                    }

                    // 再塞下拉成員
                    // 沒有這筆下拉成員才塞
                    if ($filter('filter')($scope.RegularReceiptsForDiscManage, { UserId: members.UserId })[0] === undefined) {
                        // 從RegularDepartmentsForDiscManage找出這筆部門
                        // 再塞到部門成員裡
                        $filter('filter')($scope.RegularDepartmentsForDiscManage, { DepartmantID: item.DepartmantID })[0].Receipts.push(members);
                        $scope.RegularReceiptsForDiscManage.push(members);
                    }
                }
            }
        });
    };

    // 重新整理固定收件人
    // 1. 跑固定收件人迴圈一一跟選擇成員比對
    // 2. 以選擇的成員ID過濾出固定收件人
    function resetRegularMember() {
        var tempArr = [];
        var temp = null;
        var removeKey = null;
        var tempRegular = [];
        angular.copy($scope.RegularReceiptsForDiscManage, tempRegular);
        $scope.RegularReceiptsForDiscManage = null;
        $scope.RegularReceiptsForDiscManage = [];

        angular.forEach($scope.selectedMemberForDiscManage, function (item, key) {
            temp = $filter('filter')(tempRegular, { UserId: item.UserId })[0];
            if (temp !== undefined) {
                //$scope.RegularReceiptsForDiscManage.push(temp);
                tempArr.push(temp);
            }
        });

        $scope.RegularReceiptsForDiscManage = tempArr;
        // 重整部門
        //angular.forEach($scope.RegularDepartmentsForDiscManage, function (dept) {
        //    angular.forEach(dept.Receipts, function (receipt, key2) {
        //        if (removeKey === null) {
        //            if ($filter('filter')(tempArr, { UserId: receipt.UserId })[0] === undefined) {
        //                removeKey = key2;
        //                dept.Receipts.splice(key2, 1);
        //            }
        //        }
        //    });
        //});
    };
}]);