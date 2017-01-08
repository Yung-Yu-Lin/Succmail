SuccApp.factory('ReceiptsService', ['$http', '$q','$filter', function ($http, $q, $filter) {
    // service Singleton Object
    var ReceiptsSrv = {};
    // #region 可存取的物件
    var lockUser = null;
    // property:收件人
    var _receipt = {};
    // property:收件人陣列
    var _receipts = [];
    // property:部門
    var _department = {};
    //亂樹時間參數
    var t = new Date();

    // 部門ViewModel
    var Department = function (department) {
        if (!department) department = {};

        var Department = {
            DepartmantID: department.DepartmantID || null,
            DepartmantName: department.DepartmantName || null,
            Receipts: [],
            selected: false
        }
        return Department;
    }

    // 部門成員ViewModel
    var Receipt = function (receipt) {
        if (!receipt) receipt = {};
        var Receipt = {
            UserId: receipt.UserId || null,
            UserName: receipt.UserName || null,
            UserEmail: receipt.UserEmail || null,
            UserImgPath: receipt.UserImgPath || null,
            IsRegular: (receipt.IsRegular || receipt.UserId === lockUser) || false,
            selected: (receipt.IsRegular || receipt.UserId === lockUser) || false,
            isImgIcon: receipt.isImgIcon || false,
            PhotoCss: receipt.PhotoCss || null,
            PhotoTxt: receipt.PhotoTxt || null
        }
        return Receipt;
    }

    // property:部門陣列
    var _departments = [];

    // #endregion
    // 取得討論組成員
    ReceiptsSrv.callReceipts = function (discId, userId) {
        lockUser = userId;
        var deferred = $q.defer();

        var result = {
            departments: [],
            receipts: [],
            selectReceipts:[]
        };

        $http.get('/Receipt/GetReceipts?DiscID=' + discId + "&t=" + t.getTime())
        .success(function (data) {
            ReceiptsSrv.setDepartments(data);
            result.departments = ReceiptsSrv.getDepartments();
            result.receipts = ReceiptsSrv.getReceipts();
            result.selectReceipts = $filter('filter')(result.receipts, { IsRegular: true });
            deferred.resolve(result);
        })
        .error(function () {
            deferred.reject('error get receipts');
        });
        return deferred.promise;
    }

    // 取公司成員
    ReceiptsSrv.GetCompUsers = function (compId) {
        // 送到後端
        var deferred = $q.defer();
        $http.get('/Receipt/GetCompanyUser?compId=' + compId + "&t=" + t.getTime())
        .success(function (data) {
            ReceiptsSrv.setDepartments(data);
            deferred.resolve(data);
        })
        .error(function () {
            deferred.reject('發生錯誤');
        });
        return deferred.promise;
    };
    // setter 部門
    ReceiptsSrv.setDepartments = function (data) {
        _departments = [];
        _receipts = [];
        // 繞回圈存部門進viewmodel
        angular.forEach(data, function (department, key) {
            if (department.Receipts.length > 0) {
                _department = new Department(department);
                // 繞回圈存收件人進viewmodel
                angular.forEach(department.Receipts, function (receipt, key) {
                    _receipt = new Receipt(receipt);
                    _department.Receipts.push(_receipt);
                    // 純收件人陣列
                    _receipts.push(_receipt);
                });
                _departments.push(_department);
            }
        });
        _departments.splice(0, 0, { DepartmantID: "0", DepartmantName: $filter('translate')('AllMember'), Receipts: _receipts });
    };

    // getter 部門
    ReceiptsSrv.getDepartments = function () {
        return _departments;
    };

    // getter 收件人
    ReceiptsSrv.getReceipts = function () {
        return _receipts;
    };

    ReceiptsSrv.getReceiptsInDepartment = function (department) {
        var receiptInDepartment = [];
        // 繞回圈存部門進viewmodel
        angular.forEach(department, function (item,key) {
            if (key > 0) {
                if (item.Receipts.length > 0) {
                    // 繞回圈存收件人進viewmodel
                    angular.forEach(item.Receipts, function (receipt, key) {
                        //_receipt = new Receipt(receipt);
                        // 再 new 一個物件的話參考會對不到無法雙向綁定，所以必須是原來的Receipts塞進去
                        // 純收件人陣列
                        receiptInDepartment.push(receipt);
                    });
                }
            }
        });
        return receiptInDepartment;
    };

    return ReceiptsSrv;
}]);