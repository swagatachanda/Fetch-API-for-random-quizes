const expresss = require('express')
const mongoose = require('mongoose')
const API = require('./routes/apiroutes')
const User = require('./routes/user')
const app = expresss()

require('dotenv/config')

app.use('/api',API)
app.use('/user',User)

app.use(expresss.static(__dirname+'/css'))
app.set('view engine', 'ejs')

app.get('/',async(req,res)=>{
    res.send('This is my app!!')
})

mongoose.connect(process.env.DB_CONNECTION,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:false
})

app.listen(process.env.port || 6500)