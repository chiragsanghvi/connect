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
    },
    showIndex: function () {
        $("#divCreate").slideUp();
        $("#divIndex").slideDown();
        $('#divMeetupDetails').slideUp();
        $("body").scrollTop(0);
    },
    showLoginModal: function () {
        $('#btnLogin').unbind('click').bind('click', function () {
            EventManager.fire('loginUser', this, {
                callback: function () {
                    EventManager.fire("userAuthenticated", this, {});
                    $("#divLoginModal").modal('hide');
                }
            });
        });
        $("#divLoginModal").modal({
            show: true
        });
    },
    showSignupModal: function () {
        $("#divSignUpModal").modal({
            show: true
        });
    }
});