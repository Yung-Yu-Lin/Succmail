SuccApp.factory('SubDetail', ['$rootScope', '$http', 'SubjectEvent', function ($rootScope, $http, SubjectEvent) {
    var factory = {};
    // #region 依據不同主題列表來源，進行不同的廣播
    //未讀訊息
    function NoRead(data) {
        //NoReadProgress
        BroadCastAndHandle(data,'NoreadProgress');
    }
    //我的信箱
    function MyBox(data) {
        //MyBoxProgress
        BroadCastAndHandle(data, 'MyBoxProgress');
    }
    //收藏夾
    function MyFav(data) {
        //OriginalProgress
        BroadCastAndHandle(data,'OriginalProgress');
    }
    //討論組主題列表
    function DiscList(data) {
        //DiscListProgress
        BroadCastAndHandle(data, 'DiscListProgress');
    }
    //已讀主題列表
    function ReadList(data) {
        //ReadListProgress
        BroadCastAndHandle(data, 'ReadListProgress');
    }
    //申請歸檔主題列表
    function ApplyList(data) {
        //ApplyListProgress
        BroadCastAndHandle(data, 'ApplyListProgress');
    }
    //完成區主題列表
    function FinishList(data) {
        //FinishListProgress
        BroadCastAndHandle(data, 'FinishListProgress');
    }
    //搜尋主題列表
    function SearchList(data) {
        //SearchListProgress
        BroadCastAndHandle(data, 'SearchListProgress');
    }
    //完成處理廣播及接受廣播
    function BroadCastAndHandle(data, Target)
    {
        //廣播
        $rootScope.$broadcast(Target,data);
    }
    // #endregion
    // #region 拿取主題詳細頁資料
    factory.GetSubjDetail = function (param)
    {
        return $http.get("/Subject/GetDetail/?SubjectID=" + param.SubjectID + "&UserID=" + param.UserID);
    };
    // #endregion
    // #region 拿取主題詳細頁回覆資料
    factory.GetSubjReply = function (param)
    {
        return $http.get("/Subject/GetReplyList/?SubjectID=" + param.SubjectID + "&UserID=" + param.UserID);
    };
    // #endregion
    // #region 獨立取得主題詳細頁的簽核資料
    factory.GetSubjFlow= function (param) {
        return $http.get("/Subject/GetSubjFlowData/?SubjectID=" + param);
    };
    // #endregion
    // #region 接收點擊主題展開之來源
    factory.OpenSubDetail = function (DiscID, CompanyID, UserID, SubjectID, UserName, type) {
        //Source 0:未讀訊息廣播 1:我的信箱廣播 2:收藏夾廣播 3:主題列表廣播 4:已讀廣播 5:申請歸檔廣播 6:完成區廣播 7:搜尋列表廣播 8:Email(不廣播)
        //Sub Detail Para
        $rootScope.$broadcast('OpenDetail',
        {
            DiscID: DiscID,
            CompID: CompanyID,
            UserID: UserID,
            SubID: SubjectID,
            UserName: UserName,
            Type: type
        });
    };
    // #endregion
    // #region 反映點擊主題之來源
    factory.onOpenSubDetail = function ($scope, process) {
        $scope.$on('OpenDetail', function (event, Data) {
            process(Data);
        });
    };
    // #endregion
    // #region 編輯主題
    factory.Edit = function (detail) {
        $rootScope.$broadcast('EditDetail', detail);
    };
    // #endregion
    // #region 發出請求到後端更新讀取狀態
    factory.UpdateReadState = function (meInReceipts, subjId, userId, compId, discId)
    {
        meInReceipts.UserReadStatus = 1;
        $http.post('/Subject/UpdateReadState',
            { UserID: userId, SubjID: subjId, CompID: compId })
        .success(function (payload) {
            if (payload.IsSuccessful === true) {
                // 廣播事件======>更新已讀取 讓每一個列表頁監聽事件來更新狀態
                $rootScope.$broadcast(SubjectEvent.ReadStateUpdated, { NoReadCount: payload.DataObj, SubjID: subjId, DiscID: discId, CompID: compId });
            } else {
            }
        })
        .error(function (error) {
        });
    };
    // #endregion
    // #region 監聽事件==更新讀取
    factory.onUpdateReadState = function (process) {
        $rootScope.$on(SubjectEvent.ReadStateUpdated, function (event, data) {
            process(data);
        });
    };
    // #endregion
    // #region 主題狀態程序處理
    factory.SubjectProgress = function (param)
    {
        if (param != null)
        {
            return $http.post('/Subject/SettingProgress', param);
        }
    };
    // #endregion
    // #region 完成歸檔後，單獨拿取processData
    factory.GetProcessData = function (param)
    {
        return $http.get('/Subject/GetProcessData/?SubjID=' + param);
    };
    // #endregion
    // #region 監聽事件======>更新主題狀態 讓每一個列表監聽
    factory.onUpdateSubjectProgress = function (Source,process)
    {
        //Source 0:未讀訊息廣播 1:我的信箱廣播 2:收藏夾廣播 3:主題列表廣播 4:已讀廣播 5:申請歸檔廣播 6:完成區廣播 7:搜尋列表廣播 8:Email(不廣播)
        switch (Source)
        {
            case 0:
                $rootScope.$on('NoreadProgress', function (event, Data) {
                    process(Data);
                });
                break;
            case 1:
                $rootScope.$on('MyBoxProgress', function (event, Data) {
                    process(Data);
                });
                break;
            case 2:
                $rootScope.$on('OriginalProgress', function (event, Data) {
                    process(Data);
                });
                break;
            case 3:
                $rootScope.$on('DiscListProgress', function (event, Data) {
                    process(Data);
                });
                break;
            case 4:
                $rootScope.$on('ReadListProgress', function (event, Data) {
                    process(Data);
                });
                break;
            case 5:
                $rootScope.$on('ApplyListProgress', function (event, Data) {
                    process(Data);
                });
                break;
            case 6:
                $rootScope.$on('FinishListProgress', function (event, Data) {
                    process(Data);
                });
                break;
            case 7:
                $rootScope.$on('SearchListProgress', function (event, Data) {
                    process(Data);
                });
                break;
        }
    };
    // #endregion
    // #region 接收所有更新主題狀態事件
    factory.UpdateSubjectProgress = function (data)
    {
        //Source 0:未讀訊息廣播 1:我的信箱廣播 2:收藏夾廣播 3:主題列表廣播 4:已讀廣播 5:申請歸檔廣播 6:完成區廣播 7:搜尋列表廣播 8:Email(不廣播)
        switch (data['Source'])
        {
            case 0:
                NoRead(data);
                break;
            case 1:
                MyBox(data);
                break;
            case 2:
                MyFav(data);
                break;
            case 3:
                DiscList(data);
                break;
            case 4:
                ReadList(data);
                break;
            case 5:
                ApplyList(data);
                break;
            case 6:
                FinishList(data);
                break;
            case 7:
                SearchList(data);
                break;
        }
        //$rootScope.$broadcast(SubjectEvent.UpdateSubjectProgress, data);
    };
    // #endregion
    // #region 廣播事件======>行政區主題退回 讓每一個列表監聽
    factory.AdminBack = function (data) {
        $rootScope.$broadcast(SubjectEvent.UpdateSubjectProgress, data);
    };
    // #endregion
    // #region 查看是否有權限讀取主題
    factory.GetRightToAccess = function (param) {
        return $http.get("/Subject/GetRightToSubjDetail/?CompID=" + param.CompID + "&UserID=" + param.UserID + "&SubjID=" + param.SubjID);
    };
    // #endregion
    return factory;
}]);