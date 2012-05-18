var VocabHandler = function (vocabDao) {
    return {
        name : 'VocabHandler', 
        
        create: function (vocab) {
                vocabDao.createVocab(vocab, contents);
        },
        
        findById: function (id) {
            //blah
        },
        
        update: function (vocabId, contents) {
            //blah
        },
        
        deleteById: function (id, reason) {
            //blah
        }
    }
}
module.exports = VocabHandler;
