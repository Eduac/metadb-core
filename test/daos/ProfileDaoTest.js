var assert = require('assert')
,   vows = require('vows')
,   events = require('events')
,   profileDao = require('../../models/dao/ProfileDao')
,	getTestProfile = function () {
		return {
			username : 'test_user',
			first_name : 'Test',
			last_name : 'User',
			email : 'test_user@test.com',
			password : 'justTesting'
		};	
    };
	
vows.describe('ProfileDao').addBatch({
    'after initialization' : {
        'should have findById query' : function () {
            assert.equal(profileDao.queries.findById, 'SELECT * FROM profiles WHERE profile_id = $1');            
        },
        'should inherit findById method' : function () {
            assert.ok(profileDao.findById);            
        },
        'after finding user long' : {
            topic : function () {
                var promise = new events.EventEmitter();
                profileDao.findById('8b46bfa0-193b-11e1-bddb-0800200c9a66', function (profile) {
                    promise.emit('success', profile);
                });
                return promise;
            },
            'should find it' : function (profile) { assert.ok(profile); },
            'should find a profile w/ match name' : function (profile) {
                assert.equal(profile.username, 'long');            
            }
        },
        'after creating a sample profile' : {
            topic : function () {
                var promise = new events.EventEmitter();
                profileDao.create(getTestProfile(), function (profile) {
                    promise.emit('success', profile);
                });
                return promise;
            },
            'should return the profile with populated id' : function (profile) {
                assert.ok(profile.profile_id);
            },
            'should be able to find that profile from DB' : {
                topic : function (profile) {
                    var promise = new events.EventEmitter();
                    profileDao.findById(profile.profile_id, function (prof) {
                        promise.emit('success', prof);
                    });
                    return promise;
                },
                'and that profile should exist' : function (profile) { 
                    assert.ok(profile); 
                },
                'and that profile should have same username' : function (profile) { 
                    assert.equal(profile.username, 'test_user'); 
                },
                'and that profile should have no password' : function (profile) { 
                    assert.ok(!profile.password); 
                }
            },
            teardown : function (profile) {
                var callback = this.callback;
                setTimeout(function () { profileDao.deleteById(profile.id, callback) }, 100);
            }
        }
    }
}).export(module);
