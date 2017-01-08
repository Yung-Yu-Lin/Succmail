SuccApp.config(['$routeProvider', '$locationProvider', '$httpProvider', '$translateProvider', 'ngClipProvider', 'LangFilter', function ($routeProvider, $locationProvider, $httpProvider, $translateProvider, ngClipProvider, LangFilter)
{
    $locationProvider.html5Mode(true);
    var CurrentCompanyID = $("#CurrentCompID").val();
    //設定複製URL
    ngClipProvider.setPath("/Scripts/lib/zclip/dist/ZeroClipboard.swf");
    //判斷瀏覽器多國語言
    var CurrentLang = window.navigator.language.toLowerCase();
    //英文
    $translateProvider.translations('en-us', LangFilter.en);
    //繁體中文
    $translateProvider.translations('zh-tw', LangFilter.tw);
    //簡體中文
    $translateProvider.translations('zh-cn', LangFilter.cn);
    //抓取瀏覽器語言
    var UserLang = window.navigator.language.toLowerCase();
    //設定語言
    $translateProvider.preferredLanguage(UserLang);
    //決定什麼時候使用 BlockUI
    $httpProvider.interceptors.push(function ($q, $rootScope) {
        return {
            'request': function (config)
            {
                //限制來源
                var subj = config.url.indexOf("GetDetail");
                var reply = config.url.indexOf("GetReplyList");
                var createReply = config.url.indexOf("CreateReply");
                var search = config.url.indexOf("GetSearchList");
                var indexData = config.url.indexOf("GetIndexData");
                var subjlist = config.url.indexOf("SubjectList");
                var Personal = config.url.indexOf("Personal");
                var createMsg = config.url.indexOf("CreateSubmit");
                var UpdateMsg = config.url.indexOf("UpdateSubmit");
                var editorTemplate = config.url.indexOf("/Subject/EditorTemplate");
                var UploadAtt = config.url.indexOf("/Attatch/Upload");
                var UpdateCompany = config.url.indexOf("UpdateIndexData");
                var subjIsDraft = 0;
                var replyIsDraft = 0;
                //主題草稿
                if (createMsg !== -1)
                {
                    subjIsDraft = config.data['isDraft'];
                    //行政區不儲存草稿
                    if(config.data['isDraft'] == undefined)
                    {
                        subjIsDraft = 0;
                    }
                }
                //回覆草稿
                if (createReply !== -1)
                {
                    replyIsDraft = config.data['isDraft'];
                    //行政區不儲存草稿
                    if (config.data['isDraft'] == undefined)
                    {
                        replyIsDraft = 0;
                    }
                }
                if (subj !== -1 || (createReply !== -1 && replyIsDraft == 0) || reply !== -1 || indexData !== -1 || subjlist !== -1 || Personal !== -1 || (createMsg !== -1 && subjIsDraft == 0) || (UpdateMsg !== -1 && subjIsDraft == 0) || editorTemplate !== -1 || UploadAtt !== -1 || UpdateCompany !== -1)
                {
                    $.blockUI();
                    //$rootScope.$broadcast('loading-start');
                }
                return config || $q.when(config);
            },
            'response': function (response) {
                //限制來源
                var subj = response.config.url.indexOf("GetDetail");
                var reply = response.config.url.indexOf("GetReplyList");
                var createReply = response.config.url.indexOf("CreateReply");
                //var subjTemplate = response.config.url.indexOf("SubDetailTemplate");
                var search = response.config.url.indexOf("GetSearchList");
                var indexData = response.config.url.indexOf("GetIndexData");
                var subjlist = response.config.url.indexOf("SubjectList");
                var Personal = response.config.url.indexOf("Personal");
                var createMsg = response.config.url.indexOf("CreateSubmit");
                var UpdateMsg = response.config.url.indexOf("UpdateSubmit");
                var editorTemplate = response.config.url.indexOf("/Subject/EditorTemplate");
                var UploadAtt = response.config.url.indexOf("/Attatch/Upload");
                var UpdateCompany = response.config.url.indexOf("UpdateIndexData");
                if (subj !== -1 || reply !== -1 || createReply !== -1 || search !== -1 || indexData !== -1 || Personal !== -1 || subjlist !== -1 || createMsg !== -1 || UpdateMsg !== -1 || editorTemplate !== -1 || UploadAtt !== -1 || UpdateCompany !== -1)
                {
                    $.unblockUI();
                    //$rootScope.$broadcast('loading-complete');
                }
                return response || $q.when(response);
            }
        };
    });

    // #region 防止IE快取
    $httpProvider.defaults.cache = false;
    if (!$httpProvider.defaults.headers.get)
    {
        $httpProvider.defaults.headers.get = {};
    }
    $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
    // #endregion
    //Book/Gatsby/ch/4?key=value
    $routeProvider
        .when('/mybox', {
            templateUrl: '/Succ/MyBox',
            controller: 'MyMessageCtrl'
        })
        .when('/mybox/:IsFirst', {
            templateUrl: '/Succ/MyBox',
            controller: 'MyMessageCtrl'
        })
        .when('/SubjList/:id', {
            templateUrl: '/Subject/SubjectList',
            controller: 'ComapnyMessageCtrl'
        })
        .when('/news', {
            templateUrl: '/Subject/NoReadList',
            controller: 'NoreadMsgCtrl'
        })
        .when('/my_draft', {
            templateUrl: '/Subject/MyDraft',
            controller: 'MyDraftCtrl'
        })
        .when('/my_favorite', {
            templateUrl: '/Subject/MyFavor',
            controller: 'MyFavoriteCtrl'
        })
        .when('/FinishList/:id', {
            templateUrl: '/Subject/FinishList',
            controller: ''
        })
        .when('/FileList/:id', {
            templateUrl: '/Subject/FilesList',
            controller: ''
        })
        .when('/Spage/:CompID/:UserID/:SubID/:Source', {
            templateUrl: '/Subject/Detail',
            controller: 'DetailCtrl'
        })
        .when('/Search', {
            templateUrl: '/Search/SearchList',
            controller:'SearchCtrl'
        })
        .when('/Personal', {
            templateUrl: '/Backend/PersonalSetting',
            controller: 'PersonalCtrl'
        })
        .when('/MemberSetting', {
            templateUrl: '/Backend/MemberSetting',
            controller:'MemberCtrl'
        })
        .when('/Trash/:DiscID', {
            templateUrl: '/SubjectTrashs/TrashList',
            controller: 'TrashListCtrl'
        })
        .when('/Subject/:SubjectDetail/:SubjID', {
            templateUrl: '/Subject/Detail',
            controller:'TransferSubj'
        })
        .when('/GoogleDoc/:AttID', {
            templateUrl: '/Attachment/GoogleDoc',
            controller:'GoogleDocCtrl'
        })
        .when('/WebOffice/:AttID', {
            templateUrl: '/Attachment/WebOffice',
            controller: 'WebOfficeCtrl'
        })
        // #region Backend
        .when('/manager', {
            templateUrl: '/Backend/Company',
            controller: 'BackendCtrl'
        })
        .when('/Sample',
        {
            templateUrl: '/F101/Index',
            contorller:'F101Ctrl'
        })
        // #endregion
        .otherwise({ redirectTo: '/mybox' });
    // C# 的 Request.IsAjaxRequest() 是以request header 的 X-Requested-With=XMLHTTPREQUEST 做判斷
    // 但angularjs 送出的 ajax request 預設不會幫我們加上去
    // 所以需要統一設定
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
}]);