const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const dbName = 'TodoApp';

const uri = `mongodb+srv://sabri:OD2o0GOGtXoeuPil@cluster0.znry1.mongodb.net/${dbName}?retryWrites=true&w=majority`;
const url = 'mongodb://localhost:27017/' + dbName;
mongoose.connect(uri || url);

module.exports = {
    mongoose
}