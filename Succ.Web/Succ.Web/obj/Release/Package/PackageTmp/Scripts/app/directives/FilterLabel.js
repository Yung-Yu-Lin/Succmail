SuccApp.directive("filterLabel", ['$filter',function ($filter) {

    var IsShowFinish = true;

    return {
        restrice: "A",
        template: "<label ng-repeat='ecs in EmergencyConditions'>" +
                        $filter('translate')('Urgency') +
                        ":{{ecs.State}}" +
                        "<button type='button' class='close' ng-click='DoEmergencyLelve(" + '"4"' + ")'>&times;</button>&nbsp;&nbsp;" +
                  "</label>" +
                  "<label ng-repeat='type in FileType'>" +
                        $filter('translate')('Type') +
                        ":{{type.Name}}" +
                        "<button type='button' class='close' ng-click='DoFileType(" + '"5"' + ")'>&times;</button>&nbsp;&nbsp;" +
                  "</label>" +
                  "<label ng-if='SelectDispatchMember' ng-init=null>" +
                        $filter('translate')('Creator') +
                       ":{{SelectDispatchMember.UserName}}" +
                       "<button type='button' class='close' ng-click='CleanUser("+ '"CreatedBy"' +")'>&times;</button>&nbsp;&nbsp;" +
                  "</label>" +
                  "<label ng-if='SelectReplyMember' ng-init=null>" +
                        $filter('translate')('Replier') +
                       ":{{SelectReplyMember.UserName}}" +
                       "<button type='button' class='close' ng-click='CleanUser(" + '"ModifiedBy"' + ")'>&times;</button>&nbsp;&nbsp;" +
                  "</label>" +
                  "<label ng-if='SelectRecipientMember' ng-init=null>" +
                        $filter('translate')('Receiver') +
                       ":{{SelectRecipientMember.UserName}}" +
                       "<button type='button' class='close' ng-click='CleanUser("+ '"recipient"' +")'>&times;</button>&nbsp;&nbsp;" +
                  "</label>" +
                  "<label ng-if='SelectUploadMember' ng-init=null>" +
                        $filter('translate')('Upload_By') +
                        ":{{SelectUploadMember.UserName}}" +
                        "<button type='button' class='close' ng-click='CleanUser(" + '"CreateBy"' + ")'>&times;</button>&nbsp;&nbsp;" +
                  "</label>" +
                  "<label ng-if='SelectappriseMember' ng-init=null>" +
                        $filter('translate')('apprise') +
                        ":{{SelectappriseMember.UserName}}" +
                        "<button type='button' class='close' ng-click='CleanUser(" + '"Appriser"' + ")'>&times;</button>&nbsp;&nbsp;" +
                  "</label>" +
                  "<label ng-if='CreateDate' ng-init=null>" +
                        $filter('translate')('Create') + $filter('translate')('Date') +
                       ":{{CreateDate.Date}}" +
                       "<button type='button' class='close' ng-click='CleanDate(" + '"0"' +")'>&times;</button>&nbsp;&nbsp;" +
                  "</label>" +
                  "<label ng-if='EndDate' ng-init='null'>" +
                       "{{dateitem}}:{{EndDate.Date}}" +
                       "<button ng-if='closedate' type='button' class='close' ng-click='CleanDate(" + '"1"' + ")'>&times;</button>&nbsp;&nbsp;" +
                  "</label>" +
                  "<label ng-if='UploadDate' ng-init='null'>" +
                       $filter('translate')('UploadTime') +
                       ":{{UploadDate.Date}}" +
                       "<button class='close' type='button' ng-click='CleanDate(" + '"2"' + ")'>&times;</button>&nbsp;&nbsp;" +
                  "</label>",
        link: function (scope, element, attrs)
        {
        }
    }

}]);