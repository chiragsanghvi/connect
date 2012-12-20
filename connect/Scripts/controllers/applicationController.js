if (!window.Connect) Connect = {};
if (!Connect.bag) Connect.bag = {};
if (!Connect.controllers) Connect.controllers = {};


Connect.controllers.applicationController = new (function () {
    var sessionId = null;

    this.getSessionId = function () { return sessionId || null; };

    this.clearSessionId = function () { $.removeCookie('__connect_app_session'); };

    this.createSession = function () {
        var request = {
            apikey: Connect.config.apikey,
            isnonsliding: false,
            usagecount: -1,
            windowtime: 240
        };
        EventManager.fire('sessionCreated');
        return;
        var url = Connect.storage.urlFactory.session.getCreateSessionUrl();
        Connect.utils.ajax.put(url, request, false, function (data) {
            if (data.session && data.session.sessionkey) {
                sessionId = data.session.sessionkey;
                Connect.utils.cookies.set('__connect_app_session', sessionId);
                EventManager.fire('sessionCreated');
            } else {
                throw new Error("Couldn't get session key from server.");
            }
        }, function () {
            throw new Error("Couldn't get session key from server.");
        });
    };

    this.refreshSession = function () {
        var that = this;
        var url = Connect.storage.urlFactory.article.getSearchAllUrl('entity');
        Connect.utils.ajax.get(url, true, function (data) {
            if (data) {
                if (data.status && data.status != null) {
                    if (data.status.code == '8027' || data.status.code == '8002' || data.status.code == '8036') {
                        that.createSession();
                    }
                }
            }
        }, function () {
            throw new Error("Couldn't connect to server.");
        });
    };
})();

EventManager.subscribe('root.pageInit', Connect.controllers.applicationController.createSession);

// to refresh api session
window.setInterval(function () {
    Connect.controllers.applicationController.refreshSession();
}, 5 * 60 * 1000);
