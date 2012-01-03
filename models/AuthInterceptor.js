var AuthenticationInterceptor = (function () {
	var _ignored = {
			'AuthenticationHandler' : 1
	};
	return {
		process : function (jReq) {
			try {
				var _handler = jReq.method.split('.')[0];
				if (_handler in _ignored) return;
				if (!jReq.headers || !jReq.headers.user || !jReq.headers.token) 
					throw new Error('Header/header user/header token is not present');
			} catch (e) {
				throw new Error('Malformed request');
			}
		}
	}	
})();

module.exports = AuthenticationInterceptor;