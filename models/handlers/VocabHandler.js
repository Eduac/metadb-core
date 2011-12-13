var VocabHandler = function (vocabDao) {
    return {
        name : 'VocabHandler', 
        
        create: function (vocabObj) {
                vocabDAO.createVocab(vocabName, contents);
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