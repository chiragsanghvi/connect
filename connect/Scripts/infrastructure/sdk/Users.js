(function (global) {

	global.Appacitive.Users = new (function() {

		this.signupWithFacebook = function(onSuccess, onError) {
			onSuccess = onSuccess || function(){};
			onError = onError || function(){};

			FB.api('/me', function(response) {
				var authRequest = {
					"accesstoken": Appacitive.facebook.accessToken,
					"type": "facebook",
					"expiry": 60 * 60,
					"attempts": -1,
					"createNew": true
				};
				var request = new Appacitive.HttpRequest();
				request.url = Appacitive.config.apiBaseUrl + Appacitive.storage.urlFactory.user.getAuthenticateUserUrl();
				request.method = 'post';
				request.data = authRequest;
				request.onSuccess = function(a) {
					if (a.user) {
						onSuccess(a);
					} else {
						onError(a);
					}
				}
				request.onError = function() {
					onError();
				}
				Appacitive.http.send(request);
			});
		};

		this.authenticateWithFacebook = this.signupWithFacebook;

	})();

})(window || process);