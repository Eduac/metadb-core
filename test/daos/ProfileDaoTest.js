var assert = require('assert')
,	pg = require('pg')
,	profileDao = require('../../models/dao/ProfileDao');
	
assert.equal(profileDao.findByIdQuery, 'SELECT * FROM profiles WHERE profile_id = $1');
assert.ok(profileDao.findById);

profileDao.findById('8b46bfa0-193b-11e1-bddb-0800200c9a66', function (profiles) {
	assert.equal(profiles.length, 1);
	assert.ok(profiles[0]);
	assert.equal(profiles[0].username, 'long');
});

var profile = {
	username : 'test_user',
	first_name : 'Test',
	last_name : 'User',
	email : 'test_user@test.com',
	password : 'justTesting'
}
profile = profileDao.create(profile, function () {
	profileDao.findById(profile.profile_id, function (profiles) {
		assert.equal(profiles.length, 1);
		assert.ok(profiles[0]);
		profileDao.deleteById(profiles[0].profile_id, function () {
			profileDao.findById(profiles[0].profile_id, function (pros) {
				assert.equal(pros.length, 0);
				pg.end();
			});
		});	
	});
});
	

assert.ok(profile.profile_id);
