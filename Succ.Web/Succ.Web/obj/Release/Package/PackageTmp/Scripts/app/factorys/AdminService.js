SuccApp.factory('AdminService', ['$http', '$q', function ($http, $q) {
    // service Singleton Object
    var AdminSrv = {};
    
    
    // #region 驗證與計算總金額
    AdminSrv.Cal = function (model ,$index, prop, properr, error) {
        var Total = 0;
        // 檢查是不是有值決定要不要改變errorClass
        var item = model[$index];
        if (item[prop] === '') {
            item[prop] = null;
        }

        if (item[properr] === error && item[prop] === null)
            item[properr] = error;
        else
            item[properr] = null;

        // 如果是價格和數量就做計算
        if (prop === 'pPrice' || prop === 'pQty') {
            if (item.pPrice !== null && item.pQty !== null) {
                item.pTotal = item.pPrice * item.pQty;
            } else {
                item.pTotal = null;
            }
        }
        // 加總
        var totalPrice = 0;
        angular.forEach(model, function (value, key) {
            if (value['pPrice'] !== null && value['pQty'] !== null) {
                totalPrice += parseFloat(value.pTotal);
            }
        });
        return {
            Total: totalPrice,
            Model: model
        };
    };

    AdminSrv.ValidPurchase = function (model) {
        // 驗證有沒有填寫每一個欄位
        var needToFills = [];
        var isValid = false;
        angular.forEach(model, function (value, key) {
            // 有填就要驗證
            if (value.pName === null && value.pPrice === null && value.pQty === null && value.pMemo === null) {
                // 讓他一定要從第一行開始填
                if (key === 0) {
                    needToFills.push({ key: key, value: 'pName' });
                    needToFills.push({ key: key, value: 'pPrice' });
                    needToFills.push({ key: key, value: 'pQty' });
                }
            } else {
                if (value.pName === null || value.pName.length < 1) {
                    needToFills.push({ key: key, value: 'pName' });
                }
                if (value.pPrice === null) {
                    needToFills.push({ key: key, value: 'pPrice' });
                }
                if (value.pQty === null) {
                    needToFills.push({ key: key, value: 'pQty' });
                }
            }
        });
        if (needToFills.length > 0) {
            angular.forEach(needToFills, function (value, key) {

                if (value.value === 'pName') {
                    model[value.key].pNameError = 'error';
                }
                if (value.value === 'pPrice') {
                    model[value.key].pPriceError = 'error';
                }
                if (value.value === 'pQty') {
                    model[value.key].pQtyError = 'error';
                }
            });
        } else {
            isValid = true;
        }

        return {
            Model: model,
            isValid: isValid
        };
    };
    AdminSrv.ValidApplyMoney = function (model) {
        // 驗證有沒有填寫每一個欄位
        var needToFills = [];
        var isValid = false;
        angular.forEach(model, function (value, key) {
            // 有填就要驗證
            if (value.pDate === null && value.pName === null && value.pPrice === null && value.pQty === null && value.pMemo === null) {
                // 讓他一定要從第一行開始填
                if (key === 0) {
                    needToFills.push({ key: key, value: 'pDate' });
                    needToFills.push({ key: key, value: 'pName' });
                    needToFills.push({ key: key, value: 'pPrice' });
                    needToFills.push({ key: key, value: 'pQty' });
                }
            } else {
                if (value.pDate === null) {
                    needToFills.push({ key: key, value: 'pDate' });
                }
                if (value.pName === null || value.pName.length < 1) {
                    needToFills.push({ key: key, value: 'pName' });
                }
                if (value.pPrice === null) {
                    needToFills.push({ key: key, value: 'pPrice' });
                }
                if (value.pQty === null) {
                    needToFills.push({ key: key, value: 'pQty' });
                }
            }
        });
        if (needToFills.length > 0) {
            angular.forEach(needToFills, function (value, key) {
                if (value.value == 'pDate') {
                    model[value.key].pDateError = 'error';
                }
                if (value.value === 'pName') {
                    model[value.key].pNameError = 'error';
                }
                if (value.value === 'pPrice') {
                    model[value.key].pPriceError = 'error';
                }
                if (value.value === 'pQty') {
                    model[value.key].pQtyError = 'error';
                }
            });
        } else {
            isValid = true;
        }

        return {
            Model: model,
            isValid: isValid
        };
    };
    // #endregion

    // #region 後端處理
    // 送出審核
    AdminSrv.AuditSubmit = function (updateAudit) {
        // 送到後端
        return $http.post('/ApplyMoney/AuditSubmit', updateAudit);
    };

    // 送出還原審核
    AdminSrv.RestoreAuditSubmit = function (updateAudit) {
        // 送到後端
        return $http.post('/ApplyMoney/RestoreAudit', updateAudit);
    };

    // 送出重新審核
    AdminSrv.ReSign = function (updateAudit) {
        // 送到後端
        return $http.post('/ApplyMoney/ReSign', updateAudit);
    };

    // 行政區退回並重新審核
    AdminSrv.AdminBack = function (updateAudit) {
        // 送到後端
        return $http.post('/ApplyMoney/ReSignAdminBack', updateAudit);
    };
    // #endregion
    return AdminSrv;
}]);