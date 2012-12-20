if (!window.Connect) Connect = {};
Connect.config = {};

Connect.config = new (function () {
    var _apiBaseUrl = "https://apis.appacitive.com/";
    var _is_touch_device = 'ontouchstart' in document.documentElement;
    var _apiKey = 'JElDHgtaLFnjyz641UlFy+6nK1Hf/6BySJsfZelnB6U=';
    var _appName = 'connect';
    var _blueprintId = "11021976257822999";
    
    this.apiBaseUrl = _apiBaseUrl;
    this.is_touch_device = _is_touch_device;
    this.apikey = _apiKey;
    this.appName = _appName;
    this.blueprintId = _blueprintId;
})();