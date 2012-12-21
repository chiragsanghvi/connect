if (!Connect) Connect = {};
if (!Connect.views) Connect.views = {};

window.Connect.views.meetupDetailsView = Backbone.View.extend({

    templateName: 'meetupDetailsTemplate',

    render: function () {
        $("#divIndex").slideUp();
        $('#divCreate').slideUp();
        $('#divMeetupDetails').show();
        
        this.$el = $('#divMeetupDetailSection');

        var html = Mustache.render(this.template, { container: {} });
        this.$el.empty().html(html);

        this.$details = $('#divDetailsHead', this.$el);
        html = Mustache.render(this.template, { details: {} });
        this.$details.append(html);

        return this;
    }
});
  