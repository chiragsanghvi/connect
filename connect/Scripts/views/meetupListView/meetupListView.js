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
        if (!this.model || this.model.length == 0) {
            var html = Mustache.render(this.template, { noResults: {} });
            this.$container.empty().append(html);
            this.$el = $('#meetup-list-container', this.$container);
        } else {

            var html = Mustache.render(this.template, { listContainer: {} });
            this.$container.empty().append(html);

            this.$el = $('#meetup-list-container', this.$container);

            this.bindEvents();
            this.appendMeetups();
        }
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
        var that = this;
        $('a[itemprop="details"]').live('click', function () {
            var id = $(this).attr('data-id');
            var res = Connect.utils.arrays.where(that.model, function (m) {
                return (m.__id == id);
            });
            EventManager.fire('showMeetupDetails', this, { meetup: res[0] });
        });

        $('a[itemprop="rsvp"]').live('click', function () {
            EventManager.fire('meetup.rsvp', this, { meetupId: $(this).attr('data-id') });
        });

    },
    appendMeetups: function () {
        var html = Mustache.render(
            this.template, {
                list: this.model,
                daysLeft: function () {
                    var d = new Date(this.date);
                    var curr = new Date();
                    var x = Math.round((d - curr) / (1000 * 60 * 60 * 24));
                    if (x <= 0) {
                        this.isMultiple = 'day';
                        return 1;
                    }
                    this.isMultiple = 'days';
                    return x;
                }, formattedDate: function () {
                    var d = new Date(this.date);
                    return d.toDateString();
                },
                isRsvpAllowed: function () {
                    if (this.user.__id == Connect.bag.user.__id) return false;
                    return true;
                }
            });
        this.$el.append(html);
    }
});
  