var uuid = require('node-uuid')
,	sha1 = require('sha1')
,	CrudDao = require('./CrudDao');

var ProfileDao = CrudDao.extend({
	
	findByIdQuery : 'SELECT * FROM profiles WHERE profile_id = $1',
	deleteByIdQuery : 'DELETE FROM profiles WHERE profile_id = $1',
	createQuery : 'INSERT INTO profiles (profile_id, username, email, first_name, last_name, last_login, last_project_id, role, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
	objToQuery : function (obj) {
		return [
			obj.profile_id,
			obj.username,
			obj.email,
			obj.first_name,
			obj.last_name,
			obj.last_login,
			obj.last_project_id,
			obj.role,
			sha1(obj.password)
		];
	},
	queryToObj : function (row) {
		return {
			profile_id : row.profile_id,
			username : row.username,
			email : row.email,
			first_name : row.first_name,
			last_name : row.last_name,
			last_login : row.last_login,
			last_project_id : row.last_project_id,
			role : row.role
		}	
	},
	create : function (obj, callbackFn) {
		obj.profile_id = uuid();
		this._super(obj, callbackFn);
		return obj;
	},
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
	
});
module.exports = new ProfileDao();