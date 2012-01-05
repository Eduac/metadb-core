var assert = require('assert')
,   vows = require('vows')
,   events = require('events')
, 	featureDao = require('../../models/daos/FeatureDao')
, 	projectDao = require('../../models/daos/ProjectDao')
,	schemaDao = require('../../models/daos/SchemaDao')
,	elementDao = require('../../models/daos/ElementDao')
,	vocabDao = require('../../models/daos/VocabDao')
,	projectFeatureDao = require('../../models/daos/ProjectFeatureDao')
, testHelper = require('./TestHelper')
;

vows.describe('ProjectFeatureDao').addBatch({
    'after initialization' : {
 		'should have findById query' : function () {
            assert.equal(projectFeatureDao.queries.findById, 'SELECT * FROM project_features WHERE project_id = $1 AND feature_id = $2');            
        },

		'should have findAllByProjectIdquery' : function () {
			assert.equal(projectFeatureDao.queries.findAllByProjectId, 'SELECT * FROM project_features WHERE project_id = $1');
		},

		'should have overridden findById method' : function () {
			assert.ok(projectFeatureDao.findById);
		},

		'should have overridden deleteById method' : function () {
			assert.ok(projectFeatureDao.deleteById);
		},

		'should have the findAllByProjectId method' : function () {
			assert.ok(projectFeatureDao.findAllByProjectId);
		},
		'sample schema' : {
			topic : function () {
				var promise = new events.EventEmitter();
				schemaDao.create(testHelper.getTestSchema(), function(schema) {
					promise.emit('success', schema);
				});
				return promise;
			},
        	'-> sample project' : {
				topic : function () {
					var promise = new events.EventEmitter();
					projectDao.create(testHelper.getTestProject(), function (project) {
					promise.emit('success', project);
					});
					return promise;
				},
				
				'-> sample feature' : {
					topic : function () {
						var promise = new events.EventEmitter();
						featureDao.create(testHelper.getTestFeature(), function (feature) {
							promise.emit('success', feature);
						});
						return promise;
					},

					'-> sample element' : { 
						topic : function (feature, project, schema) {
							var promise = new events.EventEmitter();
							elementDao.create(testHelper.getTestElement(schema), function(element) {
								promise.emit('success', element);
							});
							return promise;
						},
						
						'-> sample vocab' : {
							topic: function (element) {
								var promise = new events.EventEmitter();
								vocabDao.create(testHelper.getTestVocab('voc_projectfeaturetest'), function (vocab) {
									promise.emit('success', vocab);
								});
								return promise;
							},

							'-> sample project feature' : {
								topic : function (vocab, element, feature, project) {
									var promise = new events.EventEmitter();
									projectFeatureDao.create(testHelper.getTestProjectFeature(project, feature, element, vocab), function (projectFeature) {
										promise.emit('success', projectFeature);
									});
									return promise;
								},

								'should return the project feature with  id\'s' : function (projectFeature) {
									assert.ok(projectFeature.project_id);
									assert.ok(projectFeature.feature_id);
								},

								'should be able to find the project feature from the DB' : {
									topic : function (projectFeature) {
										var promise = new events.EventEmitter();
										projectFeatureDao.findById(projectFeature.project_id, projectFeature.feature_id, function (feat) {
											promise.emit('success', feat);
										});
										return promise;
									},

									'and that project feature should exist' : function (feat) {
										assert.ok(feat);
									},

									'and that project feature should have a project ID' : function (feat) {
										assert.ok(feat.project_id);
									},

									'and that project feature should have a feature ID' : function (feat) {
										assert.ok(feat.feature_id);
									},

									'and that project feature should have an element ID' : function (feat) {
										assert.ok(feat.element_id);
									},

									'and that project feature should have the same value' : function (feat) {
										assert.equal(feat.value, 'test_value');
									},

									'and that project feature should have the same setting bit mask' : function (feat) {
										assert.equal(feat.setting_bit_mask, 10101010);
									},

									'and that project feature should have a vocab ID' : function (feat) {
										assert.ok(feat.vocab_id);
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
