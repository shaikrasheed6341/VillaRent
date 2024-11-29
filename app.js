const express = require('express')
const mongoose = require('mongoose');
const listing = require('./models/listing')


const app = express()
const port = 3000;




app.get('/testlisting', async (req, res) => {
  let newlisting = new listing({
    tittle: "hyderabad villa",
    description: "it  is located in hyd  ",
    price: 1200,
    location: "hyderabad",
    country: "india"

  });
  await newlisting.save();
  console.log("new listing was saved")
  res.send("your list was sucess fully saved")

})

app.get('/', (req, res) => res.send('Hello World!')); 
app.listen(port, () => console.log(`Example app listening on port ${port}!`));