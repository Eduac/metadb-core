var njrpc = require('njrpc')
,	http = require('http')
,	AuthInterceptor = require('./models/AuthInterceptor')
,	PORT = 3000

,	daoList = { 
    	AuthenticationDao : require('./models/dao/AuthenticationDao'),
	    VocabDao : require('./models/dao/VocabDao'),
	    ProfileDao: require('./models/dao/ProfileDao'),
	    SessionDao: require('./models/dao/SessionDao')   
	}

,	handlers = [ 
		new (require('./models/handlers/AuthenticationHandler'))(daoList.AuthenticationDao, daoList.SessionDao, daoList.ProfileDao),
		new (require('./models/handlers/VocabHandler'))(daoList.VocabDao)
    ];

njrpc.register(handlers);
	
exports.start = function(port) { 
	port = port || PORT;

	http.createServer(function (req, res) {
		njrpc.handle(req, res, AuthInterceptor.process);
	}).listen(port);
}
