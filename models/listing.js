const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;


const listeingschema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
     image: {
        filename: { type: String, default : null},
        url: { type: String ,required : true} 
      },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    review:[{
        type: Schema.Types.ObjectId,
        ref:"Reviews"
    }]
});

const listing = mongoose.model('listing', listeingschema);
module.exports = listing;
