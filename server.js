var njrpc = require('njrpc'),
	http = require('http'),
	AuthInterceptor = require('./models/AuthInterceptor'),
	PORT = 3000;

var daos = { 
    //AuthenticationDao : new (require('./models/dao/AuthenticationDao'))(),
    VocabDao : (require('./models/dao/VocabDao'))
    };

var handlers = [ 
        (require('./models/handlers/AuthenticationHandler')),
        (require('./models/handlers/VocabHandler'))
    ];

var services = {
    };

njrpc.register(
    handlers
);
	
http.createServer(function (req, res) {
	njrpc.handle(req, res, AuthInterceptor.process);
}).listen(PORT);
	


