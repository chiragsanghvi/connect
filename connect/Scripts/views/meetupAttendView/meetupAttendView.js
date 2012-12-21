if (!Connect) Connect = {};
if (!Connect.views) Connect.views = {};

window.Connect.views.meetupAttendView = Backbone.View.extend({

    templateName: 'meetupAttendTemplate',

    render: function ($container) {

        this.$container = $container;
        var html = Mustache.render(this.template, { container: {} });
        this.$container.empty().append(html);

        this.$el = $('.D_summaryList', this.$container).first();
        this.appendMeetups();
    },

    appendMeetups: function () {
        var isOrganise = this.model.entityType == 'organise';
        var html = Mustache.render(this.template, { list: { isOrganise: isOrganise} });
        for (var i = 0; i < 5; i++) {
            this.$el.append(html);
        }
        if (isOrganise) {
            html = Mustache.render(this.template, { add: {} });
            this.$el.append(html);
        }
    }
});
  