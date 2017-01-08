SuccApp.directive("finishscreen", ['$http', '$rootScope', 'Filter_Create_Start', 'Filter_Create_End', 'Filter_Modifyed_Start', 'Filter_Modifyed_End', '$filter', 'GetListFinish', 'getMoreFinish', 'getFinish', function ($http, $rootScope, Filter_Create_Start, Filter_Create_End, Filter_Modifyed_Start, Filter_Modifyed_End, $filter, GetListFinish, getMoreFinish, getFinish) {
    //初始化頁面Value
    function InitData(scope) {
        //初始不顯示過濾清單
        scope.FilterVisible = "false";
        //緊急程度的過濾
        scope.EmergencyConditions = [];
        //初始過濾無條件物件
        scope.FilterPara = {};
        //建立日期
        scope.FilterDate = {};
        //最後回覆日期
        scope.FilterClose = {};
        //過濾建立日期初始為null
        scope.CreateDate = null;
        //成員篩選(發文者)
        scope.SelectDispatchMember = [];
        //成員篩選(回覆者)
        scope.SelectReplyMemberList = [];
        //成員塞選(收件者)
        scope.SelectReplyMemberList = [];
        //完成區過濾日期以今日至兩個月前
        FinishCloseInit(scope);
    }

    function FinishCloseInit(scope)
    {
        scope.EndDate = {};
        var Today = new Date();
        var TodayString = Date.parse(Today.getFullYear() + '/' + (Today.getMonth() + 1) + '/' + Today.getDate()) / 1000;
        var twoMonth = TodayString - (60 * 24 * 60 * 60);
        var twoMobthDate = new Date(twoMonth * 1000);
        scope.EndDate["Date"] = (Today.getMonth() + 1) + "/" + Today.getDate() + $filter('translate')('To') + (twoMobthDate.getMonth() + 1) + "/" + twoMobthDate.getDate();
    }

    //初始化各別討論組的使用者資料
    function InitDiscUser(scope, discid) {
        //拿取各別(發文者 回覆者 收件人Data)
        $http({
            method: 'get',
            url: "/Subject/GetUserData/?DiscussionID=" + discid
        })
        .success(function (data) {
            //收件者
            scope.RecipientMemberList = data;
        })
        .error(function () {
            alert("Get UserData Error");
        })
    }

    //關閉排序空間
    function CloseFilterArea(scope) {
        $('.Finish_tab_bar').css("height", "50px");
        scope.FilterVisible = "false";
        scope.SortVisible = "false";
    }

    //實作建立時期排序，傳送Function給FilterPara
    function realize_Create_Filter(data, StartDate, EndDate)
    {
        return (Date.parse(data.CreatedOn) / 1000) < StartDate && (Date.parse(data.CreatedOn) / 1000) >= EndDate;
    }

    //實作建立日期自行選擇
    function realize_Create_Date(scope, Create_Date_Start, Create_Date_End) {
        scope.CreateDate = {};
        //原本有選值，手動清除
        if (Create_Date_Start == "" && Create_Date_End == "") {
            scope.CreateDate = null;
            scope.FilterDate = {};
        }
        else if (Create_Date_End == undefined || Create_Date_End == "") {
            scope.FilterDate = function (data) {
                return Date.parse(data.CreatedOn) > Date.parse(Create_Date_Start);
            }
            //實作日期Tag
            scope.CreateDate["Date"] = Create_Date_Start.getFullYear() + "/" + (Create_Date_Start.getMonth() + 1) + "/" + Create_Date_Start.getDate() + $filter('translate')('After');
        }
        else if (Create_Date_Start == undefined || Create_Date_Start == "") {
            scope.FilterDate = function (data) {
                return Date.parse(data.CreatedOn) <= Date.parse(Create_Date_End);
            }
            //實作日期Tag
            scope.CreateDate["Date"] = Create_Date_End.getFullYear() + "/" + (Create_Date_End.getMonth() + 1) + "/" + Create_Date_End.getDate() + $filter('translate')('Before');
        }
        else {
            scope.FilterDate = function (data) {
                return Date.parse(data.CreatedOn) > Date.parse(Create_Date_Start) && Date.parse(data.CreatedOn) <= Date.parse(Create_Date_End);
            }
            //實作日期Tag
            scope.CreateDate["Date"] = Create_Date_Start.getFullYear() + "/" + (Create_Date_Start.getMonth() + 1) + "/" + Create_Date_Start.getDate() + " " + $filter('translate')('To') + " " + Create_Date_End.getFullYear() + "/" + (Create_Date_End.getMonth() + 1) + "/" + Create_Date_End.getDate();
        }
    }

    //實作歸檔時期排序，傳送Function給FilterPara
    function realize_Close_Filter(data, StartDate, EndDate)
    {
        return data.CloseOn < StartDate && data.CloseOn >= EndDate;
    }
    
    //實作最後回覆日期，自行選擇
    function realize_Close_Date(scope, Modifyed_Date_Start, Modifyed_Date_End) {
        scope.EndDate = {};
        if (Modifyed_Date_Start == "" && Modifyed_Date_End == "") {
            scope.EndDate = null;
            scope.FilterClose = {};
        }
        else if (Modifyed_Date_End == undefined || Modifyed_Date_End == "") {
            scope.FilterClose = function (data) {
                return Date.parse(data.PlanCloseOn) > Date.parse(Modifyed_Date_Start);
            }
            //實作日期Tag
            scope.EndDate["Date"] = Modifyed_Date_Start.getFullYear() + "/" + (Modifyed_Date_Start.getMonth() + 1) + "/" + Modifyed_Date_Start.getDate() + $filter('translate')('After');
        }
        else if (Modifyed_Date_Start == undefined || Modifyed_Date_Start == "") {
            scope.FilterClose = function (data) {
                return Date.parse(data.PlanCloseOn) <= Date.parse(Modifyed_Date_End);
            }
            //實作日期Tag
            scope.EndDate["Date"] = Modifyed_Date_End.getFullYear() + "/" + (Modifyed_Date_End.getMonth() + 1) + "/" + Modifyed_Date_End.getDate() + $filter('translate')('Before');
        }
        else {
            scope.FilterClose = function (data) {
                return Date.parse(data.PlanCloseOn) > Date.parse(Modifyed_Date_Start) && Date.parse(data.PlanCloseOn) <= Date.parse(Modifyed_Date_End);
            }
            //實作日期Tag
            scope.EndDate["Date"] = Modifyed_Date_Start.getFullYear() + "/" + (Modifyed_Date_Start.getMonth() + 1) + "/" + Modifyed_Date_Start.getDate() + " " + $filter('translate')('To') + " " + Modifyed_Date_End.getFullYear() + "/" + (Modifyed_Date_End.getMonth() + 1) + "/" + Modifyed_Date_End.getDate();
        }
    }

    //實作建立者及最後回覆者的Group By
    function GroupByUserData(scope, ListData)
    {
        //初始化建立人及最後回覆人為空陣列
        var CreatorData = [];
        var ModifierData = [];

        //進行Distinct
        var CreatorArray = $filter('distinct')(ListData, "CreatedBy");
        var ModifierArray = $filter('distinct')(ListData, "ModifiedBy");
        //建立者
        for (var i = 0; i < CreatorArray.length; i++) {
            var result =
                {
                    UserID: CreatorArray[i].CreatedBy,
                    UserName: CreatorArray[i].CreatorName
                };
            CreatorData.push(result);
        }
        //最後回覆
        for (var i = 0; i < ModifierArray.length; i++) {
            if (ModifierArray[i].ModifiedBy != "00000000-0000-0000-0000-000000000000") {
                var result =
                    {
                        UserID: ModifierArray[i].ModifiedBy,
                        UserName: ModifierArray[i].ModifierName
                    };
                ModifierData.push(result);
            }
        }
        //發文者
        scope.DispatchMemberList = CreatorData;
        //最後回覆者
        scope.ReplyMemberList = ModifierData;
    }
    

    return {
        restrict: "A",
        //Template
        template: "<button class='condition-btn-filter btn btn-sm' ng-click='OpenFilter()'>" +
                       $filter('translate')('Filter') +
                       "<span class='caret'></span>" +
                  "</button>" +
                  "<ul class='dropdown-menu drop-filter' style='display:block;' ng-show='FilterVisible'>" +
                       "<li class='dropdown-submenu'>" +
                           "<a class='dropdown-submenu-a a_type'>" +
                           $filter('translate')('Urgency') +
                           "</a>" +
                           "<ul class='dropdown-menu'>" +
                               "<li><a ng-click='DoEmergencyLelve(" + '"3"' + ")' tabindex='-1' class='a_type'>" + $filter('translate')('Urgent') + "</a></li>" +
                               "<li><a ng-click='DoEmergencyLelve(" + '"2"' + ")' tabindex='-1' class='a_type'>" + $filter('translate')('Pressing') + "</a></li>" +
                               "<li><a ng-click='DoEmergencyLelve(" + '"1"' + ")' tabindex='-1' class='a_type'>" + $filter('translate')('Important') + "</a></li>" +
                               "<li><a ng-click='DoEmergencyLelve(" + '"0"' + ")' tabindex='-1' class='a_type'>" + $filter('translate')('Unmarked') + "</a></li>" +
                           "</ul>" +
                       "</li>" +
                       "<li class='dropdown-submenu'>" +
                           "<label><span></span>" + $filter('translate')('Member') + "</label>" +
                           "<div class='filter-people'>" +
                               "<span class='pull-left'>" + $filter('translate')('Creator') + "</span>" +
                               "<div class='chose-box chose-sender pull-left'>" +
                                   "<select class='chosen-select-deselect' multiselect-chosen style='width:100px;'tabindex='-1' ng-model='SelectDispatchMember' selectmodel='SelectDispatchMember' ng-options='Create.UserName for Create in DispatchMemberList'>" +
                                       "<option value=''></option>" +
                                   "</select>" +
                               "</div>" +
                           "</div>" +
                           "<div class='filter-people'>" +
                               "<span class='pull-left'>" + $filter('translate')('Replier') + "</span>" +
                               "<div class='chose-box chose-sender pull-left'>" +
                                   "<select class='chosen-select-deselect' multiselect-chosen style='width:100px;'tabindex='-1' ng-model='SelectReplyMember' selectmodel='SelectReplyMember' ng-options='Modify.UserName for Modify in ReplyMemberList'>" +
                                       "<option value=''></option>" +
                                   "</select>" +
                               "</div>" +
                           "</div>" +
                           "<div class='filter-people'>" +
                               "<span class='pull-left'>" + $filter('translate')('Receiver') + "</span>" +
                                "<div class='chose-box chose-sender pull-left'>" +
                                    "<select class='chosen-select-deselect' multiselect-chosen style='width:100px;'tabindex='-1' ng-model='SelectRecipientMember' selectmodel='SelectRecipientMember' ng-options='rmr.UserName for rmr in RecipientMemberList'>" +
                                        "<option value=''></option>" +
                                    "</select>" +
                                "</div>" +
                           "</div>" +
                       "</li>" +
                       "<li><label>"+ $filter('translate')('Date') +"</label><br></li>" +
                        "<li class='dropdown-submenu'>" +
                            "<a class='a_type'>" +
                                $filter('translate')('Create') + $filter('translate')('Date') +
                                "<ul class='dropdown-menu' style='width:120px;top:-105px;' ng-controller='DatepickerDemoCtrl'>" +
                                    "<li>" +
                                        "<a class='a_type' tabindex='=-1' ng-click='CDateRange(" + '"1"' + ")'>" + $filter('translate')('Within_One_Week') + "</a>" +
                                    "</li>" +
                                    "<li>" +
                                        "<a class='a_type' ng-click='CDateRange(" + '"2"' + ")'>" + $filter('translate')('Within_Two_Week') + "</a>" +
                                    "</li>" +
                                    "<li>" +
                                        "<a class='a_type' ng-click='CDateRange(" + '"3"' + ")'>" + $filter('translate')('Within_One_Mon') + "</a>" +
                                    "</li>" +
                                    "<li class='FilterDatePicker'>" +
                                        "<p class='input-group input-group-sm start-date pull-left'>" +
                                            "<input type='text' class='form-control' datepicker-popup='{{format}}' ng-model='Create_Date_Start' is-open='StartCreateOpened' min-date='1990-01-01' max-date=''2015-06-22'' datepicker-options='dateOptions' date-disabled='disabled(date, mode)' ng-required='true' close-text='Close' show-button-bar='show_button' ng-keydown='FinishKeydown($event)'/>" +
                                            "<span class='input-group-btn'>" +
                                                "<button type='button' class='btn btn-default' ng-click='open($event)'><i class='glyphicon glyphicon-calendar'></i></button>" +
                                            "</span>" +
                                        "</p>" +
                                    "</li>" +
                                    "<li class='FilterDatePicker'>" +
                                        "<p class='input-group input-group-sm start-date pull-left'>" +
                                            "<input type='text' class='form-control' datepicker-popup='{{format}}' ng-model='Create_Date_End' is-open='LastCreateOpened' min-date='1990-01-01' max-date=''2015-06-22'' datepicker-options='dateOptions' date-disabled='disabled(date, mode)' ng-required='true' close-text='Close' show-button-bar='show_button' ng-keydown='FinishKeydown($event)'/>" +
                                            "<span class='input-group-btn'>" +
                                                "<button type='button' class='btn btn-default' ng-click='Endopen($event)'><i class='glyphicon glyphicon-calendar'></i></button>" +
                                            "</span>" +
                                        "</p>" +
                                    "</li>" +
                                "</ul>" +
                            "</a>" +
                        "</li>" +
                        "<li class='dropdown-submenu'>" +
                            "<a class='a_type'>" +
                                $filter('translate')('Close') + $filter('translate')('Date') +
                                "<ul class='dropdown-menu' style='width:120px;top:-132px;' ng-controller='DatepickerDemoCtrl'>" +
                                    "<li>" +
                                        "<a href='' class='a_type' ng-click='EDateRange(" + '"1"' + ")'>" + $filter('translate')('Within_One_Week') + "</a>" +
                                    "</li>" +
                                    "<li>" +
                                        "<a href='' class='a_type' ng-click='EDateRange(" + '"2"' + ")'>" + $filter('translate')('Within_Two_Week') + "</a>" +
                                    "</li>" +
                                    "<li>" +
                                        "<a href='' class='a_type' ng-click='EDateRange(" + '"3"' + ")'>" + $filter('translate')('Within_One_Mon') + "</a>" +
                                    "</li>" +
                                    "<li class='FilterDatePicker'>" +
                                        "<p class='input-group input-group-sm start-date pull-left'>" +
                                            "<input type='text' class='form-control' datepicker-popup='{{format}}' ng-model='Modifyed_Date_Start' is-open='StartModifyOpened' min-date='1990-01-01' max-date=''2015-06-22'' datepicker-options='dateOptions' date-disabled='disabled(date, mode)' ng-required='true' close-text='Close' show-button-bar='show_button' ng-keydown='FinishKeydown($event)'/>" +
                                            "<span class='input-group-btn'>" +
                                                "<button type='button' class='btn btn-default' ng-click='MStartopen($event)'><i class='glyphicon glyphicon-calendar'></i></button>" +
                                            "</span>" +
                                        "</p>" +
                                    "</li>" +
                                    "<li class='FilterDatePicker'>" +
                                        "<p class='input-group input-group-sm start-date pull-left'>" +
                                            "<input type='text' class='form-control' datepicker-popup='{{format}}' ng-model='Modifyed_Date_End' is-open='EndModifyOpened' min-date='1990-01-01' max-date=''2015-06-22'' datepicker-options='dateOptions' date-disabled='disabled(date, mode)' ng-required='true' close-text='Close' show-button-bar='show_button' ng-keydown='FinishKeydown($event)'/>" +
                                            "<span class='input-group-btn'>" +
                                                "<button type='button' class='btn btn-default' ng-click='MEndopen($event)'><i class='glyphicon glyphicon-calendar'></i></button>" +
                                            "</span>" +
                                        "</p>" +
                                    "</li>" +
                                "</ul>" +
                            "</a>" +
                        "</li>" +
                  "</ul>",
        link: function (scope, element, attrs) {
            //完城區部可自動輸入日期
            scope.FinishKeydown = function ($event) {
                $event.preventDefault();
                return false;
            };
            //完成區不顯示取消按鈕
            scope.closedate = false;
            scope.dateitem = $filter('translate')('Close') + $filter('translate')('Date');
            //初始化資料
            InitData(scope);
            
            //初始化完成區收件人
            InitDiscUser(scope, attrs.discid);

            //初始化完成區建立者及最後回覆者
            GetListFinish.onGetFinish(scope, function ()
            {
                GroupByUserData(scope, scope.FinishObj.FinishData);
            });
            
            //完成區頁面載入更大範圍，刷新FilterClose and FilterLabel
            getMoreFinish.onGetMore(scope, function (Data)
            {
                console.log(Data);
                scope.EndDate["Date"] = Data.ShowSDate + " " + $filter('translate')('To') + " " + Data.ShowEDate;
                //實作
                scope.FilterClose = function (data)
                {
                    return realize_Close_Filter(data, Data.SDate, Data.EDate);
                }
            });

            //新版控制過濾選單出現方法
            scope.OpenFilter = function ()
            {
                if (scope.FilterVisible == "false") {
                    $('.Finish_tab_bar').css("height", "300px");
                    scope.FilterVisible = "true";
                    scope.SortVisible = "false";
                }
                else
                    CloseFilterArea(scope);
            }

            //緊急程度篩選
            scope.DoEmergencyLelve = function (type_number) {
                //每次點擊都先清空array
                scope.EmergencyConditions = [];
                if (type_number == "3") {
                    scope.FilterPara["SubjectColor"] = type_number;
                    scope.EmergencyConditions.push({ State: $filter('translate')('Urgent') });
                }
                if (type_number == "2") {
                    scope.FilterPara["SubjectColor"] = type_number;
                    scope.EmergencyConditions.push({ State: $filter('translate')('Pressing') });
                }
                if (type_number == "1") {
                    scope.FilterPara["SubjectColor"] = type_number;
                    scope.EmergencyConditions.push({ State: $filter('translate')('Important') });
                }
                if (type_number == "0") {
                    scope.FilterPara["SubjectColor"] = type_number;
                    scope.EmergencyConditions.push({ State: $filter('translate')('Unmarked') });
                }
                if (type_number == "4") {
                    scope.FilterPara["SubjectColor"] = '';
                }
                CloseFilterArea(scope);
            }

            //發文者
            scope.$watch('SelectDispatchMember', function (newValue, oldValue) {
                if (newValue != undefined) {
                    scope.FilterPara["CreatedBy"] = newValue.UserID;
                    CloseFilterArea(scope);
                }
            })

            //回覆者
            scope.$watch('SelectReplyMember', function (newValue, oldValue) {
                if (newValue != undefined) {
                    scope.FilterPara["ModifiedBy"] = newValue.UserID;
                    CloseFilterArea(scope);
                }
            })

            //收件者
            scope.$watch('SelectRecipientMember', function (newValue, oldValue) {
                if (newValue != undefined) {
                    scope.FilterPara["Receiver"] = newValue.UserID;
                    CloseFilterArea(scope);
                }

            })

            //清除有關人的過濾:包掛發文者、回覆者、收件者
            scope.CleanUser = function (para) {
                switch (para) {
                    case 'CreatedBy':
                        scope.SelectDispatchMember = [];
                        //清空過濾條件
                        scope.FilterPara["CreatedBy"] = '';
                        break;
                    case 'ModifiedBy':
                        scope.SelectReplyMember = [];
                        //清空過濾條件
                        scope.FilterPara["ModifiedBy"] = '';
                        break;
                    case 'recipient':
                        scope.SelectRecipientMember = [];
                        //清空過濾條件
                        scope.FilterPara["Receiver"] = '';
                        break;
                }
            }

            //排序建立日期
            scope.CDateRange = function (para) {
                //計算出今日日期字串
                var Today = new Date();
                var TodayString = Date.parse(Today.getFullYear() + '/' + (Today.getMonth() + 1) + '/' + Today.getDate()) / 1000;
                scope.CreateDate = {};
                switch (para) {
                    case "1":
                        //一星期內
                        var OneWeekString = TodayString - (7 * 24 * 60 * 60);
                        scope.CreateDate['Date'] = $filter('translate')('Within_One_Week');
                        //data 是 ng-repeat 之中在迴圈跑過的各筆資料
                        scope.FilterDate = function (data) {
                            //實作建立時期排序
                            return realize_Create_Filter(data, TodayString, OneWeekString);
                        }
                        break;
                    case "2":
                        //二星期內
                        var TwoWeeksString = TodayString - (14 * 24 * 60 * 60);
                        scope.CreateDate['Date'] = $filter('translate')('Within_Two_Week');
                        scope.FilterDate = function (data) {
                            //實作建立時期排序
                            return realize_Create_Filter(data, TodayString, TwoWeeksString);
                        }
                        break;
                    case "3":
                        //一個月內
                        var OneMonthString = TodayString - (30 * 24 * 60 * 60);
                        scope.CreateDate['Date'] = $filter('translate')('Within_One_Mon');
                        scope.FilterDate = function (data) {
                            //實作建立時期排序
                            return realize_Create_Filter(data, TodayString, OneMonthString);
                        }
                        break;

                }
                CloseFilterArea(scope);
            }

            //建立日期開始
            Filter_Create_Start.onFilterDate(scope, function (item) {
                //送輸入的日期到factory廣播
                getFinish.GetSlectFilterDate(item.StartDate, item.EndDate, "", "");
                //呼叫建立日期自行選擇的filter
                realize_Create_Date_New(scope,item.StartDate,item.EndDate);
                //呼叫關閉排序空間
                CloseFilterArea(scope);
            }); 
            //建立日期結束
            Filter_Create_End.onFilterDate(scope, function (item) {
                //送輸入的日期到factory廣播
                getFinish.GetSlectFilterDate(item.StartDate, item.EndDate,"","");
                //呼叫建立日期自行選擇的filter
                realize_Create_Date_New(scope, item.StartDate, item.EndDate);
                //呼叫關閉排序空間
                CloseFilterArea(scope);
            });
            //建立日期自行選擇的filter
            function realize_Create_Date_New(scope, Create_Date_Start, Create_Date_End) {
                var Today = new Date();
                var TodayString = Date.parse(Today.getFullYear() + '/' + (Today.getMonth() + 1) + '/' + Today.getDate()) / 1000;
                scope.CreateDate = {};
                //原本有選值，手動清除
                if (Create_Date_Start == "" && Create_Date_End == "") {
                    scope.CreateDate = null;
                    scope.FilterDate = {};
                }
                //如果沒有選取結束日期
                else if (Create_Date_End == undefined || Create_Date_End == "") {
                    scope.FilterDate = function (data) {
                        //把選取日期轉成跟後端回傳的資料相同
                        return data.CreatedOn >= Date.parse(Create_Date_Start) / 1000;
                    }
                    //實作日期Tag
                    scope.CreateDate["Date"] = Create_Date_Start.getFullYear() + "/" + (Create_Date_Start.getMonth() + 1) + "/" + Create_Date_Start.getDate() + $filter('translate')('After');
                }
                //如果沒有選取開始日期
                else if (Create_Date_Start == undefined || Create_Date_Start == "") {
                    scope.FilterDate = function (data) {
                        //把選取日期轉成跟後端回傳的資料相同
                        return  data.CreatedOn <= Date.parse(Create_Date_End) / 1000;
                    }
                    //實作日期Tag
                    scope.CreateDate["Date"] = Create_Date_End.getFullYear() + "/" + (Create_Date_End.getMonth() + 1) + "/" + Create_Date_End.getDate() + $filter('translate')('Before');
                }
                else {
                    scope.FilterDate = function (data) {
                        //把選取日期轉成跟後端回傳的資料相同
                        return data.CreatedOn >= Date.parse(Create_Date_Start) / 1000 && data.CreatedOn <= Date.parse(Create_Date_End) / 1000;
                    }
                    //實作日期Tag
                    scope.CreateDate["Date"] = Create_Date_Start.getFullYear() + "/" + (Create_Date_Start.getMonth() + 1) + "/" + Create_Date_Start.getDate() + " " + $filter('translate')('To') + " " + Create_Date_End.getFullYear() + "/" + (Create_Date_End.getMonth() + 1) + "/" + Create_Date_End.getDate();
                }
            }
            //排序結束日期時間
            scope.EDateRange = function (para) {
                //計算出今日日期字串
                var Today = new Date();
                var TodayString = Date.parse(Today.getFullYear() + '/' + (Today.getMonth() + 1) + '/' + (Today.getDate() + 1)) / 1000;
                scope.EndDate = {};
                switch (para) {
                    case "1":
                        //一星期內
                        var OneWeekString = TodayString - (7 * 24 * 60 * 60);
                        scope.EndDate["Date"] = $filter('translate')('Within_One_Week');
                        scope.FilterClose = function (data) {
                            console.log(TodayString);
                            return realize_Close_Filter(data, TodayString, OneWeekString);
                        }
                        break;
                    case "2":
                        //兩星期內
                        var TwoWeeksString = TodayString - (14 * 24 * 60 * 60);
                        scope.EndDate["Date"] = $filter('translate')('Within_Two_Week');
                        scope.FilterClose = function (data) {
                            return realize_Close_Filter(data, TodayString, TwoWeeksString);
                        }
                        break;
                    case "3":
                        //一個月內
                        var OneMonthString = TodayString - (30 * 24 * 60 * 60);
                        scope.EndDate["Date"] = $filter('translate')('Within_One_Mon');
                        scope.FilterClose = function (data) {
                            return realize_Close_Filter(data, TodayString, OneMonthString);
                        }
                        break;

                }
                CloseFilterArea(scope);
            }

            //歸檔日期開始
            Filter_Modifyed_Start.onFilterDate(scope, function (item) {
                //送輸入的日期到factory廣播
                getFinish.GetSlectFilterDate("","",item.StartDate, item.EndDate);
                //呼叫歸檔日期自行選擇的filter
                realize_Close_Date_New(scope, item.StartDate, item.EndDate);
                //呼叫關閉排序空間
                CloseFilterArea(scope);
            });

            //歸檔日期結束
            Filter_Modifyed_End.onFilterDate(scope, function (item) {
                //送輸入的日期到factory廣播
                getFinish.GetSlectFilterDate("","",item.StartDate, item.EndDate);
                //呼叫歸檔日期自行選擇的filter
                realize_Close_Date_New(scope, item.StartDate, item.EndDate);
                //呼叫關閉排序空間
                CloseFilterArea(scope);
            });
            //歸檔日期自行選擇的filter
            function realize_Close_Date_New(scope, Close_Date_Start, Close_Date_End) {
                scope.EndDate = {};
                //原本有選值，手動清除
                if (Close_Date_Start == "" && Close_Date_End == "") {
                    scope.EndDate = null;
                    scope.FilterDate = {};
                }
                //如果沒有選取結束日期
                else if (Close_Date_End == undefined || Close_Date_End == "") {
                    scope.FilterDate = function (data) {
                        //把選取日期轉成跟後端回傳的資料相同
                        return data.CloseOn >= Date.parse(Close_Date_Start) / 1000;
                    }
                    //實作日期Tag
                    scope.EndDate["Date"] = Close_Date_Start.getFullYear() + "/" + (Close_Date_Start.getMonth() + 1) + "/" + Close_Date_Start.getDate() + $filter('translate')('After');
                }
                //如果沒有選取開始日期
                else if (Close_Date_Start == undefined || Close_Date_Start == "") {
                    scope.FilterDate = function (data) {
                        //把選取日期轉成跟後端回傳的資料相同
                        return data.CloseOn <= Date.parse(Close_Date_End) / 1000;
                    }
                    //實作日期Tag
                    scope.EndDate["Date"] = Close_Date_End.getFullYear() + "/" + (Close_Date_End.getMonth() + 1) + "/" + Close_Date_End.getDate() + $filter('translate')('Before');
                }
                else {
                    scope.FilterDate = function (data) {
                        //把選取日期轉成跟後端回傳的資料相同
                        return data.CloseOn >= Date.parse(Close_Date_Start) / 1000 && data.CloseOn <= Date.parse(Close_Date_End) / 1000;
                    }
                    //實作日期Tag
                    scope.EndDate["Date"] = Close_Date_Start.getFullYear() + "/" + (Close_Date_Start.getMonth() + 1) + "/" + Close_Date_Start.getDate() + " " + $filter('translate')('To') + " " + Close_Date_End.getFullYear() + "/" + (Close_Date_End.getMonth() + 1) + "/" + Close_Date_End.getDate();
                }
            }
            //清除日期排序的Tag
            scope.CleanDate = function (para) {
                switch (para) {
                    case '0':
                        //建立日期
                        scope.CreateDate = null;
                        scope.FilterDate = {};
                        //清空日期選擇的Model
                        $rootScope.$broadcast('Filter_Create_Clean');
                        getFinish.GetSlectFilterDate(null, null, null, null);
                        break;
                    case '1':
                        //最後回覆日期
                        scope.EndDate = null;
                        scope.FilterClose = {};
                        //清空日期選擇的Model
                        $rootScope.$broadcast('Filter_Modifyed_Clean');
                        break;
                }
            }
        }
    }
}]);