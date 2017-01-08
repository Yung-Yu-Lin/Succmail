SuccApp.factory('FastReplyService', ['ReplyService', function (ReplyService) {
    var FastReplySrv = {};

    var _fastReply = {};

    // FastReply ViewModel
    var FastReply = function (fastReply) {
        if (!fastReply) fastReply = {};
        var FastReply = {
            SubjId: fastReply.SubjId || null,
            DiscID: fastReply.DiscID || null,
            Receipts: fastReply.Receipts || [],
            Content: fastReply.Content || null,
            Attatchs: fastReply.Attatchs || [],
            DiscName: fastReply.DiscName || null,
            CreatedBy: fastReply.CreatedBy || null,
            CreatedName: fastReply.CreatedName || null,
            CompanyID: fastReply.CompanyID || null,
            CreateOn: fastReply.CreateOn || null,
            IsAdmin: fastReply.IsAdmin || false,
            IsBoss: fastReply.IsBoss || false,
            ID: fastReply.ID || null
        };
        return FastReply;
    };

    FastReplySrv.getFastReply = function () {
        return _fastReply;
    };

    FastReplySrv.setFastReply = function (fastReply) {
        _fastReply = new FastReply(fastReply);
    };

    FastReplySrv.createFastReply = function (fastReply) {
        return ReplyService.create(_fastReply);
    };

    return FastReplySrv;
}]);