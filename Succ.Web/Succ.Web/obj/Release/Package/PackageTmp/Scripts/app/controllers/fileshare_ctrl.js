SuccApp.controller('DiscFileCtrl', ['$scope', '$http', '$filter', 'FileFolder', 'ClickFolder', 'UploadFile', 'UploadFinish', 'FileUploader', 'UploadOk', 'CopyFileUrl','Filesize_Conf','UniqueComp', function ($scope, $http, $filter, FileFolder, ClickFolder, UploadFile, UploadFinish, FileUploader, UploadOk, CopyFileUrl, Filesize_Conf, UniqueComp)
{
    // #region 參數設定
    //預設左邊的討論組列表顯示
    $scope.$parent.$parent.ShowLeftMenu = true;
    //CompanyID
    var CompanyID = $scope.IndexData.CurrentUser.CompID;
    //DiscID
    var DiscID = $scope.discussionid;
    //UserID
    var UserID = $scope.IndexData.CurrentUser.UserID;
    //UserName
    var UserName = $scope.IndexData.CurrentUser.UserName;
    //判斷是否為老闆
    var isAdmin = $scope.IndexData.CurrentUser.isAdmin;

    //指定參數給FileFilter Directive
    $scope.userid = UserID;
    $scope.compid = CompanyID;
    $scope.discussionid = DiscID;
    //預設無開啟資料夾
    $scope.IsInFile = true;
    //預設資料夾階層為空
    $scope.FileClass = "";
    //預設為清單顯示方式
    $scope.IsLargerIcon = false;
    //給于新增資料夾 多國語言Value
    $scope.newFolder = $filter('translate')('NewFolder');
    //資料夾階層給于空陣列
    $scope.FolderStep = [];
    //初始化複製Url字串為空
    $scope.urlString = "";
    //Init FileView
    $scope.FileView = {};
    $scope.FileMoveView = {};
    $scope.FileVersion = {};
    // #endregion
    UploadFileInit("00000000-0000-0000-0000-000000000000");
    MoveFileInit("00000000-0000-0000-0000-000000000000");
    FileVersionInit("00000000-0000-0000-0000-000000000000");
    // #region 呼叫拿取檔案分享的資料
    GetFileData();
    // #endregion
    // #region 確認檔案分享區 呼叫subjectList New Msg Btn'
    $scope.Btnobj.IsShowFileBtn = true;
    // #endregion
    // #region 隱藏新增訊息
    $scope.Btnobj.IsShowMsgBtn = false;
    // #endregion
    // #region 滑過檔案分享列表事件(hover)
    angular.element(".tab-pane").on('mouseover', '.fileShreFile', function () {
        $(this).css('background-color', '#ffffdd');
        $(this).find('.hideBtn').css('opacity', '1.0');
    });

    angular.element(".tab-pane").on("mouseout", ".fileShreFile", function () {
        $(this).css('background-color', '#fff');
        $(this).find(".hideBtn").css("opacity", '0.0');
    });
    // #endregion
    // #region 滑過檔案分享列表(Large)
    angular.element(".tab-pane").on('mouseover', '.fileLargerTd', function () {
        $(this).css('background-color', '#ffffdd');
        $(this).find(".fileLargerVersion").css('background-color', 'lightgray');
        $(this).find(".fileLargeRemove").css('visibility', 'visible');
    });
    angular.element(".tab-pane").on('mouseout', '.fileLargerTd', function () {
        $(this).css('background-color', '#fff');
        $(this).find(".fileLargerVersion").css('background-color', '#fff');
        $(this).find(".fileLargeRemove").css('visibility', 'hidden');
    });
    // #endregion
    // #region 箭頭點擊事件
    $scope.ShowOther = function(FileID)
    {
        $filter('filter')($scope.FileData.showData, { FileID: FileID }, true)[0].IsShowBtn = !$filter('filter')($scope.FileData.showData, { FileID: FileID }, true)[0].IsShowBtn;
        var IsOpen = $filter('filter')($scope.FileData.showData, { FileID: FileID }, true)[0].IsShowBtn;
        IsOpen == true ? $filter('filter')($scope.FileData.showData, { FileID: FileID }, true)[0].TitleStyle = "50%" : $filter('filter')($scope.FileData.showData, { FileID: FileID }, true)[0].TitleStyle = "61%";
    }
    // #endregion
    // #region 檔案分享區Icon 設定
    $scope.IconPath = function(FileType)
    {
        switch (FileType)
        {
            case 9:
                return "IconSetting mp4";
                break;
            case 8:
                return "IconSetting text";
                break;
            case 7:
                return "IconSetting jpg";
                break;
            case 6:
                return "IconSetting mp3";
                break;
            case 5:
                return "IconSetting pdf";
                break;
            case 4:
                return "IconSetting ppt";
                break;
            case 3:
                return "IconSetting excel";
                break;
            case 2:
                return "IconSetting word";
                break;
            case 1:
                return "IconSetting rar";
                break;
            case -1:
                return "IconSetting other";
                break;
        }
    }
    // #endregion
    // #region 檔案分享區 LargeIcon 路徑設定
    $scope.LargeIconPath = function (FileType) {
        switch (FileType) {
            case 9:
                return "fileLargerIcon Largemp4";
                break;
            case 8:
                return "fileLargerIcon Largetext";
                break;
            case 7:
                return "fileLargerIcon Largejpg";
                break;
            case 6:
                return "fileLargerIcon Largemp3";
                break;
            case 5:
                return "fileLargerIcon Largepdf";
                break;
            case 4:
                return "fileLargerIcon Largeppt";
                break;
            case 3:
                return "fileLargerIcon Largeexcel";
                break;
            case 2:
                return "fileLargerIcon Largeword";
                break;
            case 1:
                return "fileLargerIcon Largerar";
                break;
            default:
                return "fileLargerIcon Largeother"
                break;
        }
    }
    // #endregion
    // #region 拿取檔案分享的資料
    function GetFileData() {
        $http({
            method: 'GET',
            url: "/FileShare/GetFilesList/?CompID=" + CompanyID + "&DiscussionID=" + DiscID
        })
        .success(function (data) {
            $scope.FileData = [];
            $scope.FileData.showData = [];
            //資料夾檔案
            if (data.DirList != null) {
                for (var i = 0; i < data.DirList.length; i++) {
                    $scope.FileData.showData.push(data.DirList[i]);
                }
            }
            //單獨檔案
            if (data.FileList != null) {
                for (var i = 0; i < data.FileList.length; i++) {
                    $scope.FileData.showData.push(data.FileList[i]);
                }
            }
        })
        .error(function () {
            alert('Get File Share Error');
        });
    }
    // #endregion
    // #region 新增檔案資料夾
    FileFolder.onAddFileFolder($scope, function () {
        if ($scope.FolderStep.length > 9) {
            alert($filter('translate')('FolderWarn'));
            return;
        }

        var empty = new Array;

        var FileObj = {
            CompanyID: CompanyID,
            DiscID: DiscID,
            DirID: ProduceGuid(),
            DirName: '',
            Name: $filter('translate')('NewFolder'),
            CreateOn: Math.floor(new Date().getTime() / 1000),
            DirList: empty,
            FileList: empty,
            CreateBy: UserID,
            CreatorName: UserName,
            SubTitle: '',
            Size: 0,
            Type: 0,
            IsNewFolder: true
        }
        if ($filter('filter')($scope.FileData.showData, {}, true).length != 0) {
            //資料夾內不為空
            //將除了最新的新增資料夾以外，其餘都變成建立資料夾
            for (var i = 0; i < $filter('filter')($scope.FileData.showData, {}, true).length; i++) {
                $filter('filter')($scope.FileData.showData, {}, true)[i].IsNewFolder = false;
            }
            $scope.FileData.showData.push(FileObj);
        }
        else {
            //資料夾內為空
            $scope.FileData.showData = [];
            $scope.FileData.showData.push(FileObj);
        }


    });
    // #endregion
    // #region 更新View Scope Data
    function UpdateFileData(DirID, Data) {
        //進行填充
        if ($scope.FileData[DirID] != undefined) {
            $scope.FileData[DirID].push(Data);
        }
    }
    // #endregion
    // #region 產生Guid
    function ProduceGuid() {
        function GuidString() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return (GuidString() + GuidString() + "-" + GuidString() + "-" + GuidString() + "-" + GuidString() + "-" + GuidString() + GuidString() + GuidString());
    }
    // #endregion
    // #region 轉換列表顯示方式(Icon)
    $scope.ShowLarger = function (para) {
        para == true ? $scope.IsLargerIcon = true : $scope.IsLargerIcon = false;
    }
    // #endregion
    // #region 刪除列表及大圖示
    $scope.RemoveFile = function (data) {
        var CheckString = $filter('translate')('AreYouSure');
        var result = confirm(CheckString);
        if (result) {
            //判斷權限
            var FileCreatedBy = data.CreateBy;
            if (isAdmin) {
                var index = $scope.FileData.showData.indexOf(data);
                if (index != -1) {
                    $scope.FileData.showData.splice(index, 1);
                }
                if (data.Type == 0) {
                    DeleteFolder(data);
                }
                else if (data.Type != 0) {
                    DeleteFile(data);
                }
            }
            else {
                alert($filter('translate')('DeleteWarn'));
                return;
            }
        }
    }
    // #endregion
    // #region 刪除版本的檔案
    $scope.RemoveVersionFile = function (data) {
        var CheckString = $filter('translate')('AreYouSure');
        var result = confirm(CheckString);
        if (result) {
            //判斷權限
            if (isAdmin) {
                //清空頁面資料
                var index = $scope.VersionList.indexOf(data);
                if (index != -1) {
                    $scope.VersionList.splice(index, 1);
                }
                //呼叫後端刪除資料
                DeleteFileD(data);
            }
            else {
                alert($filter('translate')('DeleteWarn'));
                return;
            }
        }
    };
    // #endregion
    // #region 刪除資料夾
    function DeleteFolder(data) {
        $http({
            method: 'post',
            url: '/FileShare/DeleteFolder',
            data: data
        })
        .success(function (para) {
        })
        .error(function () {
        });
    }
    // #endregion
    // #region 刪除主要檔案
    function DeleteFile(data) {
        var postData =
            {
                FileID: data.FileID,
                Version: data.Version,
                UserId: UserID,
                DiscId: DiscID
            };
        $http({
            method: 'post',
            url: '/FileShare/DeleteFile',
            data: postData
        })
        .success(function (para) {
        })
        .error(function () {
        });
    }
    // #endregion
    // #region 刪除特定版本的檔案
    function DeleteFileD(data) {
        var postData =
            {
                FileID: data.FileID,
                Version: data.Version,
                UserId: UserID,
                DiscId: DiscID
            };
        $http({
            method: 'post',
            url: '/FileShare/DeleteFileD',
            data: postData
        })
        .success(function (para) {
            //取得最新的版本檔案
            var LastNewFile = $scope.VersionList[$scope.VersionList.length - 1];
            //列表目標檔案
            var TargetFile = $filter('filter')($scope.FileData.showData, { 'FileID': LastNewFile['FileID'] }, true)[0];
            //更新最新檔案的資料
            $filter('filter')($scope.FileData.showData, { 'FileID': LastNewFile['FileID'] }, true)[0].CompanyID = LastNewFile['CompanyID'];
            $filter('filter')($scope.FileData.showData, { 'FileID': LastNewFile['FileID'] }, true)[0].CreateBy = LastNewFile['CreateBy'];
            $filter('filter')($scope.FileData.showData, { 'FileID': LastNewFile['FileID'] }, true)[0].CreateOn = LastNewFile['CreateOn'];
            $filter('filter')($scope.FileData.showData, { 'FileID': LastNewFile['FileID'] }, true)[0].CreatorName = LastNewFile['CreatorName'];
            $filter('filter')($scope.FileData.showData, { 'FileID': LastNewFile['FileID'] }, true)[0].Name = LastNewFile['Name'];
            $filter('filter')($scope.FileData.showData, { 'FileID': LastNewFile['FileID'] }, true)[0].Type = LastNewFile['Type'];
            $filter('filter')($scope.FileData.showData, { 'FileID': LastNewFile['FileID'] }, true)[0].Version = '' + LastNewFile['Version'] + '';
        })
        .error(function () {
        });
    };
    // #endregion
    // #region 輸入新增資料夾名稱
    $scope.KeyinFolder = function (DirID, keyCode, FolderName) {
        //按下Enter
        if (keyCode == 13) {
            $filter('filter')($scope.FileData.showData, { DirID: DirID }, true)[0].Name = FolderName;
            $filter('filter')($scope.FileData.showData, { DirID: DirID }, true)[0].IsNewFolder = false;
            CreateFolder(DirID, FolderName);
        }
    }
    // #endregion
    // #region 點擊進入資料夾
    $scope.ClickFolder = function (FileData, AllData) {
        if (FileData.IsNewFolder == true) {
            return;
        }
        var DirID = FileData.DirID;
        $scope.FileClass = DirID;
        //插入資料夾階層
        $scope.FolderStep.push(FileData);
        //轉換顯示資料夾內部檔案
        FillingData(FileData, DirID);
        //儲存回上一頁使用的Data
        FillingDirData(FileData, DirID);
        //更新SubjectList 新增檔案的目的地資料夾
        ClickFolder.ClickFolder(DirID);
        //更新檔案上傳目的地的資料夾ID(本地更新)
        UploadFileInit(DirID);
        MoveFileInit(DirID);
        FileVersionInit(DirID);
    }
    // #endregion
    // #region 轉換顯示資料夾 階層資料夾 + 內部檔案
    function FillingData(FileData, DirID) {
        //Clean FileData
        $scope.FileData.showData = [];
        //首次填充資料(使用Service來的Data)
        if ($scope.FileData[DirID] == undefined) {
            //檔案
            for (var i = 0; i < FileData.FileList.length; i++) {
                $scope.FileData.showData.push(FileData.FileList[i]);
            }
            //資料夾下還有資料夾
            for (var i = 0; i < FileData.DirList.length; i++) {
                $scope.FileData.showData.push(FileData.DirList[i]);
            }
        }
            //二次點擊資料夾(從view Scope Data加入)
        else {
            $scope.FileData.showData = [];
            for (var i = 0; i < $scope.FileData[DirID].length; i++) {
                $scope.FileData.showData.push($scope.FileData[DirID][i]);
            }
        }

    }
    // #endregion
    // #region 填充回上頁需使用的Data(DirData)
    function FillingDirData(FileData, DirID) {
        //首次填充才清空，建立新的Array
        if ($scope.FileData[DirID] == undefined) {
            $scope.FileData[DirID] = [];
        }
        //檔案
        for (var i = 0; i < FileData.FileList.length; i++) {
            var FileIndex = $scope.FileData[DirID].indexOf(FileData.FileList[i]);
            if (FileIndex == -1) {
                $scope.FileData[DirID].push(FileData.FileList[i]);
            }
        }
        //資料夾下還有資料夾
        for (var i = 0; i < FileData.DirList.length; i++) {
            var DirIndex = $scope.FileData[DirID].indexOf(FileData.DirList[i]);
            if (DirIndex == -1) {
                $scope.FileData[DirID].push(FileData.DirList[i]);
            }
        }

    }
    // #endregion
    // #region 點擊檔案進行下載
    $scope.DownLoadFile = function (FileID, Version)
    {
        $("#frameSetting").attr("src", encodeURI("../../FileShare/downloadFile/?FileID=" + FileID + "&version=" + Version));
    };
    // #endregion
    // #region 回任何一層資料夾
    $scope.GoBack = function (StepData, DirID) {
        $scope.FileClass = DirID;
        //回到此DirID的前面那一層
        $scope.FileData.showData = [];
        for (var i = 0; i < $scope.FileData[DirID].length; i++) {
            $scope.FileData.showData.push($scope.FileData[DirID][i]);
        }
        //取得改資料夾階層
        var StepIndex = $scope.FolderStep.indexOf(StepData);
        //總階層長度
        var StepLength = $scope.FolderStep.length;
        //移除該階層後方的階層
        $scope.FolderStep.splice(StepIndex + 1, (StepLength - StepIndex - 1));
        //更新檔案上傳目的地的資料夾ID
        ClickFolder.ClickFolder(DirID);
        //更新檔案上傳目的地的資料夾ID(本地更新)
        UploadFileInit(DirID);
        MoveFileInit(DirID);
        FileVersionInit(DirID);
    }
    // #endregion
    // #region 回到Top
    $scope.GoHome = function () {
        $scope.FileData = [];
        GetFileData();
        //清空ParentID
        $scope.FileClass = "00000000-0000-0000-0000-000000000000";
        $scope.FolderStep = [];
        //更新檔案上傳目的地為最上層
        ClickFolder.ClickFolder("00000000-0000-0000-0000-000000000000");
        //更新檔案上傳目的地的最上層(本地更新)
        UploadFileInit("00000000-0000-0000-0000-000000000000");
        //更新檔案上傳目的地的最上層(本地更新)
        MoveFileInit("00000000-0000-0000-0000-000000000000");
        FileVersionInit("00000000-0000-0000-0000-000000000000");
    }
    // #endregion
    // #region 建立新增的資料夾
    function CreateFolder(DirID, FolderName) {
        var empty = new Array;
        var now = Math.floor(new Date().getTime() / 1000);
        var ParentID = $scope.FileClass;
        var result = {
            CompanyID: CompanyID,
            DiscID: DiscID,
            DirID: DirID,
            Name: FolderName,
            CreateOn: now,
            CreateBy: UserID,
            CreatorName: UserName,
            FileList: empty,
            DirList: empty,
            ParentID: ParentID,
            SubTitle: '',
            Size: 0,
            Type: 0,
            IsNewFolder: false
        };
        //填充view Scope Data
        UpdateFileData(ParentID, result);

        //呼叫Service 建立新增資料夾
        $http({
            method: 'post',
            url: '/FileShare/CreateFolder',
            data: result
        })
        .success(function (Successdata) {
        })
        .error(function () {
        });
    }
    // #endregion
    // #region 複製檔案連結
    $scope.CopyUrl = function (FileID, Version) {
        $(".bs-url-modal").modal("show");
        $scope.copyurl = CopyFileUrl.OnlineString + "FileShare/downloadFile/?FileID=" + FileID + "&version=" + Version;
    }
    // #endregion
    // #region 顯示檔案版本紀錄
    $scope.showVersion = function (FileID) {
        $(".bs-version-modal").modal("show");
        GetVersionList(FileID);
        var DirID = $scope.FileData.showData[0].DirID;
        FileVersionInit(DirID, FileID);
    }
    // #endregion
    // #region 接受到使用者，點擊上傳檔案
    UploadFile.onUploadFile($scope, function () {
        $(".bs-upload-modal").modal("show");
        $scope.OnLoadingFile = true;

        //初始化queue
        $scope.$parent.File.Uploader.queue = [];
        $scope.FileView.Uploader.queue = [];
        $scope.FileMoveView.Uploader.queue = [];
    });
    // #endregion
    // #region 接收到檔案完成上傳
    UploadFinish.onFinishUpload($scope, function (data) {
        $scope.fileItem = data.FileItem.uploader;
    });
    // #endregion
    // #region 檔案分享持續上傳Modal View 上傳檔案初始化設定
    function UploadFileInit(DirID) {
        var UploadAttach =
            {
                url: '/FileShare/UploadFile',
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
                autoUpload: true,
                removeAfterUpload: false,
                formData: [
                    {
                        CompanyId: CompanyID,
                        DiscussionID: DiscID,
                        DirID: DirID,
                        UserId: UserID,
                        UserName: UserName,
                        IsValidate: true
                    }
                ]
            };

        var uploader = $scope.FileView.Uploader = new FileUploader(UploadAttach);
        //上傳檔案前置換FormData (更換資料夾目的地)
        uploader.onBeforeUploadItem = function (item) {
            // 利用FormData 裡面的IsValidate來判斷是否超過10MB
            var _FileSize = item.file.size / 1024 / 1024;
            var _LimitSize = 0;
            switch(CompanyID)
            {
                case UniqueComp.CompList[0]:
                case UniqueComp.CompList[1]:
                    _LimitSize = Filesize_Conf.AdvancedSize;
                    break;
                default:
                    _LimitSize = Filesize_Conf.Size;
                    break;
            }
            console.log("上傳檔案大小:" + _FileSize);
            console.log("限制檔案大小:" + _LimitSize);
            //var _FileSize = item.file.size / 1024 / 1024;
            if (_FileSize > _LimitSize)
            {
                $scope.FileView.Uploader.formData[0].IsValidate = false;
            }
            else {
                $scope.FileView.Uploader.formData[0].IsValidate = true;
            }
            Array.prototype.pop.apply(item.formData, []);
            Array.prototype.push.apply(item.formData, $scope.FileView.Uploader.formData);

        };
        //上傳檔案中Pass Progress
        uploader.onAfterAddingFile = function (fileItem) {
            $scope.fileItem2 = fileItem.uploader;
        };
        //完成上傳後
        uploader.onCompleteItem = function (item, response, status, headers) {
            ValiadateUploadFile(item, response, status);
        };

    }
    // #endregion
    // #region 檔案分享 拖曳上傳初始化設定
    function MoveFileInit(DirID) {
        var UploadAttach =
            {
                url: '/FileShare/UploadFile',
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
                autoUpload: true,
                removeAfterUpload: false,
                formData: [
                    {
                        CompanyId: CompanyID,
                        DiscussionID: DiscID,
                        DirID: DirID,
                        UserId: UserID,
                        UserName: UserName,
                        IsValidate: true
                    }
                ]
            };

        var uploader = $scope.FileMoveView.Uploader = new FileUploader(UploadAttach);

        //上傳檔案前置換FormData (更換資料夾目的地)
        uploader.onBeforeUploadItem = function (item) {
            // 利用FormData 裡面的IsValidate來判斷是否超過10MB
            var _FileSize = item.file.size / 1024 / 1024;
            var _LimitSize = 0;
            switch (CompanyID) {
                case UniqueComp.CompList[0]:
                case UniqueComp.CompList[1]:
                    _LimitSize = Filesize_Conf.AdvancedSize;
                    break;
                default:
                    _LimitSize = Filesize_Conf.Size;
                    break;
            }
            console.log("上傳檔案大小:" + _FileSize);
            console.log("限制檔案大小:" + _LimitSize);
            if (_FileSize > _LimitSize) {
                $scope.FileMoveView.Uploader.formData[0].IsValidate = false;
            }
            else {
                $scope.FileMoveView.Uploader.formData[0].IsValidate = true;
            }
            Array.prototype.pop.apply(item.formData, []);
            Array.prototype.push.apply(item.formData, $scope.FileMoveView.Uploader.formData);
        };
        //上傳檔案中Pass Progress
        uploader.onAfterAddingFile = function (fileItem) {
            $scope.fileItem3 = fileItem.uploader;
        };
        //完成上傳後
        uploader.onCompleteItem = function (item, response, status, headers) {
            ValiadateUploadFile(item, response, status);
        };
    }
    // #endregion
    // #region 判斷檔案是否有正常上傳，沒有的話不進入假資料動作
    function ValiadateUploadFile(item, response, status) {
        if (status == 400) {
            var _msg = $filter('translate')('FileSizeFail');
            alert(_msg);
        }
        else {
            response = response.replace(/\"/g, "");
            UploadOk.UploadComplete(item, response);
        }
    };
    // #endregion
    // #region 接收到檔案上傳完成
    UploadOk.onUploadComplete($scope, function (item) {
        completeData(item);
    });
    // #endregion
    // #region 轉換onComplete Data 可以變成假資料的格式
    function completeData(item) {
        //檔案名稱
        var fileName = item.FileItem.file.name;
        var index = fileName.lastIndexOf(".");
        //檔案類型
        var FileType = fileName.substring(index + 1, fileName.length).toUpperCase();
        //檔案ID
        var FileID = item.FileID;
        //檔案所在資料夾位置
        var DirID = item.FileItem.formData[0].DirID;
        //公司ID
        var CompanyID = item.FileItem.formData[0].CompanyId;
        //討論組ID
        var DiscID = item.FileItem.formData[0].DiscussionID;
        //使用者ID
        var UserID = item.FileItem.formData[0].UserId;
        //使用者名稱
        var UserName = item.FileItem.formData[0].UserName;


        //假資料 Result
        var result =
            {
                Appriser: null,
                CompanyID: CompanyID,
                CreateBy: UserID,
                CreateOn: Math.floor(new Date().getTime() / 1000),
                CreatorName: UserName,
                DirID: DirID,
                DiscID: DiscID,
                FileID: FileID,
                IsShowBtn: false,
                Name: fileName,
                Path: null,
                Size: item.FileItem.file.size / 1000 + "K",
                TitleStyle: "61%",
                Type: transferType(FileType),
                Version: "1"
            }
        PushFileData(result, DirID);
    }
    // #endregion
    // #region version complete Data
    function versioncompleteData(item) {
        //檔案名稱
        var fileName = item.file.name;
        var index = fileName.lastIndexOf(".");
        //檔案類型
        var FileType = fileName.substring(index + 1, fileName.length).toUpperCase();
        //檔案ID
        var FileID = item.formData[0].FileId;
        //檔案所在資料夾位置
        var DirID = item.formData[0].DirID;
        //公司ID
        var CompanyID = item.formData[0].CompanyId;
        //討論組ID
        var DiscID = item.formData[0].DiscussionID;
        //使用者ID
        var UserID = item.formData[0].UserId;
        //使用者名稱
        var UserName = item.formData[0].UserName;

        //假資料 Result
        var result =
            {
                CreateBy: UserID,
                CreateOn: Math.floor(new Date().getTime() / 1000),
                CreatorName: UserName,
                DirID: DirID,
                FileID: FileID,
                Name: fileName,
                Type: transferType(FileType),
                Version: ($scope.VersionList[($scope.VersionList.length - 1)].Version) + 1
            };
        $scope.VersionList.push(result);
    }
    // #endregion
    // #region 檔案上傳完成後，建立假資料
    function PushFileData(item, DirID) {
        if (DirID != "00000000-0000-0000-0000-000000000000") {
            $scope.FileData[DirID].push(item);
        }
        $scope.FileData.showData.push(item);
    }
    // #endregion
    // #region 根據檔案類型轉換檔案Type
    function transferType(Type) {
        if (Type == "PPT" || Type == "PPTX") {
            return 4;
        }
        else if (Type == "XLS" || Type == "XLSX") {
            return 3;
        }
        else if (Type == "DOC" || Type == "DOCX") {
            return 2;
        }
        else if (Type == "ZIP" || Type == "RAR" || Type == "7ZIP") {
            return 1;
        }
        else if (Type == "TXT") {
            return 8;
        }
        else if (Type == "JPG" || Type == "PNG" || Type == "GIF" || Type == "TIF") {
            return 7;
        }
        else if (Type == "MP3") {
            return 6;
        }
        else if (Type == "MP4") {
            return 9;
        }
        else if (Type == "PDF") {
            return 5;
        }
        else {
            return -1;
        }
    }
    // #endregion
    // #region 取得檔案版本列表
    function GetVersionList(FileID) {
        $http({
            method: 'get',
            url: '/FileShare/GetFileVersion/?CompanyID=' + $("#CurrentCompID").val() + '&FileID=' + FileID
        })
        .success(function (data) {
            $scope.VersionList = data;
        })
        .error(function () {
            alert('version List Error');
        });
    }
    // #endregion
    // #region 檔案版本上傳 初始化設定
    function FileVersionInit(DirID, FileID) {
        var UploadAttach =
            {
                url: '/FileShare/uploadFileNewVersion',
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
                autoUpload: true,
                removeAfterUpload: true,
                formData: [
                    {
                        FileId: FileID,
                        CompanyId: CompanyID,
                        DiscussionID: DiscID,
                        DirID: DirID,
                        UserId: UserID,
                        UserName: UserName
                    }
                ]
            };

        var uploader = $scope.FileVersion.Uploader = new FileUploader(UploadAttach);
        //上傳檔案前置換FormData (更換資料夾目的地)
        uploader.onBeforeUploadItem = function (item) {
            // 利用FormData 裡面的IsValidate來判斷是否超過10MB
            var _FileSize = item.file.size / 1024 / 1024;
            var _LimitSize = 0;
            switch (CompanyID) {
                case UniqueComp.CompList[0]:
                case UniqueComp.CompList[1]:
                    _LimitSize = Filesize_Conf.AdvancedSize;
                    break;
                default:
                    _LimitSize = Filesize_Conf.Size;
                    break;
            }
            console.log("上傳檔案大小:" + _FileSize);
            console.log("限制檔案大小:" + _LimitSize);
            if (_FileSize > _LimitSize) {
                $scope.FileVersion.Uploader.formData[0].IsValidate = false;
            }
            else {
                $scope.FileVersion.Uploader.formData[0].IsValidate = true;
            }
            Array.prototype.pop.apply(item.formData, []);
            Array.prototype.push.apply(item.formData, $scope.FileVersion.Uploader.formData);
        };
        //上傳檔案中Pass Progress
        uploader.onAfterAddingFile = function (fileItem) {
            $scope.versionitem = fileItem.uploader;
        };
        //完成上傳後
        uploader.onCompleteItem = function (item, response, status, headers) {
            if (status == 400) {
                var _msg = $filter('translate')('FileSizeFail');
                alert(_msg);
            }
            else
            {
                response = response.replace(/\"/g, "");
                //Update Version List
                versioncompleteData(item);
                //Update File List
                UpdateFileLst(item);
            }
        };
    }
    // #endregion
    // #region 上傳新版後，更新檔案列表的資料
    function UpdateFileLst(item) {
        //檔案名稱
        var fileName = item.file.name;
        var index = fileName.lastIndexOf(".");
        //檔案類型
        var FileType = fileName.substring(index + 1, fileName.length).toUpperCase();
        //檔案ID
        var FileID = item.formData[0].FileId;
        //檔案所在資料夾位置
        var DirID = item.formData[0].DirID;
        //公司ID
        var CompanyID = item.formData[0].CompanyId;
        //討論組ID
        var DiscID = item.formData[0].DiscussionID;
        //使用者ID
        var UserID = item.formData[0].UserId;
        //使用者名稱
        var UserName = item.formData[0].UserName;

        //更新建立者公司ID
        $filter('filter')($scope.FileData.showData, { FileID: FileID }, true)[0].CompanyID = CompanyID;
        //更新建立者ID
        $filter('filter')($scope.FileData.showData, { FileID: FileID }, true)[0].CreateBy = UserID;
        //更新建立時間
        $filter('filter')($scope.FileData.showData, { FileID: FileID }, true)[0].CreateOn = Math.floor(new Date().getTime() / 1000);
        //更新建立者名稱
        $filter('filter')($scope.FileData.showData, { FileID: FileID }, true)[0].CreatorName = UserName;
        //更新檔案名稱
        $filter('filter')($scope.FileData.showData, { FileID: FileID }, true)[0].Name = fileName;
        //更新檔案大小
        $filter('filter')($scope.FileData.showData, { FileID: FileID }, true)[0].Size = $filter('number')(item.file.size / 1024 / 1024, 2);
        //更新檔案類型
        $filter('filter')($scope.FileData.showData, { FileID: FileID }, true)[0].Type = transferType(FileType);
        //更新版本
        $filter('filter')($scope.FileData.showData, { FileID: FileID }, true)[0].Version = '' + $scope.VersionList[$scope.VersionList.length - 1].Version + '';
    }
    // #endregion
    // #region 控制資料夾的寬度
    $scope.FolderStyle = function (Folder) {
        var FolderCount = Folder.length;
        var widthNum = Math.floor(90 / FolderCount);

        var result =
            {
                'width': '' + widthNum + '%'
            };
        return result;
    }
    // #endregion
    //上傳檔案的SubTitle
    $scope.UploadSubTitle = function () {

    }

}]);