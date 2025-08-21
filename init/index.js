const mongoose = require('mongoose')
const ToData = require('./data.js')
const listing = require('../models/listing.js');

main().then((res) => { 
    console.log("it is connected to db")
  }).catch(err => console.log(err));
  
  
  async function main() {
    await mongoose.connect('mongodb+srv://shaikrasheed634:H1hSD4jntHrmztRW@cluster0.cahpons.mongodb.net/');
  
  
}
const newdata = async ()=>{
    await listing.deleteMany({});
    await listing.insertMany(ToData.data);
    console.log("data was sucefully intilizedd")
}
newdata();

