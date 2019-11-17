var mongoose = require('mongoose'),
    mongoosePaginate = require('mongoose-paginate'),
    Schema = mongoose.Schema;

var schema = new Schema({
    name : {type : Schema.Types.ObjectId, ref:'User'},
    title : {type : String, trim : true, required : true},
    content : {type : String, trim : true, required : true},
    reg_date:{type: Date, default:Date.now}
    
}, {
    toJSON: {virtuals : true},
    toObject: {virtuals : true}
});

schema.plugin(mongoosePaginate);

var Post = mongoose.model('Post', schema);

module.exports = Post;