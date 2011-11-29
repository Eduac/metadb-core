var uuid = require('node-uuid');
var AuthenticationHandler = (function () {
	return {
		name : 'AuthenticationHandler',
		authenticate : function (username, password) {
			if (username === 'metadb' && password === '123123') {
				return uuid.v4();
			}
			return null;
		}
	}
})();
module.exports = AuthenticationHandler;