/**
Depends on	Backbone
jQuery
jQuery.watermark
Mustache
loginTemplate - Mustache Template
**/

if (!Connect) Connect = {};
if (!Connect.views) Connect.views = {};

window.Connect.views.headerView = Backbone.View.extend({

    templateName: 'headerTemplate',

    render: function () {
        var that = this;
        this.$element = $("#divHeader");
        var html = Mustache.render(this.template, Connect.bag.user);
        this.$element.html(html);
        if (Connect.bag.isAuthenticatedUser == true) {
            $("#ulUser").removeClass("hidden").show();
            $("#ulSignUp").addClass("hidden").hide();
        } else {
            $("#ulSignUp").removeClass("hidden").show();
            $("#ulUser").addClass("hidden").hide();
        }

        $('#btnLogout').bind('click', function () {
            try {
                Appacitive.facebook.logout();
            } catch (e) {
                
            }
            Connect.utils.cookies.del('_connect_user_token');
            EventManager.fire('logoutUser');
        });
        return this;
    }
});