var mongoose = require('mongoose'),
    mongoosePaginate = require('mongoose-paginate'),
    Schema = mongoose.Schema;

var schema = new Schema({
    name : {type: Schema.Types.ObjectId, ref: 'User'},
    post: {type: Schema.Types.ObjectId, ref: 'Post'},
    content : {type:String, trim: true, required : true},
    reg_date: {type:Date, default: Date.now}
    
},{
    toJSON : {virtuals: true},
    toObject: {virtuals: true}
});

schema.plugin(mongoosePaginate);
var Comment = mongoose.model('Comment',schema);

module.exports = Comment;