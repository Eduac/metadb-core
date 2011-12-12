var njrpc = require('njrpc'),
	http = require('http'),
	AuthInterceptor = require('./models/AuthInterceptor'),
	PORT = 3000;

var daoList = { 
    AuthenticationDao : (require('./models/dao/AuthenticationDao')),
    VocabDao : (require('./models/dao/VocabDao')),
    ProfileDao: (require('./models/dao/ProfileDao'))   
    };

var handlers = [ 
        //(require('./models/handlers/AuthenticationHandler'))(daoList),
        //(require('./models/handlers/VocabHandler'))(daoList)
    ];

var services = {
    };

njrpc.register(
    handlers
);
	
http.createServer(function (req, res) {
	njrpc.handle(req, res, AuthInterceptor.process);
}).listen(PORT);

