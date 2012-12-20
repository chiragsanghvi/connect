$(function () {
    // state
    // not initialized = 0
    // loading = 1
    // loaded = 2
    var pageState = 0;

    var initializePage = function (callback, options) {
        callback = callback || function () { };
        options = options || {};

        if (pageState == 0) {
            EventManager.fire("root.pageInit", this, { options: options });
            pageState = 1;
            return;
        }

        if (pageState == 2) {
            callback();
        }
    };
    var setPageState = function (sender, args) {
        allLoaded = allLoaded + 1;
        if (allLoaded == 1) {
            pageState = 2;
            firstCallback();
        }
    };

    var firstCallback = function () { };
    var allLoaded = 0;

    var Rtr = Backbone.Router.extend({

        routes: {},

        initialize: function () {
            var router = this,
            routes = [
            //error
                        [new RegExp('.'), 'error', this.showError],
            // For start page
                        ["", 'main', this.init]
                ];
            _.each(routes, function (route) {
                router.route.apply(router, route);
            });
            return router;
        },

        init: function () {
            initializePage();
        },

        showError: function () {
            EventManager.fire('error.404');
        }
    });

    window.Router = new Rtr;
    try {
        Backbone.history.start();
    } catch (e) { }
});