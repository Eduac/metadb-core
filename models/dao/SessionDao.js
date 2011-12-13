var uuid = require('node-uuid');
var pg = require('pg');
var connectionString = "postgres://metadb_rw:metadb@localhost:5432/metadb";

var SessionDao = (function () { 
    return {
        name: 'SessionDao',
        createSession: function (profile_id) {
            var session_id = uuid();
            pg.connect(connectionString, function(err, client) {
                client.query('INSERT INTO sessions (session_id, profile_id, expire_time) '+
                             ' VALUES( $1, $2, $3)', 
                            [ session_id, profile_id, 3600000 ]
                            );
            });
            return session_id;
        },

        destroySession: function () {}
    }
})();
module.exports = SessionDao;
















