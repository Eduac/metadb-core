var uuid = require('node-uuid')
,	sha1 = require('sha1')
,	CrudDao = require('./CrudDao')
,	_queries = {
		create : 'INSERT INTO profiles (profile_id, username, email, first_name, last_name, last_login, last_project_id, role, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
		findById : 'SELECT * FROM profiles WHERE profile_id = $1',
		update: 'UPDATE profiles SET username = $2, email = $3, first_name = $4, last_name = $5, last_login = $6, last_project_id = $7, role = $8, password = $9 WHERE profile_id = $1',
		deleteById: 'DELETE FROM profiles WHERE profile_id = $1',
		findByUsername: 'SELECT * FROM profiles WHERE username = $1'
	};

var ProfileDao = CrudDao.extend({
	
	/******* OVERRIDE ******/
	queries : _queries,
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
            id : row.profile_id,
			profile_id : row.profile_id,
			username : row.username,
			email : row.email,
			first_name : row.first_name,
			last_name : row.last_name,
			last_login : row.last_login,
			last_project_id : row.last_project_id,
			role : row.role
		};
	},
	create : function (obj, callbackFn) {
		obj.profile_id = obj.id = uuid();
		this._super(obj, callbackFn);		
	},
	
	/******* CUSTOM *******/
	findByUsername: function (username, callbackFn) {
        if (typeof callbackFn !== 'function') return;
		var _this = this;
		this.connect(function (err, client) {
			var object; 
			client
				.query(_this.queries.findByUsername, [username])
				.on('row', function (row) { object = _this.queryToObj(row); })
				.on('end', function () { callbackFn(object); });	
		});
	}
});
module.exports = new ProfileDao();
