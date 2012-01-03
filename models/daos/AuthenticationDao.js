//Authenticate(): check against DB, return new sessionID(uuid) 
//return null if error
var BasicDao = require('./BasicDao')
,   sha1 = require('sha1')
,   _queries = {
        authenticate : 'SELECT profile_id FROM profiles WHERE username = $1 AND password = $2'
    };

var AuthenticationDao = BasicDao.extend({ 
	authenticate: function (username, password, callbackFn) {
		this.connect(function (err, client) {
            client.query(_queries.authenticate, [username, sha1(password)], function (err, result) {
                callbackFn(result.rows.length);
            });
        });
	}
	
});

module.exports = new AuthenticationDao();