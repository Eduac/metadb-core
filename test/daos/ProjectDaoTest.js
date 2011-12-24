var assert = require('assert')
,   vows = require('vows')
,   events = require('events')
,   projectDao = require('../../models/dao/ProjectDao')
,	getTestProject= function () {
		return {
			name : 'test_project',
			description : 'test', 
			branding_text : 'test_brand'
		};	
	};
	
vows.describe('ProjectDao').addBatch({
    'after initialization' : {
        'should have findById query' : function () {
            assert.equal(projectDao.queries.findById, 'SELECT * FROM projects WHERE project_id = $1');            
        },
        'should inherit findById method' : function () {
            assert.ok(projectDao.findById);            
        },
        'after creating a sample project' : {
            topic : function () {
                var promise = new events.EventEmitter();
                projectDao.create(getTestProject(), function (project) {
                    promise.emit('success', project);
                });
                return promise;
            },
            'should return the project with a populated id' : function (project) {
                assert.ok(project.project_id);
            },
            'should be able to find that project from the DB' : {
                topic : function (project) {
                    var promise = new events.EventEmitter();
                    projectDao.findById(project.project_id, function (project) {
                        promise.emit('success', project);
                    });
                    return promise;
                },
                'and that project should exist' : function (project) { 
                    assert.ok(project); 
                },
                'and that project should have same name' : function (project) { 
                    assert.equal(project.name, 'test_project'); 
                },
                'and that project should have the same description' : function (project) { 
                    assert.equal(project.description, 'test');
                },
								'and that project should have the same branding text' : function (project) {
										assert.equal(project.branding_text, 'test_brand');
								}
            },
            teardown : function (project) {
                var callback = this.callback;
                setTimeout(function () { projectDao.deleteById(project.project_id, callback); }, 100);
            }
        }
    }
}).export(module);
