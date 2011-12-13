var uuid = require('node-uuid');
var pg = require('pg');
var connectionString = "postgres://metadb_rw:metadb@localhost:5432/metadb";

var ProfileDao = (function () {
	
	var _client = new pg.Client(connectionString);
	
	return {
		findByName: function (username, callbackFn) {
			var profile = {}
			,	query;
			//Get the user row.
			query = _client.query('SELECT FROM profiles WHERE username = $1', [username]);
			
			//Construct profile json.
			query.on('row', function(row) {
				profile['profile_id'] = row.profile_id;
				profile['username'] = row.username;
				profile['email'] = row.email;
				profile['first_name'] = row.first_name;
				profile['last_name'] = row.last_name;
				profile['last_login'] = row.last_login;
				profile['last_project_id'] = row.last_project_id;
				profile['role'] = row.role;
				callbackFn(profile);
			});
		}
	}
})();
module.exports = ProfileDao;