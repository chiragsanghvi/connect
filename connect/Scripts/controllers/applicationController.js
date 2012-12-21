if (!window.Connect) Connect = {};
if (!Connect.bag) Connect.bag = {};
if (!Connect.controllers) Connect.controllers = {};


Connect.controllers.applicationController = new (function () {
    this.createSession = function () {
        var _sessionOptions = { "apikey": Connect.config.apikey, app: 'sdk' }
        Appacitive.session.create(_sessionOptions);
        Appacitive.eventManager.subscribe('session.success', function () {
            EventManager.fire('sessionCreated');
        });
    };
})();

EventManager.subscribe('root.pageInit', Connect.controllers.applicationController.createSession);