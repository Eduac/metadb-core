var uuid = require('node-uuid')
,	CrudDao = require('./CrudDao')
,	_queries = {
        create : 'INSERT INTO sessions (session_id, profile_id, expire_time) VALUES ($1, $2, $3)',
        findById : 'SELECT * FROM sessions WHERE session_id = $1',
        update : 'UPDATE sessions SET profile_id = $2, expire_time = $3 WHERE session_id = $1',
        deleteById : 'DELETE FROM sessions WHERE session_id = $1'
    }

,   _timeoutMap = { } ;

var SessionDao = CrudDao.extend( 
{
	/******* OVERRIDE ******/
	queries : _queries,
	objToQuery : function (obj) {
		return [
			obj.session_id,
			obj.profile_id,
		    obj.expire_time	
		];
	},
	queryToObj : function (row) {
		return {
            id : row.session_id,
            session_id : row.session_id,
			profile_id : row.profile_id,
			expire_time : row.expire_time
		};
	},
    create : function (obj, callbackFn) {
        var _this = this
        ,   utcTime = new Date().getUTCMilliseconds();
        /* Store the session ID into the map */
		_timeoutMap[obj.session_id] = setTimeout( function() {
                _this.deleteById(obj.session_id);
            }, obj.expire_time-utcTime);

        obj.session_id = obj.id = uuid();
		this._super(obj, callbackFn);		
	},

    /******* CUSTOM *******/ 
    update : function(obj, callbackFn) {
        var _this = this
        ,   utcTime = new Date().getUTCMilliseconds();
        /* Reset the timer */
        clearTimeOut(_timeoutMap[obj.session_id]);

        /* Extend the session */
		_timeoutMap[obj.session_id] = setTimeout( function() {
                _this.deleteById(obj.session_id);
            }, obj.expire_time-utcTime);

        this._super(obj, callbackFn);
    }
});
module.exports = new SessionDao();
