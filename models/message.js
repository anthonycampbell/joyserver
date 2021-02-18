var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    writer: {type: Schema.Types.ObjectId, ref:'User', required: true},
    data: {type: String, required: isRequired},
    date: {type: String, default: Date.now},
});

function isRequired(){
    return typeof this.data === 'string'? false : true
}

module.exports = mongoose.model('Message', messageSchema);