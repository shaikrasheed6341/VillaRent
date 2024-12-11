const express = require('express')
const mongoose = require('mongoose');
const listing = require('./models/listing')
const path = require('path')
const methodOverride = require('method-override')
const ejsmate = require('ejs-mate');
const Review = require('./models/review');
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local');
const User = require('./models/user');




const app = express()
const port = 3001

main().then((res) => {
  console.log("it is connected to db")
}).catch(err => console.log(err));


async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/villarent');


}

//session

const sessionfile = {
  secret: "my secretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    Expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60,
    httpOnly: true

  }
};

//using flash
app.use(session(sessionfile))
app.use(flash())

//passport intilization 
app.use(passport.initialize())
app.use(passport.session())
//configuration passport 

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, 'views'));





app.use(methodOverride("_method"));
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/images')));
app.use(express.json()); // Parses JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded bodies (form data)




app.use((req, res, next) => {
  res.locals.success = req.flash("success")
  next()
})
// //pasport route
// app.get('/demouser', async (req, res) => {
//   let fakeuser = new User({
//     email: "shaikrasheed@gmail.com",
//     username :"shaikrasheed"

//   })
//    let regerseduser = await User.register(fakeuser,"shaikraheed");
//    res.send(regerseduser)
// })
//user get 
app.get('/signup', (req,res)=>{
  res.render('./users/signup')
})
app.post('/signup', async(req,res)=>{
 let {username,email,password } =req.body;
  const newuser = new User ({username,email})
  let regesteruser = await User.register(newuser,password)
  console.log(regesteruser)
  req.flash("success", "Welcome to VillaRent");
  res.redirect('/listing')

})

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
  const list = await listing.findById(id).populate("review")
  res.render('listing/show', { list })
})
//add newlist
app.post('/listing', async (req, res) => {
  try {
    let newlisting = new listing(req.body.listing);

    await newlisting.save();
    req.flash("success", "new list added ");
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
app.post('/listing/:id/review', async (req, res) => {
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
app.delete('/listing/:id/review/:reviewid', async (req, res) => {
  let { id, reviewid } = req.params;
  await listing.findByIdAndUpdate(id, { $pull: { review: reviewid } });
  await Review.findById(reviewid);
  res.redirect(`/listing/${id}`)
})






app.listen(port, () => console.log(`Example app listening on port ${port}!`));