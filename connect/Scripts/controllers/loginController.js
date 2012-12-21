if (!window.Connect) Connect = {};
if (!Connect.controllers) Connect.controllers = {};
Connect.bag.isAuthenticatedUser = false;

Connect.controllers.loginController = new (function () {

    this.authenticateUser = function () {
        var base = Connect.controllers.loginController;
        Connect.bag.user = { __id: '' };

        //Check the user cookie
        var ucookie = Connect.utils.cookies.get("_connect_user_token");
        if (ucookie == null) {
            Connect.bag.user = null;
            EventManager.fire("userAuthenticated", this, {});
        } else {
            base.login(this, {
                callback: function () {
                    EventManager.fire("userAuthenticated", this, {});
                }
            });
        }

    };

    this.login = function (sender, args) {
        Appacitive.facebook.requestLogin(function () {
            Appacitive.Users.signupWithFacebook(function () {
                Appacitive.session.setUserAuthHeader(arguments[0].token);
                Connect.utils.cookies.set("_connect_user_token", arguments[0].token);
                Connect.bag.user = arguments[0].user;
                Connect.bag.user.fName = Connect.bag.user.firstname;
                Connect.bag.user.lName = Connect.bag.user.lastname;
                Connect.bag.isAuthenticatedUser = true;
                args.callback(args);
            });
        });
    };
})();

EventManager.subscribe('sessionCreated', Connect.controllers.loginController.authenticateUser);
EventManager.subscribe('loginUser', Connect.controllers.loginController.login);