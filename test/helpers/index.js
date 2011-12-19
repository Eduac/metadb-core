process.env.NODE_ENV = 'test';

module.exports = 
    {
        server: require("./server_helpers.js"),
        test: require("./test_helpers.js"),
        model: require("./test_models.js")
    };
