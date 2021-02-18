var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true, min:8},
    date: {type: String, default: Date.now},
    studyGuides: [{type: Schema.Types.ObjectId, ref: 'StudyGuide'}],
    friends: [{type: Schema.Types.ObjectId, ref: 'User'}],
    chats: [{type: Schema.Types.ObjectId, ref: 'Chat'}]
});

module.exports = mongoose.model('User', UserSchema);