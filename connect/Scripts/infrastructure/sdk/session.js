(function(global) {
	
	/**
	 * @constructor
	 */
	var SessionManager = function() {

		/**
		 * @constructor
		 */
		var _sessionRequest = function() {
			this.apikey = '';
			this.isnonsliding = false;
			this.usagecount = -1;
			this.windowtime = 240;
		}

		var _sessionKey = null;
		var _appName = null;
		var _options = null;

		this.onSessionCreated = function() {};

		this.recreate = function() {
			global.Appacitive.session.create(_options);
		}

		this.create = function(options) {
			if (_sessionKey != null) return;
			
			options = options || {};
			_options = options;

			// track the application 
			_appName = options.app || '';

			// create the session
			var _sRequest = new _sessionRequest();
			_sRequest.apikey = options.apikey || '';
			_sRequest.isnonsliding = options.isnonsliding || _sRequest.isnonsliding;
			_sRequest.usagecount = options.usagecount || _sRequest.usagecount;
			_sRequest.windowtime = options.windowtime || _sRequest.windowtime;
			
			var _request = new Appacitive.HttpRequest();
			_request.url = global.Appacitive.config.apiBaseUrl + 'application.svc/session';
			_request.method = 'put';
			_request.data = _sRequest;
			_request.onSuccess = function(data) {
				if (data && data.status && data.status.code == '200') {
					_sessionKey = data.session.sessionkey;
					global.Appacitive.eventManager.fire('session.success', {}, data);
					global.Appacitive.http.addProcessor({
						pre: function(req) {
							req.headers.push({ key: 'appacitive-session', value: _sessionKey });
						}
					});
					global.Appacitive.session.onSessionCreated();
				}
				else { 
					global.Appacitive.eventManager.fire('session.error', {}, data);
				}
			}
			global.Appacitive.http.send(_request);
		};

		var _authToken = null, authEnabled = false;
		global.Appacitive.http.addProcessor({
			pre: function(request) {
				if (authEnabled == true)
					request.headers.push({ key: 'appacitive-user-auth', value: _authToken });
			}
		});
		
		this.setUserAuthHeader = function(authToken) {
			authEnabled = true;
			_authToken = authToken;
		};

		this.removeUserAuthHeader = function() {
			authEnabled = false;
		};

		this.isSessionValid = function(response) {
			if (!response) return true;
			if (response.status) {
				if (response.status.code) {
					if (response.status.code == '8027' || response.status.code == '8002') {
						return false;
					}
				}
			} else if (response.code) {
				if (response.code == '8027' || response.code == '8002') {
					return false;
				}
			}
			return true;
		};

		this.resetSession = function() {
			_sessionKey = null;
		}

		this.get = function() {
			return _sessionKey;
		}
	}

	global.Appacitive.session = new SessionManager();

}(window || process))