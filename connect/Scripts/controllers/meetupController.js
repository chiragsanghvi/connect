if (!window.Connect) Connect = {};
if (!Connect.controllers) Connect.controllers = {};

Connect.controllers.meetupController = new (function () {
    this.meetupListView = null;

    this.init = function () {
        var base = Connect.controllers.meetupController;
        //fetch meetups for current location
        base.meetupListView = new Connect.views.meetupListView().render($('#divSearchResult'));
        base.showAttending();
    };

    this.showAttending = function () {
        var base = Connect.controllers.meetupController;
        if (Connect.bag.isAuthenticatedUser) {
            base.meetupListView.contract();
            base.meetupAttendView = new Connect.views.meetupAttendView({ model: { entityType: 'attend'} }).render($('#divAttending'));
            base.meetupAttendView = new Connect.views.meetupAttendView({ model: { entityType: 'organise'} }).render($('#divOrganising'));
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