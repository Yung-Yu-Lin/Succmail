// Email只允許輸入英數的全形轉半形方法
var Validate = function (Values, Target) {
    var FullWidthString = Values.match(/[^\x00-\xff]/g);
    if (FullWidthString != null) {
        FullWidthString = FullWidthString.toString().match(/[０-９Ａ-Ｚａ-ｚA-Za-z_.@＿．＠]/g);
    }
    if (FullWidthString != null) {
        for (var i = 0; i < FullWidthString.length; i++) {
            var FullIndex = $(Target).val().indexOf(FullWidthString[i]);
            var halfString = String.fromCharCode(FullWidthString[i].charCodeAt(0) - 0xfee0);
            var TotalLength = $(Target).val().length;
            var AssignValue = $(Target).val().replaceBetween(FullIndex, FullIndex + 1, halfString);
            $(Target).val(AssignValue);
        }
    }
};

String.prototype.replaceBetween = function (start, end, what) {
    return this.substring(0, start) + what + this.substring(end);
};