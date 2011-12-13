var VocabHandler = function (vocabDao) {
    return {
        name : 'VocabHandler', 
        
        create: function (vocabObj) {
                vocabDAO.createVocab(vocabName, contents);
        },
        
        get: function (id) {
            //blah
        },
        
        update: function (vocabId, contents) {
            //blah
        },
        
        remove: function (id, reason) {
            //blah
        }
    }
}
module.exports = VocabHandler;