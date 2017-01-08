SuccApp.filter('FileTypeFilter', [function () {
    return function (item) {
        var type = item.toLowerCase().slice(item.lastIndexOf('.') + 1);
        switch (type) {
            case 'pdf':
                return 'pdf';
                break;
            case 'xlsx':
            case 'xls':
                return 'excel';
                break;
            case 'doc':
            case 'docx':
                return 'word';
                break;
            case 'ppt':
            case 'pptx':
                return 'ppt';
                break;
            case 'zip':
            case 'rar':
            case '7z':
            case 'gzip':
                return 'rar';
                break;
            case 'png':
            case 'jpg':
            case 'gif':
            case 'bmp':
                return 'jpg';
                break;
            case 'txt':
                return 'text';
                break;
            case 'html':
            case 'cs':
            case 'vb':
            case 'js':
            case 'css':
                return 'file';
                break;
            case 'mp3':
            case 'wav':
                return 'mp3';
                break;
            case 'avi':
            case 'mpeg':
            case 'rmvb':
            case 'mp4':
                return 'mp4';
                break;
            default:
                return 'other';
                break;
        }
    };
}]);