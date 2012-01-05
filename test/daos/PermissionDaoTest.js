var assert = require('assert')
,   vows = require('vows')
,   events = require('events')
, 	profileDao = require('../../models/daos/ProfileDao')
, 	permissionDao = require('../../models/daos/PermissionDao')
,	projectDao = require('../../models/daos/ProjectDao')
,	testHelper = require('./TestHelper')
;

vows.describe('PermissionDao').addBatch({
    'after initialization' : {
 		'should have findById query' : function () {
            assert.equal(permissionDao.queries.findById, 'SELECT * FROM permissions WHERE profile_id = $1 AND project_id = $2');            
        },

		'should have findAllByProfileId query' : function () {
			assert.equal(permissionDao.queries.findAllByProfileId, 'SELECT * FROM permissions WHERE profile_id = $1');
		},

		'should have overridden findById method' : function () {
			assert.ok(permissionDao.findById);
		},

		'should have overridden deleteById method' : function () {
			assert.ok(permissionDao.deleteById);
		},

		'should have the findAllByProfileId method' : function () {
			assert.ok(permissionDao.findAllByProfileId);
		},

        '-> sample project' : {
			topic : function () {
                var promise = new events.EventEmitter();
				projectDao.create(testHelper.getTestProject(), function (project) {
					promise.emit('success', project);
				});
				return promise;
			},
			'-> sample profile' : {
				topic : function (project) {
					var promise = new events.EventEmitter();
					profileDao.create(testHelper.getTestProfile(), function(profile) {
						promise.emit('success', profile);
					});
					return promise;
				},
				'-> sample permission' : { 
					topic : function (profile, project) {
						var promise = new events.EventEmitter();
						permissionDao.create(testHelper.getTestPermission(profile, project), function(permission) {
							promise.emit('success', permission);
						});
						return promise;
					},
					'should return the permission with IDs populated' : function(permission) {
						assert.ok(permission.profile_id);
						assert.ok(permission.project_id);
					},

					'should be able to find the permission from the DB' : {
						topic: function (permission) {
							var promise = new events.EventEmitter();
							permissionDao.findById(permission.profile_id, permission.project_id, function (perm) {
								promise.emit('success', perm);
							});
							return promise;
						},
                		'and that permission should exist' : function (permission) { 
                   			assert.ok(permission); 
                		},

                		'and that permission should have a profile ID' : function (permission) { 
                    		assert.ok(permission.profile_id);
                		},
						
                		'and that permission should have a project ID' : function (permission) { 
                    		assert.ok(permission.project_id);
						},

						'and that permission should have the same feature bit mask' : function (permission) {
							assert.equal(permission.feature_bit_mask, 10101010);
						}
					},

					teardown : function (permission) {
						var callback = this.callback;
						setTimeout(function () { permissionDao.deleteById(permission.profile_id, permission.project_id, callback); }, 100);
					}
				},
				teardown : function (profile) {
					var callback = this.callback;
					setTimeout(function () { profileDao.deleteById(profile.profile_id, callback); }, 100);
				}
			},
			teardown : function (project) {
				var callback = this.callback;
				setTimeout(function () { projectDao.deleteById(project.project_id, callback); }, 100);
			}
        }
    }
}).export(module);
