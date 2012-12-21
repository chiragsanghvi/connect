﻿if (!window.Connect) Connect = {};
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
            base.showSideViews();
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
    this.showSideViews = function () {
        var base = Connect.controllers.meetupController;
        if (Connect.bag.isAuthenticatedUser) {
            base.meetupListView.contract();
            this.showAttending(this, {});
            this.showOrganising(this, {});
        }
    },
    this.hideSideViews = function () {
        var base = Connect.controllers.meetupController;
        if (Connect.bag.isAuthenticatedUser) {
            this.hideAttending();
            this.hideOrganising();
        }
    },

    this.showAttending = function (sender, args) {
        var base = Connect.controllers.meetupController;
        if (Connect.bag.isAuthenticatedUser) {
            if (base.meetupListView) base.meetupListView.contract();
            var _c = function (meetups) {
                base.meetupAttendView = new Connect.views.meetupAttendView({ model: { entityType: 'attend', meetups: meetups} }).render($('#divAttending'));
            };
            if (!args.isAdd) {
                //fetch attending meetups for current user and call callback _c
                var meetups = [];
                var users = new Appacitive.ArticleCollection({ schema: 'user' });
                var thisUser = users.createNewArticle();
                thisUser.set('__id', Connect.bag.user.__id);
                var meetupsAttending = thisUser.getConnectedArticles({ relation: 'rsvp', otherSchema: 'meetup' });
                meetupsAttending.fetch(function () {
                    if (meetupsAttending.getAll().length > 0) {
                        meetups = meetupsAttending.getAll().map(function (m) { return m.connectedArticle.getArticle(); });
                    }
                    _c(meetups);
                });
            } else {
                base.meetupAttendView.model.meetups.splice(0, 0, args.meetup);
                base.meetupAttendView.render();
            }
        }
    };

    this.showOrganising = function (sender, args) {
        var base = Connect.controllers.meetupController;
        if (Connect.bag.isAuthenticatedUser) {
            if (base.meetupListView) base.meetupListView.contract();
            var _c = function (meetups) {
                base.meetupOrganiseView = new Connect.views.meetupAttendView({ model: { entityType: 'organise', meetups: meetups} }).render($('#divOrganising'));
            };

            if (!args.isAdd) {
                //fetch organising meetups for current user and call callback _c
                var meetups = [];
                var users = new Appacitive.ArticleCollection({ schema: 'user' });
                var thisUser = users.createNewArticle();
                thisUser.set('__id', Connect.bag.user.__id);
                var meetupsOrganized = thisUser.getConnectedArticles({ relation: 'user_meetup', otherSchema: 'meetup' });
                meetupsOrganized.fetch(function () {
                    if (meetupsOrganized.getAll().length > 0) {
                        meetups = meetupsOrganized.getAll().map(function (m) { return m.connectedArticle.getArticle(); });
                    }
                    _c(meetups);
                });
            } else {
                base.meetupOrganiseView.model.meetups.splice(0, 0, args.meetup);
                base.meetupOrganiseView.render($('#divOrganising'));
            }

        }
    };

    this.hideAttending = function () {
        var base = Connect.controllers.meetupController;
        if (base.meetupListView) base.meetupListView.expand();
        base.meetupAttendView.close();
        base.meetupAttendView.close();
    };

    this.hideOrganising = function () {
        var base = Connect.controllers.meetupController;
        if (base.meetupListView) base.meetupListView.expand();
        if (base.meetupOrganiseView) base.meetupOrganiseView.close();
    };

})();

EventManager.subscribe('userAuthenticated', Connect.controllers.meetupController.init);
EventManager.subscribe('userLoggedIn', Connect.controllers.meetupController.showSideViews);
EventManager.subscribe('logoutUser', Connect.controllers.meetupController.hideSideViews);
EventManager.subscribe('searchMeetUps', Connect.controllers.meetupController.showListView);

EventManager.subscribe('meetUpCreated', Connect.controllers.meetupController.showOrganising);
EventManager.subscribe('rsvpCreated', Connect.controllers.meetupController.showAttending);
