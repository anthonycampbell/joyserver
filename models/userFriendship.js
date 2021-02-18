var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserFriendshipSchema = new Schema({
    requester: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: Number, required: true }
});

module.exports = mongoose.model('UserFriendship', UserFriendshipSchema);