/**
Depends on	Backbone
jQuery
**/

if (!Connect) Connect = {};
if (!Connect.views) Connect.views = {};

window.Connect.views.masterPageView = Backbone.View.extend({
    render: function () {
        $('body').css('visibility', 'visible');
        return this;
    }
});