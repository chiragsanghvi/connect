﻿if (!window.Connect) Connect = {};
if (!Connect.controllers) Connect.controllers = {};

Connect.controllers.masterPageController = new (function () {
    masterPageView = null;
    headerView = null;
    addMeetUpView = null;

    this.init = function () {
        this.headerView = new Connect.views.headerView().render();
        this.masterPageView = new Connect.views.masterPageView().render();
    };

    this.onUserLogout = function () {
        Connect.bag.isAuthenticatedUser = false;
        this.headerView.render();
    };

    this.onAddNewMeetUp = function () {
        if (!addMeetUpView) addMeetUpView = new Connect.views.meetupAddView();
        addMeetUpView.render();
    };


    this.onShowIndexView = function () { this.masterPageView.showIndex(); };

    this.onShowLogin = function () { this.masterPageView.showLoginModal(); };

    this.onShowSignup = function () { this.masterPageView.showSignupModal(); };

    this.onCreateMeetUpRequest = function (sender, args) {
        var that = this;
        var date = $.datepicker.formatDate('yy-mm-dd', args["date"]);
        var collection = new Appacitive.ArticleCollection({ schema: 'meetup' });
        var article = collection.createNewArticle();
        article.set('title', args["title"]);
        article.set('details', args["description"]);
        article.set('venue', args["venue"]);
        article.set('formatted_address', args["address"]);
        article.set('geolocation', String.format("{0},{1}", args["lat"], args["lng"]));
        article.set('date', date);
        article.set('time', args["time"]);
        article.set('no_of_attendees', '0');
        article.save(function () {
            var userId = window.Connect.bag.user.__id;
            var connectOptions = {
                __endpointa: {
                    articleid: userId,
                    label: 'user'
                },
                __endpointb: {
                    articleid: article.get('__id'),
                    label: 'meetup'
                }
            };
            var cC = new Appacitive.ConnectionCollection({ relation: 'user_meetup' });
            var connection = cC.createNewConnection(connectOptions);
            connection.save(function () {
                that.addMeetUpView.showSuccess(article);
            }, function () {
                that.addMeetUpView.showError();
            });
        }, function () {
            that.addMeetUpView.showError();
        });
    };
})();

EventManager.subscribe('userAuthenticated', Connect.controllers.masterPageController.init);
EventManager.subscribe('logoutUser', Connect.controllers.masterPageController.onUserLogout);
EventManager.subscribe('createMeetUp', Connect.controllers.masterPageController.onAddNewMeetUp);
EventManager.subscribe('showIndexView', Connect.controllers.masterPageController.onShowIndexView);
EventManager.subscribe('modalLogin', Connect.controllers.masterPageController.onShowLogin);
EventManager.subscribe('modalSignup', Connect.controllers.masterPageController.onShowSignup);
EventManager.subscribe('createMeetUpRequest', Connect.controllers.masterPageController.onCreateMeetUpRequest);
