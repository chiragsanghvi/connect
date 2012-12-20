/**
Depends on	Connect.utils.ajax
**/

if (typeof (Connect) == 'undefined') Connect = {};
if (!Connect.utils) Connect.utils = {};

Connect.utils.templateManager = (function () {
    var store = new (function () {

        var _store = {};

        this.setTemplate = function (obj) {
            var key = obj.templateName, value = obj.template
            _store[key] = value;
        };

        this.getTemplate = function (templateName) {
            if (_store[templateName]) return _store[templateName];
            return null;
        };
    })();

    //relative path from app root
    var basePath = '/scripts/views/';

    //template aliases and locations
    var map = {
        "headerTemplate": "header/headerTemplate.html",
        "meetupOrganiserTemplate": "meetupOrganiserView/meetupOrganiserViewTemplate.html",
        "loginTemplate": "loginView/loginViewTemplate.html",
        "meetupAddTemplate": "meetupAddView/meetupAddViewTemplate.html",
        "meetupDetailsTemplate": "meetupDetailsView/meetupDetailsViewTemplate.html",
        "meetupEntityTemplate": "meetupEntityView/meetupEntityViewTemplate.html",
        "meetupListTemplate": "meetupListView/meetupListViewTemplate.html",
        "meetupAttendTemplate": "meetupAttendView/meetupAttendViewTemplate.html",
        "meetupSearchTemplate": "meetupSearchView/meetupSearchViewTemplate.html"
    };

    //private function
    var _getTemplate = function (templateName) {

        var result = '';

        // try to get from store
        if (store.getTemplate(templateName) != null) {
            return store.getTemplate(templateName);
        }

        // else get from server and store
        Connect.utils.ajax.get(basePath + map[templateName], false, function (data) {
            store.setTemplate({ templateName: templateName, template: data });
            result = data;
        }, function () {
            EventManager.fire('error.show', this, { message: 'Error fetching template data from server.' });
        });
        return result;
    };

    var that = {};

    that.getTemplate = _getTemplate;

    return that;
})();