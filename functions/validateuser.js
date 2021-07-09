const UserLogin=require('../models/login')
const bcrypt=require('bcrypt')
const validateUser = async (username, password) =>{
    var error={'status': false}
    try{
        var userSearch={}
        userSearch= await UserLogin.findOne({'username' : username})
        
        if(userSearch==null)
        {
            throw new Error("Username not found")
        }
        else{
        // console.log(userSearch)
        // console.log(userSearch.password)
        const isTrue= await bcrypt.compare(password,userSearch.password)
        if(isTrue == false)
            throw new Error("Password incorrect")
        else    
            userSearch.password="It is secret"
            // console.log(userSearch.password)
            return {'status' : true, 'error' : "No error"}
        }
            
    }
    catch(err){ 
        error.error=err.message
        if(err.message==='Password incorrect')
            error.code=26
        else    
            error.code=25
    }  
    console.log(error)  
    return error
}

module.exports=validateUser