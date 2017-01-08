Date.prototype.addHours = function (h) {
    this.setHours(this.getHours() + h);
    return this;
}
Date.prototype.get2nHours = function () {
    var n = this.getHours();
    return (n < 10) ? '0' + n : n.toString();
}
Date.prototype.get2nMinutes = function () {
    var n = this.getMinutes();
    return (n < 10) ? '0' + n : n.toString();
}
Date.prototype.get2nSeconds = function () {
    var n = this.getSeconds();
    return (n < 10) ? '0' + n : n.toString();
}