const express = require('express');
const bcrypt = require("bcrypt");
const { cleanUpAndValidate } = require('../Utils/AuthUtil');
const User = require('../Models/UserModel');
const isAuth = require('../Middlewares/AuthMiddleware');


const AuthRouter = express.Router();

AuthRouter.post('/register',async(req,res)=>{
    const { name,email,username,password } = req.body;

    try{
        
        await cleanUpAndValidate({name,email,username,password});
    }
    catch(err){
        return res.send({
            status: 400,
            message : "Data issue",
            error : err
        })
    }

    

    try{
        await User.finUsernameAndEmailExists({email,username});

        //craete object from user class
        const userObj = new User({name,username,email,password});

        //use registerUser method on user class object 
        const userDb = await userObj.registerUser()
       return res.send({
         status : 201,
         message : 'user craeted successfully',
         data : userDb
       })
    }
    catch(err){
        return res.send({
            status : 500,
            message : "Database error",
            error : err
        })
    }
});



AuthRouter.post("/login",async(req,res)=>{
    const {loginId, password} = req.body;

    if(!loginId || !password)
    {
        return res.send({
            status : 400,
            message : 'misisng credentials'
        })
    }

    try{
        const userDb = await User.findUserEmailOrUsername({loginId})
        const isMatch = await bcrypt.compare(password,userDb.password)

        if(!isMatch)
        {
            return res.send({
                status : 400,
                message : "Password not matched"
            })
        }

        //session base auth 
        req.session.isAuth = true;
        req.session.user ={
            userId : userDb._id,
            email: userDb.email,
            username : userDb.username
        }

        return res.send({
            status : 200,
            message : 'Login successful'
        })
    }
    catch(err){
        return res.send({
            status : 500,
            message: 'database error',
            error : err
        })
    }
})


AuthRouter.post('/logout',isAuth,(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            return res.send({
                status : 500,
                message : 'Logout Unsuccessful',
                error : err
            })
        }

        return res.send({
            status : 200,
            message : 'Logout successful'
        })
    })
})

module.exports = AuthRouter;