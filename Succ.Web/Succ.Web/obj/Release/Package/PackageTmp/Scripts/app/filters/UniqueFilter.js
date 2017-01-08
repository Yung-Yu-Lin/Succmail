SuccApp.filter('distinct', function ()
{
    return function (List, key) {
        var group = {};
        var groupList = [];
        for (var i = 0; i < List.length; i++)
        {
            if (typeof group[List[i][key]] == "undefined")
            {
                group[List[i][key]] = "";
                groupList.push(List[i]);
            }
        }
        return groupList;
    };
});