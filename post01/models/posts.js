var mongoose = require('mongoose'),
    mongoosePaginate = require('mongoose-paginate'),
    Schema = mongoose.Schema;

var schema = new Schema({
    id : {type : Schema.Types.ObjectId, ref:'User'},
    title : {type : String, trim : true, required : true},
    content : {type : String, trim : true, required : true},
    tags: [String],

    numLikes: {type: Number, default: 0},
    numAnswers : {type : Number, default: 0},
    numReads : {type: Number, default:0},
    createdAt:{type: Date, default:Date.now}
}, {
    toJSON: {virtuals : true},
    toObject: {virtuals : true}
});

schema.plugin(mongoosePaginate);

var Post = mongoose.model('Post', schema);

module.exports = Post;