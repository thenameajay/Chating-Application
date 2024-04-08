const mongoose =  require("mongoose")
require("dotenv").config()

mongoose.connect(process.env.DATABASE_URL,{useNewUrlParser:true})

const db=mongoose.connection

db.once('open',()=>{console.log("successfully connected with mongoDB")})
db.on('error',()=>{console.log("not connected with database")})

module.exports = db