const express = require('express')
const mongoose = require('mongoose');
const listing = require('./models/listing')
const path = require('path')



const app = express()
const port = 3001

main().then((res) => {
    console.log("it is connected to db")
  }).catch(err => console.log(err));
  
  
  async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/villarent');
  
  
}




app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, 'views'));




// app.get('/testlisting', async (req, res) => {
//   let newlisting = new listing({
//     tittle: "hyderabad villa",
//     description: "it  is located in hyd  ",
//     price: 1200,
//     location: "hyderabad",
//     country: "india"

//   });
//   await newlisting.save();
//   console.log("new listing was saved")
//   res.send("your list was sucess fully saved")

// })
// app.get('/listing',async(req,res)=>{
//     let alllisting = await listing.find({})
//     console.log(alllisting)
//     res.render('listing/index.ejs',{alllisting})
// })

//index route
app.get('/listing', async (req, res) => {
  try {
      let alllisting = await listing.find({});  // Corrected variable name
      console.log(alllisting);  // Check if this is printing the listings.
      res.render('listing/index', { alllisting });  // Ensure you don't use '.ejs' here; EJS extension is implicit.
  } catch (error) {
      console.error('Error fetching listings:', error);
      res.status(500).send('Error fetching listings');
  }
});

//show route 
app.use(express.urlencoded({ extended: true }));
app.get('/listing/:id',async(req,res)=>{
  let{id} = req.params;
  const list = await listing.findById(id)
  res.render('listing/show',{list})
})


app.get('/', (req, res) => res.send('Hello World!')); 
app.listen(port, () => console.log(`Example app listening on port ${port}!`));