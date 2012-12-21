if (!Connect) Connect = {};
if (!Connect.views) Connect.views = {};

window.Connect.views.meetupAddView = Backbone.View.extend({
    templateName: 'meetupAddTemplate',

    render: function () {
        var that = this;
        $("#divIndex").slideUp();
        $('#divMeetupDetails').slideUp();

        this.$element = $("#divCreate");
        this.$element.html(this.template).slideDown();
        if (!Connect.bag.createData) Connect.bag.createData = {};
        var now = new Date();
        var nowStr = String.format("{0}-{1}-{2}", now.getDate(), now.getMonth() + 1, now.getFullYear());

        $("#txtDate").data("date", nowStr)
                .datepicker()
                .on('changeDate', function (ev) {
                    if (ev.date.valueOf() < new Date().valueOf()) $('label[for="txtDate"]').show().text("The end date can not be less than today's date");
                    else {
                        $('label[for="txtDate"]').hide();
                        Connect.bag.createData["date"] = ev.date;
                    }
                    $('#txtDate').datepicker('hide');
                });

        $("#txtTime").timepicker();
        $("#txtAddress").geocomplete({
            map: ".column-map",
            markerOptions: {
                draggable: true
            }
        }).bind("geocode:result", function (event, result) {
            Connect.bag.createData["lat"] = result.geometry.location.lat();
            Connect.bag.createData["lng"] = result.geometry.location.lng();
        }).bind("geocode:dragged", function (event, latLng) {
            $("input[name=lat]").val(latLng.lat());
            $("input[name=lng]").val(latLng.lng());
        });
        setTimeout(function () { $("#txtTitle").focus(); }, 500);

        $("#btnCreate").click(that.createMeetUp);
    },
    createMeetUp: function () {
        var args = {
            title: $.trim($("#txtTitle").val()),
            description: $.trim($("#txtDesc").val()),
            venue: $.trim($("#txtVenue").val()),
            address: $.trim($("#txtAddress").val()),
            lat: Connect.bag.createData["lat"],
            lng: Connect.bag.createData["lng"],
            date: Connect.bag.createData["date"],
            time: $("#txtTime").val()
        };
        EventManager.fire("createMeetUpRequest", this, args);
        $("#btnCreate").button('loading');
        $("#btnCancel").attr("disabled", "disabled");
        $("#lblRegStatus").removeClass().addClass("alert alert-info").html("Creating Connect meet-up, please wait.");
    },
    showSuccess: function (createdMeetup) {
        $("#btnCreate").button('reset');
        $("#btnCreate").attr("disabled", "disabled");
        $("#btnCancel").removeAttr("disabled");
        $("#lblRegStatus").removeClass().addClass("alert alert-success").html("Connect meet-up created successfully.");
        EventManager.fire("meetUpCreated", this, {
            isAdd: true,
            meetup: createdMeetup.getArticle()
        });
    },
    showError: function () {
        $("#btnCreate").button('reset');
        $("#btnCancel").removeAttr("disabled");
        $("#lblRegStatus").removeClass().addClass("alert alert-error").html("Failed to create meet-up. Please try again.");
    }
});
  