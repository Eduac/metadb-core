var assert = require('assert')
,   vows = require('vows')
,   events = require('events')
,   featureDao = require('../../models/daos/FeatureDao')
,	getTestFeature= function () {
		return {
			name : 'test_feature',
			description : 'test_description',	
			feature_bit : 10101010
		};	
    };
	
vows.describe('FeatureDao').addBatch({
    'after initialization' : {
        'should have findById query' : function () {
            assert.equal(featureDao.queries.findById, 'SELECT * FROM features WHERE feature_id = $1');            
        },
        'should inherit findById method' : function () {
            assert.ok(featureDao.findById);            
        },
        'after creating a sample feature' : {
            topic : function () {
                var promise = new events.EventEmitter();
                featureDao.create(getTestFeature(), function (feature) {
                    promise.emit('success', feature);
                });
                return promise;
            },
            'should return the feature with populated id' : function (feature) {
                assert.ok(feature.feature_id);
            },
            'should be able to find that feature from DB' : {
                topic : function (feature) {
                    var promise = new events.EventEmitter();
                    featureDao.findById(feature.feature_id, function (feat) {
                        promise.emit('success', feat);
                    });
                    return promise;
                },
                'and that feature should exist' : function (feature) { 
                    assert.ok(feature); 
                },
                'and that feature should have the same name' : function (feature) { 
                    assert.equal(feature.name, 'test_feature'); 
                },
                'and that feature should have the same description' : function (feature) { 
                    assert.equal(feature.description, 'test_description');
                },
				'and that feature should have the same bit mask' : function (feature) {
					assert.equal(feature.feature_bit , 10101010);
				}
            },
            teardown : function (feature) {
                var callback = this.callback;
                setTimeout(function () { featureDao.deleteById(feature.id, callback); }, 100);
            }
        }
    }
}).export(module);
