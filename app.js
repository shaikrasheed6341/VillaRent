const express = require('express')
const mongoose = require('mongoose');
const listing = require('./models/listing')
const path = require('path')
const methodOverride = require('method-override')
const ejsmate = require('ejs-mate')



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
app.use(methodOverride("_method"));
app.engine('ejs', ejsmate);
app.use(express.static (path.join(__dirname,'/public')));



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
    res.render('listing/index', { alllisting });  // Ensure you don't use '.ejs' here; EJS extension is implicit.
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).send('Error fetching listings');
  }
});
//adding new listing
app.get('/listing/new', (req, res) => {
  res.render('listing/new.ejs')
})


//show route 
app.use(express.urlencoded({ extended: true }));
app.get('/listing/:id', async (req, res) => {
  let { id } = req.params;
  const list = await listing.findById(id)
  res.render('listing/show', { list })
})
//add newlist
app.post('/listing', async (req, res) => {
  try {
    let newlisting = new listing(req.body.listing);
    await newlisting.save();
    console.log(newlisting)
    res.redirect('/listing');
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).send('Error creating listing');
  }
});
 
//edit
app.get('/listing/:id/edit',async(req,res)=>{
  let { id } = req.params;
  const list = await listing.findById(id)
  res.render('listing/edit',{list})
})
//update
app.put('/listing/:id', async (req, res) => {
  let { id } = req.params;
  await listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listing/${id}`); // Use backticks for template literals
});
//delete route
app.delete('/listing/:id', async (req,res)=>{
  let { id } = req.params;
  let listdelete = await listing.findByIdAndDelete(id);
  console.log(listdelete)
  res.redirect('/listing')

})


//add newlist 
//creating post request
// app.post('/listing',async(req,res)=>{
//   let newlisting =  new listing(req.body.listing);
//    await newlisting.save()
//    res.redirect('/listing');
// }) 




app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));