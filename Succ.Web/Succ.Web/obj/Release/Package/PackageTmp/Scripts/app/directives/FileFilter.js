SuccApp.directive('filescreen', ['$http', '$filter', 'Filter_Upload_Start', 'Filter_Upload_End', '$rootScope', 'GetListFinish', function ($http, $filter, Filter_Upload_Start, Filter_Upload_End, $rootScope, GetListFinish)
{

    //初始化頁面Value
    function InitData(scope)
    {
        //初始不顯示過濾清單
        scope.FilterVisible = "false";
        //檔案類型初始化
        scope.FileType = [];
        //成員篩選(上傳者)
        scope.SelectUploadMember = [];
        //成員篩選(通知人)
        scope.SelectappriseMember = [];
        //檔案上傳時間
        scope.UploadDate = null;
        //上傳條件
        scope.FilterPara = {};
        //上傳日期
        scope.FileterDate = {};
    }

    //關閉排序空間
    function CloseFilterArea(scope)
    {
        $('.condition').css("height", "50px");
        scope.FilterVisible = "false";
        scope.SortVisible = "false";
    }

    //初始化檔案分享區上傳者
    function InitFileUser(scope,compid,discid)
    {
        //拿取各別上傳者 & 通知人
        $http({
            method: 'get',
            url: '/FileShare/GetFileCreatorList/?CompID=' + compid + '&DiscussionID=' + discid
        })
        .success(function (data) {
            //指定上傳者
            scope.UploadByList = data;
            //指定通知人
            //scope.AppriseList = data.AppriserData;
        })
        .error(function () {
        });
    }

    //實作上傳日期排序，傳送function 給 FilterPara
    function realize_Upload_Filter(data, StartDate, EndDate)
    {
        return data.CreateOn < StartDate && data.CreateOn >= EndDate;
    }

    //實作上傳日期自行選擇
    function realize_Upload_Date(scope, Upload_Date_Start, Upload_Date_End)
    {
        scope.UploadDate = {};
        //原本有選值，手動清除
        if(Upload_Date_Start == "" && Upload_Date_End == "")
        {
            scope.UploadDate = null;
            scope.FilterDate = {};
        }
        else if(Upload_Date_End == undefined || Upload_Date_End == "")
        {
            scope.FilterDate = function(data)
            {
                return data.CreateOn > (Date.parse(Upload_Date_Start) / 1000);
            }
            //實作日期Tag
            scope.UploadDate["Date"] = Upload_Date_Start.getFullYear() + "/" + (Upload_Date_Start.getMonth() + 1) + "/" + Upload_Date_Start.getDate() + $filter('translate')('After');
        }
        else if(Upload_Date_Start == undefined || Upload_Date_Start == "")
        {
            scope.FilterDate = function(data)
            {
                return data.CreateOn <= (Date.parse(Upload_Date_End) / 1000);
            }
            //實作日期Tag
            scope.UploadDate["Date"] = Upload_Date_End.getFullYear() + "/" + (Upload_Date_End.getMonth() + 1) + "/" + Upload_Date_End.getDate() + $filter('translate')('Before');
        }
        else
        {
            scope.FilterDate = function(data)
            {
                return data.CreateOn > (Date.parse(Upload_Date_Start) / 1000) && data.CreateOn <= (Date.parse(Upload_Date_End) / 1000);
            }
            //實作日期Tag
            scope.UploadDate["Date"] = Upload_Date_Start.getFullYear() + "/" + (Upload_Date_Start.getMonth() + 1) + "/" + Upload_Date_Start.getDate() + " " + $filter('translate')('To') + " " + Upload_Date_End.getFullYear() + (Upload_Date_End.getMonth() + 1) + "/" + Upload_Date_End.getDate();
        }
    }

    //實作上傳者的Group By
    function GroupByUserData(scope, ListData)
    {
        //初始化上傳者
        var CreatorData = [];

        //進行Distinct
        var CreatorArray = $filter('distinct')(ListData, "CreateBy");

        //建立者
        for (var i = 0; i < CreatorArray.length; i++) {
            var result =
                {
                    UserID: CreatorArray[i].CreateBy,
                    UserName: CreatorArray[i].CreatorName
                };
            CreatorData.push(result);
        }
        scope.UploadByList = CreatorData;
    }

    //第二版需加入的參與者模板
//    "<div class='filter-people'>" +
//    "<span class='pull-left'> " + $filter('translate')('apprise') + "</span>" +
//      "<div class='chose-box chose-sender pull-left'>" +
//          "<select class='chosen-select-deselect' multiselect-chosen style='width:100px;' tabindex='-1' ng-model='SelectappriseMember' selectmodel='SelectappriseMember' ng-options='apprise.UserName for apprise in AppriseList'>" +
//          "<option value=''></option>" +
//          "</select>" +
//     "</div>" +
//"</div>" +

    return {
        restrict: "A",
        template: "<button class='condition-btn-filter btn btn-sm' ng-click='OpenFilter()'>" +
                       $filter('translate')('Filter') +
                       "<span class='caret'></span>" +
                  "</button>" +
                  "<ul class='dropdown-menu drop-filter' style='display:block;' ng-show='FilterVisible'>" +
                       "<li class='dropdown-submenu'>" +
                            "<a class='dropdown-submenu-a a_type'>" +
                                 $filter('translate')('File') + $filter('translate')('Type') +
                            "</a>" +
                            "<ul class='dropdown-menu'>" +
                                 "<li><a ng-click='DoFileType(" + '"4"' + ")' tabindex='-1' >" + "ppt,pptx" + "</a></li>" +
                                 "<li><a ng-click='DoFileType(" + '"3"' + ")' tabindex='-1' >" + "xls,xlsx" + "</a></li>" +
                                 "<li><a ng-click='DoFileType(" + '"2"' + ")' tabindex='-1' >" + "doc,docx" + "</a></li>" +
                                 "<li><a ng-click='DoFileType(" + '"1"' + ")' tabindex='-1' >" + "zip,rar,7zip" + "</a></li>" +
                                 "<li><a ng-click='DoFileType(" + '"0"' + ")' tabindex='-1' >" + $filter('translate')('Others') + "</a></li>" +
                            "</ul>" +
                       "</li>" +
                       "<li><label>" + $filter('translate')('Date') + "</label><br /></li>" +
                       "<li class='dropdown-submenu'>" +
                            "<a class='a_type'>" +
                                 $filter('translate')('UploadTime') +
                                 "<ul class='dropdown-menu' style='width:120px;top:-55px;' ng-controller='DatepickerDemoCtrl'>" +
                                     "<li>" +
                                         "<a class='a_type' tabindex='-1' ng-click='FDateRange(" + '"1"' + ")'>" +
                                              $filter('translate')('Within_One_Week') +
                                         "</a>" +
                                     "</li>" +
                                     "<li>" +
                                         "<a class='a_type' tabindex='-1' ng-click='FDateRange(" + '"2"' + ")'>" +
                                              $filter('translate')('Within_Two_Week') +
                                         "</a>" +
                                     "</li>" +
                                     "<li>" +
                                         "<a class='a_type' tabindex='-1' ng-click='FDateRange(" + '"3"' + ")'>" +
                                              $filter('translate')('Within_One_Mon') +
                                         "</a>" +
                                     "</li>" +
                                    "<li class='FilterDatePicker'>" +
                                        "<p class='input-group input-group-sm start-date pull-left'>" +
                                            "<input type='text' class='form-control' datepicker-popup='{{format}}' ng-model='File_Date_Start' is-open='StartFileOpened' min-date='1990-01-01' max-date=''2015-06-22'' datepicker-options='dateOptions' date-disabled='disabled(date, mode)' ng-required='true' close-text='Close' show-button-bar='show_button'  ng-keydown='FilePressKey($event)' />" +
                                            "<span class='input-group-btn'>" +
                                                "<button type='button' class='btn btn-default' ng-click='Fileopen($event)'>" +
                                                    "<i class='glyphicon glyphicon-calendar'></i>" +
                                                "</button>" +
                                            "</span>" +
                                        "</p>" +
                                    "</li>" +
                                    "<li class='FilterDatePicker'>" +
                                        "<p class='input-group input-group-sm start-date pull-left'>" +
                                            "<input type='text' class='form-control' datepicker-popup='{{format}}' ng-model='File_Date_End' is-open='LastFileOpened' min-date='1990-01-01' max-date=''2015-06-22'' datepicker-options='dateOptions' date-disabled='disabled(date, mode)' ng-required='true' close-text='Close' show-button-bar='show_button' ng-keydown='FilePressKey($event)' />" +
                                            "<span class='input-group-btn'>" +
                                                "<button type='button' class='btn btn-default' ng-click='FileEndopen($event)'>" +
                                                    "<i class='glyphicon glyphicon-calendar'></i>" +
                                                "</button>" +
                                            "</span>" +
                                        "</p>" +
                                    "</li>" +
                                 "</ul>" +
                            "</a>" +
                       "</li>" +
                       "<li class='dropdown-submenu'>" +
                            "<label><span></span>" + $filter('translate')('Member') + "</label>" +
                            "<div class='filter-people'>" +
                                 "<span class='pull-left'>" + $filter('translate')('Upload_By') + "</span>" +
                                 "<div class='chose-box chose-sender pull-left'>" +
                                      "<select class='chosen-select-deselect' multiselect-chosen style='width:100px;' tabindex='-1' ng-model='SelectUploadMember' selectmodel='SelectUploadMember' ng-options='Upload.UserName for Upload in UploadByList'>" +
                                      "<option value=''></option>" +
                                      "</select>" +
                                 "</div>" +
                            "</div>" +
                       "</li>" +
                  "</ul>", 

        link: function(scope, element,attrs)
        {
            //初始化資料
            InitData(scope);
            //按鈕按下事件
            scope.FilePressKey = function ($event) {
                $event.preventDefault();
                return false;
            };
            //新版控制過濾選單出現方法
            scope.OpenFilter = function ()
            {
                if (scope.FilterVisible == "false")
                {
                    $('.condition').css("height", "300px");
                    scope.FilterVisible = "true";
                    scope.SortVisible = "false";
                }
                else
                    CloseFilterArea(scope);
            }
            //控制初始化上傳者資料
            if (attrs.filetype == "Search")
            {
                //搜尋檔案結果
                GroupByUserData(scope, scope.$parent.SearchFileData);
            }
            else if (attrs.filetype == "fileShare")
            {
                //檔案分享區
                InitFileUser(scope, attrs.compid, attrs.discid);
            }
            //上傳檔案類型篩選
            scope.DoFileType = function (type_number)
            {
                //每次點擊都先清空array
                scope.FileType = [];
                if(type_number == "4")
                {
                    scope.FilterPara["Type"] = type_number;
                    scope.FileType.push({ Name: "PPT" });
                }
                if (type_number == "3") {
                    scope.FilterPara["Type"] = type_number;
                    scope.FileType.push({ Name: "XLS" });
                }
                if (type_number == "2") {
                    scope.FilterPara["Type"] = type_number;
                    scope.FileType.push({ Name: "DOC" });
                }
                if (type_number == "1") {
                    scope.FilterPara["Type"] = type_number;
                    scope.FileType.push({ Name: "ZIP" });
                }
                if (type_number == "0") {
                    scope.FilterPara["Type"] = type_number;
                    scope.FileType.push({ Name: $filter('translate')('Others') });
                }
                if (type_number == "5") {
                    scope.FilterPara["Type"] = '';
                }
                CloseFilterArea(scope);
            }
            //上傳者
            scope.$watch('SelectUploadMember', function (newValue,oldValue) {
                if(newValue != undefined)
                {
                    scope.FilterPara["CreateBy"] = newValue.UserID;
                    CloseFilterArea(scope);
                }
            });
            //通知人
            scope.$watch('SelectappriseMember', function (newValue,oldValue) {
                if(newValue != undefined)
                {
                    scope.FilterPara["Appriser"] = newValue.UserID;
                    CloseFilterArea(scope);
                }
            });

            //清除有關人的過濾
            scope.CleanUser = function (para)
            {
                switch(para)
                {
                    case "CreateBy":
                        scope.SelectUploadMember = [];
                        scope.FilterPara["CreateBy"] = '';
                        break;
                    case "Appriser":
                        scope.SelectappriseMember = [];
                        scope.FilterPara["Appriser"] = '';
                        break;
                }
            }

            //排序上傳日期
            scope.FDateRange = function (para)
            {
                //計算出今日日期字串
                var Today = new Date();
                var TodayString = Date.parse(Today.getFullYear() + '/' + (Today.getMonth() + 1) + '/' + Today.getDate()) / 1000;
                scope.UploadDate = {};
                switch(para)
                {
                    case "1":
                        //一星期內
                        var OneWeekString = TodayString - (7 * 24 * 60 * 60);
                        scope.UploadDate['Date'] = $filter('translate')('Within_One_Week');
                        scope.FilterDate = function(data)
                        {
                            //實作上傳日期排序
                            return realize_Upload_Filter(data, TodayString, OneWeekString);
                        }
                        break;
                    case "2":
                        //兩星期內
                        var TwoWeeksString = TodayString - (14 * 24 * 60 * 60);
                        scope.UploadDate['Date'] = $filter('translate')('Within_Two_Week');
                        scope.FilterDate = function(data)
                        {
                            //實作上傳日期排序
                            return realize_Upload_Filter(data, TodayString, TwoWeeksString);
                        }
                        break;
                    case "3":
                        //一個月內
                        var OneMonthString = TodayString - (30 * 24 * 60 * 60);
                        scope.UploadDate['Date'] = $filter('translate')('Within_One_Mon');
                        scope.FilterDate = function(data)
                        {
                            //實作上傳日期排序
                            return realize_Upload_Filter(data, TodayString, OneMonthString);
                        }
                        break;
                }
                CloseFilterArea(scope);
            }

            //上傳日期自行選擇開始
            Filter_Upload_Start.onFilterDate(scope, function (item) {
                realize_Upload_Date(scope, item.StartDate, item.EndDate);
                CloseFilterArea(scope);
            });
            //上傳日期自行選擇結束
            Filter_Upload_End.onFilterDate(scope, function (item) {
                realize_Upload_Date(scope, item.StartDate, item.EndDate);
                CloseFilterArea(scope);
            });

            //清除日期排序的Tag
            scope.CleanDate = function(para)
            {
                switch(para)
                {
                    case "2":
                        //上傳日期
                        scope.UploadDate = null;
                        scope.FilterDate = {};
                        //清空日期選擇的Model
                        $rootScope.$broadcast('File_Create_Clean');
                        break;
                }
            }

        }

    }

}]);