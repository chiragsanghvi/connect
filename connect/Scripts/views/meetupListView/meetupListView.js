if (!Connect) Connect = {};
if (!Connect.views) Connect.views = {};

window.Connect.views.meetupListView = Backbone.View.extend({

    templateName: 'meetupListTemplate',

    render: function ($container) {

        if (Connect.bag.isAuthenticatedUser) {
            this.contract();
        } else {
            this.expand();
        }

        this.$container = $container;
        var html = Mustache.render(this.template, { listContainer: {} });
        this.$container.empty().append(html);


        this.$el = $('#meetup-list-container', this.$container);

        this.bindEvents();
        this.appendMeetups();

        return this;
    },

    expand: function () {
        $('.rightSection').hide();
        $('#divSearchResult').addClass('span9').removeClass('span6');
    },
    contract: function () {
        $('#divSearchResult').addClass('span6').removeClass('span9');
        $('.rightSection').show();
    },
    bindEvents: function () {
        $('a[itemprop="details"]').live('click', function () {
            EventManager.fire('showMeetupDetails', this, { meetupId: '123' });
        });
    },
    appendMeetups: function () {
        var html = Mustache.render(this.template, { list: {} });
        for (var i = 0; i < 5; i++) {
            this.$el.append(html);
        }
    }
});
  