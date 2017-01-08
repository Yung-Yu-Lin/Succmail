//------------------------------------------------
// Ajax request
//------------------------------------------------
function jsonAuthAjax(paramUrl, paramData, paramSuccess, paramType, paramAsync) {
    if (arguments.length < 4) {
        paramType = "GET";
        paramAsync = false;
    } else if (arguments.length < 5) {
        paramAsync = false;
    }

    $.ajax({
        url: paramUrl,
        data: paramData,
        type: paramType,
        traditional: true,
        async: paramAsync,
        error: function (response) {
            alert(response);
        },
        success: function (response) {
            paramSuccess(response);
        }
    });
}