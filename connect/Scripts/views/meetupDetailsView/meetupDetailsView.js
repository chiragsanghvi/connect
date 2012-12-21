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

        this.model.daysLeft = function() {
            var d = new Date(this.date);
            var curr = new Date();
            var x = Math.round((d - curr) / (1000 * 60 * 60 * 24));
            if (x <= 0) {
                this.isMultiple = 'day';
                return 1;
            }
            this.isMultiple = 'days';
            return x;
        };
        this.model.formattedDate = function () {
            var d = new Date(this.date);
            return d.toDateString();
        };
        this.model.isRsvpAllowed = function () {
            if (!Connect.bag.isAuthenticatedUser)
                return false;
            if (this.noRsvp)
                return false;

            if (this.user) {
                if (this.user.__id == Connect.bag.user.__id) return false;
            } else {
                if (this.__createdby == Connect.bag.user.__id) return false;
            }
            return true;
        };
        html = Mustache.render(this.template, { details: this.model });
        this.$details.append(html);

        this.bindEvents();

        return this;
    },
    bindEvents: function () {
        var that = this;
        $('.rsvp-callout-outer', this.$el).bind('click', function () {
            EventManager.subscribe('rsvpCreated', function () {
                $('.rsvp-callout-outer', that.$el).css('visibility', 'hidden');
            });
            EventManager.fire('meetup.rsvp', this, { meetup: that.model });
        });
    }
});
  