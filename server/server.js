const express = require('express')
const app = express()
const port = 3000;
//var cookieParser = require('cookie-parser')
const session = require('express-session')
// app.use(session({
//     
// }))
const seestionoption = {
    secret: "thisismysecretcode",
         resave: false,
         saveUninitialized: true,
}
app.use(session(seestionoption))

app.get('/sign',(req,res)=>{
    let{name} = req.query;
    req.session.name = name;
    res.send(`welcome to ${name} our course`)
    res.redirect('/hello')
})
app.get('/hello',(req,res)=>{
    res.send(`say hello new user ${req.session.name}`)
})
// app.get('/reqcount',(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }
//     else{
//         req.session.count =1;
//     }
//     res.send( `your count is reached ${req.session.count}`)
   
// })


app.get('/test', (req, res) => {
    res.send("test is uces fully comennsdf")
})




app.listen(port, () => {
    `your port is working on ${port}`
})