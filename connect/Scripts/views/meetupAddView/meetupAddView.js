if (!Connect) Connect = {};
if (!Connect.views) Connect.views = {};

window.Connect.views.meetupAddView = Backbone.View.extend({
    templateName: 'meetupAddTemplate',

    render: function () {
        $("#divIndex").slideUp();
        $('#divMeetupDetails').slideUp();
        
        this.$element = $("#divCreate");
        this.$element.html(this.template).slideDown();
        var now = new Date();
        var nowStr = String.format("{0}-{1}-{2}", now.getDate(), now.getMonth() + 1, now.getFullYear());

        $("#txtDate").data("date", nowStr)
                .datepicker()
                .on('changeDate', function (ev) {
                    if (ev.date.valueOf() < new Date().valueOf()) $('label[for="txtDate"]').show().text("The end date can not be less than today's date");
                    else $('label[for="txtDate"]').hide();
                    $('#txtDate').datepicker('hide');
                });

        $("#txtTime").timepicker();
        $("#txtAddress").geocomplete({
            map: ".column-map",
            markerOptions: {
                draggable: true
            }
        }).bind("geocode:result", function (event, result) {
            if (!Connect.bag.search) Connect.bag.search = {};
            Connect.bag.search["lat"] = result.geometry.location.lat();
            Connect.bag.search["lng"] = result.geometry.location.lng();
        }).bind("geocode:dragged", function (event, latLng) {
            $("input[name=lat]").val(latLng.lat());
            $("input[name=lng]").val(latLng.lng());
        });
    }
});
  