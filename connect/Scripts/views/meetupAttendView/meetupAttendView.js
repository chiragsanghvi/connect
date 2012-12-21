if (!Connect) Connect = {};
if (!Connect.views) Connect.views = {};

window.Connect.views.meetupAttendView = Backbone.View.extend({

    templateName: 'meetupAttendTemplate',

    render: function ($container) {

        this.$container = $container;

        var html = '';
        if ((this.model.meetups && this.model.meetups.length > 0) || this.model.entityType == 'organise') {
            html = Mustache.render(this.template, { container: {} });
            this.$container.empty().append(html);
            this.$el = $('.D_summaryList', this.$container).first();
            this.appendMeetups();

        } else {
            html = Mustache.render(this.template, { noResults: {} });
            this.$container.empty().append(html);
        }

        return this;
    },

    appendMeetups: function () {
        var isOrganise = this.model.entityType == 'organise';
        var html = Mustache.render(this.template, {
            list: this.model.meetups,
            formattedDate: function () {
                var d = new Date(this.date);
                return d.toDateString();
            },
            isOrganise: isOrganise
        });
        this.$el.append(html);
        if (isOrganise) {
            html = Mustache.render(this.template, { add: {} });
            this.$el.append(html);
        }
        this.bindEvents();
    },

    bindEvents: function () {
        var that = this;
        $('a[itemprop="title"]', this.$el).bind('click', function () {
            var id = $(this).attr('data-id');
            var res = Connect.utils.arrays.where(that.model.meetups, function (m) {
                return (m.__id == id);
            });
            res[0].noRsvp = true;
            EventManager.fire('showMeetupDetails', this, { meetup: res[0] });
        });

        $('#btnAddMeetup', this.$el).click(function () {
            EventManager.fire('createMeetUp');
        });
    },

    close: function () {
        this.$el.empty();
    }
});
  