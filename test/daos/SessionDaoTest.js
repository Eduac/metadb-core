var assert = require('assert')
,   vows = require('vows')
,   events = require('events')
,   sessionDao = require('../../models/daos/SessionDao')
,	getTestSession= function () {
		return {
            profile_id : '8b46bfa1-193b-11e1-bddb-0800200c9a66',
            expire_time : new Date().getUTCMilliseconds()+5000
        };	
    };
	
vows.describe('SessionDao').addBatch({
    'after initialization' : {
        'should have findById query' : function () {
            assert.equal(sessionDao.queries.findById, 'SELECT * FROM sessions WHERE session_id = $1');            
        },
        'should inherit findById method' : function () {
            assert.ok(sessionDao.findById);            
        },
        
        'after creating a sample session' : {
            topic : function () {
                var promise = new events.EventEmitter();
                sessionDao.create(getTestSession(), function (session) {
                    promise.emit('success', session);
                });
                return promise;
            },
            'should return the session with populated id' : function (session) {
                assert.ok(session.session_id);
            },
            'should be able to find that session from DB' : {
                topic : function (session) {
                    var promise = new events.EventEmitter();
                    sessionDao.findById(session.session_id, function (session) {
                        promise.emit('success', session);
                    });
                    return promise;
                },
                'and that session should exist' : function (session) { 
                    assert.ok(session); 
                },
                'and that session should have same profile ID' : function (session) { 
                    assert.equal(session.profile_id, '8b46bfa1-193b-11e1-bddb-0800200c9a66'); 
                },
                'and that session should have a valid expire time' : function (session) { 
                    assert.ok(session.expire_time);
                },
								'and that session should destroy itself after the expire time has passed' : function (session) {
										setTimeout( function() { assert.ok(!SessionDao.findById(session.session_id)); }, 5000);
								}
            },
            teardown : function (session) {
                var callback = this.callback;
                setTimeout(function () { sessionDao.deleteById(session.id, callback); }, 100);
            }
        }
    }
}).export(module);
