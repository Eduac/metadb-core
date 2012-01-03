var SESSION_TIMEOUT = 60000 * 30
,   AuthenticationHandler = function (authDao, sessionDao, profileDao) {
	
	return {
		name : 'AuthenticationHandler',
		
		//Auth success -> return new session ID
		//Auth failure -> return null
		//TODO: Try-Catch 
		authenticate : function (username, password, outFn) {
			authDao.authenticate(username, password, function(authenticated) {
                if (!authenticated) return outFn(null);
                profileDao.findByUsername(username, function (profile) {
                    sessionDao.create({
                        profile_id : profile.profile_id,
                        expire_time : new Date().getUTCMilliseconds() + SESSION_TIMEOUT
                    }, outFn);                    
                });
				return null;
			});
		}
	};
};
module.exports = AuthenticationHandler;