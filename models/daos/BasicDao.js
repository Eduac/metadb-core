var pg = require('pg')
,   Class = require('../Class')
,   BasicDao = Class.extend({
    init: function() {
        this.connString = 'postgres://metadb_rw:metadb@localhost:5432/metadb';
        this.pg = pg;
    },
    connect: function(callbackFn) {
        pg.connect(this.connString, callbackFn);
    },
    shutdown: function () {
        this.pg.end();
    }
});

module.exports = BasicDao;
    