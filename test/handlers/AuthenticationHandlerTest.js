var server = require('../../server')
,   http = require('http')
,   events = require('events')
,   vows = require('vows')
,   assert = require('assert')
,   Helper = require('./helper')
,   authenticationHandler = require('../../models/handlers/AuthenticationHandler')
,   PORT = 4000;

vows.describe('AuthenticationHandler').addBatch({
    'after server started' : {
        topic: function () {
            server.listen(PORT, 'localhost', this.callback);
        },
        'when authenticate user long' : {
            topic : function () {
                var promise = new(events.EventEmitter),
                    options = Helper.getOptions();
                options.method = 'GET';
                options.path = "/" + Helper.sampleGetRequest("AuthenticationHandler.authenticate", ['long', 'long'], 2);
                http.request(options, function (res) { promise.emit('success', res); }).end();
                return promise;
            },
            'should pass' : function (uuid) {
                assert.ok(uuid);
            }
        }
    }    
}).addBatch({
    'ultimate teardown' : function () {
        server.close();
    }
}).export(module);


