var CrudDao = require('./BasicDao').extend({
    queries: {
        create: '',
        findById: '',
        update: '',
        deleteById: ''
    },
    findById: function(id, callbackFn) {
        var _this = this;
        this.connect(function(err, client) {
            if (typeof callbackFn !== 'function') { return; }
            var object;
            client
                .query(_this.queries.findById, [id])
                .on('row', function(row) {
                    object = _this.queryToObj(row);
                })
                .on('end', function () { callbackFn(object); });
        });
    },
    create: function(obj, callbackFn) {
        var _this = this;
        this.connect(function(err, client) {
            client
                .query(_this.queries.create, _this.objToQuery(obj))
                .on('end', function () { _this.findById(obj.id, callbackFn); });
        });
    },
    update: function(obj, callbackFn) {
        var _this = this;
        this.connect(function(err, client) {
            client.query(_this.queries.update, _this.objToQuery(obj), callbackFn);
        });
    },
    deleteById: function(id, callbackFn) {
        var _this = this;
        this.connect(function(err, client) {
            client.query(_this.queries.deleteById, [id], callbackFn);            
        });
    },
    objToQuery: function() {
        return [];
    },
    queryToObj: function() {
        return {};
    }
});

module.exports = CrudDao;