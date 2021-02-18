var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var StudyGuideSchema = new Schema({
    title: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    collaborators: [{type: Schema.Types.ObjectId, ref: 'User'}],
    subjects: [{type: Schema.Types.ObjectId, ref: 'Subject'}]
});

module.exports = mongoose.model('StudyGuide', StudyGuideSchema)