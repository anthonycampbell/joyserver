var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChatSchema = new Schema({
    participants: [{type: Schema.Types.ObjectId, ref: 'User'}],
    messages: [{type: Schema.Types.ObjectId, ref: 'Message'}]
});

module.exports = mongoose.model('Chat', ChatSchema);