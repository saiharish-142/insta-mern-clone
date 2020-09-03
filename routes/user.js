const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post")
const User = mongoose.model("User")

router.get('/user/:id',requireLogin,(req,res)=>{
    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
        Post.find({postedBy:req.params.id})
        .populate("postedBy","_id name profilePic")
        .populate("comments.postedBy","_id name profilePic")
        .exec((err,posts)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            res.json({user,posts})
        })
    }).catch(err=>{
        return res.status(404).json({error:"User not found"})
    })
})

router.put('/follow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.user._id}
    },{new:true},(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        result.password = undefined
        User.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.followId}
        },{new:true}).then(user=>{
            user.password = undefined
            res.json({result,user})
        })
        .catch(err=>{ return res.status(422).json({error:err})})
    })
})

router.put('/unfollow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.user._id}
    },{new:true},(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        result.password = undefined
        User.findByIdAndUpdate(req.user._id,{
            $pull:{following:req.body.unfollowId}
        },{new:true}).then(user=>{
            user.password = undefined
            res.json({result,user})
        })
        .catch(err=>{ return res.status(422).json({error:err})})
    })
})

router.put('/editProfile',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{$set:{profilePic:req.body.profilePic,name:req.body.username,email:req.body.email}
    },{new:true},
        (err,result)=>{
            result.password = undefined
         if(err){
             return res.status(422).json({error:"pic canot post"})
         }
         res.json(result)
    })
})
router.put('/deleteDP',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{$unset:{profilePic:""}
    },{new:true},
        (err,result)=>{
            result.password = undefined
         if(err){
             return res.status(422).json({error:"pic canot post"})
         }
         res.json(result)
    })
})

router.post('/search-user',(req,res)=>{
    const userPattern = new RegExp("^"+req.body.query)
    User.find({name:{$regex:userPattern}})
    .select("_id email name")
    .then(user=>{
        res.json({user})
    })
    .catch(err => {
        console.log(err)
    })
})

module.exports = router