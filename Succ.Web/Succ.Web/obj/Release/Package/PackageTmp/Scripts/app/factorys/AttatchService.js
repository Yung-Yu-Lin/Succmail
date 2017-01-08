SuccApp.factory('AttatchService', ['$http', '$log', function ($http, $log) {

    // 圖片陣列
    var Attatchs = [];

    // 插入圖片陣列
    function InsertToAttatch(data) {
        Attatchs.push(data);
    };

    // 從附件陣列移除
    function RemoveItemFromAttatchs(data) {
        for (var i in Attatchs) {
            if (Attatchs[i].AttID == data.AttID) {
                Attatchs[i].isDel = true;
                Attatchs[i].Size = Attatchs[i].Size.toString();
                return;
            }
        }
    };

    function RemoveAll() {
        for (var i in Attatchs) {
            Attatchs[i].isDel = true;
        }
    }

    function downLoad(attId) {
        return $http.get('/FileShare/downloadFile2', { FileID: attId });
    }

    function ResetAttach()
    {
        Attatchs = [];
    }

    // 回傳Factory物件
    return {
        Attatchs: Attatchs,
        InsertToAttatch: InsertToAttatch,
        RemoveItem: RemoveItemFromAttatchs,
        RemoveAll: RemoveAll,
        ResetAttach: ResetAttach
    }
}]);