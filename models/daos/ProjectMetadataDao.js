var CrudDao = require('./CrudDao')
,   _queries = {
        create : 'INSERT INTO project_metadata (project_id , derivative , width , height , brand , background_color, foreground_color) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        findById: 'SELECT * FROM project_metadata WHERE project_id = $1 AND derivative = $2',
        update : 'UPDATE project_metadata SET width = $3, height = $3, brand = $4, background_color = $5 WHERE project_id = $1 AND derivative = $2',
        deleteById : 'DELETE FROM project_metadata WHERE project_id = $1 AND derivative = $2',
        findAllByProjectId : 'SELECT * FROM project_metadata WHERE project_id = $1'
    };

var ProjectMetadataDao = CrudDao.extend( {

    /******* Override *******/
    queries : _queries,
    objToQuery : function (obj) {
        return [    
            obj.project_id,
            obj.derivative,
            obj.width,
            obj.height,
            obj.brand,
            obj.background_color,
            obj.foreground_color
        ];
    },

    queryToObj : function (row) {
        return {
            project_id : row.project_id,
            derivative : row.derivative,
            width : row.width,
            height : row.height,
            brand : row.brand,
            background_color : row.background_color,
            foreground_color : row.foreground_color
        };
    },
    
    create : function (obj, callbackFn) {
        var _this = this;
        this.connect(function(err, client) {
            client 
                .query(_this.queries.create, _this.objToQuery(obj))
                .on('end', function() { _this.findById(obj.project_id, obj.derivative, callbackFn); });
        });
    },

    findById : function( project_id, derivative, callbackFn) {
        if (typeof callbackFn !== 'function') return;
        var _this = this;
        this.connect(function (err, client) {
            var object; 
            client
                .query(_this.queries.findById, [project_id, derivative])
                .on('row', function (row) { object = _this.queryToObj(row); })
                .on('end', function () { callbackFn(object); } );
        });
    },

    deleteById : function (project_id, derivative, callbackFn) {
        if (typeof callbackFn !== 'function') return;
        var _this = this;
        this.connect( function (err, client) {
            client.query(_this.queries.deleteById, [project_id, derivative], callbackFn);
        });
    },

    /******** Custom ********/

    findAllByProjectId : function (project_id, callbackFn) {
        if (typeof callbackFn !== 'function') return;
        var _this = this;
        this.connect(function (err, client) {
            var object;
            client
                .query(_this.queries.findAllByProjectId,[ project_id ])
                .on('row', function(row) { object = _this.queryToObj(row); })
                .on('end', function() { callbackFn(object); });
        });
    }
});
module.exports = new ProjectMetadataDao();
