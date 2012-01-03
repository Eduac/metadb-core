var uuid = require('node-uuid')
,	sha1 = require('sha1')
,	CrudDao = require('./CrudDao')
,	_queries = {
		create : 'INSERT INTO elements (element_id, schema_id, element) VALUES ($1, $2, $3)',
		findById : 'SELECT * FROM elements WHERE element_id = $1',
		update: 'UPDATE elements SET schema_id = $2, element = $3 WHERE element_id = $1',
		deleteById: 'DELETE FROM elements WHERE element_id = $1',
	    findAllBySchema : 'SELECT * FROM elements WHERE schema_id = $1'
    };

var ElementDao = CrudDao.extend({
	
	/******* OVERRIDE ******/
	queries : _queries,
	objToQuery : function (obj) {
		return [
			obj.element_id,
			obj.schema_id,
            obj.element
		];
	},
	queryToObj : function (row) {
		return {
			id : row.element_id,
			element_id : row.element_id,
			schema_id : row.schema_id,
		    element: row.element
        };
	},
	create : function (obj, callbackFn) {
		obj.element_id = obj.id = uuid();
		this._super(obj, callbackFn);		
	},
	
	/******* CUSTOM *******/
	findAllBySchema : function (schema_id, callbackFn) {
        if (typeof callbackFn !== 'function') return;
        var _this = this;
        this.connect(function (err, client) {
            var object; 
            client
                .query(_this.queries.findAllBySchema, [schema_id])
                .on('row', function (row) { object = _this.queryToObj(row); })
                .on('end', function () { callbackFn(object); });
        });
	}
});
module.exports = new ElementDao();
