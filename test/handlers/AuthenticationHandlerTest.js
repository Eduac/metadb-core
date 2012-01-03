var server = require('../../server')
,   http = require('http')
,   events = require('events')
,   vows = require('vows')
,   assert = require('assert')
,   Helper = require('./helper')
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
            'should produce a response' : {
                topic : Helper.parseResponse,
                'that has a valid uuid' : function (jsonRes) {
                    assert.ok(jsonRes.result);
                }
            }
        },
        'when authenticate user random' : {
            topic : function () {
                var promise = new(events.EventEmitter),
                    options = Helper.getOptions();
                options.method = 'GET';
                options.path = "/" + Helper.sampleGetRequest("AuthenticationHandler.authenticate", ['random', 'whatever'], 2);
                http.request(options, function (res) { promise.emit('success', res); }).end();
                return promise;
            },
            'should produce a response' : {
                topic : Helper.parseResponse,
                'that has a null uuid' : function (jsonRes) {
                    assert.ok(!jsonRes.result);
                }
            }
        }
    }    
}).addBatch({
    'ultimate teardown' : function () {
        server.close();
    }
}).export(module);


