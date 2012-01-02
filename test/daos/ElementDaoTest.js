var assert = require('assert')
,   vows = require('vows')
,   events = require('events')
,   elementDao = require('../../models/dao/ElementDao')
,	schemaDao = require('../../models/dao/SchemaDao')
,   _schema_id = ''
,	getTestSchema = function () {
		return {
		    name : 'test_schema', 
            description: 'This is the description of a test schema.'
        };
    }
,   getTestElement= function(schema) {
		return {
            schema_id : schema.schema_id,
            element: 'test_element'
		};	
	};
	
vows.describe('ElementDao').addBatch({
    'after initialization' : {
        'should have findById query' : function () {
            assert.equal(elementDao.queries.findById, 'SELECT * FROM elements WHERE element_id = $1');            
        },
        'should inherit findById method' : function () {
            assert.ok(elementDao.findById);            
        },

        'should have a findAllBySchema method' : function () {
            assert.ok(elementDao.findAllBySchema);
        },

        'after creating a sample schema' : {
            topic : function () {
                var promise = new events.EventEmitter();
                schemaDao.create(getTestSchema(), function (schema) {
                    _schema_id = schema.schema_id;
                    promise.emit('success', schema);
                });
                return promise;
            },
            'after creating a sample element in that schema' : {
                topic : function (schema) {
                    var promise = new events.EventEmitter();
                    elementDao.create(getTestElement(schema), function (element) {
                        promise.emit('success', element);
                    });
                    return promise;
                },
                        
                'should return the element with a populated id' : function (element) {
                    assert.ok(element.element_id);
                },
            
                'should be able to find that element from the DB' : {
                     topic : function (element) {
                        var promise = new events.EventEmitter();
                        elementDao.findById(element.element_id, function (element) {
                            promise.emit('success', element);
                        });
                        return promise;
                    },
                    'and that element should exist' : function (element) { 
                        assert.ok(element); 
                    },
                    'and that element should have the same schema ID' : function (element) { 
                        assert.equal(element.schema_id, _schema_id); 
                    },
                    'and that element should have the same name' : function (element) { 
                        assert.equal(element.element, 'test_element');
                    },
                },
                teardown : function (element) {
                    var callback = this.callback;
                    setTimeout(function () { elementDao.deleteById(element.element_id, callback); }, 100);
                }
            },
            teardown : function (schema) {
                var callback = this.callback;
                setTimeout(function () { schemaDao.deleteById (schema.schema_id , callback); }, 100);
            }
        }
    }
}).export(module);
