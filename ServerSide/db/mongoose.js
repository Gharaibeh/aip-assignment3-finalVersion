var mongoose = require('mongoose')
var db = mongoose.connect("mongodb://localhost:27017/main", {
    useMongoClient: true,
    /* other options */
})
mongoose.Promise = global.Promise;
module.exports = mongoose