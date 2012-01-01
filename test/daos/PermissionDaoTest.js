var assert = require('assert')
,   vows = require('vows')
,   events = require('events')
, 	profileDao = require('../../models/dao/ProfileDao')
, 	permissionDao = require('../../models/dao/PermissionDao')
,	projectDao = require('../../models/dao/ProjectDao')
, 	_profile_id
, 	_project_id
, 	getTestProject = function () {
		return { 
			name : 'test_project',
			description : 'test',
			branding_text : 'test_brand'
		};
	}

, 	getTestProfile = function () {
		return {
			username : 'test_user',
			first_name : 'Test',
			last_name : 'User',
			email : 'test_user@test.com',
			password : 'justTesting'
		};
	};

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

        'after creating a sample project' : {
			topic : function () {
                var promise = new events.EventEmitter();
				projectDao.create(getTestProject(), function (project) {
					_project_id = project.project_id;
					promise.emit('success', project);
				});
				return promise;
			},
			'after creating a sample profile' : {
				topic : function () {
					var promise = new events.EventEmitter();
					profileDao.create(getTestProfile(), function(profile) {
						_profile_id = profile.profile_id;
						promise.emit('success', profile);
					});
					return promise;
				},
				'after creating a sample permission' : { 
					topic : function () {
						var promise = new events.EventEmitter();
						permissionDao.create(
							{ 
								project_id : _project_id, 
								profile_id : _profile_id,
								feature_bit_mask : 10101010
							},
							function(permission) {
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

                		'and that permission should have the same profile ID' : function (permission) { 
                    		assert.equal(permission.profile_id, _profile_id); 
                		},
						
                		'and that permission should have the same project ID' : function (permission) { 
                    		assert.equal(permission.project_id, _project_id);
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
