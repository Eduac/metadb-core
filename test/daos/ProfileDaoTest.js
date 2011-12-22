var assert = require('assert')
,	pg = require('pg')
,	profileDao = require('../../models/dao/ProfileDao')
,	getTestProfile = function () {
		return {
			username : 'test_user',
			first_name : 'Test',
			last_name : 'User',
			email : 'test_user@test.com',
			password : 'justTesting'
		}	
};
	
assert.equal(profileDao.queries.findById, 'SELECT * FROM profiles WHERE profile_id = $1');
assert.ok(profileDao.findById);

profileDao.findById('8b46bfa0-193b-11e1-bddb-0800200c9a66', function (profile) {
	assert.ok(profile);
	assert.equal(profile.username, 'long');
});

var sample = getTestProfile();
profileDao.create(sample, function () {
	profileDao.findById(sample.profile_id, function (profile) {
		assert.ok(profile);
		profileDao.deleteById(profile.profile_id, function () {
			profileDao.findById(profile.profile_id, function (pro) {
				assert.ok(!pro);
				pg.end();
			});
		});	
	});
});