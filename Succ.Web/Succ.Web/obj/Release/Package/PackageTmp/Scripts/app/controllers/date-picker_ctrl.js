SuccApp.controller('DatepickerDemoCtrl', ['$scope', 'SearchDate', 'SearchEndDate', 'Filter_Create_Start', 'Filter_Create_End', 'Filter_Modifyed_Start', 'Filter_Modifyed_End', 'Filter_Upload_Start', 'Filter_Upload_End', function ($scope, SearchDate, SearchEndDate, Filter_Create_Start, Filter_Create_End, Filter_Modifyed_Start, Filter_Modifyed_End, Filter_Upload_Start, Filter_Upload_End) {

    //最大極限日
    $scope.maxDate = new Date().getFullYear() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getDate();

    $scope.test = function () {

    };

    // Disable weekend selection
    $scope.disabled = function (date, mode) {
        //return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
    };

    $scope.toggleMin = function () {
        return null;
        //$scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();
    //建立日期開始
    $scope.open = function ($event)
    {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.StartCreateOpened = !$scope.StartCreateOpened;
        if ($scope.LastCreateOpened)
            $scope.LastCreateOpened = false;
    };
    //建立日期結束
    $scope.Endopen = function ($event)
    {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.LastCreateOpened = !$scope.LastCreateOpened;
        if ($scope.StartCreateOpened)
            $scope.StartCreateOpened = false;
    };
    //回覆日期開始
    $scope.MStartopen = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.StartModifyOpened = !$scope.StartModifyOpened;
        if ($scope.EndModifyOpened)
            $scope.EndModifyOpened = false;
    };
    //回覆日期結束
    $scope.MEndopen = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.EndModifyOpened = !$scope.EndModifyOpened;
        if ($scope.StartModifyOpened)
            $scope.StartModifyOpened = false;
    };
    //上傳日期開始
    $scope.Fileopen = function($event)
    {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.StartFileOpened = !$scope.StartFileOpened;
        if ($scope.LastFileOpened)
            $scope.LastFileOpened = false;
    }
    //上傳日期結束
    $scope.FileEndopen = function($event)
    {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.LastFileOpened = !$scope.LastFileOpened;
        if ($scope.StartFileOpened)
            $scope.StartFileOpened = false;
    }
    //搜尋日期開始
    $scope.SearchSopen = function ($event)
    {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.StartSearchopened = !$scope.StartSearchopened;
        if ($scope.EndSearchopened)
            $scope.EndSearchopened = false;
    }
    //搜尋日期結束
    $scope.SearchEopen = function($event)
    {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.EndSearchopened = !$scope.EndSearchopened;
        if ($scope.StartSearchopened)
            $scope.StartSearchopened = false;
    }

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.initDate = new Date('2016-15-20');
    $scope.formats = ['dd/MM/yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.show_button = false;

    //Watch Start Date Value Search
    $scope.$watch('SearchStartDate', function (newValue, oldValue)
    {
        //搜尋開始選取日期改變
        SearchDate.UpdateDate(newValue);   
    });

    //Watch End Date Value Search
    $scope.$watch('SearchEndDate', function (newValue, oldValue)
    {
        //搜尋結束選取日期改變
        SearchEndDate.UpdateDate(newValue);
    });

    //Watch Create_Date_Start
    $scope.$watch('Create_Date_Start', function (newValue, oldValue) {
        if(newValue != undefined)
        {
            //主題過濾 建立開始日期改變
            Filter_Create_Start.FilterDate(newValue, $scope.Create_Date_End);
        }
    });

    //Watch Create_Date_End
    $scope.$watch('Create_Date_End', function (newValue, oldValue)
    {
        if(newValue != undefined)
        {
            //主題過濾 建立結束日期改變
            Filter_Create_End.FilterDate($scope.Create_Date_Start,newValue);
        }
    });
    //Watch Modifyed_Date_Start
    $scope.$watch('Modifyed_Date_Start', function (newValue, oldValue) {
        if(newValue != undefined)
        {
            //主題過濾 最後回覆開始日期改變
            Filter_Modifyed_Start.FilterDate(newValue, $scope.Modifyed_Date_End)
        }
    });
    //Watch Modifyed_Dat_End
    $scope.$watch('Modifyed_Date_End', function (newValue, oldValue) {
        if(newValue != undefined)
        {
            //主題過濾 最後回覆結束日期改變
            Filter_Modifyed_End.FilterDate($scope.Modifyed_Date_Start, newValue);
        }
    });
    //Watch File_Date_Start
    $scope.$watch('File_Date_Start', function (newValue, oldValue) {
        if(newValue != undefined)
        {
            //檔案分享區過濾 檔案上傳開始日期改變
            Filter_Upload_Start.FilterDate(newValue, $scope.File_Date_End);
        }
    });
    //Watch File_Date_End
    $scope.$watch('File_Date_End', function (newValue, oldValue)
    {
        if(newValue != undefined)
        {
            //檔案分享區過濾 檔案上傳結束日期改變
            Filter_Upload_End.FilterDate($scope.File_Date_Start, newValue);
        }
    });
    //清除建立日期的model Value
    $scope.$on("Filter_Create_Clean", function () {        
        $scope.Create_Date_Start = null;
        $scope.Create_Date_End = null;
    });
    //清除結束日期的model Value
    $scope.$on("Filter_Modifyed_Clean", function ()
    {
        $scope.Modifyed_Date_Start = null;
        $scope.Modifyed_Date_End = null;
    });
    //清除上傳日期的model Value
    $scope.$on("File_Create_Clean", function () {
        $scope.File_Date_Start = null;
        $scope.File_Date_End = null;
    });

}]);