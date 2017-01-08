SuccApp.controller('BackendRecord', ['$scope', 'GetBackendData', '$filter', function ($scope, GetBackendData, $filter) {
    //預設顯示公司名稱
    $scope.IsShowCompName = { 'display': 'block' };
    //預設隱藏CompDetail
    $scope.IsShowCompDetail = { 'display': 'none' };
    $scope.CompNameClass = "bascinfo w3-animate-left";
    $scope.CompDetailClass = "w3-animate-left";
    $scope.CompShorNameBtnClass = "w3-btn w3-teal adddepart";
    //預設顯示標題
    $scope.Title = { 'display': 'block' };
    //factory:GetUseRecord設定http
    GetBackendData.GetUseRecord()
    .then(function (result) {
        //把拿到的值塞進CompList
        $scope.CompList = result.data;
       // var Para = $filter('date')(result.data[0].Complist[0].CompCreatTime, "dd/MM/yyyy");
    });
    //按下公司按鈕後的function
    $scope.ShowCompDetail = function (CompID) {
      
        $scope.CompShorNameBtnClass = "w3-btn w3-pink";
        //到factory:GetBackendData 拿後端get到的資料
        GetBackendData.GetUsageStatus(CompID)
        .then(function (result) {
            var para = {};
            //把公司名稱加到para object
            para.Compname = result.data[0].DiscCount[0].Compname;
            //把討論組數量(全部)加到para object
            para.Disccount = result.data[0].DiscCount[0].Disccount;
            //把討論組數量(未刪除)加到para object
            para.ActiveDisccount = result.data[0].ActiveDiscCount[0].ActiveDisccount;
            //判斷SubjCount是否為undefined
            if (result.data[0].SubjCount[0] == undefined) {
                //預設為0
                para.Last30SubjCount = 0;
            }
            else {
                //把近一個月主題數量加到para object
                para.Last30SubjCount = result.data[0].SubjCount[0].Last30SubjCount;
            }
            //判斷SubjCount是否為undefined
            if (result.data[0].SubjCount[0] == undefined)
            {
                //預設為0
                para.Subjcount = 0;
            }
            else
            {
                //把主題總量加到para object
                para.Subjcount = result.data[0].SubjCount[0].Subjcount;
            }
            //判斷ActiveSubjCount是否為undefined
            if (result.data[0].ActiveSubjCount[0] == undefined) {
                //預設為0
                para.ActiveSubjcount = 0;
            }
            else {
                //把主題總量(未刪除)加到para object
                para.ActiveSubjcount = result.data[0].ActiveSubjCount[0].ActiveSubjcount;
            }
            //把近一個月上傳數量加到para object
            para.Last30Att = result.data[0].Last30TotalUploadSize;
            //把上傳總量加到para object
            para.TotalAttachCount = result.data[0].TotalUploadSize;
            //把異動公司(Top1)名稱加到para object
            para.TopTenSubjChangeCompName = result.data[0].TopTenSubjChange[0].CompName;
            //把異動公司(Top2)名稱加到para object
            para.TopTenSubjChangeCompName2 = result.data[0].TopTenSubjChange[1].CompName;
            //把異動公司(Top3)名稱加到para object
            para.TopTenSubjChangeCompName3 = result.data[0].TopTenSubjChange[2].CompName;
            //把異動公司(Top4)名稱加到para object
            para.TopTenSubjChangeCompName4 = result.data[0].TopTenSubjChange[3].CompName;
            //把異動公司(Top5)名稱加到para object
            para.TopTenSubjChangeCompName5 = result.data[0].TopTenSubjChange[4].CompName;
            //把異動公司(Top6)名稱加到para object
            para.TopTenSubjChangeCompName6 = result.data[0].TopTenSubjChange[5].CompName;
            //把異動公司(Top7)名稱加到para object
            para.TopTenSubjChangeCompName7 = result.data[0].TopTenSubjChange[6].CompName;
            //把異動公司(Top8)名稱加到para object
            para.TopTenSubjChangeCompName8 = result.data[0].TopTenSubjChange[7].CompName;
            //把異動公司(Top9)名稱加到para object
            para.TopTenSubjChangeCompName9 = result.data[0].TopTenSubjChange[8].CompName;
            //把異動公司(Top10)名稱加到para object
            para.TopTenSubjChangeCompName10 = result.data[0].TopTenSubjChange[9].CompName;
            //new一個array
            var resultarray = [];
            //把para(object)加到resultarray(arry)裡面
            resultarray.push(para);
            //灌config的值
            $scope.config = {
                         datatype: "local",
                         data: resultarray,
                         //欄位名稱
                         colNames: ["公司名稱", "討論組數量(未刪除)", "30天內的主題數量", "主題數量(未刪除)", "30天內上傳數量", "上傳總量"],
                         //欄位內容
                         colModel: [
                             { name: 'Compname', sortable: false, width: '300px', align: 'center' },   
                             { name: 'ActiveDisccount', sortable: false, width: '160px', align: 'center' },
                             { name: 'Last30SubjCount', sortable: false, width: '160px', align: 'center' }, 
                             { name: 'ActiveSubjcount', sortable: false, width: '160px', align: 'center' },
                             { name: 'Last30Att', sortable: false, width: '150px', align: 'center' },
                             { name: 'TotalAttachCount', sortable: false, width: '165px', align: 'center' }
                         ],
                         height: 38,
                         scrollOffset: 0,
                         width: 1100,
                         shrinkToFit: false
            };
            //把所有成員的資料存進alluser變數
            var alluser = result.data[0].AllUser;
            //灌configcompuser的值
            $scope.configcompuser = {
                datatype: "local",
                data: alluser,
                //欄位名稱
                colNames: [ "所有成員"],
                //欄位內容
                colModel: [
                    { name: 'UserName', sortable: false, width: '180px', align: 'center' }
                ],
                height: 350,
                pager: '#compuserpager',
            };
            //把30天內有登入成員的資料存進last30user變數
            var last30user = result.data;
            //灌configlast30user的值
            $scope.configlast30user = {
                datatype: "json",
                url: '/Backend/GetUser/?CompID=' + CompID,
                //欄位名稱
                colNames: ["30天內有登入的成員","最後一次登入時間"],
                //欄位內容
                colModel: [
                    { name: 'UserName', sortable: false, width: '180px', align: 'center' },
                    { name: 'LastLoginTime', sortable: false, width: '180px', align: 'center' }
                ],
                height: 350,
                pager: '#last30userpager',
            };
            //$scope.configtoptensubjchange = {
            //    datatype: "local",
            //    data: resultarray,
            //    //欄位名稱
            //    colNames: ["有主題異動的公司(Top1)", "Top2", "Top3", "Top4", "Top5"],
            //    //欄位內容
            //    colModel: [
            //        { name: 'TopTenSubjChangeCompName', sortable: false, width: '200px', align: 'center' },
            //        { name: 'TopTenSubjChangeCompName2', sortable: false, width: '200px', align: 'center' },
            //        { name: 'TopTenSubjChangeCompName3', sortable: false, width: '200px', align: 'center' },
            //        { name: 'TopTenSubjChangeCompName4', sortable: false, width: '200px', align: 'center' },
            //        { name: 'TopTenSubjChangeCompName5', sortable: false, width: '200px', align: 'center' }
            //    ],
            //    height: 38
            //};
            //$scope.configtoptensubjchange2 = {
            //    datatype: "local",
            //    data: resultarray,
            //    //欄位名稱
            //    colNames: [ "Top6", "Top7", "Top8", "Top9", "Top10"],
            //    //欄位內容
            //    colModel: [
            //        { name: 'TopTenSubjChangeCompName6', sortable: false, width: '200px', align: 'center' },
            //        { name: 'TopTenSubjChangeCompName7', sortable: false, width: '200px', align: 'center' },
            //        { name: 'TopTenSubjChangeCompName8', sortable: false, width: '200px', align: 'center' },
            //        { name: 'TopTenSubjChangeCompName9', sortable: false, width: '200px', align: 'center' },
            //        { name: 'TopTenSubjChangeCompName10', sortable: false, width: '200px', align: 'center' }
            //    ],
            //    height: 38
            //};
        });
        //factory:GetUseRecord設定http
        GetBackendData.GetUseRecord()
        .then(function (result) {

            $scope.CurrentCompId = CompID;
            // var Para = $filter('filter')($scope.CompList, { Compid: $scope.CompList[0].Compid = CompID }, true);
            //過濾出現在是點選到哪間公司
            var Para = $filter('filter')(result.data, { Compid: CompID }, true);
            //把該間公司的DefaultStyle換掉
            Para[0].DefaultStyle = "w3-btn w3-deep-orange";
            //把改過的資料在塞進$scope.CompList
            $scope.CompList = result.data;
        });
        //把現在的window位置存到$scope.CurrentScroll
        $scope.CurrentScroll = document.body.scrollTop;
        //公司detail頁window固定在最上方
        window.scrollTo(0, 0);
        //隱藏標題
        $scope.Title = { 'display': 'none' };
        CompDetailSetting("basicinfo", { 'display': 'none' }, { 'display': 'block' });
    };
    //上一頁
    $scope.PrevCompName = function () {
        //顯示標題
        $scope.Title = { 'display': 'block' };
        CompDetailSetting("basicinfo w3-animate-right", { 'display': 'block' }, { 'display': 'none' });
        //滾動到剛點的位置
        $("body").animate({ scrollTop: $scope.CurrentScroll }, "slow");
    };
    function CompDetailSetting(CompNameStyle, CompNameClass, CompDetailStyle) {
        $scope.CompNameClass = CompNameStyle;
        $scope.IsShowCompName = CompNameClass;
        $scope.IsShowCompDetail = CompDetailStyle;
    };
}]);