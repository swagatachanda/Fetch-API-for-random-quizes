const expresss = require('express')
const mongoose = require('mongoose')
const API = require('./routes/apiroutes')
const User = require('./routes/user')

const app = expresss()

require('dotenv').config()

app.use('/api',API)
app.use('/user',User)

app.use(expresss.static(__dirname+'/css'))
app.set('view engine', 'ejs')

app.get('/',async(req,res)=>{
    res.render("userpage")
})
app.get("/signup",async(req,res)=>{
    res.render("signup")
})

mongoose.connect(process.env.DB_CONNECTION,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:false
})

app.listen(process.env.PORT || 3000)