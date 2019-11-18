var mongoose = require('mongoose'),
    mongoosePaginate = require('mongoose-paginate'),
    Schema = mongoose.Schema;

var schema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  bor: { type: Schema.Types.ObjectId, ref: 'Bor' },
  content: {type: String, trim: true, required: true},
  reg_date: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});
schema.plugin(mongoosePaginate);
var Answer = mongoose.model('Answer', schema);

module.exports = Answer;
