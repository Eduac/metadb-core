var assert = require('assert')
,   vows = require('vows')
,   events = require('events')
,   schemaDao = require('../../models/dao/SchemaDao')
,	getTestSchema = function () {
		return {
		    name : 'test_schema', 
            description: 'This is the description of a test schema.'
        };	
    };
	
vows.describe('SchemaDao').addBatch({
    'after initialization' : {
        'should have findById query' : function () {
            assert.equal(schemaDao.queries.findById, 'SELECT * FROM metadata_schemas WHERE schema_id = $1');            
        },

        'should inherit findById method' : function () {
            assert.ok(schemaDao.findById);            
        },

        'should have overridden findByName method' : function () {
            assert.ok(schemaDao.findByName);
        },

        'after finding the schema dublin': {
            topic : function () {
                var promise = new events.EventEmitter();
                schemaDao.findByName('dublin', function (schema) {
                    promise.emit('success', schema);
                });
                return promise;
            },
            'should find it' : function (schema) { assert.ok(schema); },
            'should find a schema w/ match name' : function (schema) {
                assert.equal(schema.name, 'dublin');            
            },

            'should find a schema with the same description' : function (schema) {
                assert.equal(schema.description, 'Dublin Core');
            }
        },
        'after creating a sample schema' : {
            topic : function () {
                var promise = new events.EventEmitter();
                schemaDao.create(getTestSchema(), function (schema) {
                    promise.emit('success', schema);
                });
                return promise;
            },
            'should return the schema with populated id' : function (schema) {
                assert.ok(schema.schema_id);
            },
            'should be able to find that schema from DB by ID' : {
                topic : function (schema) {
                    var promise = new events.EventEmitter();
                    schemaDao.findById(schema.schema_id, function (prof) {
                        promise.emit('success', prof);
                    });
                    return promise;
                },
                'and that schema should exist' : function (schema) { 
                    assert.ok(schema); 
                },
                'and that schema should have the same name' : function (schema) { 
                    assert.equal(schema.name, 'test_schema'); 
                },
                'and that schema should have the same description' : function (schema) { 
                    assert.equal(schema.description, 'This is the description of a test schema.'); 
                }
            },
            'should be able to find that schema from DB by name' : {
                topic : function (schema) {
                    var promise = new events.EventEmitter();
                    schemaDao.findById(schema.schema_id, function (prof) {
                        promise.emit('success', prof);
                    });
                    return promise;
                },
                'and that schema should exist' : function (schema) { 
                    assert.ok(schema); 
                },
                'and that schema should have the same name' : function (schema) { 
                    assert.equal(schema.name, 'test_schema'); 
                },
                'and that schema should have the same description' : function (schema) { 
                    assert.equal(schema.description, 'This is the description of a test schema.'); 
                }
            },
            teardown : function (schema) {
                var callback = this.callback;
                setTimeout(function () { schemaDao.deleteById(schema.id, callback); }, 100);
            }
        }
    }
}).export(module);
