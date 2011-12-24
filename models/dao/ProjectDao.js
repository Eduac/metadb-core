var uuid = require('node-uuid')
, 	CrudDao = require('./CrudDao')
, 	_queries = {
		create : 'INSERT INTO projects(project_id, name, description, branding_text) VALUES($1, $2, $3, $4)',
		findById : 'SELECT * FROM projects WHERE project_id = $1',
		update : 'UPDATE projects SET name = $2, description = $3, brandingt_text = $4 WHERE project_id = $1',	
		deleteById : 'DELETE FROM projects WHERE project_id = $1',
		findByProjectName : 'SELECT * FROM projects WHERE name = $1'
};

var ProjectDao = CrudDao.extend({
	
	/******* Override *******/ 
	queries : _queries,
	objToQuery : function (obj) {
		return [
			obj.project_id,
			obj.name,
			obj.description,
			obj.branding_text
		];
	},
	queryToObj : function (row) {
		return {
			project_id : row.project_id,
			name : row.name,
			description: row.description,
			branding_text : row.branding_text
		};
	},

	create : function (obj, callbackFn) {
		obj.project_id = obj.id = uuid();
		this._super (obj, callbackFn);
	},

	/******* Custom *******/
	findByProjectName: function (projectName, callbackFn) {
		if (typeof callbackFn !== 'function') return;
		var _this = this; 
		this.connect(function (err, client) {
			var object; 
			client
				.query(_this.queries.findByProjectName, [projectName])
				.on('row', function (row) { object = _this.queryToObj(row); })
				.on('end', function () { callbackFn(object); });
				});
	}
});
module.exports = new ProjectDao();
