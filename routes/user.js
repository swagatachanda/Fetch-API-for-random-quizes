const express = require('express')
const fetch = require('node-fetch')
const user = require('../models/login')
const quiz = require('../models/quiz')
const bcrypt=require('bcrypt')
const validateUser=require('../functions/validateuser')
const router = express.Router()


router.use(express.json())


const validateQuizID= async (id)=>{
    try{
        const response=await Quiz.findById(id)
        if(response != null)
            return true
        return false
    }
    catch(err)
    {
        console.log(err);
    }   
}

router.post('/signup',async(req,res)=>{
    console.log(req.body)
    var status={}
    try
    {
        try{
            var hashedPassword= await bcrypt.hash(req.body.password,10)
        }
        catch(err){
            res.json({'status' : false, 'error' : err, 'code' : 21}) 
        }
        status.status=true
    const User = new user({
        username: req.body.username,
        Name : req.body.Name,
        password : hashedPassword,
        mail :req.body.mail
    })
    try{
        const newuser= await User.save();
        status.data=newuser;
    }
    catch(err){
        status.status=false;
        if(err.code)
            status.code=err.code;
        else    
            status.code=12
        status.error=err.message
        console.log(err)
    }
    }
    catch(err){
        console.log(err)
    }
    res.json(status)
})
router.post('/login',async(req,res)=>{
    if(req.body.username===undefined) {return res.json({"status": false, "error" : "no username and password"})}
    try{
        
        const {status, error, code}=await validateUser(req.body.username, req.body.password)
        if(status==false)
            res.json({'status' : status, error, code})
        else{
            const searchUser= await user.findOne({'username': req.body.username})
            console.log(searchUser)
            // const quizdetails = await quiz.find({'userId':searchUser._id})
            // const url=`${req.protocol}://${req.get('host')}/api/getall/${searchUser[0]._id}`
            // const quesdetails = await fetch(url)
            // const result = await quesdetails.json()
            // console.log(result)
            // res.render("quizdetails",{data : searchUser})
        res.send({'data':searchUser})
            
            // res.json({"status": true, "data" : searchUser})
            // res.send(searchUser)
        
         }
        }
        catch(err){
            console.log(err)
        }
  
})

router.get('/getuser', async (req,res)=>{
    
    q={}
    try{
        const searchUser=await user.find(q)
        res.json(searchUser)
    }
    catch(err)
    {
        res.json({'status': false, 'error' : err, 'code': 103})
    }
})




module.exports=router