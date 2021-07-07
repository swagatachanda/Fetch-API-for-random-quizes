const mongoose = require('mongoose')
// const quiz = require('./quiz')
// const express = require('express')
// const router = express.Router()

// router.get("/", async(req,res)=>{
//     res.send('This is questions page!!')
// })


const Questions = mongoose.Schema({
    category:{
        type: String,
        required: true,
    },
    type:{
        type:String,
        required: true
    },
    difficulty:{
        type: String,
        // required: true
    },
    question:{
        type: String,
        required: true,
    },
    correct_answer:{
        type: String,
        required: true
    },
    incorrect_answers:{
        type: [String],
        required: true
    },
    options:{
        type:[String],
        required: true
    }
})

const Answers = mongoose.Schema({
    quizId:{
        type: String,
        required: true,
        unique: true,
    },
    answers_det:{
        type: [Questions],
        required: true
    },
    
})


module.exports=mongoose.model('Answer', Answers)

