/**
Depends on	jQuery
**/
(function ($) {
    if (!window.Connect) {
        window.Connect = {};
    }
    if (!Connect.utils)
        window.Connect.utils = {};

    $.support.cors = true;

    window.Connect.utils.ajax = new (function () {
        this.get = function (url, async, onSuccess, onError) {
            onError = onError || function () { };
            onSuccess = onSuccess || function () { };
            $.ajax({
                url: url,
                type: 'GET',
                async: async,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('appacitive-session', Connect.utils.cookies.get("__connect_app_session") != null ? Connect.utils.cookies.get("__connect_app_session").value : "");
                    xhr.setRequestHeader('appacitive-environment', 'live');
                },
                success: function (output) {
                    //Hack to make things work in FF
                    try { output = JSON.parse(output); } catch (e) { }
                    onSuccess(output);
                },
                error: function () {
                    onError();
                }
            });
        };

        this.post = function (url, data, async, onSuccess, onError) {
            onSuccess = onSuccess || function () { };
            onError = onError || function () { };
            try { data = JSON.stringify(data); } catch (e) { }
            $.ajax({
                url: url,
                type: 'POST',
                async: async,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('appacitive-session', Connect.utils.cookies.get("__connect_app_session") != null ? Connect.utils.cookies.get("__connect_app_session").value : "");
                    xhr.setRequestHeader('appacitive-environment', 'live');
                },
                contentType: "application/json",
                data: data,
                success: function (output) {
                    //Hack to make things work in FF
                    try { output = JSON.parse(output); } catch (e) { }
                    onSuccess(output);
                },
                error: function () {
                    onError();
                }
            });
        };

        this.put = function (url, data, async, onSuccess, onError) {
            onSuccess = onSuccess || function () { };
            onError = onError || function () { };
            //Hack to make things work in FF
            try { data = JSON.stringify(data); } catch (e) { }
            $.ajax({
                url: url,
                type: 'PUT',
                async: async,
                data: data,
                dataType: "json",
                // contentType: "application/json",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('appacitive-session', Connect.utils.cookies.get("__connect_app_session") != null ? Connect.utils.cookies.get("__connect_app_session").value : "");
                    xhr.setRequestHeader('appacitive-environment', 'live');
                },
                success: function (output) {
                    //Hack to make things work in FF
                    try { output = JSON.parse(output); } catch (e) { }
                    onSuccess(output);
                },
                error: function () {
                    onError();
                }
            });
        };

        this.del = function (url, async, onSuccess, onError) {
            onSuccess = onSuccess || function () { };
            onError = onError || function () { };
            $.ajax({
                url: url,
                type: 'DELETE',
                async: async,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('appacitive-session', Connect.utils.cookies.get("__connect_app_session") != null ? Connect.utils.cookies.get("__connect_app_session").value : "");
                    xhr.setRequestHeader('appacitive-environment', 'live');
                },
                success: function (output) {
                    //Hack to make things work in FF
                    try { output = JSON.parse(output); } catch (e) { }
                    onSuccess(output);
                },
                error: function () {
                    onError();
                }
            });
        };
    })();
})(jQuery);