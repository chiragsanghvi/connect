if (!Connect) Connect = {};
if (!Connect.views) Connect.views = {};

window.Connect.views.meetupOrganiserView = Backbone.View.extend({
    templateName: 'meetupOrganiserTemplate',

    render: function () {

        var html = Mustache.render(this.template, this.model);
        $('#divOrganiserContainer').empty().html(html);
        return this;
    }
});
  