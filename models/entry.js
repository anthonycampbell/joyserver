var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var EntrySchema = new Schema({
    subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    values: [{type: String}]
});

module.exports = mongoose.model('Entry', EntrySchema);