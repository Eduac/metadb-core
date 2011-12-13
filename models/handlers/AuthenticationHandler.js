var uuid = require('node-uuid');
var AuthenticationHandler = function (authDao, sessionDao, profileDao) {
	
	return {
		name : 'AuthenticationHandler',
		
		//Auth success -> return new session ID
		//Auth failure -> return null
		//TODO: Try-Catch 
		authenticate : function (username, password, outFn) {
			authDao.authenticate(username, password, function(authenticated) {
				if (authenticated) {
					return sessionDao.create(profileDao.findByName(username).profile_id, outFn);
				}	
				return outFn(null);			 
			});
		}
	}
}
module.exports = AuthenticationHandler;