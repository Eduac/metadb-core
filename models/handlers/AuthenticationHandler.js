var uuid = require('node-uuid');
var AuthenticationHandler = (function () {
    var AuthDao = (require('../dao/AuthenticationDao')); 
		var SessionDao = (require('../dao/SessionDao'));
    var ProfileDao = (require('../dao/ProfileDao'));
    
    return {
			name : 'AuthenticationHandler',
		
			authenticate : function (username, password) {
				
				//Auth success -> return new session ID
				//Auth failure -> return null
				//TODO: Try-Catch 

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
