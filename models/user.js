const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    profilePic:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcR0ZL7it9GAAc4a1Fb40d6fxu-paaRZ-zG2yQ&usqp=CAU"
    },
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}],
    resetToken:String,
    expireToken:Date
})

mongoose.model("User",userSchema)