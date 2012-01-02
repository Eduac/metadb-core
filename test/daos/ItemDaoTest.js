var assert = require('assert')
,   vows = require('vows')
,   events = require('events')
,	featureDao = require('../../models/daos/FeatureDao')
,	projectFeatureDao = require('../../models/daos/ProjectFeatureDao')
,   itemDao = require('../../models/daos/ItemDao')
,	projectDao = require('../../models/daos/ProjectDao')
,	schemaDao = require('../../models/daos/SchemaDao')
,	vocabDao = require('../../models/daos/VocabDao')
,	elementDao = require('../../models/daos/ElementDao')
,	getTestItem= function (project, element) {
		return {
			project_id : project.project_id,
			item_index : 1,
			element_id : element.element_id,
			value : 'test_value'
		};	
   }
,	getTestProject= function () {
		return {
			name : 'test_project',
			description : 'test', 
			branding_text : 'test_brand'
		};	
	}
,   getTestElement= function(schema) {
		return {
            schema_id : schema.schema_id,
            element: 'test_element'
		};	
	}
,	getTestSchema = function () {
		return {
		    name : 'test_schema', 
            description: 'This is the description of a test schema.'
        };	
	}
, 	getTestFeature = function () {
		return {
			name : 'test_feature',
			description : 'test_description',
			feature_bit : 10101010
		};
	}
,	getTestVocab = function () {
		return {
			name : 'test_vocab_1',
			words: 'one; two; three; four'
		};	
	}
,	getTestProjectFeature = function (project, feature, element, vocab) {
		return {
			project_id: project.project_id,
			feature_id : feature.feature_id,
			element_id : element.element_id,
			value : 'test_value',
			setting_bit_mask : 10101010,
			vocab_id : vocab.vocab_id,
		}
	};

vows.describe('ItemDao').addBatch({
    'after initialization' : {
        'should have findById query' : function () {
            assert.equal(itemDao.queries.findById, 'SELECT * FROM items WHERE item_id = $1');            
        },
        'should inherit findById method' : function () {
            assert.ok(itemDao.findById);            
        },
        'should have a findAllByProject method' : function () {
			assert.ok(itemDao.findAllByProject);
		},
		
		'after creating a sample schema' : { 
			topic : function () { 
				var promise = new events.EventEmitter();
				schemaDao.create(getTestSchema(), function (schema) {
					promise.emit('success', schema);
				});
				return promise;
			},
			'after creating a sample project' : {
				topic : function(schema) {
					var promise = new events.EventEmitter();
           	     	projectDao.create(getTestProject(), function (project) {
						promise.emit('success', project);
                	});
					return promise;
				},
				'after creating a sample feature' : { 
					topic : function (project, schema) {
						var promise = new events.EventEmitter();
						featureDao.create(getTestFeature(), function (feature) {
							promise.emit('success', feature);
						});
						return promise;
					},
						
					'after creating a sample element' : {
						topic : function (feature, project, schema) {
							var promise = new events.EventEmitter();
							elementDao.create(getTestElement(schema), function (element) {
								promise.emit('success', element);
							});
							return promise;
						},
	
						'after creating a sample vocab' : {
							topic : function (element, feature, project, schema) {
								var promise = new events.EventEmitter();
								vocabDao.create(getTestVocab(), function (vocab) {
									promise.emit('success', vocab);
								});
								return promise;
							},
	
							'after creating a sample project feature' : {
								topic : function (vocab, element, feature, project, schema) {
									var promise = new events.EventEmitter();
									projectFeatureDao.create(getTestProjectFeature(project, feature, element, vocab), function (projectFeature) {
										promise.emit('success', projectFeature);
									});
									return promise;
								},
	
								'after creating a sample item' : { 
									topic : function (projectFeature, vocab, element, feature, project) {
										var promise = new events.EventEmitter();
										itemDao.create(getTestItem(project, element), function (item) {
											promise.emit('success', item);
										});
										return promise;
									},
			
									'should be able to find that item from DB' : {
										topic : function (item) {
   		   	    	          				var promise = new events.EventEmitter();
   		   		              				itemDao.findById(item.item_id, function (prof) {
   		           		          				promise.emit('success', prof);
   		               		  				});
   		                 					return promise;
   		             					},
   		            	 				'and that item should exist' : function (item) { 
   		                 					assert.ok(item); 
   		            					},
										'and that item should have an item id' : function (item) {
									 		assert.ok(item.item_id);
										},
   			             				'and that item should have a project id' : function (item) { 
   			                 				assert.ok(item.project_id); 
   		   		          				},
										'and that item should have the same item index' : function (item) {
											assert.equal(item.item_index, 1);
										},
	   	             					'and that item should have an element id' : function (item) { 
   		                 					assert.ok(item.element_id);
   	            			 			},
										'and that item should have the same value' : function (item) {
											assert.equal(item.value, 'test_value');
										}
									},
									teardown : function (item) {
										var callback = this.callback;
										setTimeout(function () { itemDao.deleteById(item.item_id, callback); }, 100);
									}
								},
								teardown : function (projectFeature) {
									var callback = this.callback;
									setTimeout(function () { projectFeatureDao.deleteById(projectFeature.project_id, projectFeature.feature_id, callback); }, 100);
								}
							},
							teardown : function (vocab) {
          	 	     			var callback = this.callback;
           		     			setTimeout(function () { vocabDao.deleteById(vocab.vocab_id, callback); }, 100);
           		 			}
						},
						teardown : function (element) {
                			var callback = this.callback;
            	   			setTimeout(function () { elementDao.deleteById(element.element_id, callback); }, 100);
            			}
					},
					teardown : function (feature) { 
						var callback = this.callback;
        				setTimeout(function () { featureDao.deleteById(feature.feature_id, callback); }, 100);
					}
				},
				teardown : function (project) {
					var callback = this.callback;
					setTimeout(function () { projectDao.deleteById(project.project_id, callback); }, 100);
				}
			},
			teardown : function (schema) {
				var callback = this.callback;
				setTimeout(function () { schemaDao.deleteById(schema.schema_id, callback); }, 100);
			}
		}
	}
}).export(module);
