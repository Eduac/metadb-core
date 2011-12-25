var assert = require('assert')
,   uuid = require('node-uuid')
,   assert = require('assert')
,   vows = require('vows')
,   events = require('events')
,   createdProfileIds = []
,   profileDao = require('../models/dao/ProfileDao')
,    getTestProfile = function () {
		return {
			username : 'test_user',
			first_name : 'Test',
			last_name : 'User',
			email : 'test_user@test.com',
			password : 'justTesting'
		};	
    }
,   controller = new events.EventEmitter();


profileDao.create(getTestProfile(), function (profile) { 
    assert.ok(profile);
    profileDao.deleteById(profile.id, function () {
        console.log('deleted sth');
        profileDao.shutdown();
    });
});
