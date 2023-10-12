const express=require('express')
const router=express.Router()
const User=require('../models/User')
const bcrypt=require('bcrypt')
const Post=require('../models/Post')
const Comment=require('../models/Comment')
const verifyToken = require('../verifyToken')

//CREATE 
//e.g: 
/*{
  "title": "demo1",
  "desc": "description1",
  "photo": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "username": "prit",
  "userId": "651f122bb7b6d4abbd48c130",
  "categories": ["demo1","demo2"]
}*/
router.post("/create",verifyToken,async (req,res)=>{
    try{
        const newPost=new Post(req.body)
        // console.log(req.body)
        const savedPost=await newPost.save()
        
        res.status(200).json(savedPost)
    }
    catch(err){
        
        res.status(500).json(err)
    }
     
})

//UPDATE    e.g http://localhost:5000/api/posts/652043c623a9545e6ba4b818
/*{
  "title": "demo1",
  "desc": "description1",
  "photo": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "username": "prit33",
  "userId": "651f122bb7b6d4abbd48c130",
  "categories": ["demo1","demo2"]
} */
router.put("/:id",verifyToken,async (req,res)=>{
    try{
       
        const updatedPost=await Post.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
        res.status(200).json(updatedPost)

    }
    catch(err){
        res.status(500).json(err)
    }
})


//DELETE    e.g http://localhost:5000/api/posts/651fd1d207e43d277eaaa271
router.delete("/:id",verifyToken,async (req,res)=>{
    try{
        await Post.findByIdAndDelete(req.params.id)
        await Comment.deleteMany({postId:req.params.id})
        res.status(200).json("Post has been deleted!")

    }
    catch(err){
        res.status(500).json(err)
    }
})


//GET POST DETAILS e.g:http://localhost:5000/api/posts/create
router.get("/:id",async (req,res)=>{
    try{
        const post=await Post.findById(req.params.id)
        res.status(200).json(post)
    }
    catch(err){
        res.status(500).json(err)
    }
})

//GET POSTS e.g http://localhost:5000/api/posts/652043c623a9545e6ba4b818
router.get("/",async (req,res)=>{
    const query=req.query
    // console.log(query);
    try{
        const searchFilter={
            title:{$regex:query.search, $options:"i"}
        }
        const posts=await Post.find(query.search?searchFilter:null)
        // const posts=await Post.find();
        res.status(200).json(posts)
    }
    catch(err){
        res.status(500).json(err)
    }
})

//GET USER POSTS  e.g http://localhost:5000/api/posts/user/651f122bb7b6d4abbd48c130 (endpoint is userId not postId)
router.get("/user/:userId",async (req,res)=>{
    try{
        const posts=await Post.find({userId:req.params.userId})
        res.status(200).json(posts)
    }
    catch(err){
        res.status(500).json(err)
    }
})




module.exports=router