/**
Depends on	Backbone
jQuery
**/

if (!Connect) Connect = {};
if (!Connect.views) Connect.views = {};

window.Connect.views.masterPageView = Backbone.View.extend({
    headerView: null,
    render: function () {
        this.headerView = new Connect.views.headerView().render();
        $('body').css('visibility', 'visible');
    }
});