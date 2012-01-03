var uuid = require('node-uuid')
,	sha1 = require('sha1')
,	CrudDao = require('./CrudDao')
,	_queries = {
		create : 'INSERT INTO metadata_schemas (schema_id, name, description) VALUES ($1, $2, $3)',
		findById : 'SELECT * FROM metadata_schemas WHERE schema_id = $1',
		update: 'UPDATE metadata_schemas SET name = $2, description = $3 WHERE schema_id = $1',
		deleteById: 'DELETE FROM metadata_schemas WHERE schema_id = $1',
        findByName : 'SELECT * FROM metadata_schemas WHERE name = $1'
    };

var SchemaDao = CrudDao.extend({
	
	/******* OVERRIDE ******/
	queries : _queries,
	objToQuery : function (obj) {
		return [
			obj.schema_id,
			obj.name,
			obj.description,
		];
	},
	queryToObj : function (row) {
		return {
			id : row.schema_id,
			schema_id : row.schema_id,
			name : row.name,
			description : row.description
		};
	},
	create : function (obj, callbackFn) {
		obj.schema_id = obj.id = uuid();
		this._super(obj, callbackFn);		
	},

    /******* CUSTOM *******/
    findByName : function (name, callbackFn) {
        var _this = this;
        this.connect(function (err, client) {
            var object;
            client
                .query(_this.queries.findByName, [name])
                .on('row', function (row) { object = _this.queryToObj(row); })
                .on('end', function () { callbackFn(object); });
        });
    }
});
module.exports = new SchemaDao();
