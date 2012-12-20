if (!window.Connect) Connect = {};
if (!Connect.controllers) Connect.controllers = {};

Connect.controllers.meetupController = new (function () {
    meetupListView = null;

    this.init = function () {
        //fetch meetups for current location
        this.meetupListView = new Connect.views.meetupListView().render($('#divSearchResult'));
    };

    this.onUserLogout = function () {
        
    };
})();

EventManager.subscribe('userAuthenticated', Connect.controllers.meetupController.init);
EventManager.subscribe('logoutUser', Connect.controllers.meetupController.onUserLogout);