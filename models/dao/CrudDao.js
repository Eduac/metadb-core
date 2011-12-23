var pg = require('pg');
var Class = require('../Class');

var CrudDao = Class.extend({
	
	init : function () {
		this.connString = 'postgres://metadb_rw:metadb@localhost:5432/metadb';
		this.pg = pg;
	},
	findByIdQuery : '',
	findById : function (id, callbackFn) {
		var _this = this;
		pg.connect(this.connString, function (err, client) {
			var objects = []; 
			client
				.query(_this.findByIdQuery, [id])
				.on('row', function (row) {
					objects.push(_this.queryToObj(row));
				})
				.on('end', function () {
					callbackFn(objects);
				});	
		});
	},
	createQuery : '',
	create : function (obj, callbackFn) {
		var _this = this;
		pg.connect(this.connString, function (err, client) { 
			client
				.query(_this.createQuery, _this.objToQuery(obj))
				.on('end', callbackFn);
		});
	},
	updateQuery : '',
	update : function (obj, callbackFn) {
		var _this = this;
		pg.connect(this.connString, function (err, client) {
			client
				.query(_this.updateQuery, _this.objToQuery(obj))
				.on('end', callbackFn);
		});
	},
	deleteByIdQuery : '',
	deleteById : function (id, callbackFn) {
		var _this = this;
		pg.connect(this.connString, function (err, client) {
			client
				.query(_this.deleteByIdQuery, [id])
				.on('end', callbackFn);
		});		
	},
	objToQuery : function (obj) { return [] },
	queryToObj : function (row) { return {} }	
});

module.exports = CrudDao;
