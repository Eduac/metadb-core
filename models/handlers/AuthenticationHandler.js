var uuid = require('node-uuid');
var AuthenticationHandler = (function () {
	return {
		name : 'AuthenticationHandler',
		authenticate : function (username, password) {
	    //call DAO to match user/pass. 
            if (username === 'metadb' && password === '123123') {
				return uuid();
			}
			return null;
		}
	}
})();
module.exports = AuthenticationHandler;
