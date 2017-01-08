SuccApp.factory('ImageService', ['$http', '$log', function ($http, $log) {
    // 圖片陣列
    var ImagesInEditor = [];

    // 上傳檔案
    function upload(fm) {
        // 上傳圖片 方法請參考https://github.com/HackerWins/summernote/issues/72
        return $http.post('/Attatch/Upload', fm, {
            headers: { 'Content-Type': undefined },
            transformRequest: angular.identity
        });
    };

    // 插入圖片陣列
    function InsertImagesInEditor(data) {
        ImagesInEditor.push(data)
    };

    // 從圖片陣列移除
    function RemoveImagesInEditor(data) {
        for (var i in ImagesInEditor) {
            if (ImagesInEditor[i].ImgPath == data) {
                ImagesInEditor[i].IsDelete = true;
            }
        }
    };

    // 回傳Factory物件
    return {
        upload: upload,
        ImagesInEditor: ImagesInEditor,
        InsertImagesInEditor: InsertImagesInEditor,
        RemoveImage: RemoveImagesInEditor
    }
}]);