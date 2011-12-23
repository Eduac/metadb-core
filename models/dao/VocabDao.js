var uuid = require('node-uuid')
, 	CrudDao = require('./CrudDao')
, 	_queries = {
		create : 'INSERT INTO vocabs(vocab_id, name, words) VALUES($1, $2, $3)',
		deleteById : 'DELETE FROM vocabs WHERE vocab_id = $1'
};

var VocabDao = CrudDao.extend({
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
	}
});
module.exports = new VocabDao();
