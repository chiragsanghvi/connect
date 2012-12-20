if (!Connect) Connect = {};
if (!Connect.views) Connect.views = {};

window.Connect.views.meetupListView = Backbone.View.extend({

    templateName: 'meetupListTemplate',

    render: function ($container) {
        this.$container = $container;
        var html = Mustache.render(this.template, { listContainer: {} });
        this.$container.empty().append(html);

        this.$el = $('#meetup-list-container', this.$container);
        this.appendMeetups();
    },

    appendMeetups: function () {
        var html = Mustache.render(this.template, { list: {} });
        for (var i = 0; i < 5; i++) {
            this.$el.append(html);
        }
    }
});
  