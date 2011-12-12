//Authenticate(): check against DB, return new sessionID(uuid) 
//return null if error
var uuid = require('node-uuid');
var sha1 = require('sha1');
var pg = require('pg').native;
var connectionString = "postgres://metadb_rw:metadb@localhost:5432/metadb";

var AuthenticationDao = (function () { 
    return {
        name: 'AuthenticationDao', 
        authenticate: function ( username, password ) {
            var hash = sha1(password);
            var correctHash = null;
            var query = pg.connect( connectionString, 
                                    function (err, client) {
                                        client.query(
                                                    'SELECT FROM profiles WHERE username = $1', 
                                                    [ username ]
                                                    );
                                    }
                        );

            query.on('row',
                     function(row) {
                        correctHash = row.password;
                    });
            
            //Check if hash matches.
            if (hash == correctHash) {
                return true;
                }
            else {
                return false;
                }
        }
    }
})();
module.exports = AuthenticationDao;


                
                

