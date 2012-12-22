if (!window.Connect) Connect = {};
if (!Connect.controllers) Connect.controllers = {};

Connect.controllers.meetupController = new (function () {

    this.meetupListView = null;

    this.init = function (sneder, args) {

        var base = Connect.controllers.meetupController;
        if (!Connect.bag.search) Connect.bag.search = {};

        Connect.bag.search["lat"] = "18.5204303";
        Connect.bag.search["lng"] = "73.85674369999992";

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
            // hide the meetings im organizing
            if (Connect.bag.meetupsOrganizing && Connect.bag.meetupsOrganizing.length > 0 && Connect.bag.isAuthenticatedUser) {
                Connect.bag.meetupsOrganizing.forEach(function (mId) {
                    mArticles = mArticles.filter(function (mA) {
                        return mA.__id != mId;
                    });
                });
            }

            base.meetupListView = new Connect.views.meetupListView({ model: mArticles }).render($('#divSearchResult'));
            if (args.callback) args.callback();

            setTimeout(function () {
                if (Connect.bag.meetupsAttending && Connect.bag.meetupsAttending.length > 0 && Connect.bag.isAuthenticatedUser) {
                    Connect.bag.meetupsAttending.forEach(function (mId) {
                        $('#rsvp' + mId).css('visibility', 'hidden');
                    });
                }
            }, 0);
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
            Connect.bag.meetupsOrganizing = [];
            meetups.getAll().forEach(function (m) {
                var mConn = m.getConnectedArticles({ relation: 'user_meetup', otherSchema: 'user' });
                mConn.fetch(function () {
                    var x = m.getArticle();
                    x.user = mConn.getAll()[0].connectedArticle.getArticle();
                    mArticles.push(x);
                    count--;

                    if (Connect.bag.isAuthenticatedUser && x.user.__id == Connect.bag.user.__id) {
                        Connect.bag.meetupsOrganizing.push(m.get('__id'));
                    }

                    if (count == 0) _c(mArticles);
                });
            });
        });
    },
    this.showSideViews = function () {
        var base = Connect.controllers.meetupController;
        if (Connect.bag.isAuthenticatedUser) {
            base.meetupListView.contract();
            base.showAttending(this, {});
            base.showOrganising(this, {});
        }
    },
    this.hideSideViews = function () {
        var base = Connect.controllers.meetupController;
        base.hideAttending();
        base.hideOrganising();
    },

    this.showMeetupDetails = function (sender, args) {
        //render meet up details
        new Connect.views.meetupDetailsView({ model: args.meetup }).render();

        //render organiser details with fetching its details
        if (!args.meetup.user) {
            var users = new Appacitive.ArticleCollection({ schema: 'user' });
            var user = users.createNewArticle();
            user.set('__id', args.meetup.__createdby);
            user.fetch(function () {
                args.meetup.user = user.getArticle();
                args.meetup.user.profilePic = '/Styles/images/human.png';
                var _c = function () {
                    new Connect.views.meetupOrganiserView({ model: args.meetup.user }).render();
                };
                if (Connect.bag.isAuthenticatedUser) {
                    //Fetch fb user for profile pic
                    user.getFacebookProfile(function (fbDetails) {
                        args.meetup.user.profilePic = Appacitive.facebook.getProfilePictureUrl(fbDetails.username);
                        _c();
                    });
                } else {
                    _c();
                }
            });
        } else {
            if (!args.meetup.user.profilePic) {
                args.meetup.user.profilePic = '/Styles/images/human.png';
            }
            var users = new Appacitive.ArticleCollection({ schema: 'user' });
            var user = users.createNewArticle();
            user.set('__id', args.meetup.user.__id);
            user.getFacebookProfile(function (fbDetails) {
                args.meetup.user.profilePic = Appacitive.facebook.getProfilePictureUrl(fbDetails.username);
                new Connect.views.meetupOrganiserView({ model: args.meetup.user }).render();
            });
        }

    };


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
                        Connect.bag.meetupsAttending = meetups.map(function (m) { return m.__id; });
                    }

                    // also, hide the rsvp tags for meetings im already attending
                    meetups.forEach(function (meetup) {
                        $('#rsvp' + meetup.__id).css('visibility', 'hidden');
                    });

                    _c(meetups);
                });
            } else {
                base.meetupAttendView.model.meetups.splice(0, 0, args.meetup);
                base.meetupAttendView.render($('#divAttending'));
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
                    // hide meetups organized by me
                    meetups.forEach(function (meetup) {
                        $('#eventContainer' + meetup.__id).css('visibility', 'hidden');
                    });

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

    this.createRSVP = function (sender, args) {
        var meetup = args.meetup;
        if (!meetup) return;
        var userId = window.Connect.bag.user.__id;
        var connectOptions = {
            __endpointa: {
                articleid: userId,
                label: 'user'
            },
            __endpointb: {
                articleid: meetup.__id,
                label: 'meetup'
            }
        };
        var cC = new Appacitive.ConnectionCollection({ relation: 'rsvp' });
        var connection = cC.createNewConnection(connectOptions);
        connection.save(function () {
            $('#rsvp' + meetup.__id).css('visibility', 'hidden');

            // fire an event signifying rsvp 
            EventManager.fire('rsvpCreated', this, {
                isAdd: true,
                meetup: meetup
            });

            // also, increase the number of attendees by one
            var meetups = new Appacitive.ArticleCollection({ schema: 'meetup' });
            var thisMeetup = meetups.createNewArticle();
            thisMeetup.set('__id', meetup.__id);
            thisMeetup.fetch(function () {
                var num = thisMeetup.get('no_of_attendees');
                if (isNaN(num) || typeof num == 'undefined') {
                    num = 0;
                }
                num = parseInt(num);
                if (isNaN(num)) {
                    num = 0;
                }
                num += 1;
                thisMeetup.set('no_of_attendees', num + '');
                thisMeetup.save(function () {
                    $('#attendies' + thisMeetup.get('__id')).html(num);
                });
                EventManager.fire('updateAttendies', this, { meetup: meetup });
            });
        }, function () {
            if (console && console.error) {
                console.error('Cannot create connection of type rsvp');
            }
        });
    };

    this.updateAttendies = function (sender, args) {
//        var base = Connect.controllers.meetupController;
//        if (base.meetupOrganiseView) {
//            var res = Connect.utils.arrays.where(base.meetupOrganiseView.model, function (m) {

//            });
//        }
//        if (base.meetupAttendView) {
//            var res = Connect.utils.arrays.forEach(base.meetupAttendView.model, function (m) {

//            });
//        }
    };

})();

EventManager.subscribe('userAuthenticated', Connect.controllers.meetupController.init);
EventManager.subscribe('userLoggedIn', Connect.controllers.meetupController.showSideViews);
EventManager.subscribe('logoutUser', Connect.controllers.meetupController.hideSideViews);
EventManager.subscribe('searchMeetUps', Connect.controllers.meetupController.showListView);

EventManager.subscribe('showMeetupDetails', Connect.controllers.meetupController.showMeetupDetails);
EventManager.subscribe('meetUpCreated', Connect.controllers.meetupController.showOrganising);
EventManager.subscribe('rsvpCreated', Connect.controllers.meetupController.showAttending);

EventManager.subscribe('meetup.rsvp', Connect.controllers.meetupController.createRSVP);
EventManager.subscribe('updateAttendies', Connect.controllers.meetupController.updateAttendies);
