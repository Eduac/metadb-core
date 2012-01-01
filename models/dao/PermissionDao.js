var uuid = require('node-uuid')
, 	CrudDao = require('./CrudDao')
, 	_queries = {
		create : 'INSERT INTO permissions (profile_id, project_id, feature_bit_mask) VALUES ($1, $2, $3)',
		findById : 'SELECT * FROM permissions WHERE profile_id = $1 AND project_id = $2',
		update : 'UPDATE permissions SET feature_bit_mask = $3 WHERE profile_id = $1 AND project_id = $2',	
		deleteById : 'DELETE FROM permissions WHERE profile_id = $1 AND project_id = $2',
		findAllByProfileId : 'SELECT * FROM permissions WHERE profile_id = $1'
};

var PermissionDao = CrudDao.extend({
	
	/******* Override *******/ 
	queries : _queries,
	objToQuery : function (obj) {
		return [
			obj.profile_id,
			obj.project_id,
			obj.feature_bit_mask
		];
	},
	queryToObj : function (row) {
		return {
			profile_id : row.profile_id,
			project_id : row.project_id,
			feature_bit_mask : row.feature_bit_mask
		};
	},

	create : function (obj, callbackFn) { 
		var _this = this;
		this.connect(function(err, client) {
			client	
				.query(_this.queries.create, _this.objToQuery(obj))
				.on('end', function () { _this.findById(obj.profile_id, obj.project_id, callbackFn); });
		});
	},

	findById : function (profile_id, project_id, callbackFn) {
		if (typeof callbackFn !== 'function') return;
		var _this = this;
		this.connect(function (err, client) {
			var object;
			client
				.query(_this.queries.findById, [profile_id, project_id])
				.on('row', function (row) { object = _this.queryToObj(row); })
				.on('end', function () { callbackFn(object); });
		});
	},

	deleteById : function (profile_id, project_id, callbackFn) {
		if (typeof callbackFn !== 'function') return;
		var _this = this;
		this.connect(function (err, client) {
			client.query(_this.queries.deleteById, [profile_id, project_id], callbackFn);
		});
	},
	/******* Custom *******/

	/* Get all permissions of one user */
	findAllByProfileId : function (profile_id, callbackFn) {
		if (typeof callbackFn !== 'function') return;
		var _this = this; 
		this.connect(function (err, client) {
			var object; 
			client
				.query(_this.queries.findAllByProfileId, [ profile_id ])
				.on('row', function (row) { object = _this.queryToObj(row); })
				.on('end', function () { callbackFn(object); });
		});
	}
});
module.exports = new PermissionDao();
