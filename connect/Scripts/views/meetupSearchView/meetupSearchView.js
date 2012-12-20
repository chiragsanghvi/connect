$(document).ready(function () {
    $("#btnSearch").click(function () {
        if ($.trim($("#txtCity").val()) == "") {
            $("#txtCity").parent().addClass("error");
            $("#txtCity").focus();
            return;
        }
        $("#txtCity").parent().removeClass("error");
        var args = {
            lat: Connect.bag.search["lat"],
            lng: Connect.bag.search["lng"],
            rad: $("#ulRadius").val()
        };
        console.log(args);
        EventManager.fire("searchMeetUps", this, args);
    });
    var focusIntId = undefined;
    $("#txtCity").focus(function () {
        focusIntId = setInterval(function () { $(".pac-container").css("width", "400px"); }, 10);
    }).focusout(function () {
        clearInterval(focusIntId);
    });
    $("#txtCity").geocomplete().bind("geocode:result", function (event, result) {
        if (!Connect.bag.search) Connect.bag.search = {};
        Connect.bag.search["lat"] = result.geometry.location.lat();
        Connect.bag.search["lng"] = result.geometry.location.lng();
    }).bind("geocode:error", function (event, status) {

    }).bind("geocode:multiple", function (event, results) {

    });
});