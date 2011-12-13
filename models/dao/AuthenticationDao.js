//Authenticate(): check against DB, return new sessionID(uuid) 
//return null if error
var uuid = require('node-uuid');
var sha1 = require('sha1');
var pg = require('pg');
var connectionString = "postgres://metadb_rw:metadb@localhost:5432/metadb";

var AuthenticationDao = (function () { 
	
	var _client = new pg.Client(connectionString);
	
	return {
		authenticate: function (username, password, callbackFn) {
			var hash = sha1(password)
			,	query;
			query = _client.query('SELECT FROM profiles WHERE username = $1', [username]);
			query.on('row', function(row) { callbackFn(hash == row.password); });
		}
	}
})();
module.exports = AuthenticationDao;