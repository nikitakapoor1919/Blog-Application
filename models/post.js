var mongoose=require('mongoose')
var Schema=mongoose.Schema
const moment=require('moment')

const PostSchema = new mongoose.Schema({
    text: {
      type: String,
      required: true
    },
    photo: {
      type: String
    },
    likes: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
    comments: [{
      text: String,
      created: { type: Date, default: Date.now },
      postedBy: { type: String, ref: 'User'}
    }],
    postedBy: {type: String, ref: 'User'},
    created: {
      type: Date,
      default: moment(Number( moment().valueOf().toString())).format(' YYYY-MM-DD h:mm A')
    }
  })

  module.exports=mongoose.model('post',PostSchema);
