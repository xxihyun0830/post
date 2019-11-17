var mongoose = require('mongoose'),
    mongoosePaginate = require('mongoose-paginate'),
    Schema = mongoose.Schema;

var schema = new Schema({
    id : {type: Schema.Types.ObjectId, ref: 'User'},
    posts: {type: Schema.Types.ObjectId, red: 'Post'},
    content : {type:String, trim: true, required : true},

    numLikes: {type: Number, default: 0},
    createdAt: {type:Date, default:Date.now}
},{
    toJSON : {virtuals: true},
    toObject: {virtuals: true}
});

schema.plugin(mongoosePaginate);
var Comment = mongoose.model('Comment',schema);

module.exports = Comment;