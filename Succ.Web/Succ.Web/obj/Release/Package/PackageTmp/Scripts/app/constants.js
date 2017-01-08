//ReplyTo判斷依據
SuccApp.constant('ReplyTo', {
    //空值
    Empty: "00000000-0000-0000-0000-000000000000" 
});
//討論組類型判斷依據
SuccApp.constant('DiscTypeJudg', {
    //以100作為基準，大於100為行政討論組，小於100為一般討論組
    Datum: 100
});
// 主題類型
SuccApp.constant('DiscType', {
    // 一般
    Normal: 2,
    // 請款
    ApplyMoney: 201,
    // 採購
    Purchasing:202,
    // 請假
    PersonLeave: 101,
    // 外出
    GoOut: 103,
    // 加班
    Overtime: 102
});

// 主題緊急程度
SuccApp.constant('SubjectColor', {
    Emergency : 3, // 緊急
    Anxious : 2, // 急
    Important : 1, // 重要
    Unmarked : 0 // 未標示
});

// 事件
SuccApp.constant('SubjectEvent', {
    ReadStateUpdated: 'ReadStateUpdated', // 讀取狀態更新完成
    Inserted: 'Inserted', // 新增主題完成
    ReplyInserted: 'ReplyInserted', // 新增回覆完成
    MessageUpdated: 'MessageUpdated', // 主題修改完成
    ReplyUpdated: 'ReplyUpdated', // 回復修改完成
    UpdateSubjectProgress: 'UpdateSubjectProgress', // 更新主題狀態完成
    AdminBack: 'AdminBack' // 行政區退回

});

// 定時儲存
SuccApp.constant('Draft', {
    Timeout: 60000 // 定時秒數
});

// 主題程序狀態
SuccApp.constant('SubjectProgress', {
    InProgress : 1, // 進行中
    ApplyClose : 2, // 申請歸檔
    Reject : 5, // 退回
    Closed: 9, // 行政區同意歸檔, 一般區已完成歸檔
    RejectInAdmin: 10 // 行政區不同意歸檔
});

// 主題程序按鈕
SuccApp.constant('SubjectProgressBtn',
{
    ApplySubject2: '0', // 申請歸檔
    ApplyCancel: '1', // 取消申請
    Finish: '2', // 完成
    GoBack: '3', // 退回
    ReAudit: '4', // 重新簽核
    AdminGoBack: '5', // 行政區退回
    Finished: '6' // 已完成
});

// 行政區審核按鈕Class 樣式
SuccApp.constant('AuditClass', {
    UnCheck: 'audit-check audit-check-uncheck',
    OkCheck: 'audit-check audit-check-ok',
    NoCheck: 'audit-check audit-check-no',
    ReSignCheck: 'audit-check audit-check-resign',
    UnCheckGray: 'audit-check audit-check-uncheck-gray',
    ReSignName: 'audit-name',
    ReSignNameGray: 'audit-name-gray',
});

// 行政區請假外出預設資料多國語言的key
SuccApp.constant('LeaveTypes', {
    PersonLeave: ['leave', 'sick', 'buttes', 'compensatory', 'maternityLeave', 'bereavementLeave'],
    GoOut: ['visitingCustomers', 'duty', 'bank', 'attendedEvent'],
});

// 編輯器統一設定參數
//'clear', 'superscript', 'subscript', 'strikethrough'
SuccApp.constant('EditorPara', {
    Para: {
        focus:false,
        lang: 'zh-TW',
        disableResizeEditor: false,
        toolbar: [
          ['style', ['bold', 'italic', 'underline', 'strikethrough', 'clear']],
          ['fontsize', ['fontsize']],
          ['color', ['fcolor']],
          ['color', ['bcolor']],
          ['para', ['ul', 'ol', 'outdent', 'indent']],
          ['history', ['undo', 'redo']],
          ['insert', ['link']],
          ['insert', ['image']]
        ],
        colors: [
            ['#000000', '#FF0000', '#FFFF00', '#0000FF', '#00C653', '#FFFFFF']
        ],
    },
    // 收件人統一樣板
    ReceiptHtml: '<div class="items clearfix"><div class="info-block block-info clearfix"><div class="square-box pull-left userimg" style="background: url(/Backend/getUserImg?userid=#:UserId#) no-repeat;background-size: 50px 50px;"></div><div class="square-box pull-left usertxt" style="background:#:PhotoCss#">#:PhotoTxt#</div><div class="username">#:UserName#</div><div class="email">#:UserEmail#</div></div></div>',
    // 後台下拉選單樣板
    BackendHtml: '<div class="items clearfix"><div class="info-block block-info clearfix"><div class="square-box pull-left userimg" style="background: url(/Backend/getUserImg?userid=#:MemberID#) no-repeat;background-size: 50px 50px;"></div><div class="square-box pull-left usertxt" style="border:1px solid lightgray;background:#:PhotoCss#">#:PhotoTxt#</div><div class="username">#:Name#</div></div></div>'
});

