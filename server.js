const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')
const mongoose = require('mongoose')
const { MONGOURI } = require('./config/keys')

app.use(express.json())
app.use(cors())

mongoose.connect(MONGOURI,{useNewUrlParser: true,useFindAndModify:false, useUnifiedTopology: true})
mongoose.connection.on('connected', () =>{
    console.log("connected to mongo yeah!!")
})
mongoose.connection.on('error',(err)=>{
    console.log('error in connection',err)
})

require('./models/user')
require('./models/post')

app.use('/auth',require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

if(process.env.NODE_ENV==="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(port, () => {
    console.log('server is running on',port)
});