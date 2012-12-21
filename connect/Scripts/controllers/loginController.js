if (!window.Connect) Connect = {};
if (!Connect.controllers) Connect.controllers = {};
Connect.bag.isAuthenticatedUser = false;

Connect.controllers.loginController = new (function () {

    this.authenticateUser = function () {
        Connect.bag.user = {
            fname: "John",
            lname: "Doe"
        };

        //Check the user cookie
        var ucookie = Connect.utils.cookies.get("_connect_user_token");
        if (ucookie == null) Connect.bag.user = null;
        else {
            Connect.bag.user = SDK.getUser(ucookie.value);
            Connect.bag.isAuthenticatedUser = true;
        }
        EventManager.fire("userAuthenticated", this, {});
    };
})();

EventManager.subscribe('sessionCreated', Connect.controllers.loginController.authenticateUser);