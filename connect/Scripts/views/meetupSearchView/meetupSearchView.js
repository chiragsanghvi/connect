$(document).ready(function () {
    $("#btnSearch").click(function () {
        var args = {
        };
        EventManager.fire("", this, args);
    });

    $("#txtCity").geocomplete().bind("geocode:result", function (event, result) {
        console.log(result);
    }).bind("geocode:error", function (event, status) {

    }).bind("geocode:multiple", function (event, results) {

    });
});