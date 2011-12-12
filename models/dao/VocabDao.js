var uuid = require('node-uuid');
var pg = require('pg').native;
var connectionString = "postgres://metadb_rw:metadb@localhost:5432/metadb";

var VocabDao = (function () {
    return {
        name : 'VocabDao',
        createVocab: function ( vocabName, contents ) {
            pg.connect(connectionString, function (err, client) { 
                client.query('INSERT INTO vocabs(vocab_id, name, words) '+
                             ' VALUES($1, $2, $3) ',
                             [ uuid(), vocabName, contents ]
                             );
            });
        },
        removeVocab: function ( vocabId ) {
            pg.connect(connectionString, function (err, client) {
                client.query('DELETE FROM vocabs WHERE vocab_id = ?', 
                              [ vocabId ]
                            );
            });
        }
    }
})();
module.exports = VocabDao;
