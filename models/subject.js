var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SubjectSchema = new Schema({
    title: {type: String, required: true},
    fields: [{type: String, required: true}]
});

module.exports = mongoose.model('Subject', SubjectSchema);