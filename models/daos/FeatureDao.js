var uuid = require('node-uuid')
,	sha1 = require('sha1')
,	CrudDao = require('./CrudDao')
,	_queries = {
		create : 'INSERT INTO features (feature_id, name, description, feature_bit) VALUES ($1, $2, $3, $4)',
		findById : 'SELECT * FROM features WHERE feature_id = $1',
		update: 'UPDATE features SET name = $2, description = $2, feature_bit = $3 WHERE feature_id = $1',
		deleteById: 'DELETE FROM features WHERE feature_id = $1',
	};

var FeatureDao = CrudDao.extend({
	
	/******* OVERRIDE ******/
	queries : _queries,
	objToQuery : function (obj) {
		return [
			obj.feature_id,
			obj.name,
			obj.description,
			obj.feature_bit,
		];
	},
	queryToObj : function (row) {
		return {
			id : row.feature_id,
			feature_id : row.feature_id,
			name : row.name,
			description : row.description,
			feature_bit : row.feature_bit
		};
	},
	create : function (obj, callbackFn) {
		obj.feature_id = obj.id = uuid();
		this._super(obj, callbackFn);		
	},
});
module.exports = new FeatureDao();
