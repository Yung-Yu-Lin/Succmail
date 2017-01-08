SuccApp.factory('RightSide', ['$rootScope', 'subjectOpen', function ($rootScope, subjectOpen) {
    var factory = {};

    // #region 點擊標籤開啟新訊息
    factory.newMsg = function ($scope) {
        // 顯示新訊息，隱藏詳細頁
        var result = subjectOpen.newMsgLabel();
        $scope.browseContentStyle = result.browseContentStyle;
        $scope.tab_list_body_class = result.tab_list_body_class;
        $scope.newMessage_Div = result.newMessage_Div;
        if ($scope.blackpad_css["display"] == "none")
        {
            $scope.body_css = result.body_css;
            $scope.tab_list_content = result.tab_list_content;
            $scope.tab_list_body = result.tab_list_body;
            $scope.blackpad_css = result.blackpad_css;
            $('.tab_list_body').animate({ right: '0' }, 200);
            $('.tab_list_head').animate({ right: '60%' }, 200);
        };
        //Re new 新增頁面的自動草稿儲存
        $rootScope.$broadcast('ReStartInterval', {
        });
    };
    // #endregion
    // #region 點擊標籤開啟詳細頁
    factory.SubDetail = function ($scope) {
        // 顯示詳細頁，隱藏新訊息
        var result = subjectOpen.SubjDetail();
        $scope.browseContentStyle = result.browseContentStyle;
        $scope.newMessage_Div = result.newMessage_Div;
        $scope.tab_list_body_class = result.tab_list_body_class;
        if($scope.blackpad_css["display"] == "none")
        {
            $scope.body_css = result.body_css;
            $scope.tab_list_content = result.tab_list_content;
            $scope.tab_list_body = result.tab_list_body;
            $scope.blackpad_css = result.blackpad_css;
            $('.tab_list_body').animate({ right: '0' }, 200);
            $('.tab_list_head').animate({ right: '60%' }, 200);
        }
    };
    // #endregion
    // #region 點擊主題列表 showSubject
    factory.ShowSubject = function () {
        $rootScope.$broadcast('ShowSubject', {

        });
    };
    // #endregion
    // #region 收到主題列表ShowSubject
    factory.onShowSubject = function ($scope) {
        $scope.$on('ShowSubject', function (event, Data)
        {
            var result = subjectOpen.OpenSubjectDetailBlock();
            $scope.browseContentStyle = result.browseContentStyle;
            $scope.browseContentClass = result.browseContentClass;
            $scope.browseContent_li_css = result.browseContent_li_css;
            $scope.browseContent_li = result.browseContent_li;
            $scope.newmessage_li = result.newmessage_li;
            $scope.newMessage_Div = result.newMessage_Div;
            $scope.tab_list_content = result.tab_list_content;
            $scope.tab_list_body = result.tab_list_body;
            $scope.tab_list_body_class = result.tab_list_body_class;
            $scope.blackpad_css = result.blackpad_css;
            $scope.body_css = result.body_css;

            $('.tab_list_body').animate({ right: '0' }, 200);
            $('.tab_list_head').animate({ right: '60%' }, 150);
        });
    };
    // #endregion
    // #region 關閉RightSide View
    factory.CloseRightSide = function ($scope)
    {
        var result = subjectOpen.CloseRightSide();
        $scope.tab_list_body = result.tab_list_body;
        $scope.tab_list_content = result.tab_list_content;
        $scope.blackpad_css = result.blackpad_css;
        $scope.body_css = result.body_css;

        $('.tab_list_body').animate({ width: '0%' }, 200);
        $('.tab_list_head').animate({ right: '0' }, 200);
        //廣播取消新增頁面自動儲存草稿
        $rootScope.$broadcast('CancelInterval', {
        });
        //廣播取消主題詳細頁面的自動儲存
        $rootScope.$broadcast('CancelDetailInterval', {
        });
    };
    // #endregion
    // #region 點擊開啟新訊息
    factory.OpenNewMsg = function ()
    {
        $rootScope.$broadcast('OpenNewMsg', {
            
        });
    }
    // #endregion
    // #region 接收開啟新訊息
    factory.onOpenNewMsg = function ($scope)
    {
        $scope.$on('OpenNewMsg', function (event, Data)
        {
            var result = subjectOpen.ClickNewMsg();
            $scope.newMessageClass = result.newMessageClass;
            $scope.newMessage_Div = result.newMessage_Div;
            $scope.newMsg_li_css = result.newMsg_li_css;
            $scope.newmessage_li = result.newmessage_li;
            $scope.browseContent_li = result.browseContent_li;
            $scope.browseContentStyle = result.browseContentStyle;
            $scope.tab_list_content = result.tab_list_content;
            $scope.tab_list_body = result.tab_list_body;
            $scope.tab_list_body_class = result.tab_list_body_class;
            $scope.blackpad_css = result.blackpad_css;
            $scope.body_css = result.body_css;
            $('.tab_list_body').animate({ right: '0' }, 300);
            $('.tab_list_head').animate({ right: '60%' }, 300);
        });
    }
    // #endregion
    // #region 點擊取消離開新訊息頁面
    factory.DeleteNewSubjBlock = function()
    {
        $rootScope.$broadcast('DeleteNewSubjBlock', {
        });
        //廣播取消新增頁面自動儲存草稿
        $rootScope.$broadcast('CancelInterval', {
        });
    }
    // #endregion
    // #region 接聽取消新增主題頁面自動草稿儲存
    factory.onCancelInterval = function ($scope,process) {
        $scope.$on('CancelInterval', function () {
            process();
        });
    };
    // #endregion
    // #region 接聽重新啟動新增主題頁面自動草稿儲存
    factory.onRestartInterval = function ($scope,process) {
        $scope.$on('ReStartInterval', function () {
            process();
        });
    };
    // #endregion
    // #region 接聽點擊取消離開新訊息頁面
    factory.onDeleteNewSubjBlock = function ($scope)
    {
        $scope.$on('DeleteNewSubjBlock', function (event, Data)
        {
            var result = subjectOpen.DeleteNewSubjBlock();
            $scope.tab_list_body_class = result.tab_list_body_class;
            $scope.newMsg_li_css = result.newMsg_li_css;
            $scope.newMessage_Div = result.newMessage_Div;
            $scope.body_css = result.body_css;
            //新增訊息li暗的時候
            if ($scope.newmessage_li == "new-message-li tab_list_head_li")
            {
                //有主題
                if($scope.browseContent_li_css["display"] == "inline-block")
                {
                    $scope.browseContent_li = result.browseContent_li;
                    $scope.browseContentStyle = result.browseContentStyle;
                }
                else
                {
                    $scope.tab_list_content = result.tab_list_content;
                    $scope.tab_list_body = result.tab_list_body;
                    $scope.tab_list_head = result.tab_list_head;
                    $scope.blackpad_css = result.blackpad_css;
                }
            }
            //新增訊息li亮的時候
            else if ($scope.newmessage_li == "new-message-li tab_list_head_li active")
            {
                //有主題
                if ($scope.browseContent_li_css["display"] == "inline-block")
                {
                    $scope.browseContent_li = result.browseContent_li;
                    $scope.browseContentStyle = result.browseContentStyle;
                }
                else
                {
                    $scope.tab_list_content = result.tab_list_content;
                    $scope.tab_list_body = result.tab_list_body;
                    $scope.tab_list_head = result.tab_list_head;
                    $scope.blackpad_css = result.blackpad_css;
                    $('.tab_list_head').css('right', '0px');
                }
            }
            
        });
    };
    // #endregion
    // #region 廣播點擊離開主題詳細頁
    factory.DeleteSubjDetailBlock = function($scope)
    {
        var result = subjectOpen.DeleteSubjDetailBlock();
        $scope.tab_list_body_class = result.tab_list_body_class;
        $scope.browseContent_li_css = result.browseContent_li_css;
        $scope.browseContentStyle = result.browseContentStyle;
        //判斷有新訊息
        if ($scope.newMsg_li_css["display"] == "inline-block")
        {
            $scope.newMessage_Div = result.newMessage_Div;
            $scope.newMsg_li_css = result.newMsg_li_css;
            $scope.browseContent_li = result.browseContent_li;
            $scope.newMessage_Div = result.newMessage_Div;
            $scope.newmessage_li = result.newmessage_li;
            $(".new-message-li").addClass("active");
            //展開情況
            if($scope.tab_list_body == undefined)
            {
                $scope.body_css = result.NoNewMessage_body_css;
                $('.tab_list_head').css('right', '0%');
            }
            else
            {
                $scope.body_css = result.body_css;
                $('.tab_list_head').css('right', '60%');
            }
        }
        //判斷無新訊息
        else
        {
            $scope.tab_list_content = result.tab_list_content;
            $scope.tab_list_body = result.tab_list_body;
            $scope.tab_list_head = result.tab_list_head;
            $scope.blackpad_css = result.blackpad_css;
            $scope.body_css = result.NoNewMessage_body_css;
            $('.tab_list_head').css('right', '0%');
        }
        //廣播取消主題詳細頁面的自動儲存
        $rootScope.$broadcast('CancelDetailInterval', {
        });
    }
    // #endregion
    // #region 廣播離開主題詳細頁後，設定SubDetail Scope回到初始值
    factory.ReNewSubjDetailScope = function()
    {
        $rootScope.$broadcast('ReNewSubjDetailScope', {});
    }
    // #endregion
    // #region 接聽收取離開主題詳細頁後，設定SubDetail Scope回到初始值
    factory.onReNewSubjDetailScope = function($scope)
    {
        $scope.$on('ReNewSubjDetailScope', function (event, Data)
        {
            $scope.EditorTemplate = "";
            $scope.isReply = false;
            $scope.isEditSubj = false;
        });
    }
    // #endregion
    // #region 點擊主題設定SubDetail Scope回到初始值
    factory.InSubjReNewScope = function ($scope,SubjID)
    {
        if ($scope.CurrentSubjID != SubjID)
        {
            $scope.EditorTemplate = "";
            $scope.isReply = false;
            $scope.isEditSubj = false;
        }
    }
    // #endregion

    return factory;

}]);