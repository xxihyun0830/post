var mongoose = require('mongoose'),
    mongoosePaginate = require('mongoose-paginate'),
    Schema = mongoose.Schema;

var schema = new Schema({
  // id : {type: Number, default: 1}, //id는 게시글 번호 , 즉 글번호 
  name: { type: Schema.Types.ObjectId}, 
  title: {type: String, trim: true, required: true},
  content: {type: String, trim: true, required: true},
  reg_date: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});
schema.plugin(mongoosePaginate);
var Post = mongoose.model('Post', schema);

module.exports = Post;
