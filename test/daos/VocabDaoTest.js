var assert = require('assert')
,   vows = require('vows')
,   events = require('events')
,   vocabDao = require('../../models/daos/VocabDao')
,	getTestVocab = function () {
		return {
			name : 'test_vocab',
			words: 'one; two; three; four'
		};	
	};
	
vows.describe('VocabDao').addBatch({
    'after initialization' : {
        'should have findById query' : function () {
            assert.equal(vocabDao.queries.findById, 'SELECT * FROM controlled_vocabs WHERE vocab_id = $1');            
        },
        'should inherit findById method' : function () {
            assert.ok(vocabDao.findById);            
        },
        'after creating a sample vocabulary' : {
            topic : function () {
                var promise = new events.EventEmitter();
                vocabDao.create(getTestVocab(), function (vocab) {
                    promise.emit('success', vocab);
                });
                return promise;
            },
            'should return the vocab with a populated id' : function (vocab) {
                assert.ok(vocab.vocab_id);
            },
            'should be able to find that vocab from the DB' : {
                topic : function (vocab) {
                    var promise = new events.EventEmitter();
                    vocabDao.findById(vocab.vocab_id, function (vocab) {
                        promise.emit('success', vocab);
                    });
                    return promise;
                },
                'and that vocab should exist' : function (vocab) { 
                    assert.ok(vocab); 
                },
                'and that vocab should have same name' : function (vocab) { 
                    assert.equal(vocab.name, 'test_vocab'); 
                },
                'and that vocab should have the same contents' : function (vocab) { 
                    assert.equal(vocab.words, 'one; two; three; four'); 
                }
            },
            teardown : function (vocab) {
                var callback = this.callback;
                setTimeout(function () { vocabDao.deleteById(vocab.vocab_id, callback); }, 100);
            }
        }
    }
}).export(module);
