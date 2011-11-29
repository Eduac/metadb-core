var db = require('pg'),
	njrpc = require('njrpc'),
	http = require('http'),
	AuthInterceptor = require('./models/AuthInterceptor'),
	PORT = 3000;
	
njrpc.register([
	require('./models/handlers/AuthenticationHandler')
]);	
	
http.createServer(function (req, res) {
	njrpc.handle(req, res, AuthInterceptor.process);
}).listen(PORT);
	


