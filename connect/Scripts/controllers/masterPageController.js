if (!window.Connect) Connect = {};
if (!Connect.controllers) Connect.controllers = {};

Connect.controllers.masterPageController = new (function () {
    masterPageView = null;
    headerView = null;

    this.init = function () {
        this.headerView = new Connect.views.headerView().render();
        this.masterPageView = new Connect.views.masterPageView().render();
    };

    this.onUserLogout = function () {
        Connect.bag.isAuthenticatedUser = false;
        this.headerView.render();
    };
})();

EventManager.subscribe('userAuthenticated', Connect.controllers.masterPageController.init);
EventManager.subscribe('logoutUser', Connect.controllers.masterPageController.onUserLogout);