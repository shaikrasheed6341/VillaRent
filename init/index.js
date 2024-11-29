const mongoose = require('mongoose')
const ToData = require('./data.js')
const listing = require('../models/listing');

main().then((res) => {
    console.log("it is connected to db")
  }).catch(err => console.log(err));
  
  
  async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/villarent');
  
  
}
const newdata = async ()=>{
    await listing.deleteMany({});
    await listing.insertMany(ToData.data);
    console.log("data was sucefully intilizedd")
}
newdata();
