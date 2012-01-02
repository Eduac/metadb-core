var CrudDao = require('./CrudDao')
, 	_queries = {
		create : 'INSERT INTO project_features (project_id, feature_id, element_id, value, setting_bit_mask, vocab_id) VALUES ($1, $2, $3, $4, $5, $6)',
		findById : 'SELECT * FROM project_features WHERE project_id = $1 AND feature_id = $2',
		update : 'UPDATE project_features SET element_id = $3, value = $4, setting_bit_mask = $5, vocab_id = $6 WHERE project_id = $1 AND feature_id = $2',	
		deleteById : 'DELETE FROM project_features WHERE project_id = $1 AND feature_id = $2',
		findAllByProjectId: 'SELECT * FROM project_features WHERE project_id = $1'
};

var ProjectFeatureDao = CrudDao.extend({
	
	/******* Override *******/ 
	queries : _queries,
	objToQuery : function (obj) {
		return [
			obj.project_id,
			obj.feature_id,
			obj.element_id, 
			obj.value,
			obj.setting_bit_mask,
			obj.vocab_id
		];
	},
	queryToObj : function (row) {
		return {
			project_id : row.project_id,
			feature_id : row.feature_id,
			element_id : row.element_id,
			value : row.value,
			setting_bit_mask : row.setting_bit_mask,
			vocab_id : row.vocab_id
		};
	},

	create : function (obj, callbackFn) { 
		var _this = this;
		this.connect(function(err, client) {
			client	
				.query(_this.queries.create, _this.objToQuery(obj))
				.on('end', function () { _this.findById(obj.project_id, obj.feature_id, callbackFn); });
		});
	},

	findById : function (project_id, feature_id, callbackFn) {
		if (typeof callbackFn !== 'function') return;
		var _this = this;
		this.connect(function (err, client) {
			var object;
			client
				.query(_this.queries.findById, [project_id, feature_id])
				.on('row', function (row) { object = _this.queryToObj(row); })
				.on('end', function () { callbackFn(object); });
		});
	},

	deleteById : function (project_id, feature_id, callbackFn) {
		if (typeof callbackFn !== 'function') return;
		var _this = this;
		this.connect(function (err, client) {
			client.query(_this.queries.deleteById, [project_id, feature_id], callbackFn);
		});
	},
	/******* Custom *******/

	/* Get all project_features of one user */
	findAllByProjectId: function (project_id, callbackFn) {
		if (typeof callbackFn !== 'function') return;
		var _this = this; 
		this.connect(function (err, client) {
			var object; 
			client
				.query(_this.queries.findAllByProjectId, [ project_id ])
				.on('row', function (row) { object = _this.queryToObj(row); })
				.on('end', function () { callbackFn(object); });
		});
	}
});
module.exports = new ProjectFeatureDao();
