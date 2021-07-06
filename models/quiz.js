const mongoose = require('mongoose')


const questionpattern = mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    dot:{
        type : Date,
        required: true
    },
    noofquestions:{
        type: Number,
        default: 10,
        min: 1,
        max: 30
    },
    category:{
        type: String,
        default : 'Any Category',
        // validate:{
        //     validator: (value) =>{
        //         const valid_category = ['Any Category', 'Books', 'Film', 'Sports', 'General Knowledge', 'Computer Science']
        //         if(valid_category.includes(value))
        //         {
        //             return true
        //         }
        //         else{
        //             return false
        //         }
                
        //     },
        //     message: "Provide a valid category"
        // }
        enum: ['Any Category', 'Books', 'Film', 'Sports', 'General Knowledge', 'Computer Science','Music']
    },
    difficulty:{
        type: String,
        default: 'Any Difficulty',
        enum: ['Any Difficulty','Easy', 'Medium','Hard']
    },
    type:{
        type:String,
        default: 'Any Type',
        enum: ['Any Type', 'Multiple Choice','True / False']
    },
    encoding:{
        type: String,
        default: 'Default Encoding'
    }
})

module.exports=mongoose.model('questionpattern',questionpattern)