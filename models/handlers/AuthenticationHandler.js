var uuid = require('node-uuid');
var AuthenticationHandler = (function (daoList) {
    console.log(daoList);
    var AuthDao = daoList['AuthenticationDao'];
	var SessionDao = daoList['SessionDao'];
    var ProfileDao = daoList['ProfileDao'];
    
    return {
		name : 'AuthenticationHandler',
		authenticate : function (username, password) {
	        //call DAO to match user/pass. 
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