//討論組下拉統一樣板
SuccApp.constant('DiscTemplate', {
    //樣本Html
    DiscHtml: '<div style="text-align:center;">#:Name#</div>'
});

//主題詳細頁複製URL
SuccApp.constant('CopySubjUrl', {
    //本機端
    LocalString: "http://localhost:2042/Spage/",
    //正式機
    OnlineString: "https://succmail.com/Spage/"
});

//未讀數字更新時間
SuccApp.constant('NoReadSetting', {
    // 更新未讀時間
    Time: 60000,
    // 更新未讀通知時間
    NoticeTime: 300000
});
//檔案分享區複製URL
SuccApp.constant('CopyFileUrl', {
    //本機端
    LocalString: "http://localhost:2042/",
    //正式機
    OnlineString: "https://succmail.com/"
});
//語言包 Filter使用
SuccApp.constant('LangFilter', {
    // #region 英文
    en: {
        typeSubj: 'Type title,please.',
        Choose_Receivrer: 'Choose Receiver,please.',
        CreateMsgOk: 'Create Success.',
        CreateMsgFail: 'Create Fail.',
        Loading: 'Loading...',
        On: 'On',
        Save_Draft: 'Saveing Draft',
        Calendar: 'Calendar',
        Export: 'Export file',
        DelSubj: 'Subject Delete',
        EditSubj: 'Subject Edit',
        ReSubj: 'Subject Reply',
        EditMsgOk: 'Edit Success',
        EditMsgFail: 'Edit Fail',
        Key_Search: 'Key Search',
        Date_Range: 'Date Range',
        Member: 'Member',
        Disc: 'Discussion',
        File: 'File',
        After: 'After',
        Before: 'Before',
        To: 'until',
        Filter: 'Filter',
        Urgency: 'Urgency',
        Urgent: 'Urgent',
        Pressing: 'Pressing',
        Important: 'Important',
        Unmarked: 'Unmarked',
        Creator: 'Creator',
        Replier: 'Replier',
        Receiver: 'Receiver',
        Select: 'Select',
        Date: 'Date',
        Create: 'Create',
        Within_One_Week: 'Within one week',
        Within_Two_Week: 'Within two weeks',
        Within_One_Mon: 'Within one month',
        End: 'End',
        Close: 'Close',
        PlanClose: 'PlanCloseOn',
        ReplyCount: 'ReplyCount',
        LastReply: 'LastReply',
        Sort: 'Sort',
        UploadTime: 'UploadTime',
        Name: 'Name',
        Type: 'Type',
        Size: 'Size',
        Upload_By: 'Upload By',
        apprise: 'apprise',
        Others: 'Others',
        NewFolder: 'New folder',
        ReSignNoCheck: 'Please Check Sign',
        AllMember: 'All Stuff',
        ReSignNoCheck: 'Please Check Sign',
        FolderWarn: 'The folder classes achieve max,if you want to increase it anymore,contact us please.',
        DeleteWarn: 'Sorry, you have no competence to delete it,reconfirm it thanks.',
        leave: 'Leave',
        sick: 'Sick',
        buttes: 'Buttes',
        compensatory: 'Compensatory',
        maternityLeave: 'Maternity Leave',
        bereavementLeave: 'Bereavement Leave',
        visitingCustomers: 'Visiting customers',
        duty: 'Duty',
        bank: 'Bank/Post Office',
        attendedEvent: 'Attended the event',
        LeaveCategory: 'Leave Category',
        OutCategory: 'Out category',
        BackCheckMessage: 'Are you sure, your data will not be saved!!',
        PwtooShort: 'The Password length too short to setting',
        PwNotSame: 'The Password is not correspond',
        InviteEmailFail: "The one's Email is fail that you invited",
        NameTooShort: "The name's length too short to save about the employee you invited.",
        AreYouSure: "Are You Sure to Delete it?",
        FileNotUploaded: "The Files not uploaded, please wait for a minutes...",
        Proversion: "Paid version",
        Leave: "Leave",
        Paternity: "Paternity Leave",
        Sick: "Sick Leave",
        Public: "Public Leave",
        Bereavement: "Bereavement Leave",
        Marriage: "Marriage",
        Others: "Others",
        Business_trip: "On a business trip",
        Customer: "Visit customer",
        TypeFullName: "Type your name, please.",
        TypeEmail: "Type your email, please.",
        TypePsd: "Type your password, please.",
        ChooseDept: "Pick up your department, please.",
        ChooseDisc: "Pick up your discussion, please.",
        TypeDeptName: "Type your department name, please.",
        FormerEmployee: "Former employee",
        TagName: "Tagname",
        Edit: "Edit",
        Enable: "Enable",
        Disable: "Disable",
        SubjectTag: "Eventtag",
        Number: "No.",
        Count: "",
        PleaseNotEmpty: "don't type empty value, please.",
        LoginTime: "Login time",
        UserName: "User name",
        LoginIP: "Login IP address",
        Browser: "Login browser",
        FileSizeFail: "The size of file is over the limitation ten MB.",
        LogoSizeFail: "The size of file is over the limitation about two MB.",
        FileUploadFail: "The system upload file error.",
        Browser: "Login browser",
        MailSend: "Letters have been sent",
        IpAddress: "This IP address is invalid",
        IpCountry: "At present the country:",
        BeforeDropout: "Switch to another company before you drop out this one, tks.",
        FileUploadFail: "The system upload file error.",
        Browser: "Login browser",
        IpAddress: "This IP address is invalid",
        IpCountry: "At present the country:",
        DeleteDepart: "Delete Depart",
        OnlineSupport: "Online Support",
        IpCountry: "At present the country:",
        AddEventTag: "Whether to add the Event tag",
        AddCusTag: "Whether to add the cus tag",
        AlertAddTag: "Please enter eventtag and custag",
        DiscRepeat: "The discussion name repeat to add, type another one, please.",
        DisableToDelDisc: "Sorry! You can't remove present discussion for system notification."
    },
    // #endregion
    // #region 繁體中文
    tw:{
        typeSubj: '請輸入主題',
        Choose_Receivrer: '請選擇收件人',
        CreateMsgOk: '訊息新增完成',
        CreateMsgFail: '訊息新增失敗!!',
        Loading: '處理中...',
        On: '已於',
        Save_Draft: '自動儲存為草稿',
        Calendar: '時程表',
        Export: '匯出文件',
        DelSubj: '刪除主題',
        EditSubj: '編輯主題',
        ReSubj: '回覆主題',
        EditMsgOk: '訊息修改完成',
        EditMsgFail: '訊息修改失敗',
        Key_Search: '關鍵搜尋',
        Date_Range: '日期範圍',
        Member: '成員',
        Disc: '討論組',
        File: '檔案',
        After: '之後',
        Before: '之前',
        To: '到',
        Filter: '篩選',
        Urgency: '依緊急程度',
        Urgent: '緊急',
        Pressing: '急',
        Important: '重要',
        Unmarked: '未標示',
        Creator: '發文者',
        Replier: '回覆者',
        Receiver: '收件者',
        Select: '選擇',
        Date: '日期',
        Create: '建立',
        Within_One_Week: '一星期內',
        Within_Two_Week: '兩星期內',
        Within_One_Mon: '一個月內',
        End: '結束',
        Close: '歸檔',
        PlanClose: '預計完成',
        ReplyCount: '回覆數量',
        LastReply: '最後回覆',
        Sort: '排序',
        UploadTime: '上傳時間',
        Name: '名稱',
        Type: '類型',
        Size: '大小',
        Upload_By: '上傳者',
        apprise: '通知人',
        Others: '其他',
        NewFolder: '新增資料夾',
        ReSignNoCheck: '未選擇重新簽核點',
        AllMember: '所有人員',
        ReSignNoCheck: '未選擇重新簽核點',
        FolderWarn: '資料夾階層已達上限，如欲增加請撥打服務電話。',
        DeleteWarn: '您並無權限進行刪除，請與管理者確認。',
        leave: '事假',
        sick: '病假',
        buttes: '特休',
        compensatory: '補休',
        maternityLeave: '產假',
        bereavementLeave: '喪假',
        visitingCustomers: '拜訪客戶',
        duty: '執勤',
        bank: '銀行/郵局',
        attendedEvent: '出席活動',
        LeaveCategory: '假別',
        OutCategory: '事別',
        BackCheckMessage: '確定返回,您的資料將不會儲存',
        PwtooShort: '密碼長度過短',
        PwNotSame: '確認密碼不符',
        InviteEmailFail: '邀請對象Email填寫錯誤!',
        NameTooShort: '邀請的員工姓名長度過短.',
        AreYouSure: '確定要刪除嗎?',
        FileNotUploaded: '附件尚未上傳完成，請稍後...',
        Proversion: "專業版",
        Leave: "事假",
        Paternity: "陪產假",
        Sick: "病假",
        Public: "公假",
        Bereavement: "喪假",
        Marriage: "婚假",
        Others: "其它",
        Business_trip: "出差",
        Customer: "拜訪客戶",
        TypeFullName: "請填寫姓名",
        TypeEmail: "請填寫信箱帳號",
        TypePsd: "請填寫密碼",
        ChooseDept: "請選擇部門",
        ChooseDisc: "請選擇討論組",
        TypeDeptName: "請輸入部門名稱",
        FormerEmployee: "離職員工",
        TagName: "標籤名稱",
        Edit: "編輯",
        Enable: "啟用",
        Disable: "停用",
        SubjectTag: "事件標籤",
        Number: "第",
        Count: "筆",
        PleaseNotEmpty: "請勿輸入空值",
        LoginTime: "登入時間",
        UserName: "人員名稱",
        LoginIP: "登入位址",
        Browser: "瀏覽器",
        LogoSizeFail: "上傳檔案超過2MB，請重新選擇...",
        FileSizeFail: "上傳檔案超過10MB，請重新選擇...",
        Browser: "瀏覽器",
        MailSend: "信件已寄出",
        IpAddress: "此IP位置無效",
        IpCountry: "目前所在國家:",
        FailToDropout: "您目前身份無法直接退出公司，請聯絡系統管理員...",
        BeforeDropout: "請先切換至其他公司，再進行退出動作。",
        FileUploadFail: "系統上傳檔案時發生錯誤，請稍後在試...",
        Browser: "瀏覽器",
        IpAddress: "此IP位置無效",
        IpCountry: "目前所在國家:",
        DeleteDepart: "刪除部門",
        OnlineSupport: "線上客服",
        IpCountry: "目前所在國家:",
        AddEventTag: "是否新增事件標籤",
        AddCusTag: "是否新增對象標籤",
        AlertAddTag: "請輸入事件標籤及對象標籤",
        DiscRepeat: "討論組名稱重複，請輸入其他討論組名稱...",
        DisableToDelDisc: "抱歉，系統公告所用討論組不可刪除"
    },
    // #endregion
    // #region 簡體中文
    cn: {
        typeSubj: '请输入主题',
        Choose_Receivrer: '请选择收件人',
        CreateMsgOk: '讯息新增完成',
        CreateMsgFail: '讯息新增失败!!',
        Loading: '处理中...',
        On: '已于',
        Save_Draft: '自动储存为草稿',
        Calendar: '时程表',
        Export: '汇出文件',
        DelSubj: '删除主题',
        EditSubj: '编辑主题',
        ReSubj: '回复主题',
        EditMsgOk: '讯息修改完成',
        EditMsgFail: '讯息修改失败',
        Key_Search: '关键搜寻',
        Date_Range: '日期范围',
        Member: '成员',
        Disc: '讨论组',
        File: '档案',
        After: '之后',
        Before: '之前',
        To: '到',
        Filter: '筛选',
        Urgency: '依紧急程度',
        Urgent: '紧急',
        Pressing: '急',
        Important: '重要',
        Unmarked: '未标示',
        Creator: '发文者',
        Replier: '回复者',
        Receiver: '收件者',
        Select: '选择',
        Date: '日期',
        Create: '建立',
        Within_One_Week: '一星期内',
        Within_Two_Week: '两星期内',
        Within_One_Mon: '一个月内',
        End: '结束',
        Close: '归档',
        PlanClose: '预计完成',
        ReplyCount: '回复数量',
        LastReply: '最后回复',
        Sort: '排序',
        UploadTime: '上传时间',
        Name: '名稱',
        Type: '类型',
        Size: '大小',
        Upload_By: '上传者',
        apprise: '通知人',
        Others: '其他',
        NewFolder: '新增文件夹',
        ReSignNoCheck: '未选择重新签核点',
        AllMember: '所有人员',
        ReSignNoCheck: '未选择重新签核点',
        FolderWarn: '文件夹阶层已达上限，如欲增加请拨打服务电话。',
        DeleteWarn: '您并无权限进行删除，请与管理者确认。',
        leave: '事假',
        sick: '病假',
        buttes: '特休',
        compensatory: '补休',
        maternityLeave: '产假',
        bereavementLeave: '丧假',
        visitingCustomers: '拜访客户',
        duty: '执勤',
        bank: '银行/邮局',
        attendedEvent: '出席活动',
        LeaveCategory: '假別',
        OutCategory: '事別',
        BackCheckMessage: '确定返回,您的资料将不会储存',
        PwtooShort: '密码长度过短',
        PwNotSame: '确认密码不符',
        InviteEmailFail: '邀请对象Email填写错误!',
        NameTooShort: '邀请的员工姓名长度过短',
        AreYouSure: '确定要删除吗?',
        FileNotUploaded: '附件尚未上传完成，请稍后...',
        Proversion: "专业版",
        Leave: "事假",
        Paternity: "陪产假",
        Sick: "病假",
        Public: "公假",
        Bereavement: "丧假",
        Marriage: "婚假",
        Others: "其他",
        Business_trip: "出差",
        Customer: "拜访客户",
        TypeFullName: "请填写姓名",
        TypeEmail: "请填写信箱账号",
        TypePsd: "请填写密码",
        ChooseDept: "请选择部门",
        ChooseDisc: "请选择讨论组",
        TypeDeptName: "请输入部门名称",
        FormerEmployee: "离职员工",
        TagName: "标签名称",
        Edit: "编辑",
        Enable: "启用",
        Disable: "停用",
        SubjectTag: "事件卷标",
        Number: "第",
        Count: "笔",
        PleaseNotEmpty: "请勿输入空值",
        LoginTime: "登入时间",
        UserName: "人员名称",
        LoginIP: "登入地址",
        Browser: "浏览器",
        LogoSizeFail: "上传档案超过2M，请重新选择...",
        FileSizeFail: "上传档案超过10M，请重新选择...",
        FileUploadFail: "系统上传档案时发生错误，请稍后在试...",
        Browser: "浏览器",
        MailSend: "信件已寄出",
        IpAddress: "此IP位置无效",
        IpCountry: "目前所在国家:",
        Browser: "浏览器",
        IpAddress: "此IP位置无效",
        IpCountry: "目前所在国家:",
        FileUploadFail: "系统上传档案时发生错误，请稍后在试...",
        FailToDropout: "您目前身份无法直接退出公司，请联络系统管理员",
        BeforeDropout: "请先切换至其他公司，再进行退出动作。",
        DeleteDepart: "删除部门",
        OnlineSupport: "在线客服",
        BeforeDropout: "请先切换至其他公司，再进行退出动作。",
        AddEventTag: "是否增加事件标签",
        AddCusTag: "是否增加对象标签",
        AlertAddTag: "请输入事件标签及对象标签",
        DiscRepeat: "讨论组名称重复，请输入其他讨论组名称",
        DisableToDelDisc: "抱歉，系统公告所用讨论组不可删除"
    }
    // #endregion
});
//假別預設區域
SuccApp.constant('LeaveSample', {
    // #region 請假區預設假別
    PersonLeave_sample: [
        {
            Action: 'create',
            ID: null,
            IsUse: false,
            Name: 'Leave'
        },
        {
            Action: 'create',
            ID: null,
            IsUse: false,
            Name: 'Paternity'
        },
        {
            Action: 'create',
            ID: null,
            IsUse: false,
            Name: 'Sick'
        },
        {
            Action: 'create',
            ID: null,
            IsUse: false,
            Name: 'Public'
        },
        {
            Action: 'create',
            ID: null,
            IsUse: false,
            Name: 'Bereavement'
        },
        {
            Action: 'create',
            ID: null,
            IsUse: false,
            Name: 'Marriage'
        },
        {
            Action: 'create',
            ID: null,
            IsUse: false,
            Name: 'Others'
        }
    ],
    // #endregion
    // #region 外出區預設事別
    Goout_sample:[
        {
            Action: 'create',
            ID: null,
            IsUse: false,
            Name: 'Business_trip'
        },
        {
            Action: 'create',
            ID: null,
            IsUse: false,
            Name: 'Customer'
        },
        {
            Action: 'create',
            ID: null,
            IsUse: false,
            Name: 'Others'
        }
    ]
    // #endregion
});
// 人頭顏色
SuccApp.constant('PhotoColor', {
    color1: "#ca7497",
    color2: "#60b4d0",
    color3: "#8fcbcc",
    color4: "#f17b60",
    color5: "#7594b3",
    color6: "#f2a5a7",
    color7: "#e29e4b",
    color8: "#b7d28d",
    color9: "#d9b9f1",
    color10: "#fed049"
});
// 預設主題標簽
SuccApp.constant('DefaultTag', {
    EventTag: [
        {
            ID: 1,
            TagName: "其它",
            IsCheck: false,
            Default: false,
            SortBy: 0
        }
        ,{
            ID: 2,
            TagName: "訂單",
            IsCheck: false,
            Default: false,
            SortBy: 0
        }
        ,{
            ID: 3,
            TagName: "報價",
            IsCheck: false,
            Default: false,
            SortBy: 0
        }
        , {
            ID: 4,
            TagName: "詢價",
            IsCheck: false,
            Default: false,
            SortBy: 0
        }
        , {
            ID: 5,
            TagName: "通知",
            IsCheck: false,
            Default: false,
            SortBy: 0
        }
        , {
            ID: 6,
            TagName: "調料",
            IsCheck: false,
            Default: false,
            SortBy: 0
        }
        , {
            ID: 7,
            TagName: "詢問",
            IsCheck: false,
            Default: false,
            SortBy: 0
        }
        , {
            ID: 8,
            TagName: "客訴",
            IsCheck: false,
            Default: false,
            SortBy: 0
        }
        , {
            ID: 9,
            TagName: "對帳",
            IsCheck: false,
            Default: false,
            SortBy: 0
        }
        , {
            ID: 10,
            TagName: "匯款",
            IsCheck: false,
            Default: false,
            SortBy: 0
        }
        , {
            ID: 11,
            TagName: "退保",
            IsCheck: false,
            Default: false,
            SortBy: 0
        }
        , {
            ID: 12,
            TagName: "加保",
            IsCheck: false,
            Default: false,
            SortBy: 0
        }
        , {
            ID: 13,
            TagName: "採購",
            IsCheck: false,
            Default: false,
            SortBy: 0
        }
        , {
            ID: 14,
            TagName: "保險",
            IsCheck: false,
            Default: false,
            SortBy: 0
        }
        , {
            ID: 15,
            TagName: "稅務",
            IsCheck: false,
            Default: false,
            SortBy: 0
        }
        , {
            ID: 16,
            TagName: "用印",
            IsCheck: false,
            Default: false,
            SortBy: 0
        }
        , {
            ID: 17,
            TagName: "租賃",
            IsCheck: false,
            Default: false,
            SortBy: 0
        }
        , {
            ID: 18,
            TagName: "郵寄",
            IsCheck: false,
            Default: false,
            SortBy: 0
        }
        , {
            ID: 19,
            TagName: "轉帳",
            IsCheck: false,
            Default: false,
            SortBy: 0
        }
        , {
            ID: 20,
            TagName: "報表",
            IsCheck: false,
            Default: false,
            SortBy: 0
        }
        , {
            ID: 11,
            TagName: "公告",
            IsCheck: false,
            Default: false,
            SortBy: 0
        }
        , {
            ID: 22,
            TagName: "水費",
            IsCheck: false,
            Default: false,
            SortBy: 0
        }
        , {
            ID: 23,
            TagName: "電費",
            IsCheck: false,
            Default: false,
            SortBy: 0
        }
        , {
            ID: 24,
            TagName: "請假",
            IsCheck: false,
            Default: false,
            SortBy: 0
        }
        , {
            ID: 25,
            TagName: "申請",
            IsCheck: false,
            Default: false,
            SortBy: 0
        }
        , {
            ID: 26,
            TagName: "薪資",
            IsCheck: false,
            Default: false,
            SortBy: 0
        }
        , {
            ID: 27,
            TagName: "訪談",
            IsCheck: false,
            Default: false,
            SortBy: 0
        }
        , {
            ID: 28,
            TagName: "設備",
            IsCheck: false,
            Default: false,
            SortBy: 0
        }
        , {
            ID: 29,
            TagName: "預算",
            IsCheck: false,
            Default: false,
            SortBy: 0
        }
        , {
            ID: 30,
            TagName: "調查",
            IsCheck: false,
            Default: false,
            SortBy: 0
        }
        , {
            ID: 31,
            TagName: "溝通",
            IsCheck: false,
            Default: false,
            SortBy: 0
        }
        , {
            ID: 32,
            TagName: "勞健保",
            IsCheck: false,
            Default: false,
            SortBy: 0
        }
        , {
            ID: 33,
            TagName: "腦力激盪",
            IsCheck: false,
            Default: false,
            SortBy: 0
        }
        , {
            ID: 34,
            TagName: "會議記錄",
            IsCheck: false,
            Default: false,
            SortBy: 0
        }
        , {
            ID: 35,
            TagName: "生產指令",
            IsCheck: false,
            Default: false,
            SortBy: 0
        }
    ]
});
// SuccMail 可察看歷史的公司ID
SuccApp.constant('HistoryComp', {
    CompID: 'af00535b-7a92-4b7b-9964-bd3a02823718'
});
// 前端檔案上傳限制大小 (MB)
SuccApp.constant('Filesize_Conf', {
    Size: 10,
    AdvancedSize: 30
});
// 前端檔案上傳特殊公司
SuccApp.constant('UniqueComp', {
    CompList: ["075d2547-b07b-4e76-9eae-3a9b6bcfc7e7", "af00535b-7a92-4b7b-9964-bd3a02823718"]
});
// 後端導引的步驟內容
SuccApp.constant('BackendGuide', {
    Step: [
        {
            '_no': 0,
            '_info': 'Step 1, 網站管理-上傳公司圖片',
            '_element': ['.companyimg', '.uploadimg'],
            '_title': '上傳專屬您公司的圖片',
            '_content': '按一下<strong>上傳圖片</strong>的按鈕，選擇您電腦中一張最能代表您公司的圖片!當然，您也可以直接使用我們預設的圖片作為公司圖片!',
            '_IsChangePage': false,
            '_PageName': '',
            '_IsDisableBtn': false
        },
        {
            '_no': 1,
            '_info': 'Step 2, 網站管理-填寫公司資訊',
            '_element': ['.companyname'],
            '_title': '填寫公司詳細資訊',
            '_content': '請確認<strong>公司名稱</strong>及<strong>時區</strong>是否需要調整，<strong class="redString">請調整至符合您期望的時區! 否則您平台所有的主題時間，皆會以格林威治標準時間來顯示。</strong>',
            '_IsChangePage': false,
            '_PageName':'',
            '_IsDisableBtn': false
        },
        {
            '_no': 2,
            '_info': 'Step 3, 網站管理-網站管理員',
            '_element': ['.boss'],
            '_title': '確認網站最高權限者',
            '_content': '<strong class="redString">更換最高權限管理員，所有平台的管理權限將同時移轉，如：刪除主題、人員管理和討論組管理等，請慎重決定。</strong>',
            '_IsChangePage': false,
            '_PageName':'',
            '_IsDisableBtn': false
        },
        {
            '_no': 3,
            '_info': 'Step 4, 討論組管理-左側選單功能介紹',
            '_element': ['.disc_list'],
            '_title': '左側選單功能介紹',
            '_content': '<ul>' +
                             '<li class="TextLeftSide"><strong>公司訊息</strong> : <p>此區域新增的討論組主要用來管理公司內部的一般事項，如：業務討論、生產討論或一般事項等...</p></li>' +
                             '<li class="TextLeftSide"><strong>行政事務</strong> : <p>此區域新增的討論組包含了公司內部的行政事務管控，如：款項請領、採購計畫或請假區等...</p></li>' +
                             '<li class="TextLeftSide"><strong>回收區</strong> : <p>回收區將保留您刪除過的所有討論組內容及訊息。當然，任何時間您都能讓這些討論組再重新啟用。</p></li>' +
                        '</ul>',
            '_IsChangePage': true,
            '_PageName': 'disc',
            '_IsDisableBtn': false
        },
        {
            '_no': 4,
            '_info': 'Step 5, 討論組管理-預先建立的討論組',
            '_element': ['#set'],
            '_title': '預設的公司公告討論組',
            '_content': '在您註冊時，我們先預設了<strong class="redString">『公司公告』</strong>這個討論組，系統會在這個討論組對所有使用者發出歡迎使用的訊息，建議您在下一個步驟，<strong class="redString">至少建立1~3個符合您公司組織的討論組</strong>。',
            '_IsChangePage': true,
            '_PageName': 'disc',
            '_IsDisableBtn': false
        },
        {
            '_no': 5,
            '_info': 'Step 6, 討論組管理-新增公司討論組',
            '_element': ['.add-eventdisc', '#set'],
            '_title': '新增公司討論組',
            '_content': '<p class="TextLeftSide">按左側<strong class="redString">『＋新增公司討論組』</strong>按鈕，建立符合您公司的討論組名稱，例如：業務部、生產部、銷售部等，<strong class="redString">對於每個新增的討論組，請設定該討論組的管理員</strong>。</p>',
            '_IsChangePage': true,
            '_PageName': 'disc',
            '_IsDisableBtn': true
        },
        {
            '_no': 6,
            '_info': 'Step 7, 討論組管理-新增行政討論組',
            '_element': ['.add-admindisc', '#set'],
            '_title': '新增行政討論組',
            '_content': '<p class="TextLeftSide">按左側<strong class="redString">『＋新增行政討論組』</strong>按鈕，建立符合您公司的行政討論組名稱，例如：採購單、請領單、請假單等，此導引舉請假區為例，在確認討論組名稱以及管理員後，<strong class="redString">對於系統預設的假別，您可依公司的規定刪、增、修假別名稱</strong>。</p>',
            '_IsChangePage': true,
            '_PageName': 'disc',
            '_IsDisableBtn': true
        },
        {
            '_no': 7,
            '_info': 'Step 8, 部門管理-新增部門',
            '_element': ['.AddDeptArea'],
            '_title': '新增部門',
            '_content': '<p class="TextLeftSide">按左上角<strong class="redString">『新建部門』</strong>按鈕來建立您公司的部門，此功能將用來歸屬您公司員工的所屬單位，在往後發布訊息時，能夠利用部門別有效率的選取收件人。</p>',
            '_IsChangePage': true,
            '_PageName': 'dept',
            '_IsDisableBtn': true
        },
        {
            '_no': 8,
            '_info': 'Step 9, 人員管理-新增人員',
            '_element': ['.memberplus', '#detail'],
            '_title': '新增人員',
            '_content': '<p class="TextLeftSide">請按右上角<strong class="redString">『新增人員』</strong>按鈕，將您公司參與此平台運作的所有員工資料一一輸入。每輸入一位員工的基本資料後，請同時設定該員工所要參與的討論組，並在每個參與的討論組裡決定該員工為<strong class="redString">指定收件人</strong>或<strong class="redString">一般收件人</strong>。<br />*指定收件人：該員工會收到討論組所發出的每一個訊息。<br />*一般收件人：除非被設定為訊息的收件人，否則訊息不會主動發送給該員工(惟一般收件人對於該討論組的所有訊息仍具有閱讀及回覆權限)。</p>',
            '_IsChangePage': true,
            '_PageName': 'member',
            '_IsDisableBtn': true
        },
        {
            '_no': 9,
            '_info': 'Step 10, 標籤管理-介紹什麼是事件標籤',
            '_element': ['.EventTagArea'],
            '_title': '事件標籤與對象標籤的設置',
            '_content': '<p class="TextLeftSide">事件標籤與對象標籤的設置，是SuccMail運作很重要的一環，透過標籤的管理，可以讓管理者更有效率的管理公司，並方便日後對於訊息的檢索。</p>',
            '_IsChangePage': true,
            '_PageName': 'eventtag',
            '_IsDisableBtn': false
        },
        {
            '_no': 10,
            '_info': 'Step 11, 標籤管理-新增預設事件標籤',
            '_element': ['.SubjTagBtn'],
            '_title': '預設、新增事件標籤',
            '_content': '<p class="TextLeftSide">事件標籤的建置' +
                '<ul>' +
                    '<li class="TextLeftSide">預設：請先由預設標籤中挑選適合您公司使用的事件標籤。</li>' +
                    '<li class="TextLeftSide">新增：請依您公司的需求新增適當的<strong class="redString">『事件標籤』</strong>。</li>' +
                '</ul>' +
            '</p>',
            '_IsChangePage': true,
            '_PageName': 'eventtag',
            '_IsDisableBtn': true
        },
        {
            '_no': 11,
            '_info': 'Step 12, 標籤管理-新增對象標籤',
            '_element': ['.SubjTagBtn'],
            '_title': '新增對象標籤',
            '_content': '<p class="TextLeftSide">對象標籤的建置' +
                '<ul>' +
                    '<li class="TextLeftSide">預設：公司所有成員都會被設定為預設<strong class="redString">『對象標籤』</strong>。</li>' +
                    '<li class="TextLeftSide">新增：請按右上角<strong class="redString">『新增』</strong>按鈕輸入新增的對象標籤名稱，例如：客戶名稱、車牌號碼、機器型號或帳戶名稱等。</li>' +
                '</ul>' +
            '</p>',
            '_IsChangePage': true,
            '_PageName': 'custag',
            '_IsDisableBtn': true
        },
        {
            '_no': 12,
            '_info': 'Step 13, 記錄管理-操作紀錄功能介紹',
            '_element': ['#operate'],
            '_title': '操作紀錄',
            '_content': '<p class="TextLeftSide">所有SuccMail訊息的操作紀錄都會被完整留存，供平台管理者調閱查詢。此外，管理者可以透過過濾功能縮減篩選範圍。</p>',
            '_IsChangePage': true,
            '_PageName': 'operate',
            '_IsDisableBtn': false
        },
        {
            '_no': 13,
            '_info': 'Step 14, 記錄管理-登入紀錄功能介紹',
            '_element': ['#recorddetail'],
            '_title': '登入紀錄',
            '_content': '<p class="TextLeftSide">所有成員的登入時間以及IP位址都會被完整留存，供管理者查詢追蹤。此外，管理者可以透過過濾功能縮減篩選範圍。</p>',
            '_IsChangePage': true,
            '_PageName': 'login',
            '_IsDisableBtn': false
        }
    ],
    // 用來廣播是否恢復按鈕點擊下一步
    EmitModify: "OnModifying",
    // 用來廣播是否需要跳頁
    EmitDirectPage: "DirectBackendGuide",
    // 用來廣播自動新增客服人員
    EmitInsertSupport: "SupportBackendGuide",
    // 用來廣播鎖死新增事件標籤的事件
    EmitDefaultEventTag: "DefaultEventTag",
    // 用來廣播新增對象標籤特殊事件
    EmitInsertCusTag: "RegistInsertCusTag",
    // 用來廣播不可顯示討論組的收件人畫面
    EmitDisableDiscReceiver: "DisableDiscReceiver",
    // 客服人員資料
    SupportInfo: { "LastName": "客服", "FirstName": "人員", "Email": "support@458.com.tw", "Password": "gary" }

});