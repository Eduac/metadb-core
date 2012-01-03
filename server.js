var njrpc = require('njrpc')
,	http = require('http')
,	AuthInterceptor = require('./models/AuthInterceptor')
,	PORT = 5000
,   START = false
,   args = process.argv
,	daoList = { 
    	AuthenticationDao : require('./models/daos/AuthenticationDao'),
	    VocabDao : require('./models/daos/VocabDao'),
	    ProfileDao: require('./models/daos/ProfileDao'),
	    SessionDao: require('./models/daos/SessionDao')   
	}

,	handlers = [ 
		new (require('./models/handlers/AuthenticationHandler'))(daoList.AuthenticationDao, daoList.SessionDao, daoList.ProfileDao),
		new (require('./models/handlers/VocabHandler'))(daoList.VocabDao)
    ];

njrpc.register(handlers);

var server = http.createServer(function (req, res) {
    njrpc.handle(req, res, AuthInterceptor.process);
});


for (var i = 0; i < args.length; i++) {
    if (args[i] == '-p') {
        i++;
        START = true;
        PORT = args[i] || PORT;            
    }
}
console.log('Starting server on port ' + PORT);
if (START) server.listen(PORT);

module.exports = server;
