if (!window.Connect) Connect = {};
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

    this.showMeetupDetails = function(sender, args) {
        //render meet up details
        new Connect.views.meetupDetailsView({ model: args.meetup }).render();

        //render organiser details with fetching its details
        new Connect.views.meetupOrganiserView({ model: {} }).render();
    };

    this.onShowIndexView = function () {
        this.masterPageView.showIndex();
    };
})();

EventManager.subscribe('userAuthenticated', Connect.controllers.masterPageController.init);
EventManager.subscribe('logoutUser', Connect.controllers.masterPageController.onUserLogout);
EventManager.subscribe('createMeetUp', Connect.controllers.masterPageController.onAddNewMeetUp);
EventManager.subscribe('showIndexView', Connect.controllers.masterPageController.onShowIndexView);
EventManager.subscribe('showMeetupDetails', Connect.controllers.masterPageController.showMeetupDetails); 
