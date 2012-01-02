var assert = require('assert')
,   vows = require('vows')
,   events = require('events')
,   authenticationDao = require('../../models/dao/AuthenticationDao');
	
vows.describe('AuthenticationDao').addBatch({
    'after initialization' : {
        'when authenticate user long' : {
            topic : function () {
                var p = new events.EventEmitter();
                authenticationDao.authenticate('long', 'long', function (passed) {
                    p.emit('success', passed);
                });
                return p;
            },
            'should pass' : function (passed) {
                assert.ok(passed);
            }
        }
    }
}).export(module);
