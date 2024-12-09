const express = require('express')
const mongoose = require('mongoose');
const listing = require('./models/listing')
const path = require('path')
const methodOverride = require('method-override')
const ejsmate = require('ejs-mate');
const Review = require('./models/review');




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
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/images')));



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

// //review validatrion 
// const validatereview = (req,res,next)=>{
//   let{error}=reviewschema.validate(req.body)
//   if(error){
//     let errormsg = error.details.map((el)=>el.message).join(",") ;
//     throw new expresserror(400,errormsg)
//   }else{
//     next();
//   }
// }


//show route 
app.use(express.urlencoded({ extended: true }));
app.get('/listing/:id', async (req, res) => {
  let { id } = req.params;
  const list = await listing.findById(id).populate("review")
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
app.get('/listing/:id/edit', async (req, res) => {
  let { id } = req.params;
  const list = await listing.findById(id)
  res.render('listing/edit', { list })
})
//update
app.put('/listing/:id', async (req, res) => {
  let { id } = req.params;
  await listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listing/${id}`); // Use backticks for template literals
});
//delete route
app.delete('/listing/:id', async (req, res) => {
  try {
    let { id } = req.params;

    let listdelete = await listing.findByIdAndDelete(id);
    console.log(listdelete)
    res.redirect('/listing')
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).send('Error creating listing');
  }


})

//revies
app.post('/listing/:id/review',  async (req,res)=>{
  let listings = await listing.findById(req.params.id);
  let newreview = new Review(req.body.review);
  listings.review.push(newreview)
  await newreview.save()
  await listings.save()
  console.log("review was saved")
  console.log("your listing is saved")
  res.redirect(`/listing/${listings._id}`)
 
 
})
//reviews delet route
app.delete('/listing/:id/review/:reviewid', async(req,res)=>{
 let{id,reviewid}=req.params;
 await listing.findByIdAndUpdate(id,{$pull :{review:reviewid}});
 await Review.findById(reviewid);
 res.redirect(`/listing/${id}`)
})


//add newlist 
//creating post request
// app.post('/listing',async(req,res)=>{
//   let newlisting =  new listing(req.body.listing);
//    await newlisting.save()
//    res.redirect('/listing');
// }) 
// app.use((err, req, res, next) => {
//   const status = err.status || 500; // Default to 500 if no status is provided
//   const message = err.message || 'Something went wrong'; // Default message if no message is provided
//   console.error(`[Error ${status}] ${message}`); // Log the error for debugging
//   res.status(status).send(message);
// });





app.listen(port, () => console.log(`Example app listening on port ${port}!`));