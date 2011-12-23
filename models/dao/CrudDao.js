var pg = require('pg');
var Class = require('../Class');

var CrudDao = Class.extend({
	init : function () {
		this.connString = 'postgres://metadb_rw:metadb@localhost:5432/metadb';
		this.pg = pg;
	},
	queries : {
		create : '',
		findById : '',
		update : '',
		deleteById : ''
	},
	connect : function (callbackFn) {
		pg.connect(this.connString, callbackFn);
	},
	findById : function (id, callbackFn) {
		var _this = this;
		this.connect(function (err, client) {
			var object; 
			client
				.query(_this.queries.findById, [id])
				.on('row', function (row) {
					object = _this.queryToObj(row);
				})
				.on('end', function () {
					callbackFn(object);
				});	
		});
	},
	create : function (obj, callbackFn) {
		var _this = this;
		this.connect(function (err, client) { 
			client
				.query(_this.queries.create, _this.objToQuery(obj))
				.on('end', callbackFn);
		});
	},
	update : function (obj, callbackFn) {
		var _this = this;
		this.connect(function (err, client) {
			client
				.query(_this.queries.update, _this.objToQuery(obj))
				.on('end', callbackFn);
		});
	},
	deleteById : function (id, callbackFn) {
		var _this = this;
		this.connect(function (err, client) {
			client
				.query(_this.queries.deleteById, [id])
				.on('end', callbackFn);
		});		
	},
	objToQuery : function (obj) { return [] },
	queryToObj : function (row) { return {} }	
});

module.exports = CrudDao;
