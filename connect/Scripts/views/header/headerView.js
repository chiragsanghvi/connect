﻿/**
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
            $(".authstuff").removeClass("hidden").show();
        } else {
            $("#ulSignUp").removeClass("hidden").show();
            $("#ulUser").addClass("hidden").hide();
            $(".authstuff").addClass("hidden").hide();
        }

        $('#btnLogout').bind('click', function () {
            try {
                Appacitive.facebook.logout(function () {
                    EventManager.fire('showIndexView')
                    Connect.utils.cookies.del('_connect_user_token');
                    Connect.bag.isAuthenticatedUser = false;
                    EventManager.fire('logoutUser');
                });
            } catch (e) {
                EventManager.fire('showIndexView')
                Connect.utils.cookies.del('_connect_user_token');
                Connect.bag.isAuthenticatedUser = false;
                EventManager.fire('logoutUser');
            }
        });
        return this;
    }
});