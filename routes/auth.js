const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET, NODEMAIL_APIKEY } = require('../config/keys')
const requireLogin = require('../middleware/requireLogin')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const { getMaxListeners } = require('process')

const transport = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:NODEMAIL_APIKEY
    }
}))

router.post('/signup',(req,res)=>{
    const {name, email, password} = req.body;
    if(!email || !name || !password){
        return res.status(422).send({error:"please enter all the reqiured fields"})
    }
    User.findOne({email:email})
    .then((saveUser)=>{
        if(saveUser){
            return res.status(422).json({error:"user already exists"})
        }
        bcrypt.hash(password,12)
        .then(hashedPassword =>{
            const user = new User({
                email,
                password:hashedPassword,
                name
            })
            user.save()
            .then(user => {
                transport.sendMail({
                    to:user.email,
                    from:"hariwebproject@gmail.com",
                    subject:"signup successfully",
                    html:"<h1>welcome to instagram</h1>"
                })
                res.json({message: "successfully added!!"})
            })
            .catch(err =>{
                res.json({error: err})
                console.log(err)
            })
        })
    })
    .catch(err => {
        console.log(err)
    })
})

router.post('/signin',(req,res)=>{
    const {email, password} = req.body;
    if(!email || !password){
        res.status(422).json({error:"please add email or password"})
    }
    User.findOne({email:email})
    .then(savedUser =>{
        if(!savedUser){
            return res.status(422).json({error:"invalid Email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch =>{
            if(doMatch){
                // res.json({message:"successfully signed in"})
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                savedUser.password = undefined
                res.json({token,user:savedUser})
            } else{
                return res.status(422).json({error:"invalid Email or password"})
            }
        })
        .catch(err => {
            console.log(err)
        })
    })
})

router.post('/reset-password',(req,res) => {
    crypto.randomBytes(32,(err,buffer) => {
        if(err){
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({email:req.body.email})
        .then((user)=>{
            if(!user){
                return res.status(422).json({error:"User doesn't exist with that email"})
            }
            user.resetToken = token
            user.expireToken = Date.now() + 3600000
            user.save().then(result => {
                transport.sendMail({
                    to:user.email,
                    from:"hariwebproject@gmail.com",
                    subject:"password reset",
                    html:`
                    <p>You have requested for password reset</p>
                    <h5>click in this link <a href="http://localhost:3000/reset/${token}">link</a> to reset your password</h5>
                    `
                })
                res.json({message:"Check Your email"})
            })
        })
    })
})

router.post('/new-password',(req,res)=>{
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({resetToken:sentToken,expireToken:{$gt: Date.now()}})
    .then(user => {
        if(!user){
            return res.status(422).json({error:"session has expired"})
        }
        bcrypt.hash(newPassword,12).then(hashedPassword=>{
            user.password = hashedPassword
            user.expireToken = undefined
            user.resetToken = undefined
            user.save()
            .then(savedUser => {
                savedUser.password = undefined
                res.json({message:"Password Update success"})
            })
            .catch(err => console.log(err))
        })
    })
})

// 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
module.exports = router