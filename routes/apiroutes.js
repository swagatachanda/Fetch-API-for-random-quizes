const express = require('express')
const details = require('../models/Details')
const quiz = require('../models/quiz')
const fetch = require('node-fetch')
const question = require('../models/questions')
const router = express.Router()



router.use('/details',details)
router.use('/ques',question)

router.use(express.json())

const map_difficulty = (value)=>{
    if(value=='Hard'){
        value='hard'
    }
    else if(value=='Medium'){
        value='medium'
    }
    else if(value=='Easy'){
        value='easy'
    }
    return value
}
const map_type = (value)=>{
    if(value=='True / False'){
        value='boolean'
    }
    else if(value=='Multiple Choice'){
        value='multiple'
    }
    return value
}
const map_category = (value)=>{
    if(value=='General Knowledge'){
        value=9
    }
    else if(value=='Books'){
        value=10
    }
    else if(value=='Film'){
        value=11
    }
    else if(value=='Computer Science'){
        value=18
    }
    else if(value=='Sports') {
        value=21
    }
    else if(value=='Music'){
        value=12
    }
    else{
        value=0
    }
    return value
}



router.get('/',async(req,res)=>{
    res.sendFile(__dirname+'/Views/frontpage.html')
})


router.post('/create',async(req,res)=>{
    console.log(req.body)
    const quesdet = new quiz({
        dot: new Date(),
        noofquestions: req.body.noofquestions,
        category: req.body.category,
        difficulty: req.body.difficulty,
        type: req.body.type,
        encoding: req.body.encoding
    })
    try{
        const newQuiz = await quesdet.save()
        const url = `${req.protocol}://${req.get('host')}/api/quiz/${newQuiz._id}`
        const resp = await fetch(url,{
            method: 'PATCH',
            headers: {
                'Content-Type':'application/json;charset=utf-8'
            } 
        })
        const json_res = await resp.json()
        console.log(json_res)
        res.send(json_res)
    }
    catch(err){
        res.json({'status': false, 'error': err, 'code':10})
    }
})




router.patch('/quiz/:quizId', async(req,res)=>{
    try{
        const quesdetails = await quiz.findById(req.params.quizId)
        console.log(quesdetails)
        const cat = map_category(quesdetails.category)
        const diff = map_difficulty(quesdetails.difficulty)
        const typ = map_type(quesdetails.type)
        let url = `https://opentdb.com/api.php?amount=${quesdetails.noofquestions}`
        if(cat==0&&typ=='Any Type'&&diff=='Any Difficulty'){
            url =  `https://opentdb.com/api.php?amount=${quesdetails.noofquestions}`
        }
        else if(cat==0&&diff=='Any Difficulty'){
           
            url = `https://opentdb.com/api.php?amount=${quesdetails.noofquestions}&type=${typ}`
            
        }
        else if(cat==0&&typ=='Any Type'){
           
            url = `https://opentdb.com/api.php?amount=${quesdetails.noofquestions}&difficulty=${diff}`
            
        }
        else if(diff=='Any Difficulty'&&typ=='Any Type')
        {
            url = `https://opentdb.com/api.php?amount=${quesdetails.noofquestions}&category=${cat}`
        }
        else if(cat==0){
            url = `https://opentdb.com/api.php?amount=${quesdetails.noofquestions}&difficulty=${diff}&type=${typ}`
        }
        else if(diff=='Any Difficulty'){
         
            url = `https://opentdb.com/api.php?amount=${quesdetails.noofquestions}&category=${cat}&type=${typ}`
        }
        else if(typ=='Any Type'){
        
            url = `https://opentdb.com/api.php?amount=${quesdetails.noofquestions}&category=${cat}&difficulty=${diff}`
        }
        
       else{
            url = `https://opentdb.com/api.php?amount=${quesdetails.noofquestions}&category=${cat}&difficulty=${diff}&type=${typ}`
            }
        
        console.log(url)
            const response = await fetch(url)
            const json = await response.json()
            console.log(json)
            console.log(json.results[0].incorrect_answers)
            console.log(quesdetails.noofquestions)
            
            newQuestions=[]
            json.results.map((item)=>{
                opt =[]
                var Newquestions={}
                opt = item.incorrect_answers 
                opt.push(item.correct_answer)
                console.log(opt)
                for (var i=0;i<opt.length;i++){
                j= Math.round(Math.random()*(opt.length-1))
                temp = opt[i]
                opt[i] = opt[j]
                opt[j] = temp
               
            }
            console.log(opt)
            Newquestions.category = item.category
            Newquestions.type = item.type
            Newquestions.difficulty = item.difficulty
            Newquestions.question = item.question
            Newquestions.correct_answer = item.correct_answer
            Newquestions.incorrect_answers = item.incorrect_answers
            Newquestions.options = opt
      
            newQuestions.push(Newquestions)
            })
    
            console.log(newQuestions)
            const questions = new question({
                quizId: req.params.quizId,
                answers_det: newQuestions
            })
            try{
                const newQues = await questions.save()
                res.json({'status': true, 'data': newQues})
            }
            catch(err){
                res.json({'status': false, 'error': err, 'code':30})
            }
           
    }
    catch(err){
        console.log(err)
    }
})

router.get('/quiz/:quizId', async(req,res)=>{
    try{
    const getques = await question.find({'quizId':req.params.quizId})
    sendQuestions=[]
    getques[0].answers_det.map((item)=>{
        var data={}
        data.question=item.question
        data.options=item.options
        data.correct_answer=item.correct_answer
        sendQuestions.push(data)
    })
   
    
    res.render("quizpage", {data:sendQuestions})
    }
    catch(err)
    {
        res.json({'status': false, 'error' : err, 'code': 103})
    }
})

router.get('/getall',async(req,res)=>{
    try{
        q={}
    const getques = await quiz.find(q)
    res.render("quizdetails",{data : getques})
    // res.send(getques)
    }
    catch(err)
    {
        res.json({'status': false, 'error' : err, 'code': 103})
    }
})

module.exports=router