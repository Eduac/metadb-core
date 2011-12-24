var uuid = require('node-uuid')
, 	CrudDao = require('./CrudDao')
, 	_queries = {
		create : 'INSERT INTO controlled_vocabs(vocab_id, name, words) VALUES($1, $2, $3)',
		findById : 'SELECT * FROM controlled_vocabs WHERE vocab_id = $1',
		update : 'UPDATE controlled_vocabs SET name = $2, words = $3 WHERE vocab_id = $1',	
		deleteById : 'DELETE FROM controlled_vocabs WHERE vocab_id = $1',
		findByVocabName : 'SELECT * FROM controlled_vocabs WHERE name = $1'
};

var VocabDao = CrudDao.extend({
	
	/******* Override *******/ 
	queries : _queries,
	objToQuery : function (obj) {
		return [
			obj.vocab_id,
			obj.name,
			obj.words
		];
	},
	queryToObj : function (row) {
		return {
			vocab_id : row.vocab_id,
			name : row.name,
			words : row.words
		};
	},

	create : function (obj, callbackFn) {
		obj.vocab_id = obj.id = uuid();
		this._super (obj, callbackFn);
	},

	/******* Custom *******/
	findByVocabName: function (vocabName, callbackFn) {
		if (typeof callbackFn !== 'function') return;
		var _this = this; 
		this.connect(function (err, client) {
			var object; 
			client
				.query(_this.queries.findByVocabName, [vocabName])
				.on('row', function (row) { object = _this.queryToObj(row); })
				.on('end', function () { callbackFn(object); });
				});
	}
});
module.exports = new VocabDao();
