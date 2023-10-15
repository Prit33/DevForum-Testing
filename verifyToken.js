const jwt=require('jsonwebtoken')
// const cookieParser = require('cookie-parser');

const verifyToken=(req,res,next)=>{
    // console.log(req.cookies.token)
    
    const token=req.cookies.token;      
    const tokenValue = req.headers.cookie.split("=")[1];    // doing another way bcoz of deployment problem
    console.log(tokenValue);


    if(!tokenValue){
        return res.status(401).json("You are not authenticated!")
    }
    jwt.verify(tokenValue,process.env.SECRET,async (err,data)=>{
        if(err){
            return res.status(403).json("tokenValue is not valid!")
        }
        // console.log(data);
        req.userId=data._id
        // console.log(req.usedId);
       
        // console.log("passed")
        
        next()
    })
}

module.exports=verifyToken
