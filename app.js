//express intilization
const express = require('express')
//moongose intilization
const mongoose = require('mongoose');
//requiring  listing from models files
const listing = require('./models/listing')
//require path for views
const path = require('path')
//method overide is used for deleta and put and patch request
const methodOverride = require('method-override')
//requring ejs 
const ejsmate = require('ejs-mate');
//requiring another model for reviews from models file
const Review = require('./models/review');
//requiring for session 
const session = require('express-session')
//requiring flash which is used to short message  to display
const flash = require('connect-flash')
//requiring passport for authication npm package
const passport = require('passport')
//which is used to support passport
const LocalStrategy = require('passport-local');
//requing another model for user auth cation form model file
const User = require('./models/user');
//the middleware which is used to userlogin or not to cehck we used
const { isloggedin } = require("./midlleware");
const { error } = require('console');




const app = express()
const port = 3001
//mongodb conecction establishment
main().then((res) => {
  console.log("it is connected to db")
}).catch(err => console.log(err));


async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/villarent');


}

//session file which is used in middlewaer session

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

//using session and flash
app.use(session(sessionfile))
app.use(flash())

//passport intilization 
app.use(passport.initialize())
//using passport session
app.use(passport.session())

//configuration passport file
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//for views intiliztion engine
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, 'views'));




//middleware
app.use(methodOverride("_method"));
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/images')));
app.use(express.json()); // Parses JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded bodies (form data)



//for flash middleware of sucess
app.use((req, res, next) => {
  res.locals.success = req.flash("success")
  res.locals.err = req.flash("err")
  res.locals.currentuser = req.user
  next()
})

//get request for  rendering signup form./views/users/singnup
app.get('/signup', (req, res) => {
  res.render('./users/signup.ejs')
})
//singup post request form 
app.post('/signup', async (req, res) => {
  try {
    let { username, email, password } = req.body;//requiring
    const newuser = new User({ username, email })//creating new user
    let regesteruser = await User.register(newuser, password)//registermehtod  of passport
    console.log(regesteruser)
    req.flash("success", "Welcome to VillaRent");
    res.redirect('/login')

  } catch (e) {
    req.flash("error", "error.e")
    res.redirect('/signup')
  }

})
//login setup get request render the form
app.get('/login', (req, res) => {
  res.render('./users/login.ejs')
})

//post request to sudmit the login form
//passport authication uses serial and dessserial wich presernt user or not
app.post('/login', passport.authenticate('local', { failureflash: true, failureRedirect: '/login' })
  , (req, res) => {
    res.redirect('/listing')
  })


//logout from user using passport logout
app.get('/logout', (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err)
    }

    req.flash("sucess", "you logout sucessfullly");
    res.redirect('/listing')
  });

})



//rendering the index route which is displaying the list 
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
app.get('/listing/new', isloggedin, (req, res) => {

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
app.post('/listing', isloggedin, async (req, res) => {
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

//edit list
app.get('/listing/:id/edit', isloggedin, async (req, res) => {
  let { id } = req.params;
  const list = await listing.findById(id)
  res.render('listing/edit', { list })
})
//update list
app.put('/listing/:id', isloggedin, async (req, res) => {
  let { id } = req.params;
  await listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listing/${id}`); // Use backticks for template literals
});
//delete route
app.delete('/listing/:id', isloggedin, async (req, res) => {
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
app.delete('/listing/:id/review/:reviewid', isloggedin, async (req, res) => {
  let { id, reviewid } = req.params;
  await listing.findByIdAndUpdate(id, { $pull: { review: reviewid } });
  await Review.findById(reviewid);
  res.redirect(`/listing/${id}`)
})






app.listen(port, () => console.log(`Example app listening on port ${port}!`));