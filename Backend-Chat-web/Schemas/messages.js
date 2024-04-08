
const mongoose = require("mongoose")

const message = mongoose.Schema({
    sender:{
        type : String,
        required : true,
    },
    reciever : {
        type : String,
        required : true,
    },
    time:{
        type:String,
        required:true,
    },
    content : {
        type : String,
        required : true,
    }
})

const Message=mongoose.model("_messages",message)
module.exports=Message
