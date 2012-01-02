var uuid = require('node-uuid')
,	sha1 = require('sha1')
,	CrudDao = require('./CrudDao')
,	_queries = {
		create : 'INSERT INTO items (item_id, project_id, item_index, element_id, value) VALUES ( $1, $2, $3, $4, $5)',
		findById : 'SELECT * FROM items WHERE item_id = $1',
		update: 'UPDATE items SET project_id = $1, item_index = $2, element_id = $3, value = $4 WHERE item_id = $1',
		deleteById: 'DELETE FROM items WHERE item_id = $1',
		findAllByProject: 'SELECT * FROM items WHERE project_id = $1'
	};

var ItemDao = CrudDao.extend({
	
	/******* OVERRIDE ******/
	queries : _queries,
	objToQuery : function (obj) {
		return [
			obj.item_id,
			obj.project_id,
			obj.item_index,
			obj.element_id,
			obj.value
		];
	},
	queryToObj : function (row) {
		return {
			id : row.item_id,
			item_id : row.item_id,
			project_id : row.project_id,
			item_index : row.item_index,
			element_id : row.element_id,
			value : row.value
		};
	},
	create : function (obj, callbackFn) {
		obj.item_id = obj.id = uuid();
		this._super(obj, callbackFn);		
	},
	
	/******* CUSTOM *******/
	findAllByProject : function (project_id, callbackFn) {
		if (typeof callbackFn !== 'function') return;
		var _this = this;
		this.connect(function (err, client)	{ 
			var object;
			client
				.query(_this.queries.findAllByProject, [project_Id])
				.on('row', function (row) { object = _this.queryToObj(row); })
				.on('end', function () { callbackFn(object); });
		});
	},
});
module.exports = new ItemDao();
