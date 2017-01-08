SuccApp.filter('adminFilter', ["$filter",function ($filter) {
    return function(item,prop) {
        var arrayToReturn = [];
        angular.forEach(item,function(value,key){
            if (value[prop] !== null) {
                arrayToReturn.push(value);
            }
        
        });
        return arrayToReturn;
    };
}]);