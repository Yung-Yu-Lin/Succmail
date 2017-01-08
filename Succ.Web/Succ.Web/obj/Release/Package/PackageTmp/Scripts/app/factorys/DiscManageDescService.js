SuccApp.factory('DiscManageService', ['$sce','$http',function ($sce, $http) {
    var DiscManageSrv = {};

    // 採購計畫詳細內容
    DiscManageSrv.getDiscPurchasingMore = function () {
        return {
            Title: '採購計畫',
            Desc: $sce.trustAsHtml('採購內容、比價、確認採購，簡單而完整的記錄與統計，一氣呵成！<br />具備簡易的簽核流程。<div id=\'detailIcon\' class=\'purchs-icon\'></div>'),
            Content: $sce.trustAsHtml('設定審核人員進行跑關流程，依序通知內部審核人員執行簽和動作。<br />線上版的申請採購計畫程序，省去傳統紙本文件的傳遞時間。<div class=\'detailOptionsMoreCheckPhoto\'></div>'),
            MoreView: '/Statics/img/ng_new-group-2-purchs.png'
        };
    };

    // 款項請領詳細內容
    DiscManageSrv.getDiscApplyMoneyMore = function () {
        return {
            Title: '款項請領',
            Desc: $sce.trustAsHtml('幫您記錄公費支出的所有細項，還能自動統計金額。<br />具備簡易的簽核流程。<div id=\'detailIcon\' class=\'applyMoney-icon\'></div>'),
            Content: $sce.trustAsHtml('設定審核人員進行跑關流程，依序通知內部審核人員執行簽和動作。<br />線上版的申請款項請領程序，省去傳統紙本文件的傳遞時間。<div class=\'detailOptionsMoreCheckPhoto\'></div>'),
            MoreView: '/Statics/img/ng_new-group-1-applyMoney.png'
        };
    };

    // 請假區詳細內容
    DiscManageSrv.getDiscPersonLeaveMore = function () {
        return {
            Title: '請假區',
            Desc: $sce.trustAsHtml('幫您記錄公費支出的所有細項，還能自動統計金額。具備簡易的簽核流程。<div id=\'detailIcon\' class=\'personLeave-icon-reversed\'></div>'),
            Content: '',
            MoreView: '/Statics/img/ng_new-group-3-personalLeave.png'
        };
    };

    // 加班區詳細內容
    DiscManageSrv.getDiscOverTimeMore = function () {
        return {
            Title: '加班區',
            Desc: $sce.trustAsHtml('要加班請登記於此，我們自動幫您按月統計。<div id=\'detailIcon\' class=\'overTime-icon-reversed\'></div>'),
            Content: '',
            MoreView: '/Statics/img/ng_new-group-4-overTime.png'
        };
    };

    // 外出單詳細內容
    DiscManageSrv.getDiscGoOutMore = function () {
        return {
            Title: '外出單',
            Desc: $sce.trustAsHtml('出外洽公確實登記，免於紙上作業的不便，還能自動按月統計。<div id=\'detailIcon\' class=\'goOut-icon-reversed\'></div>'),
            Content: '',
            MoreView: '/Statics/img/ng_new-group-5-goOut.png'
        };
    };

    DiscManageSrv.Create = function (discussion) {
        return $http.post('/DiscManage/Create', discussion);
    };
    return DiscManageSrv;
}]);