if (!window.Connect) Connect = {};
if (!Connect.controllers) Connect.controllers = {};

Connect.controllers.meetupController = new (function () {
    this.meetupListView = null;

    this.init = function (sneder, args) {
        var base = Connect.controllers.meetupController;
        var args = {
            lat: '18.5204303',
            lng: '73.85674369999992',
            rad: '2'
        };

        args.callback = function () {
            base.showAttending();
        };
        base.showListView(this, args);

    };

    this.showListView = function (sender, args) {
        var base = Connect.controllers.meetupController;

        var _c = function (mArticles) {
            console.dir(mArticles);
            base.meetupListView = new Connect.views.meetupListView({ model: mArticles }).render($('#divSearchResult'));
            if (args.callback) args.callback();
        };

        var meetups = new Appacitive.ArticleCollection({ schema: 'meetup' });
        var currDate = new Date().toISOString();
        currDate = currDate.substring(0, currDate.indexOf('T'));

        var filter = '(*date >= date(\'' + currDate + '\') and *geolocation within_circle ' + args.lat + ',' + args.lng + ',' + args.rad + ' mi)';
        meetups.setFilter(filter);
        
        meetups.getQuery().extendOptions({ orderBy: 'date' });

        meetups.fetch(function () {
            var count = meetups.getAll().length;

            if (count == 0) {
                _c([]);
                return;
            }
            var mArticles = [];
            meetups.getAll().forEach(function (m) {
                var mConn = m.getConnectedArticles({ relation: 'user_meetup', otherSchema: 'user' });
                mConn.fetch(function () {
                    var x = m.getArticle();
                    x.user = mConn.getAll()[0].connectedArticle.getArticle();
                    mArticles.push(x);
                    count--;

                    if (count == 0) _c(mArticles);
                });
            });
        });
    },

    this.showAttending = function () {
        var base = Connect.controllers.meetupController;
        if (Connect.bag.isAuthenticatedUser) {
            base.meetupListView.contract();
            base.meetupAttendView = new Connect.views.meetupAttendView({ model: { entityType: 'attend', meetups: []} }).render($('#divAttending'));
            base.meetupAttendView = new Connect.views.meetupAttendView({ model: { entityType: 'organise', meetups: []} }).render($('#divOrganising'));
        }
    };

    this.hideAttending = function () {
        var base = Connect.controllers.meetupController;
        base.meetupListView.expand();
        base.meetupAttendView.close();
        base.meetupAttendView.close();
    };

})();

EventManager.subscribe('userAuthenticated', Connect.controllers.meetupController.init);
EventManager.subscribe('userLoggedIn', Connect.controllers.meetupController.showAttending);
EventManager.subscribe('logoutUser', Connect.controllers.meetupController.hideAttending);
EventManager.subscribe('searchMeetUps', Connect.controllers.meetupController.showListView)