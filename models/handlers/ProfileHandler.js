var ProfileHandler = function (profileDao) {
    return {
        name : 'ProfileHandler', 
        
        getAllUsers: function (outFn) {
          profileDao.getAllUsers(outFn);
        },

        create: function (profile, outFn) {
                profileDao.create(profile, outFn);
        },
        
        findById: function (id, outFn) {
         console.log(id);
          profileDao.findById(id, outFn);
        },
        
        update: function (vocabId, contents) {
            //blah
        },
        
        deleteById: function (id, reason) {
            //blah
        }
    }
}
module.exports = ProfileHandler;
