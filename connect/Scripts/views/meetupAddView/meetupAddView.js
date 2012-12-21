if (!Connect) Connect = {};
if (!Connect.views) Connect.views = {};

window.Connect.views.meetupAddView = Backbone.View.extend({
    templateName: 'meetupAddTemplate',

    render: function () {
        $("#divIndex").slideUp();
        this.$element = $("#divCreate");
        this.$element.html(this.template).slideDown();
    }
});
  