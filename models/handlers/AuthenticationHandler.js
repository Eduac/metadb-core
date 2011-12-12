var uuid = require('node-uuid');
var AuthenticationHandler = (function () {
	var AuthDao = (require('../dao/AuthenticationDao')); 
	var SessionDao = (require('../dao/SessionDao'));
	var ProfileDao = (require('../dao/ProfileDao'));
	
	return {
		name : 'AuthenticationHandler',
		
		//Auth success -> return new session ID
		//Auth failure -> return null
		//TODO: Try-Catch 
		authenticate : function (username, password) {
			if (authDao.authenticate(username, password)) {
				var profile_id = profileDao.getProfile(username);
				var uuid = sessionDao.createSession(profile_id);
				return uuid;
			}
			else {
				return null;
			}
		}
	}
})();
module.exports = AuthenticationHandler;