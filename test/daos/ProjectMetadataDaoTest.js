var assert = require('assert')
,   vows = require('vows')
,   events = require('events')
, 	projectDao = require('../../models/daos/ProjectDao')
,	projectMetadataDao = require('../../models/daos/ProjectMetadataDao')
, testHelper = require('./TestHelper')
;

vows.describe('ProjectMetadataDao').addBatch({
    'after initialization' : {
 		'should have findById query' : function () {
            assert.equal(projectMetadataDao.queries.findById, 'SELECT * FROM project_metadata WHERE project_id = $1 AND derivative = $2');            
        },

		'should have findAllByProjectIdquery' : function () {
			assert.equal(projectMetadataDao.queries.findAllByProjectId, 'SELECT * FROM project_metadata WHERE project_id = $1');
		},

		'should have overridden findById method' : function () {
			assert.ok(projectMetadataDao.findById);
		},

		'should have overridden deleteById method' : function () {
			assert.ok(projectMetadataDao.deleteById);
		},

		'should have the findAllByProjectId method' : function () {
			assert.ok(projectMetadataDao.findAllByProjectId);
		},
		'sample project' : {
			topic : function () {
				var promise = new events.EventEmitter();
				projectDao.create(testHelper.getTestProject(), function(project) {
					promise.emit('success', project);
				});
				return promise;
			},
        	'-> sample project metadata' : {
				topic : function (project) {
					var promise = new events.EventEmitter();
					projectMetadataDao.create(testHelper.getTestProjectMetadata(project), function (metadata) {
					promise.emit('success', metadata);
					});
					return promise;
				},

                'should return project metadata with id\'s' : function(metadata) {
                    assert.ok(metadata.project_id);
                    assert.ok(metadata.derivative);
                },
				
                'should be able to find the metadata from the database' : {
                    topic : function (metadata) {
                        var promise = new events.EventEmitter();
                        projectMetadataDao.findById(metadata.project_id, metadata.derivative, function (md) { 
                            promise.emit('success', md);
                        });
                        return promise;
                    },

                    'and that metadata should exist' : function (md) {
                        assert.ok(md);
                    },

                    'and that metadata should have a project ID' : function (md) {
                        assert.ok(md.project_id);
                    },

                    'and that metadata should have a derivative name' : function (md) {
                        assert.ok(md.derivative);
                    },

                    'and that metadata should have a width' : function (md) {
                        assert.ok(md.width);
                    },

                    'and that metadata should have a height' : function (md) {
                        assert.ok(md.height);
                    },

                    'and that metadata should have a brand setting' : function (md) {
                        assert.ok(md.brand);
                    },

                    'and that metadata should have a background color setting' : function (md) {
                        assert.ok(md.background_color);
                    },

                    'and that metadata should have a foreground color setting' : function (md) {
                        assert.ok(md.foreground_color);
                    }
                },

				teardown : function (metadata) {
					var callback = this.callback;
					setTimeout(function () { projectMetadataDao.deleteById(metadata.project_id, metadata.derivative, callback); }, 100);
				}
			},

			teardown : function (project) {
				var callback = this.callback;
				setTimeout(function () { projectDao.deleteById(project.project_id, callback); }, 100);
			}
		}
    }
}).export(module);
