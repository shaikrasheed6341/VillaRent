const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let reviewschema = new Schema({
    
    rating : {
        type:Number,
        min:1,
        max:5

    },
    comments : {type :String},
    createat : {
       type: Date,
       default:Date.now()
    }
});
module.exports = mongoose.model("Reviews",reviewschema)