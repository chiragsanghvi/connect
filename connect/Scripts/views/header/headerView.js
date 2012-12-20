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
        var html = Mustache.render(this.template, {});
        this.$element.html(html);
        return this;
    }
});