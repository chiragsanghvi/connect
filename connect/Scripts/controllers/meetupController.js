if (!window.Connect) Connect = {};
if (!Connect.controllers) Connect.controllers = {};

Connect.controllers.meetupController = new (function () {
    meetupListView = null;

    this.init = function () {
        //fetch meetups for current location
        this.meetupListView = new Connect.views.meetupListView().render($('#divSearchResult'));
        if (Connect.bag.isAuthenticatedUser) {
            $('.rightSection').show();
            this.meetupAttendView = new Connect.views.meetupAttendView({ model: { entityType: 'attend'} }).render($('#divAttending'));
            this.meetupAttendView = new Connect.views.meetupAttendView({ model: { entityType: 'organise'} }).render($('#divOrganising'));
        }
    };

    this.onUserLogout = function () {

    };
})();

EventManager.subscribe('userAuthenticated', Connect.controllers.meetupController.init);
EventManager.subscribe('logoutUser', Connect.controllers.meetupController.onUserLogout);