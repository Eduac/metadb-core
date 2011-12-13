var uuid = require('node-uuid');
var pg = require('pg');
var connectionString = "postgres://metadb_rw:metadb@localhost:5432/metadb";

var SessionDao = (function () {
	var _client = new pg.Client(connectionString);
	 
    return {
        create: function (profile_id, callbackFn) {
            var session_id = uuid()
            ,	query;
            query = _client.query('INSERT INTO sessions (session_id, profile_id, expire_time) '+
                             ' VALUES( $1, $2, $3)', 
                            [ session_id, profile_id, 3600000 ]
                            );
            query.on('row', function() { callbackFn(session_id); });
        },

        destroySession: function () {}
    }
})();
module.exports = SessionDao;
















