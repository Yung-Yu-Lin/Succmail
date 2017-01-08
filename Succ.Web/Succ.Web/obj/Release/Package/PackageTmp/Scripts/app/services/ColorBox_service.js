SuccApp.service('colorbox', ['$http',function ($http) {
    this.OpenImg = function (obj)
    {
       return $(obj).colorbox({
            transition: 'elastic',
            width: '60%',
            speed: '400',
            close: '關閉',
            imgError: '圖片不存在',
            maxWidth: '70%',
        });
    };
}]);