const jwt=require('jsonwebtoken')
var express = require('express');
var app = express();
var cookies = require("cookie-parser");

app.use(cookies());

const verifyToken=(req,res,next)=>{
    // console.log(req.cookies.token)
    
    // const token=req.cookies.token;  
    const token=req.headers.authorization;  
    // const tokenValue = req.headers.cookie.split("=")[1];    // doing another way bcoz of deployment problem
    console.log(token);


    if(!token){
        return res.status(401).json("You are not authenticated!")
    }
    jwt.verify(token,process.env.SECRET,async (err,data)=>{
        if(err){
            return res.status(403).json("token is not valid!")
        }
        // console.log(data);
        req.userId=data._id
        // console.log(req.usedId);
       
        // console.log("passed")
        
        next()
    })
}

module.exports=verifyToken
